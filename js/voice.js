// Controlador de voz - entrada e saída
class VoiceController {
  constructor() {
    this.recognition = null;
    this.synth = window.speechSynthesis;
    this.isListening = false;
    this.isSpeaking = false;

    // Inicializa reconhecimento de voz se suportado
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'pt-BR';

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.onVoiceInput(transcript);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.updateUI();
      };

      this.recognition.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        this.isListening = false;
        this.updateUI();
      };
    }
  }

  // Callback para quando receber entrada de voz
  onVoiceInput(text) {
    // Será definido pelo chatbot
    if (this.voiceInputCallback) {
      this.voiceInputCallback(text);
    }
  }

  // Define callback para entrada de voz
  setVoiceInputCallback(callback) {
    this.voiceInputCallback = callback;
  }

  // Inicia reconhecimento de voz
  startListening() {
    if (this.recognition && !this.isListening) {
      this.isListening = true;
      this.recognition.start();
      this.updateUI();
    }
  }

  // Para reconhecimento de voz
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Seleciona voz em português (pt-BR)
  selectPortugueseVoice() {
    const voices = this.synth.getVoices();
    // Tenta encontrar voz em português do Brasil
    let selectedVoice = voices.find(voice => voice.lang.includes('pt-BR'));
    // Se não encontrar, tenta português genérico
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => voice.lang.includes('pt'));
    }
    // Se ainda não encontrar, usa a primeira disponível
    if (!selectedVoice && voices.length > 0) {
      selectedVoice = voices[0];
    }
    return selectedVoice;
  }

  // Fala um texto
  speak(text, callback = null) {
    if (!text || text.trim() === '') {
      if (callback) callback();
      return;
    }

    // Cancela qualquer fala anterior para evitar sobreposição
    this.synth.cancel();
    this.isSpeaking = false;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95; // Velocidade ligeiramente mais lenta para clareza
    utterance.pitch = 1.0; // Tom natural
    utterance.volume = 1.0; // Volume máximo

    // Tenta selecionar voz em português
    const portugueseVoice = this.selectPortugueseVoice();
    if (portugueseVoice) {
      utterance.voice = portugueseVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.updateUI();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.updateUI();
      if (callback) callback();
    };

    utterance.onerror = (event) => {
      console.error('Erro na síntese de voz:', event.error);
      this.isSpeaking = false;
      this.updateUI();
    };

    // Inicia a fala após cancelar fala anterior
    this.synth.speak(utterance);
  }

  // Para fala
  stopSpeaking() {
    this.synth.cancel();
    this.isSpeaking = false;
    this.updateUI();
  }

  // Verifica se reconhecimento de voz é suportado
  isRecognitionSupported() {
    return this.recognition !== null;
  }

  // Verifica se síntese de voz é suportada
  isSynthesisSupported() {
    return 'speechSynthesis' in window;
  }

  // Atualiza interface (será implementado na UI)
  updateUI() {
    // Placeholder - será implementado no main.js
  }
}

// Instância global
const voiceController = new VoiceController();
