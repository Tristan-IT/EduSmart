/**
 * Sound Manager for Adapti Belajar
 * Manages audio playback, volume, and settings for gamification sounds
 */

export type SoundType =
  | "level-up"
  | "achievement"
  | "streak-milestone"
  | "quiz-complete"
  | "quiz-correct"
  | "quiz-wrong"
  | "gem-earn"
  | "heart-lost"
  | "unlock"
  | "click";

interface SoundSettings {
  enabled: boolean;
  volume: number; // 0-1
}

class SoundManager {
  private sounds: Map<SoundType, HTMLAudioElement> = new Map();
  private settings: SoundSettings;
  private readonly STORAGE_KEY = "adapti-sound-settings";

  constructor() {
    // Load settings from localStorage
    this.settings = this.loadSettings();
    // Initialize sounds
    this.initializeSounds();
  }

  private loadSettings(): SoundSettings {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to load sound settings:", error);
    }
    // Default settings
    return {
      enabled: true,
      volume: 0.5,
    };
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error("Failed to save sound settings:", error);
    }
  }

  private initializeSounds(): void {
    // Using data URLs for simple synthetic sounds
    // In production, replace with actual sound files
    
    const soundData: Record<SoundType, string> = {
      "level-up": this.createTone([523, 659, 784, 1047], [0.1, 0.1, 0.1, 0.3]),
      "achievement": this.createTone([659, 784, 988], [0.15, 0.15, 0.2]),
      "streak-milestone": this.createTone([440, 554, 659, 880], [0.1, 0.1, 0.1, 0.25]),
      "quiz-complete": this.createTone([523, 659, 784], [0.1, 0.1, 0.2]),
      "quiz-correct": this.createTone([659, 880], [0.1, 0.15]),
      "quiz-wrong": this.createTone([330, 262], [0.15, 0.2]),
      "gem-earn": this.createTone([784, 988, 1175], [0.08, 0.08, 0.12]),
      "heart-lost": this.createTone([392, 330, 294], [0.1, 0.1, 0.15]),
      "unlock": this.createTone([523, 784, 659, 1047], [0.08, 0.08, 0.08, 0.2]),
      "click": this.createTone([880], [0.05]),
    };

    // Create audio elements
    Object.entries(soundData).forEach(([type, dataUrl]) => {
      const audio = new Audio(dataUrl);
      audio.volume = this.settings.volume;
      this.sounds.set(type as SoundType, audio);
    });
  }

  /**
   * Create a simple tone using Web Audio API
   */
  private createTone(frequencies: number[], durations: number[]): string {
    // For now, return empty data URL - will be replaced with actual sounds
    // This is a placeholder that won't make actual noise
    return "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
  }

  /**
   * Play a sound effect
   */
  public play(type: SoundType): void {
    if (!this.settings.enabled) return;

    const sound = this.sounds.get(type);
    if (sound) {
      // Clone and play to allow multiple simultaneous sounds
      const clone = sound.cloneNode() as HTMLAudioElement;
      clone.volume = this.settings.volume;
      clone.play().catch((error) => {
        // Ignore errors (user might not have interacted with page yet)
        console.debug("Sound play failed:", error);
      });
    }
  }

  /**
   * Enable or disable sounds
   */
  public setEnabled(enabled: boolean): void {
    this.settings.enabled = enabled;
    this.saveSettings();
  }

  /**
   * Set volume (0-1)
   */
  public setVolume(volume: number): void {
    this.settings.volume = Math.max(0, Math.min(1, volume));
    this.saveSettings();

    // Update all sound volumes
    this.sounds.forEach((sound) => {
      sound.volume = this.settings.volume;
    });
  }

  /**
   * Get current settings
   */
  public getSettings(): SoundSettings {
    return { ...this.settings };
  }

  /**
   * Preload a specific sound
   */
  public preload(type: SoundType): void {
    const sound = this.sounds.get(type);
    if (sound) {
      sound.load();
    }
  }

  /**
   * Preload all sounds
   */
  public preloadAll(): void {
    this.sounds.forEach((sound) => sound.load());
  }
}

// Singleton instance
const soundManager = new SoundManager();

export default soundManager;

/**
 * React hook for using sound manager
 */
export function useSoundManager() {
  const play = (type: SoundType) => soundManager.play(type);
  const setEnabled = (enabled: boolean) => soundManager.setEnabled(enabled);
  const setVolume = (volume: number) => soundManager.setVolume(volume);
  const getSettings = () => soundManager.getSettings();

  return {
    play,
    setEnabled,
    setVolume,
    getSettings,
  };
}
