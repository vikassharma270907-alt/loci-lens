/**
 * Loci Lens - AudioFx
 * Manages spatial auditory feedback for interactions, answer reveals, and out-of-view guidance.
 */

export interface AudioEventLog {
  eventType: "place" | "reveal" | "success" | "missed" | "out_of_view_chime";
  frequencyHz: number;
  durationMs: number;
  timestamp: number;
}

export class AudioFx {
  public history: AudioEventLog[] = [];
  public isMuted: boolean = false;

  private record(type: AudioEventLog["eventType"], freq: number, dur: number): void {
    if (this.isMuted) return;
    this.history.push({
      eventType: type,
      frequencyHz: freq,
      durationMs: dur,
      timestamp: Date.now()
    });
  }

  public playPlaceTone(): void {
    // Soft high-frequency spatial confirmation ping (587 Hz, D5)
    this.record("place", 587.33, 150);
  }

  public playRevealTone(): void {
    // Gentle melodic sweep upward (440 Hz -> 659 Hz)
    this.record("reveal", 659.25, 200);
  }

  public playSuccessTone(): void {
    // Cheerful harmonic major chord chime (880 Hz, A5)
    this.record("success", 880.0, 250);
  }

  public playMissedTone(): void {
    // Low, soft supportive feedback tone (349 Hz, F4)
    this.record("missed", 349.23, 200);
  }

  public playOutOfViewChime(): void {
    // Subtle direction locator ping (784 Hz, G5)
    this.record("out_of_view_chime", 783.99, 120);
  }

  public clearHistory(): void {
    this.history = [];
  }
}
