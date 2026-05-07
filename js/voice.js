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

    this.speechQueue = [];
    this.currentUtteranceText = null;
    this.voices = [];
    this.selectedVoice = null;

    this.initVoices();
  }

  initVoices() {
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      if (!voices || voices.length === 0) {
        return;
      }
      this.voices = voices;
      this.selectedVoice = this.selectPortugueseVoice();
    };

    loadVoices();
    if ('onvoiceschanged' in this.synth) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  // Callback para quando receber entrada de voz
  onVoiceInput(text) {
    console.log(`🎤 Voice input received: "${text}"`);
    // Será definido pelo chatbot
    if (this.voiceInputCallback) {
      console.log('📞 Chamando voiceInputCallback');
      this.voiceInputCallback(text);
    } else {
      console.log('🚫 voiceInputCallback não definido');
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
    const voices = this.voices.length ? this.voices : this.synth.getVoices();
    const languageKey = (voice) => (voice.lang || '').toLowerCase();
    const nameKey = (voice) => (voice.name || '').toLowerCase();

    const scoreVoice = (voice) => {
      let score = 0;
      const lang = languageKey(voice);
      const name = nameKey(voice);
      if (lang.includes('pt-br')) score += 10;
      if (lang.includes('pt')) score += 5;
      if (name.includes('google')) score += 4;
      if (name.includes('microsoft')) score += 4;
      if (name.includes('natural')) score += 3;
      if (name.includes('brasil') || name.includes('brazil') || name.includes('português')) score += 2;
      if (name.includes('female') || name.includes('feminino')) score += 2;
      return score;
    };

    const candidates = voices.filter(voice => languageKey(voice).includes('pt'));
    if (candidates.length > 0) {
      candidates.sort((a, b) => scoreVoice(b) - scoreVoice(a));
      return candidates[0];
    }

    if (voices.length > 0) {
      return voices[0];
    }

    return null;
  }

  enqueueSpeech(text, callback = null) {
    this.speechQueue.push({ text, callback });
    if (!this.isSpeaking) {
      this.playNextSpeech();
    }
  }

  playNextSpeech() {
    if (this.isSpeaking || this.speechQueue.length === 0) {
      return;
    }

    const next = this.speechQueue.shift();
    if (!next || !next.text) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(next.text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    this.isSpeaking = true;
    this.currentUtteranceText = next.text;
    this.updateUI();

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.updateUI();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtteranceText = null;
      this.updateUI();
      if (typeof next.callback === 'function') {
        next.callback();
      }
      setTimeout(() => this.playNextSpeech(), 100);
    };

    utterance.onerror = (event) => {
      console.error('Erro na síntese de voz:', event.error);
      this.isSpeaking = false;
      this.currentUtteranceText = null;
      this.updateUI();
      if (typeof next.callback === 'function') {
        next.callback();
      }
      setTimeout(() => this.playNextSpeech(), 100);
    };

    this.synth.speak(utterance);
  }

  // Fala um texto
  speak(text, callback = null) {
    if (!text || text.trim() === '') {
      if (callback) callback();
      return;
    }

    if (typeof userInteracted === 'undefined' || !userInteracted) {
      if (callback) callback();
      return;
    }

    if (typeof isChatOpen === 'undefined' || !isChatOpen) {
      console.log('🎤 Voz ignorada: chat não está aberto');
      if (callback) callback();
      return;
    }

    if (this.currentUtteranceText === text || this.speechQueue.some(item => item.text === text)) {
      console.log('🔇 Mensagem duplicada ignorada:', text);
      if (callback) callback();
      return;
    }

    this.enqueueSpeech(text, callback);
  }

  // Para fala
  stopSpeaking() {
    this.speechQueue = [];
    this.synth.cancel();
    this.isSpeaking = false;
    this.currentUtteranceText = null;
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
