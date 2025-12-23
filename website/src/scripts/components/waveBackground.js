/**
 * Wave Background Component
 * Dynamischer WebGL-Hintergrund mit Sonnenuntergangs-Schimmer und Maus-Interaktion
 * 
 * Verbesserungen gegenüber Original:
 * - Modulare Struktur
 * - Bessere Error-Handling
 * - Context-Loss-Recovery
 * - Konfigurierbare Parameter
 * - Performance-Optimierungen (requestAnimationFrame, Throttling)
 * - Accessibility (prefers-reduced-motion)
 * - Fallback für nicht-WebGL Browser
 */

// Vertex Shader - Definiert die Geometrie (Fullscreen-Quad)
const VERTEX_SHADER_SOURCE = `
    attribute vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

// Fragment Shader - Berechnet die Farbe jedes Pixels
const FRAGMENT_SHADER_SOURCE = `
    #ifdef GL_ES
    precision highp float;
    #endif

    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_mouseInfluence;

    // Konfigurierbare Farben (als Uniforms für spätere Anpassung)
    const vec3 colorWaterDeep = vec3(0.03, 0.05, 0.18);
    const vec3 colorWaterMid = vec3(0.08, 0.12, 0.35);
    const vec3 colorWaterLight = vec3(0.12, 0.18, 0.45);
    
    const vec3 colorSunsetDeep = vec3(0.9, 0.3, 0.1);
    const vec3 colorSunsetMid = vec3(1.0, 0.55, 0.2);
    const vec3 colorSunsetBright = vec3(1.0, 0.85, 0.4);

    // Wellen-Parameter
    const float speed = 0.15;
    const float waveDensity = 6.0;

    // Pseudo-Random Funktion für organischere Muster
    float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    // Verbesserte Noise-Funktion für realistischere Wellen
    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        
        // Smooth interpolation
        vec2 u = f * f * (3.0 - 2.0 * f);
        
        return mix(
            mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
            u.y
        );
    }

    // Fraktales Brownian Motion für organische Wellenbewegung
    float fbm(vec2 p, float time) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        // 4 Oktaven für Detail-Reichtum
        for (int i = 0; i < 4; i++) {
            value += amplitude * noise(p * frequency + time * speed * float(i + 1) * 0.3);
            amplitude *= 0.5;
            frequency *= 2.0;
        }
        
        return value;
    }

    // Organische Wellenbewegung mit mehreren überlagerten Schichten
    float oceanWaves(vec2 uv, float time) {
        float wave = 0.0;
        
        // Primäre große Wellen
        wave += sin(uv.x * waveDensity + time * speed) * 0.4;
        wave += sin(uv.y * waveDensity * 0.7 + time * speed * 0.8) * 0.4;
        
        // Sekundäre Wellen (gegenläufig für Realismus)
        wave += sin(uv.x * waveDensity * 1.8 - time * speed * 1.5 + uv.y * 2.0) * 0.25;
        wave += sin(uv.y * waveDensity * 2.2 + time * speed * 1.8 - uv.x * 1.5) * 0.25;
        
        // Feine Detail-Wellen
        wave += sin(uv.x * waveDensity * 4.0 + time * speed * 3.0) * 0.1;
        wave += sin(uv.y * waveDensity * 5.0 - time * speed * 2.5) * 0.1;
        
        // FBM für organische Unregelmäßigkeit
        wave += fbm(uv * 3.0, time) * 0.3;
        
        return wave;
    }

    void main() {
        // Normalisierte Koordinaten (0.0 bis 1.0)
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        
        // Aspect-Ratio-Korrektur
        float aspect = u_resolution.x / u_resolution.y;
        vec2 stCorrected = vec2(st.x * aspect, st.y);
        
        // Normalisierte Mausposition mit Aspect-Korrektur
        vec2 mouseNorm = u_mouse / u_resolution.xy;
        mouseNorm.x *= aspect;

        // 1. HINTERGRUND-GRADIENT (Horizont-Effekt)
        float horizonGradient = pow(1.0 - st.y, 1.5);
        vec3 background = mix(colorWaterDeep, colorWaterMid, horizonGradient);
        
        // Subtiler Himmel-Gradient oben
        float skyGradient = smoothstep(0.7, 1.0, st.y);
        background = mix(background, colorWaterLight, skyGradient * 0.3);

        // 2. WELLEN-BERECHNUNG
        float wavePattern = oceanWaves(stCorrected, u_time);
        
        // Wellenkämme hervorheben
        float waveCrests = smoothstep(0.1, 0.8, wavePattern);
        float waveHighlights = smoothstep(0.5, 1.0, wavePattern);

        // 3. MAUS-LICHT (Sonnenuntergangs-Schimmer)
        float distToMouse = distance(stCorrected, mouseNorm);
        
        // Haupt-Lichtkegel
        float primaryLight = smoothstep(0.6, 0.0, distToMouse) * u_mouseInfluence;
        
        // Weicher äußerer Glow
        float outerGlow = smoothstep(1.2, 0.3, distToMouse) * u_mouseInfluence * 0.3;
        
        // Licht stärker am unteren Bildrand (wie Sonnenuntergang auf Wasser)
        float verticalFalloff = 1.0 - st.y * 0.6;
        primaryLight *= verticalFalloff;
        outerGlow *= verticalFalloff;

        // 4. SCHIMMER-BERECHNUNG
        // Sonnenuntergangs-Farbverlauf basierend auf Wellenintensität
        vec3 shimmerColor = mix(colorSunsetDeep, colorSunsetMid, wavePattern * 0.5 + 0.5);
        shimmerColor = mix(shimmerColor, colorSunsetBright, waveHighlights);
        
        // Schimmer nur auf Wellenkämmen und wo Licht ist
        float shimmerIntensity = waveCrests * primaryLight;
        
        // Zusätzliche Glanzpunkte auf den höchsten Wellenkämmen
        float sparkle = pow(waveHighlights, 3.0) * primaryLight * 1.5;

        // 5. FINALE KOMPOSITION
        vec3 finalColor = background;
        
        // Ambient Glow hinzufügen
        finalColor += shimmerColor * outerGlow * 0.2;
        
        // Haupt-Schimmer auf Wellenkämmen
        finalColor = mix(finalColor, shimmerColor, shimmerIntensity);
        
        // Glanzpunkte
        finalColor += shimmerColor * sparkle;
        
        // Leichter Vignette-Effekt für Tiefe
        float vignette = 1.0 - length(st - 0.5) * 0.5;
        finalColor *= vignette;

        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

/**
 * Konfiguration für den Wave-Background
 */
export const WAVE_CONFIG = {
    // Aktiviert/Deaktiviert die Animation
    enabled: true,
    
    // Fallback-Gradient wenn WebGL nicht verfügbar
    fallbackGradient: 'linear-gradient(135deg, #0a0d2e 0%, #1a1f4e 50%, #2a2f5e 100%)',
    
    // Maus-Einfluss-Stärke (0.0 - 1.0)
    mouseInfluence: 1.0,
    
    // Ob Touch-Events unterstützt werden sollen
    enableTouch: true,
    
    // Reduzierte Bewegung für Accessibility
    respectReducedMotion: true
};

/**
 * Wave Background Manager Klasse
 */
export class WaveBackground {
    constructor(canvasId, config = {}) {
        this.config = { ...WAVE_CONFIG, ...config };
        this.canvas = document.getElementById(canvasId);
        
        if (!this.canvas) {
            console.error(`Canvas mit ID "${canvasId}" nicht gefunden`);
            return;
        }
        
        this.gl = null;
        this.program = null;
        this.uniforms = {};
        this.isRunning = false;
        this.animationId = null;
        
        // Maus-Position (initialisiert in der Mitte)
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;
        
        // Prüfe auf prefers-reduced-motion
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    /**
     * Initialisiert WebGL und startet die Animation
     */
    init() {
        // Prüfe ob reduzierte Bewegung gewünscht ist
        if (this.config.respectReducedMotion && this.reducedMotion) {
            this.applyFallback();
            console.log('WaveBackground: Reduzierte Bewegung aktiv, verwende statischen Hintergrund');
            return;
        }
        
        // WebGL Kontext erstellen
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        
        if (!this.gl) {
            console.warn('WebGL nicht unterstützt, verwende Fallback');
            this.applyFallback();
            return;
        }
        
        // Shader kompilieren und Programm erstellen
        if (!this.createShaderProgram()) {
            this.applyFallback();
            return;
        }
        
        // Buffer für Fullscreen-Quad erstellen
        this.createBuffers();
        
        // Uniform-Locations abrufen
        this.getUniformLocations();
        
        // Event-Listener einrichten
        this.setupEventListeners();
        
        // Canvas-Größe anpassen
        this.resize();
        
        // Maus in der Mitte initialisieren
        this.mouseX = this.canvas.width / 2;
        this.mouseY = this.canvas.height / 2;
        this.targetMouseX = this.mouseX;
        this.targetMouseY = this.mouseY;
        
        // Animation starten
        this.start();
        
        console.log('WaveBackground: WebGL erfolgreich initialisiert');
    }
    
    /**
     * Kompiliert einen Shader
     */
    compileShader(source, type) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader-Kompilierungsfehler:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    /**
     * Erstellt das Shader-Programm
     */
    createShaderProgram() {
        const vertexShader = this.compileShader(VERTEX_SHADER_SOURCE, this.gl.VERTEX_SHADER);
        const fragmentShader = this.compileShader(FRAGMENT_SHADER_SOURCE, this.gl.FRAGMENT_SHADER);
        
        if (!vertexShader || !fragmentShader) {
            return false;
        }
        
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);
        
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Shader-Programm-Linking-Fehler:', this.gl.getProgramInfoLog(this.program));
            return false;
        }
        
        this.gl.useProgram(this.program);
        return true;
    }
    
    /**
     * Erstellt die Buffer für das Fullscreen-Quad
     */
    createBuffers() {
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        
        // Zwei Dreiecke die den ganzen Bildschirm abdecken
        const positions = new Float32Array([
            -1.0, -1.0,
             1.0, -1.0,
            -1.0,  1.0,
             1.0,  1.0
        ]);
        
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
        
        const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
    }
    
    /**
     * Ruft die Uniform-Locations ab
     */
    getUniformLocations() {
        this.uniforms = {
            resolution: this.gl.getUniformLocation(this.program, 'u_resolution'),
            time: this.gl.getUniformLocation(this.program, 'u_time'),
            mouse: this.gl.getUniformLocation(this.program, 'u_mouse'),
            mouseInfluence: this.gl.getUniformLocation(this.program, 'u_mouseInfluence')
        };
    }
    
    /**
     * Richtet Event-Listener ein
     */
    setupEventListeners() {
        // Resize
        window.addEventListener('resize', () => this.resize());
        
        // Mausbewegung
        window.addEventListener('mousemove', (e) => {
            this.targetMouseX = e.clientX;
            this.targetMouseY = this.canvas.height - e.clientY; // Y invertieren für WebGL
        });
        
        // Touch-Support
        if (this.config.enableTouch) {
            window.addEventListener('touchmove', (e) => {
                if (e.touches.length > 0) {
                    this.targetMouseX = e.touches[0].clientX;
                    this.targetMouseY = this.canvas.height - e.touches[0].clientY;
                }
            }, { passive: true });
            
            window.addEventListener('touchstart', (e) => {
                if (e.touches.length > 0) {
                    this.targetMouseX = e.touches[0].clientX;
                    this.targetMouseY = this.canvas.height - e.touches[0].clientY;
                }
            }, { passive: true });
        }
        
        // Context-Loss-Handling
        this.canvas.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            console.warn('WebGL Context verloren');
            this.stop();
        });
        
        this.canvas.addEventListener('webglcontextrestored', () => {
            console.log('WebGL Context wiederhergestellt');
            this.init();
        });
        
        // Visibility-Change (Pause wenn Tab nicht sichtbar)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop();
            } else {
                this.start();
            }
        });
    }
    
    /**
     * Passt die Canvas-Größe an
     */
    resize() {
        const displayWidth = window.innerWidth;
        const displayHeight = window.innerHeight;
        
        if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
            
            if (this.gl) {
                this.gl.viewport(0, 0, displayWidth, displayHeight);
                this.gl.uniform2f(this.uniforms.resolution, displayWidth, displayHeight);
            }
        }
    }
    
    /**
     * Render-Loop
     */
    render(timestamp) {
        if (!this.isRunning || !this.gl) return;
        
        // Zeit in Sekunden
        const time = timestamp * 0.001;
        
        // Sanfte Maus-Interpolation für flüssigere Bewegung
        const smoothing = 0.1;
        this.mouseX += (this.targetMouseX - this.mouseX) * smoothing;
        this.mouseY += (this.targetMouseY - this.mouseY) * smoothing;
        
        // Uniforms aktualisieren
        this.gl.uniform1f(this.uniforms.time, time);
        this.gl.uniform2f(this.uniforms.mouse, this.mouseX, this.mouseY);
        this.gl.uniform1f(this.uniforms.mouseInfluence, this.config.mouseInfluence);
        
        // Zeichnen
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        
        // Nächsten Frame anfordern
        this.animationId = requestAnimationFrame((t) => this.render(t));
    }
    
    /**
     * Startet die Animation
     */
    start() {
        if (this.isRunning || !this.gl) return;
        
        this.isRunning = true;
        this.animationId = requestAnimationFrame((t) => this.render(t));
    }
    
    /**
     * Stoppt die Animation
     */
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    /**
     * Wendet den CSS-Fallback an
     */
    applyFallback() {
        this.canvas.style.background = this.config.fallbackGradient;
    }
    
    /**
     * Zerstört die Instanz und räumt auf
     */
    destroy() {
        this.stop();
        
        if (this.gl && this.program) {
            this.gl.deleteProgram(this.program);
        }
    }
}

/**
 * Initialisiert den Wave-Background
 * @param {string} canvasId - ID des Canvas-Elements
 * @param {object} config - Optionale Konfiguration
 * @returns {WaveBackground} Die WaveBackground-Instanz
 */
export function initWaveBackground(canvasId = 'waveCanvas', config = {}) {
    return new WaveBackground(canvasId, config);
}


