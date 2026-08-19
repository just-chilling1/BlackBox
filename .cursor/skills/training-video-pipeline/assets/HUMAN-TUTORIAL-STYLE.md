# Human Tutorial Voice — Style Guide

How to write voiceover scripts that sound like a real person giving a tutorial, not a document being read aloud. Based on e-learning narration research (writing-for-the-ear, Clark & Mayer personalization principle) and the ElevenLabs v3 prompting guide.

## The core shift: write for the ear, not the eye

A listener cannot re-read a sentence. Every rule below exists because of that one fact.

| Written for the eye | Written for the ear |
|---|---|
| Complex sentences, embedded clauses | Short sentences. Subject-verb-object. |
| Formal, precise vocabulary | Conversational, plain words |
| Headers and bullets do the structure | Spoken signposts do the structure ("Okay, next up...") |
| Passive voice | Active voice, "you" and "I" |
| "15%" / "$1,500" | "fifteen percent" / "fifteen hundred dollars" |

## Sentence rules

1. **Under ~20 words per sentence.** If a sentence needs a comma just to survive, cut it in two.
2. **One instruction per sentence** during walkthroughs. Never chain three UI actions into one breath.
3. **Vary rhythm deliberately.** Some sentences introduce. Some explain. Some are three words long. The short ones are where the listener catches up.
4. **More contractions than looks right on the page.** "You will" → "you'll", "it is" → "it's", "going to" → "gonna". Real speech is contraction-dense; written drafts always under-use them.
5. **Numbers as speech.** "fifteen hundred words", "about half", "three sales a day". Money can stay as digits only if short ("$50"); spell out anything a narrator would phrase ("one thousand — even five thousand dollars a day").

## Tutor moves (what real instructors do that documents don't)

Use these constantly in tool-walkthrough videos:

- **Direct + confirm:** "Go ahead and click Power Write. ... You should see three steps across the top."
- **Anticipate confusion:** "If it says 'Analyzing link' for a second — that's normal. That's the software reading your product page."
- **Reassure at friction points:** "Don't worry about getting this perfect. You can change it later."
- **Micro-recap before moving on:** "So that's step one: name the link, paste it, save it. Now — step two."
- **Check-in phrases:** "Still with me?", "See it?", "That's it. That's the whole step."
- **Think out loud during demos:** "I'm gonna pick Conversational here... because food is personal."
- **Hook first, detail second:** say what the action is, then why it matters, then the nuance — in that order.

## Tone calibration

- Sound like **a person helping you understand something**, not a hype reel and not a manual.
- **Aphorism budget: max 1–2 clever one-liners per video.** "Perfect is the enemy of posted" lands once. Five punchlines per script sounds written, not spoken.
- Persuasion beats (video 1 and 2) can be emotional, but every line must pass the say-it-aloud test: would a person actually say this to someone sitting next to them?
- **Read-aloud test:** if a narrator would stumble, run out of breath, or sound like they're performing — rewrite it.

## ElevenLabs v3 mechanics

1. **Punctuation before tags.** An ellipsis (...) or a period does pausing work more reliably than a [pause] tag. Dashes for mid-thought asides. Reserve [short pause] / [long pause] for genuinely dramatic beats.
2. **Tags mark emotional SHIFTS, not decoration.** Place the tag directly before the text it affects. A handful of well-placed tags per script beats one on every paragraph.
3. **Approved palette:** [calm] [warmly] [thoughtful] [curious] [confident] [serious] [excited] [quietly] [whisper] [whispering] [annoyed] [chuckles] [sighs] [short pause] [long pause]
4. **CAPS for single-word emphasis** ("YEARS.", "ALREADY out there") — sparingly.
5. **Ellipses for trailing thoughts and hesitation** — v3 reads them well.
6. Generation settings: stability ~0.3–0.5 so tags actually fire; generate paragraph-by-paragraph (one beat per generation).

## Banned meta patterns (hard fails)

These sound like the writer talking to themselves, not a tutor talking to a member:

1. **Banner meta-commentary.** Never say "one mention per video, so here it is", "once per video…", "this is the only time I'll bring this up", or similar. If a free-training banner appears during a load, just notice it naturally: "Oh — and that banner under the progress bar? That's the free training where we show you how to scale this to one thousand… even five thousand dollars a day. It's coming down soon. Click it and lock your spot while this finishes." Same pitch. Zero production notes.
2. **Loop restatement.** Never do "Station one of the loop / Remember the model / Where this sits in the money flow…" and then later "let me run the full loop once" that retells image → link → pin → commission (or that product's whole Disconnect map). Pick one:
   - a single short orientation breath up front ("This is where the pictures come from"), **or**
   - a concrete mini-scenario that *uses* the feature — not both as full loop narrations.
   Disconnect (video 2) is the only script allowed to walk one named character through the entire end-to-end money loop.

## File format

- Pure spoken script only. No metadata, no beat headers, no screen cues, no notes.
- One paragraph per beat, blank line between paragraphs.
- File starts directly on the first audio tag or spoken word.
