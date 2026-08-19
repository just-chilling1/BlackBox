#!/usr/bin/env python3
"""Align slide anchors to voiceover word timestamps and emit Remotion data files."""
import json
import re
import sys
from difflib import SequenceMatcher

# Set to this software's video working dir, e.g. "/path/to/{software-slug}-videos"
BASE = "./videos-workspace"


def norm(t):
    out = []
    for w in t.lower().split():
        w = re.sub(r"[^a-z0-9]+", "", w)
        if w:
            out.append(w)
    return out


def load_words(path):
    d = json.load(open(path))
    words = []
    for s in d["segments"]:
        for w in s["words"]:
            token = re.sub(r"[^a-z0-9]+", "", w["w"].lower())
            if token:
                words.append({"t": token, "raw": w["w"].strip(), "s": w["s"], "e": w["e"]})
    return words


def find_anchor(words, anchor, start_idx):
    """Fuzzy-find anchor token sequence in words, at/after start_idx. Returns (idx, score)."""
    atoks = norm(anchor)
    n = len(atoks)
    best, best_i = 0.0, None
    hi = len(words) - n
    for i in range(start_idx, hi):
        window = [words[j]["t"] for j in range(i, i + n)]
        r = SequenceMatcher(None, atoks, window).ratio()
        if r > best:
            best, best_i = r, i
            if r > 0.97:
                break
    return best_i, best


def captions(words, max_chars=46):
    """Group words into caption chunks."""
    chunks, cur, cur_s = [], [], None
    for w in words:
        if cur_s is None:
            cur_s = w["s"]
        cur.append(w)
        text = " ".join(x["raw"] for x in cur)
        endp = re.search(r"[.!?…]$", w["raw"])
        if len(text) >= max_chars or endp:
            chunks.append({"s": round(cur_s, 2), "e": round(w["e"], 2), "text": text})
            cur, cur_s = [], None
    if cur:
        chunks.append({"s": round(cur_s, 2), "e": round(cur[-1]["e"], 2), "text": " ".join(x["raw"] for x in cur)})
    return chunks


def build(video, slides, out_path):
    words = load_words(f"{BASE}/transcripts/{video}.json")
    dur = max(w["e"] for w in words)
    resolved = []
    idx = 0
    misses = []
    for sl in slides:
        if sl.get("anchor") is None:
            t = sl.get("at", 0.0)
        else:
            i, score = find_anchor(words, sl["anchor"], idx)
            if i is None or score < 0.55:
                misses.append((sl["anchor"], score))
                continue
            t = words[i]["s"]
            idx = i
        item = {k: v for k, v in sl.items() if k not in ("anchor", "at")}
        item["start"] = round(t, 2)
        resolved.append(item)
    for a, b in zip(resolved, resolved[1:]):
        a["end"] = b["start"]
    resolved[-1]["end"] = round(dur, 2)
    data = {"durationSec": round(dur + 0.5, 2), "slides": resolved, "captions": captions(words)}
    json.dump(data, open(out_path, "w"), indent=1)
    print(f"video {video}: {len(resolved)} slides, dur {dur:.1f}s -> {out_path}")
    for m, s in misses:
        print(f"  MISS ({s if s else 0:.2f}): {m[:70]}")


# ---------------------------------------------------------------- VIDEO 1
V1 = [
    {"anchor": None, "at": 0.0, "type": "intro", "num": "1", "title": ["WATCH", "THIS FIRST"], "sub": "Before you touch anything"},
    {"anchor": "a little voice is going to show up in your head", "type": "quote", "text": "\u201cDid I really just spend money on that?\u201d", "label": "TONIGHT, A LITTLE VOICE"},
    {"anchor": "so before you click a single button before you open a single tool", "type": "shot", "img": "dashboard.png", "caption": "Give me ten minutes. Just ten."},
    {"anchor": "but first and I really mean this congratulations", "type": "title", "kicker": "FIRST THINGS FIRST", "headline": "Congratulations.", "sub": "Not for buying software — for what buying it says about you."},
    {"anchor": "most people watch videos about making money online for years", "type": "title", "kicker": "THE DIVIDING LINE", "headline": "Most people watch.\nYou decided.", "sub": "A decision, backed with your own money."},
    {"anchor": "It's not talent it's not luck it's decisions", "type": "title", "kicker": "", "headline": "Not talent.\nNot luck.\nDECISIONS.", "sub": ""},
    {"anchor": "now let's talk about that voice because I know its script by heart", "type": "title", "kicker": "NAME THE ENEMY", "headline": "The Remorse Voice", "sub": "It has a script. I know it by heart."},
    {"anchor": "you've bought things like this before and they're still sitting", "type": "quote", "text": "\u201cYou've bought things like this before\u2026\u201d", "label": "THE VOICE SAYS"},
    {"anchor": "everybody online is running some kind of scam", "type": "quote", "text": "\u201cEverybody online is running some kind of scam\u2026\u201d", "label": "THE VOICE SAYS"},
    {"anchor": "isn't nothing you know you can't really afford", "type": "quote", "text": "\u201cYou can't really afford to be experimenting\u2026\u201d", "label": "THE VOICE SAYS"},
    {"anchor": "you're not the kind of person this actually works for", "type": "quote", "text": "\u201cYou're not the kind of person this works for.\u201d", "label": "ITS FAVORITE ONE \u2014 2 AM"},
    {"anchor": "every single successful member of ProfitLoop heard that exact same voice", "type": "title", "kicker": "HERE'S THE TRUTH", "headline": "Every successful member\nheard that voice.", "sub": "Every. Single. One. It's just noise. It's weather."},
    {"anchor": "psychologists have been studying this since the fifties", "type": "title", "kicker": "SINCE THE 1950s", "headline": "Post-Purchase\nDissonance", "sub": "Your brain felt the money leave — it can't see the result yet."},
    {"anchor": "it's not the feeling of a mistake it's the feeling of a commitment", "type": "title", "kicker": "SO THAT FEELING?", "headline": "Not a mistake.\nA commitment.", "sub": "Nobody gets buyer's remorse over a sandwich."},
    {"anchor": "you didn't buy software you bought a different kind of Tuesday", "type": "title", "kicker": "WHAT YOU ACTUALLY BOUGHT", "headline": "A different kind\nof Tuesday.", "sub": "Picture it — a few weeks from now."},
    {"anchor": "you open ProfitLoop your daily allowance is refreshed and waiting", "type": "shot", "img": "dashboard.png", "caption": "Your daily allowance — refreshed and waiting."},
    {"anchor": "you pick a batch of real local businesses", "type": "shot", "img": "leads.png", "caption": "A dentist in Austin. A roofer in Tampa. A gym in Phoenix."},
    {"anchor": "some say yes tell me more and every one of those is money in motion", "type": "quote", "text": "\u201cYes \u2014 tell me more.\u201d", "label": "MONEY IN MOTION"},
    {"anchor": "and here's why picking this was smart in plain terms", "type": "title", "kicker": "WHY THIS WAS SMART", "headline": "The demand side\nis real.", "sub": "Restaurants · Realtors · Plumbers · Clinics — they pay for customers."},
    {"anchor": "the hard part is the boring repetitive grind standing in front of it", "type": "title", "kicker": "THE REAL OBSTACLE", "headline": "The grind is where\nbeginners quit.", "sub": "Finding businesses one by one. Writing every pitch from scratch."},
    {"anchor": "the software finds the businesses the AI writes the emails", "type": "shot", "img": "email-builder.png", "caption": "The software finds. The AI writes."},
    {"anchor": "you didn't buy a lottery ticket today", "type": "title", "kicker": "", "headline": "Not a lottery ticket.", "sub": "You bought back the hours standing between you and money."},
    {"anchor": "let me tell you how I know this works before ProfitLoop was ever a product", "type": "title", "kicker": "HOW I KNOW", "headline": "Before it was a product,\nit was my workflow.", "sub": "Hours every day. By hand. Getting ignored."},
    {"anchor": "not my skill my volume and my consistency same me ten times the output", "type": "title", "kicker": "WHAT CHANGED", "headline": "Same me.\n10\u00d7 the output.", "sub": "That exact system — cleaned up and put behind buttons."},
    {"anchor": "sometime this week you'll mention this to someone", "type": "quote", "text": "\u201cYou bought WHAT?\u201d", "label": "THE LOOK — IT'S COMING"},
    {"anchor": "they're not judging ProfitLoop they can't be they've never seen it", "type": "title", "kicker": "REMEMBER THIS", "headline": "That's love,\nexpressed badly.", "sub": "Skeptics aren't convinced by debates. They're convinced by results."},
    {"anchor": "give me a month I'll show you instead of telling you", "type": "quote", "text": "\u201cGive me a month \u2014 I'll show you\ninstead of telling you.\u201d", "label": "JUST SAY THIS"},
    {"anchor": "now the part most sellers skip which is exactly why I won't", "type": "title", "kicker": "THE HONEST PART", "headline": "This works.\nAnd it's still work.", "sub": "The software removes the grind — not the showing up."},
    {"anchor": "if anyone ever promises you money with zero effort close the tab", "type": "title", "kicker": "STRAIGHT TALK", "headline": "\u201cZero effort\u201d\nis a lie.", "sub": "Every hour you put in moves you forward. That's the honest trade."},
    {"anchor": "before this video ends I'm going to ask you to do exactly one thing", "type": "title", "kicker": "YOUR ONE ACTION", "headline": "Not ten things.\nOne.", "sub": ""},
    {"anchor": "see that banner the one that says free training", "type": "banner", "headline": "FREE TRAINING", "sub": "How members scale to $1,000 \u2013 $5,000 per day", "note": "Right below this video"},
    {"anchor": "so here's your one action click that banner register for the free training", "type": "banner", "headline": "CLICK THE BANNER \u2192 REGISTER", "sub": "Takes about 30 seconds. Do it now.", "note": "Buyers hesitate. Doers click."},
    {"anchor": "alright here's your map from here so you're never lost", "type": "steps", "kicker": "YOUR MAP", "items": ["This video", "How the money flows", "The quick tour", "Training Academy"], "sub": "Video \u2192 video \u2192 tour \u2192 training. That's the whole path."},
    {"anchor": "and yes you're covered by the money back guarantee", "type": "title", "kicker": "PRESSURE'S OFF", "headline": "You're covered.", "sub": "Money-back guarantee, exactly as promised. Now\u2026 we build."},
    {"anchor": "that next video the one that plays after this", "type": "title", "kicker": "UP NEXT", "headline": "How the money\nactually flows.", "sub": "The difference between members who make this work — and members who stay confused."},
    {"anchor": "click the banner register for the free training and I'll see you in the next video", "type": "end", "headline": "Click the Free Training banner below", "sub": "See you in the next video."},
]

# ---------------------------------------------------------------- VIDEO 2
V2 = [
    {"anchor": None, "at": 0.0, "type": "intro", "num": "2", "title": ["HOW THE", "MONEY FLOWS"], "sub": "Where it comes from \u00b7 how you get paid"},
    {"anchor": "I want to hand you something the training just assumes you already have the map", "type": "title", "kicker": "BEFORE YOU TOUCH A TOOL", "headline": "The Map.", "sub": "How money moves through this system — assuming you know nothing."},
    {"anchor": "people who watch this video see the training afterward and go ah obviously", "type": "title", "kicker": "TEN MINUTES NOW", "headline": "\u201cAh — obviously.\u201d\nvs \u201cWait — what?\u201d", "sub": "Ten minutes now saves ten hours of confusion later."},
    {"anchor": "so here's the entire business in one sentence ready", "type": "title", "kicker": "THE WHOLE BUSINESS", "headline": "One sentence.", "sub": ""},
    {"anchor": "small businesses everywhere desperately need more customers", "type": "title", "kicker": "", "headline": "Businesses need customers.\nThey pay whoever\nbrings them.", "sub": "That's it. That's the machine."},
    {"anchor": "imagine every small business in your city has a door", "type": "title", "kicker": "THE MASTER ANALOGY", "headline": "Every business\nis a door.", "sub": "Behind each one: an owner awake at night — \u201cI need more customers.\u201d"},
    {"anchor": "slip a friendly personal note under a hundred of those doors", "type": "quote", "text": "\u201cHey. I can help you with that.\nHere's how.\u201d", "label": "THE NOTE UNDER THE DOOR"},
    {"anchor": "some doors ignore the note sure some doors open and every door that opens is money", "type": "title", "kicker": "", "headline": "Every door that opens\n= money.", "sub": "Everything else is details — the doors, the notes, getting read."},
    {"anchor": "every beginner has three questions they never say out loud", "type": "steps", "kicker": "THE 3 SILENT QUESTIONS", "items": ["Who pays?", "Why pay a stranger?", "Why would they pick ME?"], "sub": ""},
    {"anchor": "question one who pays small business owners", "type": "title", "kicker": "1 \u2014 WHO PAYS?", "headline": "The dentist. The roofer.\nThe realtor.", "sub": "Great at their craft. Underwater on everything else."},
    {"anchor": "question two why would they pay a stranger", "type": "title", "kicker": "2 \u2014 WHY A STRANGER?", "headline": "Urgent problem.\nScarce help.", "sub": "Businesses buy help by email every single day."},
    {"anchor": "and question three why you this is the beautiful part", "type": "title", "kicker": "3 \u2014 WHY YOU?", "headline": "Almost nobody\ndoes this properly.", "sub": "\u201cDear sir, greetings of the day\u201d \u2192 Delete."},
    {"anchor": "a personal specific well-written email to the right business", "type": "title", "kicker": "YOUR EDGE", "headline": "A handwritten letter\nin a stack of junk mail.", "sub": "And you're about to have a machine that produces exactly those."},
    {"anchor": "here's the part nobody tells beginners the work itself was never the hard part", "type": "title", "kicker": "NOBODY TELLS BEGINNERS", "headline": "The work was never\nthe hard part.", "sub": "The hard part is everything BEFORE the work."},
    {"anchor": "week one they're excited week two they're tired week three they're gone", "type": "steps", "kicker": "DONE BY HAND", "items": ["Week 1 — excited", "Week 2 — tired", "Week 3 — gone"], "sub": "2–3 hours a day of unpaid labor. It's where most people quit."},
    {"anchor": "the software finds the businesses for you real ones with real emails", "type": "shot", "img": "leads.png", "caption": "Real businesses, real emails — up to 25 searches a day."},
    {"anchor": "and then the AI writes the note a personal professional email", "type": "shot", "img": "email-builder.png", "caption": "Subject line, message, even the follow-up. Copy \u2192 paste \u2192 send."},
    {"anchor": "you'll see a banner on your screen about a free training", "type": "banner", "headline": "FREE TRAINING", "sub": "Scale this machine to $1,000 \u2013 $5,000 per day", "note": "When you see it — click it. Register. You'll hear this once."},
    {"anchor": "you bought a tireless assistant who does the part everyone quits over", "type": "title", "kicker": "WHAT YOU BOUGHT", "headline": "A tireless assistant\nfor the part\neveryone quits over.", "sub": "You only show up for the part that pays."},
    {"anchor": "next up let's learn the local language", "type": "title", "kicker": "JARGON SCHOOL", "headline": "10 words.\n30 seconds each.", "sub": "No jargon left behind."},
    {"anchor": "first one lead a lead is just a business you could email", "type": "term", "n": 1, "term": "Lead", "def": "A business you could email — name, address, location.", "analogy": "One door on the map of doors."},
    {"anchor": "next search one run of the customer finder", "type": "term", "n": 2, "term": "Search", "def": "One run of the customer finder. Industry + city + click.", "analogy": "One throw of the fishing net — 25 casts a day."},
    {"anchor": "next offer your offer is what you're actually pitching", "type": "term", "n": 3, "term": "Offer", "def": "What you're pitching — saved once in the Offer Library.", "analogy": "Your one great sales letter, written once, reused forever."},
    {"anchor": "next niche your niche is the one category you focus on", "type": "term", "n": 4, "term": "Niche", "def": "The one category you focus on — real estate, restaurants, fitness.", "analogy": "The one supermarket aisle you decide to OWN."},
    {"anchor": "next cold email also called outreach", "type": "term", "n": 5, "term": "Cold Email", "def": "Emailing a business that doesn't know you yet.", "analogy": "The note under the door — polite, personal, completely normal."},
    {"anchor": "next subject line that's the email's headline", "type": "term", "n": 6, "term": "Subject Line", "def": "The one line they see before they open.", "analogy": "The envelope — if it doesn't get opened, the letter doesn't exist."},
    {"anchor": "next follow-up the second shorter email you send a few days after", "type": "term", "n": 7, "term": "Follow-Up", "def": "The second, shorter email a few days later.", "analogy": "About HALF of all yeses come from the follow-up."},
    {"anchor": "next affiliate link a special tracking link for a product", "type": "term", "n": 8, "term": "Affiliate Link", "def": "A tracking link with your name baked in.", "analogy": "A coupon code that's yours alone."},
    {"anchor": "which brings us to commission your cut of the sale", "type": "term", "n": 9, "term": "Commission", "def": "Your cut of the sale — a finder's fee.", "analogy": "This is the actual money."},
    {"anchor": "and last one traffic source any website or community where your link can sit", "type": "term", "n": 10, "term": "Traffic Source", "def": "Anywhere your link can sit and get seen.", "analogy": "A noticeboard in a busy town square — Social Payouts has 102 of them."},
    {"anchor": "and that's the whole language ten words you now speak fluent", "type": "title", "kicker": "DONE", "headline": "You now speak\nfluent Profit Loop.", "sub": ""},
    {"anchor": "in one single loop meet Dana Monday morning", "type": "title", "kicker": "THE STORY PASS", "headline": "Meet Dana.", "sub": "Monday morning. Every word doing its job — in one loop."},
    {"anchor": "Dana opens the offer library and saves her offer template", "type": "shot", "img": "offers.png", "caption": "Offer template saved — affiliate link inside. Three minutes."},
    {"anchor": "then she opens find customers picks her niche real estate types in Dallas", "type": "shot", "img": "leads.png", "caption": "Niche: Real Estate. Location: Dallas, TX. One search."},
    {"anchor": "then she clicks generate email on the first lead", "type": "shot", "img": "email-builder.png", "caption": "The AI reads her offer, reads the lead, writes the email."},
    {"anchor": "Wednesday a reply lands this looks interesting how does it work", "type": "quote", "text": "\u201cThis looks interesting \u2014\nhow does it work?\u201d", "label": "WEDNESDAY — A REPLY"},
    {"anchor": "the commission lands in her account", "type": "title", "kicker": "", "headline": "One full loop.\nCommission in.", "sub": "And her links keep collecting clicks while she sleeps."},
    {"anchor": "let's kill the three doubts that might still be whispering", "type": "steps", "kicker": "THE 3 DOUBTS", "items": ["Does this actually work?", "Can I do it?", "Do my circumstances allow it?"], "sub": ""},
    {"anchor": "you've never met an owner who said we've got too many clients", "type": "title", "kicker": "DOES IT WORK?", "headline": "Profit Loop didn't invent\nthis game.", "sub": "It automated the losing part of it."},
    {"anchor": "pick from a dropdown type a city click a button copy paste send", "type": "title", "kicker": "CAN I DO IT?", "headline": "Dropdown. City. Click.\nCopy. Paste. Send.", "sub": "What's left is genuinely beginner-proof."},
    {"anchor": "the core loop takes about an hour a day from any laptop", "type": "title", "kicker": "MY CIRCUMSTANCES?", "headline": "~1 hour a day.\nAny laptop.", "sub": "No audience. No website. Zero ad spend."},
    {"anchor": "let's do some honest math on one small win", "type": "title", "kicker": "HONEST MATH", "headline": "$50 commission.\n10 emails a day.", "sub": "70 personalized emails a week — all written for you."},
    {"anchor": "and one yes one at fifty dollars that covers your entire cost", "type": "title", "kicker": "ONE YES", "headline": "1 yes = cost covered.\n2 yeses = profit.", "sub": "Small, understandable numbers that compound daily."},
    {"anchor": "now stack the streams on top recurring streams posts social payouts traffic", "type": "title", "kicker": "THEN STACK", "headline": "+ Recurring Streams\n+ Social Payouts", "sub": "That's how members build toward the big numbers."},
    {"anchor": "here's how to consume everything from here in order", "type": "steps", "kicker": "YOUR ORDER", "items": ["The quick tour", "Offer Library \u2192 create templates", "Find Customers \u2192 first batch", "Write Emails \u2192 first ten"], "sub": "Watch one video, DO the thing, then the next. That's the method."},
    {"anchor": "your very first action tonight open the offer library click new template", "type": "shot", "img": "offers.png", "caption": "Tonight: New Template \u2192 your first offer. Five minutes."},
    {"anchor": "you're not a buyer anymore you're an operator", "type": "title", "kicker": "THE MOMENT IT APPEARS", "headline": "You're not a buyer.\nYou're an operator.", "sub": "You understand this machine better than most one-year veterans."},
    {"anchor": "the doors are out there the notes write themselves now", "type": "end", "headline": "The doors are out there.", "sub": "Let's go slip the first note under one."},
]

build("1", V1, f"{BASE}/remotion/src/data/video1.json")
build("2", V2, f"{BASE}/remotion/src/data/video2.json")
