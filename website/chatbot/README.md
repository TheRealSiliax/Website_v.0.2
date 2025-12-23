# KI-Chatbot Modul

Dieses Modul enthält alles, was für den KI-Chatbot benötigt wird.

## Struktur

```
chatbot/
├── components/        # UI-Komponenten
│   ├── ChatWidget.js  # Haupt-Widget
│   ├── ChatBubble.js  # Nachrichtenblasen
│   └── ChatInput.js   # Eingabefeld
├── services/          # API-Services
│   ├── apiClient.js   # HTTP-Client
│   └── chatApi.js     # Chat-API-Aufrufe
├── config/            # Konfiguration
│   └── chatConfig.js  # Chatbot-Einstellungen
└── prompts/           # System-Prompts
    └── default.md     # Standard-System-Prompt
```

## API-Integration

### Unterstützte APIs

1. **OpenAI** (ChatGPT)
   - Modelle: gpt-4, gpt-4-turbo, gpt-3.5-turbo
   - Endpunkt: `https://api.openai.com/v1/chat/completions`

2. **Anthropic** (Claude)
   - Modelle: claude-3-opus, claude-3-sonnet, claude-3-haiku
   - Endpunkt: `https://api.anthropic.com/v1/messages`

3. **Eigenes Backend** (empfohlen für Produktion)
   - Endpunkt: `/api/chat`
   - Vorteile: API-Key bleibt auf dem Server

## Konfiguration

1. Kopiere `.env.example` nach `.env`
2. Trage deinen API-Key ein
3. Wähle das gewünschte Modell

## Sicherheitshinweise

- **NIEMALS** den API-Key im Frontend-Code speichern (nur für Entwicklung!)
- Für Produktion: Verwende ein Backend als Proxy
- Implementiere Rate-Limiting
- Validiere und sanitize alle Benutzereingaben

## Anpassung

### System-Prompt anpassen

Bearbeite `prompts/default.md` um das Verhalten der KI anzupassen.

### Styling

Die Styles befinden sich in `src/styles/main.css` unter dem Abschnitt "CHATBOT WIDGET".


