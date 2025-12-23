/**
 * Chatbot Konfiguration
 * Zentrale Einstellungen für den KI-Chatbot
 */

export const CHAT_CONFIG = {
    // UI-Einstellungen
    ui: {
        position: 'bottom-right',      // Position des Widgets
        theme: 'light',                // 'light' oder 'dark'
        primaryColor: '#2563eb',       // Hauptfarbe
        width: '380px',                // Breite des Chat-Fensters
        height: '500px',               // Höhe des Chat-Fensters
        zIndex: 9999                   // Z-Index
    },
    
    // Nachrichten
    messages: {
        welcome: 'Hallo! Ich bin Ihr KI-Assistent. Wie kann ich Ihnen heute helfen?',
        placeholder: 'Nachricht eingeben...',
        errorMessage: 'Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
        typingIndicator: 'KI tippt...'
    },
    
    // Verhalten
    behavior: {
        autoOpen: false,               // Chat automatisch öffnen
        autoOpenDelay: 5000,           // Verzögerung in ms
        saveHistory: true,             // Verlauf speichern
        historyMaxLength: 50,          // Max. gespeicherte Nachrichten
        showTimestamps: false          // Zeitstempel anzeigen
    },
    
    // API-Einstellungen
    api: {
        provider: 'openai',            // 'openai', 'anthropic', 'custom'
        timeout: 30000,                // Timeout in ms
        retries: 2,                    // Anzahl Wiederholungsversuche
        maxTokens: 1000,               // Max. Tokens in Antwort
        temperature: 0.7               // Kreativität (0-1)
    },
    
    // Sicherheit
    security: {
        rateLimit: 10,                 // Max. Nachrichten pro Minute
        maxMessageLength: 1000,        // Max. Zeichen pro Nachricht
        sanitizeInput: true            // Eingabe bereinigen
    }
};


