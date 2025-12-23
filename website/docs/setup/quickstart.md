# Schnellstart-Anleitung

## Voraussetzungen

- Moderner Webbrowser
- Texteditor (VS Code empfohlen)
- Optional: Node.js für lokalen Entwicklungsserver
- API-Key für KI-Integration (OpenAI, Anthropic, etc.)

## Installation

### 1. Projekt öffnen

Öffne das `website/` Verzeichnis in deinem Editor.

### 2. Konfiguration einrichten

```bash
# Kopiere die Beispiel-Umgebungsdatei
cp config/.env.example config/.env

# Öffne und bearbeite die .env Datei
# Trage deinen API-Key ein
```

### 3. API-Key konfigurieren

**Für Entwicklung** (nur lokal testen):
1. Öffne `src/config/api.config.js`
2. Ersetze `YOUR_API_KEY_HERE` mit deinem API-Key

**Für Produktion** (empfohlen):
1. Erstelle ein Backend, das die API-Aufrufe macht
2. Ändere `apiUrl` zu deinem Backend-Endpunkt

### 4. Website starten

**Option A: Einfach öffnen**
- Öffne `src/index.html` im Browser

**Option B: Mit Live-Server**
```bash
# Installiere Live Server (einmalig)
npm install -g live-server

# Starte den Server
cd website/src
live-server
```

**Option C: Mit Python**
```bash
cd website/src
python -m http.server 3000
```

## Projektstruktur verstehen

```
website/
├── src/                    # Quellcode
│   ├── index.html          # Startseite
│   ├── styles/             # CSS
│   └── scripts/            # JavaScript
├── chatbot/                # KI-Chatbot
├── config/                 # Konfiguration
├── templates/              # Design-Vorlagen
└── docs/                   # Dokumentation
```

## Nächste Schritte

1. **Design anpassen**: Bearbeite die CSS-Variablen in `styles/base/variables.css`
2. **Inhalte ändern**: Bearbeite `src/index.html`
3. **Chatbot konfigurieren**: Passe `chatbot/config/chatConfig.js` an
4. **System-Prompt anpassen**: Bearbeite `chatbot/prompts/default.md`

## Hilfe

Bei Problemen siehe:
- `docs/setup/troubleshooting.md` (kommt noch)
- `docs/api/` für API-Dokumentation


