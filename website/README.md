# Website mit KI-Chatbot Integration

## Projektübersicht

Moderne Website mit integriertem KI-Chatbot, der über eine API angebunden wird.

## Ordnerstruktur

```
website/
├── src/                    # Quellcode
│   ├── assets/            # Statische Ressourcen
│   │   ├── images/        # Bilder und Icons
│   │   ├── fonts/         # Schriftarten
│   │   └── videos/        # Videos
│   ├── styles/            # CSS/SCSS Stylesheets
│   │   ├── components/    # Komponenten-Styles
│   │   ├── layouts/       # Layout-Styles
│   │   ├── base/          # Basis-Styles (Reset, Variablen)
│   │   └── main.css       # Haupt-Stylesheet
│   ├── scripts/           # JavaScript
│   │   ├── components/    # UI-Komponenten
│   │   ├── services/      # API-Services
│   │   ├── utils/         # Hilfsfunktionen
│   │   └── main.js        # Haupt-Script
│   ├── pages/             # HTML-Seiten
│   └── index.html         # Startseite
├── api/                    # Backend/API-Integration
│   ├── services/          # API-Service-Layer
│   ├── middleware/        # Middleware (Auth, Logging)
│   └── routes/            # API-Routen
├── chatbot/               # KI-Chatbot-Modul
│   ├── components/        # Chat-UI-Komponenten
│   ├── services/          # Chat-API-Integration
│   ├── config/            # Chatbot-Konfiguration
│   └── prompts/           # System-Prompts für die KI
├── config/                # Konfigurationsdateien
│   ├── .env.example       # Beispiel-Umgebungsvariablen
│   └── settings.json      # Allgemeine Einstellungen
├── templates/             # Design-Vorlagen (JSON, Figma-Export, etc.)
│   ├── designs/           # Design-Dateien
│   ├── mockups/           # Mockup-Daten
│   └── components/        # Komponenten-Templates
├── docs/                  # Dokumentation
│   ├── api/               # API-Dokumentation
│   ├── setup/             # Setup-Anleitungen
│   └── architecture/      # Architektur-Diagramme
├── tests/                 # Tests
│   ├── unit/              # Unit-Tests
│   ├── integration/       # Integrationstests
│   └── e2e/               # End-to-End-Tests
├── build/                 # Build-Ausgabe (generiert)
└── public/                # Öffentliche statische Dateien
```

## Schnellstart

1. Konfiguration einrichten:
   ```bash
   cp config/.env.example config/.env
   ```

2. API-Key eintragen in `config/.env`

3. Website starten (siehe Setup-Anleitung)

## Sicherheit

- **API-Keys niemals committen!** Verwende `.env` Dateien
- Die `.gitignore` schützt sensible Daten automatisch


