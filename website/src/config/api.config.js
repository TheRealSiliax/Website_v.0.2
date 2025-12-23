/**
 * API Configuration
 * Konfiguration für die KI-API-Anbindung
 * 
 * WICHTIG: Diese Datei sollte NICHT in Git committed werden!
 * Für Produktion: Verwende Umgebungsvariablen oder ein Backend
 */

export const API_CONFIG = {
    /**
     * API-Key für die KI-API
     * ACHTUNG: Für Produktion NIEMALS den API-Key im Frontend-Code speichern!
     * Verwende stattdessen ein Backend-Proxy
     */
    apiKey: 'YOUR_API_KEY_HERE',
    
    /**
     * API-Endpunkt
     * Unterstützte APIs:
     * - OpenAI: https://api.openai.com/v1/chat/completions
     * - Anthropic: https://api.anthropic.com/v1/messages
     * - Oder dein eigenes Backend: /api/chat
     */
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    
    /**
     * Model-Name
     * OpenAI: gpt-4, gpt-4-turbo, gpt-3.5-turbo
     * Anthropic: claude-3-opus, claude-3-sonnet, claude-3-haiku
     */
    model: 'gpt-4-turbo',
    
    /**
     * Maximale Anzahl der Tokens in der Antwort
     */
    maxTokens: 1000,
    
    /**
     * Temperatur (0-1)
     * Niedrig = deterministischer, Hoch = kreativer
     */
    temperature: 0.7
};

/**
 * SICHERHEITSHINWEIS:
 * 
 * In einer Produktionsumgebung solltest du:
 * 
 * 1. NIEMALS den API-Key im Frontend speichern
 * 2. Ein Backend verwenden, das die API-Aufrufe macht
 * 3. Rate-Limiting implementieren
 * 4. Benutzer-Authentifizierung verwenden
 * 
 * Beispiel Backend-Route:
 * 
 * app.post('/api/chat', authenticate, rateLimit, async (req, res) => {
 *     const response = await openai.chat.completions.create({
 *         model: 'gpt-4-turbo',
 *         messages: req.body.messages
 *     });
 *     res.json(response);
 * });
 */


