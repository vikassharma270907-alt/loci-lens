import wave
import struct
import math
import os

def create_tone(freq, dur_s, sample_rate=22050, volume=0.22, tone_type="sine"):
    samples = []
    n_samples = int(dur_s * sample_rate)
    for i in range(n_samples):
        t = i / float(sample_rate)
        env = math.exp(-3.5 * (t / dur_s)) # Decay envelope
        if tone_type == "sine":
            val = math.sin(2 * math.pi * freq * t)
        elif tone_type == "triangle":
            val = 2 * abs(2 * (t * freq - math.floor(t * freq + 0.5))) - 1
        elif tone_type == "major_chord":
            val = (math.sin(2 * math.pi * freq * t) + 
                   0.6 * math.sin(2 * math.pi * (freq * 1.25) * t) + 
                   0.4 * math.sin(2 * math.pi * (freq * 1.5) * t)) / 2.0
        else:
            val = math.sin(2 * math.pi * freq * t)
        sample = int(val * env * volume * 32767)
        samples.append(sample)
    return samples

def main():
    in_wav = 'temp_audio/combined_narration.wav'
    out_wav = 'temp_audio/final_soundtrack.wav'

    with wave.open(in_wav, 'rb') as w:
        framerate = w.getframerate()
        n_frames = w.getnframes()
        data = w.readframes(n_frames)
        # 16-bit mono or stereo
        n_channels = w.getnchannels()
        fmt = f"<{n_frames * n_channels}h"
        raw_samples = list(struct.unpack(fmt, data))

    # Add chimes at specific timestamps (converted to sample indices)
    # Timestamps in seconds:
    # Scene 3 (Place Mode): starts at 33.0s, cards placed at 36s, 40s, 44s, 48s, 52s, 56s
    place_chimes = [36.0, 40.0, 44.0, 48.0, 52.0, 56.5]
    # Scene 4 (Stroll Mode): starts at 63.0s, out of view alert at 76.0s
    out_of_view_chimes = [76.0]
    # Scene 5 (Test Mode): starts at 87.0s, reveal at 93.0s, got it at 96.0s, reveal at 100.0s, missed at 104.0s
    flip_chimes = [93.0, 100.0]
    got_it_chimes = [96.0]
    missed_chimes = [104.0]
    # Scene 6 (Summary Mode): starts at 108.0s, summary fanfare at 109.0s
    summary_chimes = [109.0]

    def overlay(tone_samples, start_time_s):
        start_idx = int(start_time_s * framerate) * n_channels
        for i, s in enumerate(tone_samples):
            idx = start_idx + i * n_channels
            if idx < len(raw_samples):
                # Mix and clamp
                mixed = raw_samples[idx] + s
                raw_samples[idx] = max(-32768, min(32767, mixed))
                if n_channels == 2:
                    mixed_r = raw_samples[idx + 1] + s
                    raw_samples[idx + 1] = max(-32768, min(32767, mixed_r))

    # Generate and overlay
    place_tone = create_tone(587.33, 0.20, framerate, volume=0.20, tone_type="sine")
    for t in place_chimes:
        overlay(place_tone, t)

    alert_tone = create_tone(783.99, 0.25, framerate, volume=0.22, tone_type="triangle")
    for t in out_of_view_chimes:
        overlay(alert_tone, t)

    flip_tone = create_tone(659.25, 0.22, framerate, volume=0.20, tone_type="triangle")
    for t in flip_chimes:
        overlay(flip_tone, t)

    success_tone = create_tone(880.0, 0.35, framerate, volume=0.25, tone_type="major_chord")
    for t in got_it_chimes:
        overlay(success_tone, t)

    missed_tone = create_tone(349.23, 0.28, framerate, volume=0.22, tone_type="sine")
    for t in missed_chimes:
        overlay(missed_tone, t)

    for t in summary_chimes:
        overlay(success_tone, t)

    # Save to final_soundtrack.wav
    with wave.open(out_wav, 'wb') as out:
        out.setnchannels(n_channels)
        out.setsampwidth(2)
        out.setframerate(framerate)
        out.writeframes(struct.pack(fmt, *raw_samples))

    print(f"Final mixed soundtrack created: {out_wav} ({n_frames / framerate:.2f}s)")

if __name__ == "__main__":
    main()
