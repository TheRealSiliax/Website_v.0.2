# SSH-Authentifizierung für GitHub einrichten

## Schritt 1: SSH-Key prüfen

Prüfe, ob bereits ein SSH-Key vorhanden ist:

```bash
ls ~/.ssh/
```

Suche nach Dateien wie:
- `id_rsa` und `id_rsa.pub` (RSA-Key)
- `id_ed25519` und `id_ed25519.pub` (ED25519-Key, empfohlen)

## Schritt 2: SSH-Key erstellen (falls nicht vorhanden)

Falls kein SSH-Key vorhanden ist, erstelle einen neuen:

```bash
ssh-keygen -t ed25519 -C "namyslo.termine@gmail.com"
```

- Drücke Enter, um den Standard-Speicherort zu verwenden
- Optional: Gib ein Passwort ein (empfohlen für zusätzliche Sicherheit)

## Schritt 3: SSH-Key zu GitHub hinzufügen

### 3.1 Öffentlichen Key anzeigen

```bash
cat ~/.ssh/id_ed25519.pub
```

Oder falls du einen RSA-Key hast:

```bash
cat ~/.ssh/id_rsa.pub
```

### 3.2 Key kopieren

Kopiere den gesamten ausgegebenen Text (beginnt mit `ssh-ed25519` oder `ssh-rsa`).

### 3.3 Zu GitHub hinzufügen

1. Gehe zu GitHub.com
2. Klicke auf dein Profil → **Settings**
3. Klicke auf **SSH and GPG keys** (links in der Seitenleiste)
4. Klicke auf **New SSH key**
5. **Title**: Gib einen beschreibenden Namen ein (z.B. "Windows PC")
6. **Key**: Füge den kopierten öffentlichen Key ein
7. Klicke auf **Add SSH key**

## Schritt 4: SSH-Verbindung testen

Teste die Verbindung zu GitHub:

```bash
ssh -T git@github.com
```

Du solltest eine Meldung sehen wie:
```
Hi TheRealSiliax! You've successfully authenticated, but GitHub does not provide shell access.
```

Falls du nach dem Fingerprint gefragt wirst, antworte mit **"yes"**.

## Schritt 5: Backup testen

Nach erfolgreicher SSH-Einrichtung kannst du das Backup testen:

```bash
python scripts/github_backup.py
```

Oder sage einfach dem Operator: **"Sicherung machen"**

## Alternative: HTTPS mit Personal Access Token

Falls SSH Probleme macht, kannst du auch HTTPS verwenden:

1. Gehe zu GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Erstelle einen neuen Token mit `repo` Berechtigung
3. Ändere in `.github_config.yaml` die URL zu:
   ```yaml
   repository_url: https://github.com/TheRealSiliax/Website_v.0.1.git
   ```
4. Git wird nach dem Token fragen (verwende den Token als Passwort)

**Hinweis**: SSH ist sicherer und bequemer, da du dich nicht jedes Mal authentifizieren musst.

## Fehlerbehebung

### "Host key verification failed"

**Lösung**: Füge GitHub zu den bekannten Hosts hinzu:

```bash
ssh-keyscan github.com >> ~/.ssh/known_hosts
```

### "Permission denied (publickey)"

**Lösung**: 
1. Stelle sicher, dass der SSH-Key zu GitHub hinzugefügt wurde
2. Prüfe, ob der richtige Key verwendet wird: `ssh-add -l`
3. Falls nötig, füge den Key hinzu: `ssh-add ~/.ssh/id_ed25519`

### Windows-spezifisch

Auf Windows kann der Pfad anders sein:
- PowerShell: `$env:USERPROFILE\.ssh\`
- CMD: `%USERPROFILE%\.ssh\`

Prüfe mit:
```powershell
ls $env:USERPROFILE\.ssh\
```

