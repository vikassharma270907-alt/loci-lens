import wave
import struct
import math
import os
import json

def get_wav_info(filepath):
    with wave.open(filepath, 'rb') as w:
        n_channels = w.getnchannels()
        sampwidth = w.getsampwidth()
        framerate = w.getframerate()
        n_frames = w.getnframes()
        duration = n_frames / float(framerate)
        data = w.readframes(n_frames)
        fmt = f"<{n_frames * n_channels}h"
        samples = list(struct.unpack(fmt, data))
        return {
            "channels": n_channels,
            "sampwidth": sampwidth,
            "framerate": framerate,
            "n_frames": n_frames,
            "duration": duration,
            "samples": samples
        }

def synth_tone(freq, dur_s, sample_rate=22050, volume=0.25, tone_type="sine"):
    samples = []
    n_samples = int(dur_s * sample_rate)
    for i in range(n_samples):
        t = i / float(sample_rate)
        env = math.exp(-3.2 * (t / dur_s))
        if tone_type == "sine":
            val = math.sin(2 * math.pi * freq * t)
        elif tone_type == "harmonic_chime":
            val = (math.sin(2 * math.pi * freq * t) +
                   0.5 * math.sin(2 * math.pi * freq * 2.0 * t) +
                   0.25 * math.sin(2 * math.pi * freq * 3.0 * t)) / 1.75
        elif tone_type == "buzzer":
            val = (math.sin(2 * math.pi * freq * t) + 
                   math.sin(2 * math.pi * (freq * 1.06) * t)) * 0.5
            val = 0.8 if val > 0 else -0.8
        elif tone_type == "fanfare":
            phase = (t / dur_s) * 4.0
            if phase < 1.0:
                f = freq
            elif phase < 2.0:
                f = freq * 1.25  # E
            elif phase < 3.0:
                f = freq * 1.5   # G
            else:
                f = freq * 2.0   # High C
            val = math.sin(2 * math.pi * f * t)
        elif tone_type == "click":
            val = math.sin(2 * math.pi * freq * t) * math.exp(-30.0 * (t / dur_s))
        else:
            val = math.sin(2 * math.pi * freq * t)
        sample = int(val * env * volume * 32767)
        samples.append(sample)
    return samples

def main():
    sr = 22050
    vo_files = [f"temp_audio/torquelock_vo_{i}.wav" for i in range(1, 8)]
    vo_data = []
    for f in vo_files:
        info = get_wav_info(f)
        vo_data.append(info)

    scenes = [
        {"id": 1, "name": "Intro & Memory Palace", "vo_idx": 0, "pad_before": 0.5, "pad_after": 1.0},
        {"id": 2, "name": "Skill Pack & Research", "vo_idx": 1, "pad_before": 0.0, "pad_after": 1.0},
        {"id": 3, "name": "Learn Mode (Star Loci)", "vo_idx": 2, "pad_before": 0.0, "pad_after": 1.2},
        {"id": 4, "name": "Recall Mode (Active Retrieval)", "vo_idx": 3, "pad_before": 0.0, "pad_after": 1.2},
        {"id": 5, "name": "Practise Mode & Warp Alert", "vo_idx": 4, "pad_before": 0.0, "pad_after": 1.2},
        {"id": 6, "name": "Summary & Spaced Repetition", "vo_idx": 5, "pad_before": 0.0, "pad_after": 1.0},
        {"id": 7, "name": "LEAF Verification & Closing", "vo_idx": 6, "pad_before": 0.0, "pad_after": 2.0},
    ]

    current_time = 0.0
    timeline = []
    for s in scenes:
        current_time += s["pad_before"]
        vo_start = current_time
        vo_dur = vo_data[s["vo_idx"]]["duration"]
        vo_end = vo_start + vo_dur
        current_time = vo_end + s["pad_after"]
        timeline.append({
            "id": s["id"],
            "name": s["name"],
            "start": vo_start - s["pad_before"],
            "vo_start": vo_start,
            "vo_end": vo_end,
            "end": current_time,
            "vo_idx": s["vo_idx"]
        })

    total_duration = current_time
    total_samples = int(total_duration * sr)

    master_buffer = [0] * total_samples

    # Place VO audio
    for t in timeline:
        idx = t["vo_idx"]
        vo_samples = vo_data[idx]["samples"]
        start_idx = int(t["vo_start"] * sr)
        for i, sample in enumerate(vo_samples):
            if start_idx + i < total_samples:
                master_buffer[start_idx + i] += sample

    # Overlay Sound Effects
    # Scene 3: Learn mode loci chimes (as the 6 bolts are highlighted: 1, 4, 2, 5, 3, 6)
    sc3_start = timeline[2]["vo_start"]
    bolt_chimes_offsets = [2.5, 5.5, 8.5, 11.5, 14.2, 16.8]
    for offset in bolt_chimes_offsets:
        chime = synth_tone(880.0, 0.40, sr, volume=0.18, tone_type="harmonic_chime")
        pos = int((sc3_start + offset) * sr)
        for i, s in enumerate(chime):
            if pos + i < total_samples:
                master_buffer[pos + i] += s

    # Scene 4: Recall mode pinch clicks and validation chimes
    sc4_start = timeline[3]["vo_start"]
    pinch_click = synth_tone(1500.0, 0.08, sr, volume=0.25, tone_type="click")
    pos_pinch = int((sc4_start + 8.5) * sr)
    for i, s in enumerate(pinch_click):
        if pos_pinch + i < total_samples:
            master_buffer[pos_pinch + i] += s
    
    confirm_chime = synth_tone(1046.5, 0.55, sr, volume=0.22, tone_type="harmonic_chime")
    pos_confirm = int((sc4_start + 8.7) * sr)
    for i, s in enumerate(confirm_chime):
        if pos_confirm + i < total_samples:
            master_buffer[pos_confirm + i] += s

    # Scene 5: Practise mode
    sc5_start = timeline[4]["vo_start"]
    for r_i in range(5):
        r_click = synth_tone(1200.0, 0.05, sr, volume=0.12, tone_type="click")
        pos_r = int((sc5_start + 6.5 + r_i * 0.18) * sr)
        for i, s in enumerate(r_click):
            if pos_r + i < total_samples:
                master_buffer[pos_r + i] += s

    torque_ok = synth_tone(1046.5, 0.5, sr, volume=0.22, tone_type="harmonic_chime")
    pos_tok = int((sc5_start + 7.6) * sr)
    for i, s in enumerate(torque_ok):
        if pos_tok + i < total_samples:
            master_buffer[pos_tok + i] += s

    # Gasket Warp Alarm buzzer at +17.0s
    warp_buzz = synth_tone(440.0, 0.65, sr, volume=0.28, tone_type="buzzer")
    pos_warp = int((sc5_start + 17.0) * sr)
    for i, s in enumerate(warp_buzz):
        if pos_warp + i < total_samples:
            master_buffer[pos_warp + i] += s

    # Scene 6: Summary mode Leitner fanfare
    sc6_start = timeline[5]["vo_start"]
    fanfare = synth_tone(523.25, 1.1, sr, volume=0.24, tone_type="fanfare")
    pos_fanfare = int((sc6_start + 1.2) * sr)
    for i, s in enumerate(fanfare):
        if pos_fanfare + i < total_samples:
            master_buffer[pos_fanfare + i] += s

    # Clamp buffer to 16-bit range
    clamped = [max(-32768, min(32767, int(s))) for s in master_buffer]

    out_file = "temp_audio/torquelock_soundtrack.wav"
    with wave.open(out_file, 'wb') as out_w:
        out_w.setnchannels(1)
        out_w.setsampwidth(2)
        out_w.setframerate(sr)
        pack_fmt = f"<{len(clamped)}h"
        out_w.writeframes(struct.pack(pack_fmt, *clamped))

    print(f"Soundtrack written: {out_file} ({len(clamped)/sr:.2f}s)")

    meta = {
        "sample_rate": sr,
        "total_duration": total_duration,
        "timeline": timeline
    }
    with open("temp_audio/torquelock_timeline.json", "w") as jf:
        json.dump(meta, jf, indent=2)
    print("Timeline written: temp_audio/torquelock_timeline.json")

if __name__ == "__main__":
    main()
