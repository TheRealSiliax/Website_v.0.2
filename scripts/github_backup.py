#!/usr/bin/env python3
"""
GitHub Backup Script

Führt automatische Sicherungen des Projekts in das konfigurierte GitHub-Repository durch.
Erkennt Backup-Anfragen und führt diese zuverlässig aus.
"""

import os
import sys
import subprocess
import yaml
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional, Tuple


def load_github_config(config_path: Path) -> Optional[Dict]:
    """Lädt die GitHub-Konfiguration aus der YAML-Datei."""
    if not config_path.exists():
        return None
    
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            config = yaml.safe_load(f)
        return config
    except Exception as error:
        print(f"Fehler beim Laden der Konfiguration: {error}", file=sys.stderr)
        return None


def check_git_initialized(project_root: Path) -> bool:
    """Prüft, ob Git im Projekt initialisiert ist."""
    git_dir = project_root / '.git'
    return git_dir.exists()


def initialize_git_repository(project_root: Path) -> bool:
    """Initialisiert ein Git-Repository, falls es noch nicht existiert."""
    try:
        subprocess.run(
            ['git', 'init'],
            cwd=project_root,
            check=True,
            capture_output=True,
            text=True
        )
        print("Git-Repository wurde initialisiert.")
        return True
    except subprocess.CalledProcessError as error:
        print(f"Fehler bei Git-Initialisierung: {error}", file=sys.stderr)
        return False


def configure_git_user(project_root: Path, config: Dict) -> bool:
    """Konfiguriert Git-Benutzer und E-Mail, falls nicht gesetzt."""
    try:
        user_name = config.get('git_user_name')
        user_email = config.get('git_user_email')
        
        if user_name:
            subprocess.run(
                ['git', 'config', 'user.name', user_name],
                cwd=project_root,
                check=True,
                capture_output=True,
                text=True
            )
        
        if user_email:
            subprocess.run(
                ['git', 'config', 'user.email', user_email],
                cwd=project_root,
                check=True,
                capture_output=True,
                text=True
            )
        
        return True
    except subprocess.CalledProcessError as error:
        print(f"Fehler bei Git-Konfiguration: {error}", file=sys.stderr)
        return False


def check_remote_configured(project_root: Path) -> bool:
    """Prüft, ob ein Remote-Repository konfiguriert ist."""
    try:
        result = subprocess.run(
            ['git', 'remote', 'get-url', 'origin'],
            cwd=project_root,
            capture_output=True,
            text=True
        )
        return result.returncode == 0
    except Exception:
        return False


def configure_remote(project_root: Path, config: Dict) -> bool:
    """Konfiguriert das Remote-Repository."""
    repository_url = config.get('repository_url')
    if not repository_url:
        print("Fehler: repository_url nicht in Konfiguration gefunden.", file=sys.stderr)
        return False
    
    try:
        if check_remote_configured(project_root):
            subprocess.run(
                ['git', 'remote', 'set-url', 'origin', repository_url],
                cwd=project_root,
                check=True,
                capture_output=True,
                text=True
            )
            print(f"Remote-URL aktualisiert: {repository_url}")
        else:
            subprocess.run(
                ['git', 'remote', 'add', 'origin', repository_url],
                cwd=project_root,
                check=True,
                capture_output=True,
                text=True
            )
            print(f"Remote-Repository hinzugefügt: {repository_url}")
        return True
    except subprocess.CalledProcessError as error:
        print(f"Fehler bei Remote-Konfiguration: {error}", file=sys.stderr)
        return False


def get_git_status(project_root: Path) -> Tuple[bool, str]:
    """Prüft den Git-Status und gibt zurück, ob es Änderungen gibt."""
    try:
        result = subprocess.run(
            ['git', 'status', '--porcelain'],
            cwd=project_root,
            capture_output=True,
            text=True,
            check=True
        )
        has_changes = bool(result.stdout.strip())
        return has_changes, result.stdout
    except subprocess.CalledProcessError as error:
        print(f"Fehler beim Prüfen des Git-Status: {error}", file=sys.stderr)
        return False, ""


def stage_all_changes(project_root: Path) -> bool:
    """Staged alle Änderungen (respektiert .gitignore)."""
    try:
        subprocess.run(
            ['git', 'add', '-A'],
            cwd=project_root,
            check=True,
            capture_output=True,
            text=True
        )
        return True
    except subprocess.CalledProcessError as error:
        print(f"Fehler beim Staging: {error}", file=sys.stderr)
        return False


def create_commit(project_root: Path, message: Optional[str] = None) -> Optional[str]:
    """Erstellt einen Commit mit Timestamp."""
    if message is None:
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        message = f"Backup: {timestamp}"
    
    try:
        result = subprocess.run(
            ['git', 'commit', '-m', message],
            cwd=project_root,
            check=True,
            capture_output=True,
            text=True
        )
        
        commit_hash_result = subprocess.run(
            ['git', 'rev-parse', 'HEAD'],
            cwd=project_root,
            capture_output=True,
            text=True,
            check=True
        )
        commit_hash = commit_hash_result.stdout.strip()
        print(f"Commit erstellt: {commit_hash}")
        return commit_hash
    except subprocess.CalledProcessError as error:
        print(f"Fehler beim Erstellen des Commits: {error}", file=sys.stderr)
        if error.stderr:
            print(f"Git-Ausgabe: {error.stderr}", file=sys.stderr)
        return None


def push_to_github(project_root: Path, branch: str = 'main') -> bool:
    """Pusht Änderungen zu GitHub."""
    current_branch_result = subprocess.run(
        ['git', 'branch', '--show-current'],
        cwd=project_root,
        capture_output=True,
        text=True
    )
    actual_branch = current_branch_result.stdout.strip() if current_branch_result.returncode == 0 else branch
    
    try:
        result = subprocess.run(
            ['git', 'push', '-u', 'origin', actual_branch],
            cwd=project_root,
            check=True,
            capture_output=True,
            text=True
        )
        print(f"Erfolgreich zu GitHub gepusht (Branch: {actual_branch})")
        return True
    except subprocess.CalledProcessError as error:
        print(f"Fehler beim Pushen zu GitHub: {error}", file=sys.stderr)
        if error.stderr:
            print(f"Git-Ausgabe: {error.stderr}", file=sys.stderr)
        
        if 'main' in error.stderr or 'master' in error.stderr:
            print("Hinweis: Versuche Branch 'master'...", file=sys.stderr)
            try:
                subprocess.run(
                    ['git', 'push', '-u', 'origin', 'master'],
                    cwd=project_root,
                    check=True,
                    capture_output=True,
                    text=True
                )
                print("Erfolgreich zu GitHub gepusht (Branch: master)")
                return True
            except subprocess.CalledProcessError:
                pass
        
        return False


def main() -> int:
    """Hauptfunktion für GitHub-Backup."""
    script_dir = Path(__file__).parent.resolve()
    project_root = script_dir.parent.resolve()
    config_path = project_root / '.github_config.yaml'
    
    print(f"Projekt-Root: {project_root}")
    print(f"Konfigurationsdatei: {config_path}")
    
    config = load_github_config(config_path)
    if not config:
        print("Fehler: GitHub-Konfiguration nicht gefunden oder ungültig.", file=sys.stderr)
        print(f"Bitte erstelle {config_path} mit den notwendigen Einstellungen.", file=sys.stderr)
        return 1
    
    if not check_git_initialized(project_root):
        print("Git-Repository nicht initialisiert. Initialisiere...")
        if not initialize_git_repository(project_root):
            return 2
        configure_git_user(project_root, config)
    
    current_branch_result = subprocess.run(
        ['git', 'branch', '--show-current'],
        cwd=project_root,
        capture_output=True,
        text=True
    )
    current_branch = current_branch_result.stdout.strip() if current_branch_result.returncode == 0 else 'master'
    
    if current_branch == 'master' and config.get('default_branch') == 'main':
        print("Benenne Branch 'master' zu 'main' um...")
        subprocess.run(
            ['git', 'branch', '-M', 'main'],
            cwd=project_root,
            check=True,
            capture_output=True,
            text=True
        )
        current_branch = 'main'
    
    if not check_remote_configured(project_root):
        print("Remote-Repository nicht konfiguriert. Konfiguriere...")
        if not configure_remote(project_root, config):
            return 3
    else:
        configure_remote(project_root, config)
    
    has_changes, status_output = get_git_status(project_root)
    if not has_changes:
        print("Keine Änderungen zum Committen vorhanden.")
        return 0
    
    print("Änderungen gefunden:")
    print(status_output)
    
    if not stage_all_changes(project_root):
        return 4
    
    commit_hash = create_commit(project_root)
    if not commit_hash:
        return 5
    
    default_branch = config.get('default_branch', 'main')
    if not push_to_github(project_root, default_branch):
        print("Warnung: Commit erstellt, aber Push fehlgeschlagen.", file=sys.stderr)
        print(f"Bitte manuell pushen mit: git push -u origin {default_branch}", file=sys.stderr)
        print("\nMögliche Ursachen:", file=sys.stderr)
        print("1. SSH-Authentifizierung nicht eingerichtet - siehe SSH_SETUP_ANLEITUNG.md", file=sys.stderr)
        print("2. Repository existiert nicht auf GitHub", file=sys.stderr)
        print("3. Keine Berechtigung für das Repository", file=sys.stderr)
        return 6
    
    print("✅ Backup erfolgreich abgeschlossen!")
    print(f"Commit: {commit_hash}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

