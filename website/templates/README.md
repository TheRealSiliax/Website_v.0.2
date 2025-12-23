# Design-Vorlagen

Dieser Ordner enthält alle Design-Vorlagen und Mockups für die Website.

## Struktur

```
templates/
├── designs/           # Design-Dateien (JSON, Figma-Export, etc.)
│   ├── homepage.json  # Homepage-Design
│   ├── components.json # Komponenten-Design
│   └── styles.json    # Style-Konfiguration
├── mockups/           # Mockup-Daten
│   └── content.json   # Beispiel-Inhalte
└── components/        # Komponenten-Templates
    └── cards.json     # Karten-Komponenten
```

## Verwendung

Platziere hier deine Design-Vorlagen in den folgenden Formaten:

### JSON-Format
Für strukturierte Design-Daten:

```json
{
    "component": "hero",
    "props": {
        "title": "Willkommen",
        "subtitle": "Untertitel",
        "backgroundImage": "url/to/image.jpg"
    },
    "styles": {
        "backgroundColor": "#2563eb",
        "textColor": "#ffffff"
    }
}
```

### Figma-Export
Exportiere Designs aus Figma als:
- JSON (für Tokens und Variablen)
- SVG (für Icons und Illustrationen)
- PNG/WebP (für Bilder)

### Tailwind Config
Falls du Tailwind CSS verwendest, kannst du hier auch Tailwind-Konfigurationen ablegen.

## Nächste Schritte

1. Lade deine Design-Vorlagen hier hoch
2. Definiere die Komponenten-Struktur in `components/`
3. Erstelle Beispiel-Inhalte in `mockups/`


