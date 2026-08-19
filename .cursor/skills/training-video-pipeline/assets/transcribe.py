#!/usr/bin/env python3
"""Transcribe voiceover MP3s with word-level timestamps using mlx-whisper (Apple Silicon).

Usage:
    python3 transcribe.py /path/to/1.mp3 /path/to/2.mp3 ...
Writes {basename}.json into ./transcripts/ in the format align.py expects.

Requirements:
    pip3 install mlx-whisper
    ffmpeg on PATH (on ARM Macs where system ffmpeg is x86, use the
    ffmpeg-static npm package binary: export PATH="$PWD/node_modules/ffmpeg-static:$PATH"
    or symlink it into a dir on PATH).
"""
import json
import os
import sys
import time

import mlx_whisper

os.makedirs("transcripts", exist_ok=True)

for path in sys.argv[1:]:
    name = os.path.splitext(os.path.basename(path))[0]
    t0 = time.time()
    r = mlx_whisper.transcribe(
        path,
        path_or_hf_repo="mlx-community/whisper-large-v3-turbo",
        word_timestamps=True,
        language="en",
    )
    out = {"segments": [
        {"start": s["start"], "end": s["end"], "text": s["text"],
         "words": [{"w": w["word"], "s": w["start"], "e": w["end"]} for w in s.get("words", [])]}
        for s in r["segments"]]}
    with open(f"transcripts/{name}.json", "w") as f:
        json.dump(out, f)
    print(f"{name} done in {time.time()-t0:.0f}s, {len(out['segments'])} segments")
