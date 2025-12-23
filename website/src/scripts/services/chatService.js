/**
 * Chat Service
 * Verwaltet die Kommunikation mit der KI-API
 */

import { API_CONFIG } from '../../config/api.config.js';

export class ChatService {
    constructor() {
        this.conversationHistory = [];
        this.systemPrompt = this.getSystemPrompt();
    }
    
    /**
     * Sendet eine Nachricht an die KI-API
     * @param {string} userMessage - Die Nachricht des Benutzers
     * @returns {Promise<string>} Die Antwort der KI
     */
    async sendMessage(userMessage) {
        // Nachricht zur Historie hinzufügen
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });
        
        try {
            const response = await this.callAPI(userMessage);
            
            // Antwort zur Historie hinzufügen
            this.conversationHistory.push({
                role: 'assistant',
                content: response
            });
            
            return response;
        } catch (error) {
            console.error('API-Fehler:', error);
            throw error;
        }
    }
    
    /**
     * Ruft die KI-API auf
     * @param {string} message - Die Nachricht
     * @returns {Promise<string>} Die API-Antwort
     */
    async callAPI(message) {
        const apiKey = API_CONFIG.apiKey;
        const apiUrl = API_CONFIG.apiUrl;
        const model = API_CONFIG.model;
        
        if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
            console.warn('Kein API-Key konfiguriert. Verwende Demo-Modus.');
            return this.getDemoResponse(message);
        }
        
        const requestBody = {
            model: model,
            messages: [
                { role: 'system', content: this.systemPrompt },
                ...this.conversationHistory
            ],
            max_tokens: API_CONFIG.maxTokens,
            temperature: API_CONFIG.temperature
        };
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API-Fehler: ${response.status} - ${errorData.error?.message || 'Unbekannter Fehler'}`);
        }
        
        const data = await response.json();
        return data.choices[0]?.message?.content || 'Keine Antwort erhalten.';
    }
    
    /**
     * Gibt eine Demo-Antwort zurück (wenn kein API-Key konfiguriert ist)
     * @param {string} message - Die Nachricht
     * @returns {string} Eine Demo-Antwort
     */
    getDemoResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        const responses = {
            'hallo': 'Hallo! Wie kann ich Ihnen helfen?',
            'hilfe': 'Ich bin hier, um Ihnen zu helfen. Stellen Sie mir gerne Ihre Fragen!',
            'kontakt': 'Sie können uns über das Kontaktformular auf dieser Seite erreichen.',
            'default': 'Vielen Dank für Ihre Nachricht. Im Live-Modus würde ich Ihnen eine detaillierte Antwort geben. Bitte konfigurieren Sie den API-Key für die volle Funktionalität.'
        };
        
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        
        return responses.default;
    }
    
    /**
     * Gibt den System-Prompt für die KI zurück
     * @returns {string} Der System-Prompt
     */
    getSystemPrompt() {
        return `Du bist ein freundlicher und hilfreicher KI-Assistent für eine Website.
        
Deine Aufgaben:
- Beantworte Fragen der Besucher höflich und kompetent
- Hilf bei der Navigation auf der Website
- Beantworte allgemeine Fragen zu den angebotenen Services
- Leite bei komplexen Anfragen zum Kontaktformular weiter

Verhaltensregeln:
- Antworte immer auf Deutsch
- Sei freundlich und professionell
- Halte Antworten kurz und prägnant
- Bei Unsicherheit, empfehle das Kontaktformular`;
    }
    
    /**
     * Löscht die Konversationshistorie
     */
    clearHistory() {
        this.conversationHistory = [];
    }
}


