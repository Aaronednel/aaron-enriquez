/**
 * Subtle Web Audio API cosmic ambient sound engine.
 * Disabled by default. Only initializes after explicit user interaction.
 */
class CosmicAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private isPlaying = false;

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    }
    this.start();
    return true;
  }

  public start(): void {
    if (this.isPlaying || typeof window === 'undefined') return;

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.045, now + 1.4);

    // Gentle low-pass filter for warm cosmic pad
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(340, now);

    filter.connect(master);
    master.connect(this.ctx.destination);

    // Subtle harmonic drone frequencies (A1, E2, B2)
    const freqs = [55, 82.41, 123.47];
    this.oscillators = freqs.map((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime((idx - 1) * 4, now);

      const oscGain = this.ctx!.createGain();
      oscGain.gain.setValueAtTime(idx === 0 ? 0.6 : 0.2, now);

      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start(now);
      return osc;
    });

    this.masterGain = master;
    this.isPlaying = true;
  }

  public stop(): void {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    const oldOscs = [...this.oscillators];
    this.oscillators = [];
    this.isPlaying = false;

    window.setTimeout(() => {
      oldOscs.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // Ignore already stopped oscillators
        }
      });
    }, 550);
  }
}

export const cosmicAudio = new CosmicAudioEngine();
