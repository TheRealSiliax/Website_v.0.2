# Sitzung: WebGL Wave Background Integration

**Datum**: 2025-12-22  
**Ziel**: Implementierung eines dynamischen WebGL-Sonnenuntergangs-Hintergrunds mit Maus-Interaktion

---

## Zusammenfassung

Integration eines GPU-beschleunigten, interaktiven Wellen-Hintergrunds mit Sonnenuntergangs-Schimmer-Effekt, der auf Mausbewegungen reagiert.

---

## Durchgeführte Änderungen

### 1. WebGL Wave Background Component
**Datei**: `website/src/scripts/components/waveBackground.js`

**Verbesserungen gegenüber Original-Code:**
- **Modulare Struktur**: Klassen-basierte Architektur statt inline-Code
- **Bessere Error-Handling**: Fallback für nicht-WebGL-Browser
- **Context-Loss-Recovery**: Wiederherstellung bei GPU-Verlust
- **Performance-Optimierungen**:
  - Sanfte Maus-Interpolation (Smoothing)
  - Visibility-API (Pause wenn Tab nicht sichtbar)
  - requestAnimationFrame
- **Accessibility**: `prefers-reduced-motion` Unterstützung
- **Verbesserter Shader**:
  - Fraktales Brownian Motion (FBM) für organischere Wellen
  - Pseudo-Random für natürliche Muster
  - Verbesserte Lichtberechnung mit Glow-Effekten
  - Vignette-Effekt für Tiefe

### 2. Index.html Update
**Datei**: `website/src/index.html`
- Canvas-Element für WebGL hinzugefügt
- Hero-Section transparent gemacht
- Service-Cards hinzugefügt
- Inter-Font integriert

### 3. CSS Styling (Glassmorphism)
**Datei**: `website/src/styles/main.css`
- **Wave-Background**: Fixed positioning, z-index -1
- **Header**: Glassmorphism mit Blur
- **Sections**: Glass-Effekte für transparente Inhalte
- **Service-Cards**: Hover-Animationen
- **Buttons**: Glow-Variante mit Gradient
- **Animationen**: fadeInUp für Hero-Content
- **Responsive**: Touch-Support, mobile Anpassungen

### 4. Main.js Integration
**Datei**: `website/src/scripts/main.js`
- WaveBackground Import und Initialisierung
- Konfigurierbare Parameter

---

## Technische Details

### WebGL Fragment Shader

Der Shader berechnet für jeden Pixel:

1. **Hintergrund-Gradient**: Horizont-Effekt mit tiefen Blau/Lila-Tönen
2. **Wellen-Berechnung**: 
   - Mehrere überlagerte Sinus-Wellen
   - FBM für organische Unregelmäßigkeit
3. **Maus-Licht**:
   - Distanz zum Cursor berechnen
   - Haupt-Lichtkegel + äußerer Glow
   - Vertikaler Falloff (stärker am unteren Rand)
4. **Schimmer**:
   - Sonnenuntergangsfarben auf Wellenkämmen
   - Nur wo Licht UND Wellenkamm

### Konfiguration

```javascript
{
    mouseInfluence: 1.0,      // Licht-Intensität (0-1)
    enableTouch: true,         // Touch-Support
    respectReducedMotion: true // Accessibility
}
```

---

## Sicherheitsaspekte

- Kein sensible Daten im Shader-Code
- Fallback-Gradient wenn WebGL nicht verfügbar
- Keine externen Abhängigkeiten (nur natives WebGL)

---

## Dateien-Übersicht

### Neu erstellt:
- `website/src/scripts/components/waveBackground.js`

### Geändert:
- `website/src/index.html`
- `website/src/scripts/main.js`
- `website/src/styles/main.css`

---

## Testing

Zum Testen:
1. Öffne `website/src/index.html` im Browser
2. Bewege die Maus über den Bildschirm
3. Beobachte den Sonnenuntergangs-Schimmer auf den Wellen

---

## Nächste Schritte

1. API-Key für KI-Chatbot konfigurieren
2. Inhalte anpassen
3. Weitere Design-Vorlagen importieren


