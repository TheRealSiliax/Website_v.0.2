/**
 * Chatbot Component
 * KI-Chatbot Widget mit API-Integration
 */

import { ChatService } from '../services/chatService.js';

let chatService = null;
let isOpen = false;

/**
 * Initialisiert den Chatbot
 */
export function initChatbot() {
    const chatbot = document.getElementById('chatbot');
    const toggleButton = document.getElementById('chatbotToggle');
    const closeButton = document.getElementById('chatbotClose');
    const chatWindow = document.getElementById('chatbotWindow');
    const chatForm = document.getElementById('chatbotForm');
    const chatInput = document.getElementById('chatbotInput');
    const messagesContainer = document.getElementById('chatbotMessages');
    
    if (!chatbot || !toggleButton || !chatWindow) {
        console.warn('Chatbot-Elemente nicht gefunden');
        return;
    }
    
    // Chat-Service initialisieren
    chatService = new ChatService();
    
    // Toggle-Button Click Handler
    toggleButton.addEventListener('click', () => {
        toggleChatWindow(chatWindow, toggleButton);
    });
    
    // Close-Button Click Handler
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            closeChatWindow(chatWindow, toggleButton);
        });
    }
    
    // Formular Submit Handler
    if (chatForm && chatInput && messagesContainer) {
        chatForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await handleMessageSubmit(chatInput, messagesContainer);
        });
    }
    
    // Willkommensnachricht anzeigen
    addWelcomeMessage(messagesContainer);
    
    console.log('Chatbot initialisiert');
}

/**
 * Öffnet/Schließt das Chat-Fenster
 * @param {HTMLElement} chatWindow - Das Chat-Fenster
 * @param {HTMLElement} toggleButton - Der Toggle-Button
 */
function toggleChatWindow(chatWindow, toggleButton) {
    isOpen = !isOpen;
    
    if (isOpen) {
        chatWindow.hidden = false;
        toggleButton.setAttribute('aria-expanded', 'true');
        
        // Fokus auf Input setzen
        setTimeout(() => {
            document.getElementById('chatbotInput')?.focus();
        }, 100);
    } else {
        chatWindow.hidden = true;
        toggleButton.setAttribute('aria-expanded', 'false');
    }
}

/**
 * Schließt das Chat-Fenster
 * @param {HTMLElement} chatWindow - Das Chat-Fenster
 * @param {HTMLElement} toggleButton - Der Toggle-Button
 */
function closeChatWindow(chatWindow, toggleButton) {
    isOpen = false;
    chatWindow.hidden = true;
    toggleButton.setAttribute('aria-expanded', 'false');
}

/**
 * Verarbeitet das Absenden einer Nachricht
 * @param {HTMLInputElement} inputElement - Das Input-Element
 * @param {HTMLElement} messagesContainer - Der Container für Nachrichten
 */
async function handleMessageSubmit(inputElement, messagesContainer) {
    const message = inputElement.value.trim();
    
    if (!message) return;
    
    // Input leeren
    inputElement.value = '';
    
    // Benutzer-Nachricht anzeigen
    addMessage(messagesContainer, message, 'user');
    
    // Loading-Indikator anzeigen
    const loadingElement = addLoadingIndicator(messagesContainer);
    
    try {
        // Nachricht an API senden
        const response = await chatService.sendMessage(message);
        
        // Loading-Indikator entfernen
        loadingElement.remove();
        
        // Bot-Antwort anzeigen
        addMessage(messagesContainer, response, 'bot');
    } catch (error) {
        console.error('Chatbot-Fehler:', error);
        
        // Loading-Indikator entfernen
        loadingElement.remove();
        
        // Fehlermeldung anzeigen
        addMessage(
            messagesContainer, 
            'Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.', 
            'bot'
        );
    }
}

/**
 * Fügt eine Nachricht zum Chat hinzu
 * @param {HTMLElement} container - Der Container für Nachrichten
 * @param {string} text - Der Nachrichtentext
 * @param {string} type - Der Typ ('user' oder 'bot')
 */
function addMessage(container, text, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `chatbot__message chatbot__message--${type}`;
    messageElement.textContent = text;
    
    container.appendChild(messageElement);
    
    // Zum Ende scrollen
    container.scrollTop = container.scrollHeight;
}

/**
 * Fügt einen Loading-Indikator hinzu
 * @param {HTMLElement} container - Der Container für Nachrichten
 * @returns {HTMLElement} Das Loading-Element
 */
function addLoadingIndicator(container) {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'chatbot__message chatbot__message--loading';
    loadingElement.innerHTML = '<span class="loading-dots">...</span>';
    
    container.appendChild(loadingElement);
    container.scrollTop = container.scrollHeight;
    
    return loadingElement;
}

/**
 * Fügt die Willkommensnachricht hinzu
 * @param {HTMLElement} container - Der Container für Nachrichten
 */
function addWelcomeMessage(container) {
    if (!container) return;
    
    const welcomeMessage = 'Hallo! Ich bin Ihr KI-Assistent. Wie kann ich Ihnen heute helfen?';
    addMessage(container, welcomeMessage, 'bot');
}


