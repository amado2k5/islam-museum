#!/usr/bin/env python3
"""Generate the Viewpoints proof of concept: index.html (landing) + 9 viewpoint pages + hunt.html. Sample English text only."""
import html, os

OUT = os.path.dirname(os.path.abspath(__file__))
E = html.escape

ICON = {
    "new": '<path d="M12 21v-9M12 12c0-4 3-6 8-6 0 4-3 6-8 6zM12 15c0-3-2-5-7-5 0 3 2 5 7 5z"/>',
    "back": '<path d="M8 8H3V3M3 8a9 9 0 1 1-1 7"/>',
    "five": '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4M8 15h3M13 15h3"/>',
    "curious": '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    "doubt": '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>',
    "research": '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/>',
    "learn": '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19a2 2 0 0 1 2-2h13"/>',
    "challenge": '<path d="M12 4v16M6 20h12M5 8h14M5 8l-3 6a3 3 0 0 0 6 0zM19 8l-3 6a3 3 0 0 0 6 0z"/>',
    "pass": '<path d="M5 20V4h8v16M13 12h8M18 9l3 3-3 3"/>',
    "hunt": '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
}


def svg(k, size=22):
    return f'<svg class="gl" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICON[k]}</svg>'


# key, file, name, "I am", light accent, light tint, dark accent, dark tint
VP = [
    ("new", "new.html", "New to Islam", "I said the shahada recently", "#3B6D11", "#EAF3DE", "#97C459", "#27500A"),
    ("back", "back.html", "Returning to Islam", "I was born Muslim and I am coming back", "#0F6E56", "#E1F5EE", "#5DCAA5", "#085041"),
    ("five", "five.html", "Five years on", "I want depth, not a beginner list", "#993556", "#FBEAF0", "#ED93B1", "#72243E"),
    ("curious", "curious.html", "Curious", "I just want to know what this is", "#854F0B", "#FAEEDA", "#EF9F27", "#633806"),
    ("doubt", "doubt.html", "Doubting", "I have questions I cannot put away", "#993C1D", "#FAECE7", "#F0997B", "#712B13"),
    ("research", "research.html", "Researching", "I need sources, dates and method", "#185FA5", "#E6F1FB", "#85B7EB", "#0C447C"),
    ("learn", "learn.html", "Learning my faith", "I practise and want to know why", "#534AB7", "#EEEDFE", "#AFA9EC", "#3C3489"),
    ("challenge", "challenge.html", "Challenging", "I disagree and want to see the evidence", "#A32D2D", "#FCEBEB", "#F09595", "#791F1F"),
    ("pass", "pass.html", "Just passing through", "Give me three minutes", "#5F5E5A", "#F1EFE8", "#B4B2A9", "#444441"),
]
BY = {v[0]: v for v in VP}

BASE = """
:root{--ivory:#f9f8f6;--ink:#1a1a1a;--lapis:#0a2533;--teal:#113f4e;--gold:#c5a059;--sand:#e6d5b8;
--bg:#f9f8f6;--fg:#1a1a1a;--muted:#4a4a4a;--card:#ffffff;--line:rgba(10,37,51,.16);--panel:#f1ece1;--gold-text:#654a15;--link:#113f4e;
--vp:#3B6D11;--vpt:#EAF3DE;--vpd:#c5a059;--vptd:#113f4e;--on:#ffffff;
--serif:"Source Serif 4",Georgia,"Times New Roman",serif;--sans:Inter,system-ui,-apple-system,"Segoe UI",sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0a2533;--fg:#f9f8f6;--muted:#c9d3d6;--card:#113f4e;--line:rgba(249,248,246,.18);--panel:#0e3342;--gold-text:#c5a059;--link:#9fd3d9;--vp:var(--vpd);--vpt:var(--vptd);--on:#0a2533;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#0a2533;--fg:#f9f8f6;--muted:#c9d3d6;--card:#113f4e;--line:rgba(249,248,246,.18);--panel:#0e3342;--gold-text:#c5a059;--link:#9fd3d9;--vp:var(--vpd);--vpt:var(--vptd);--on:#0a2533;color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font-family:var(--serif);font-size:1.0625rem;line-height:1.65}
.wrap{max-width:60rem;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
a{color:var(--link)}h1,h2,h3{text-wrap:balance;line-height:1.2;margin:0}
.ui{font-family:var(--sans)}
.gl{flex:none}
.top{background:var(--lapis);color:#f9f8f6;font-family:var(--sans);font-size:.9rem}
.top .wrap{display:flex;align-items:center;gap:16px;padding-block:10px;flex-wrap:wrap}
.top b{font-family:var(--serif);font-size:1.15rem;font-weight:600;letter-spacing:.01em}
.top a{color:#e6d5b8;text-decoration:none}.top a:hover{text-decoration:underline}
.vbar{margin-inline-start:auto;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.vbar .chip{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;background:var(--vp);color:var(--on);font-weight:500}
.hero{background:linear-gradient(160deg,#0a2533 0%,#113f4e 100%);color:#f9f8f6;border-bottom:4px solid var(--vp)}
.hero .wrap{padding-block:44px 40px}
.eyebrow{font-family:var(--sans);font-size:.8rem;letter-spacing:.14em;text-transform:uppercase;color:#e6d5b8;margin:0 0 10px}
.hero h1{font-size:clamp(1.9rem,4.4vw,2.9rem);font-weight:600;max-width:24ch}
.hero p.lede{font-size:1.15rem;max-width:44ch;margin:14px 0 22px;color:#e6edf0}
.btn{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 18px;border-radius:999px;font-family:var(--sans);font-weight:500;font-size:.95rem;text-decoration:none;border:1.5px solid transparent;transition:transform .2s,background .2s}
.btn.main{background:var(--vp);color:var(--on)}.btn.main:hover{transform:translateY(-2px)}
.btn.ghost{border-color:#e6d5b8;color:#f9f8f6}.btn.ghost:hover{background:rgba(249,248,246,.1)}
:focus-visible{outline:3px solid var(--gold);outline-offset:3px}
section.blk{padding-block:34px}
.blk h2{font-size:1.5rem;margin-bottom:6px}
.blk .sub{font-family:var(--sans);font-size:.92rem;color:var(--muted);margin:0 0 16px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(15rem,1fr));gap:12px}
.card{background:var(--card);border:1px solid var(--line);border-radius:6px;padding:16px 18px;min-width:0}
.card h3{font-size:1.05rem;margin-bottom:4px}.card p{margin:0;font-size:.97rem;color:var(--muted)}
.thought{font-style:italic;font-size:1.05rem;border-inline-start:4px solid var(--vp);background:var(--vpt);color:var(--fg);padding:12px 16px;border-radius:0}
.steps{list-style:none;margin:0;padding:0;counter-reset:s;display:grid;gap:10px}
.steps li{counter-increment:s;display:grid;grid-template-columns:2.4rem 1fr auto;gap:12px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:6px;padding:12px 16px;min-width:0}
.steps li::before{content:counter(s);width:2.1rem;height:2.1rem;border-radius:50%;background:var(--vp);color:var(--on);display:grid;place-items:center;font-family:var(--sans);font-weight:600;font-size:.9rem}
.steps a{font-weight:600;text-decoration:none;color:var(--fg)}.steps a:hover{text-decoration:underline}
.steps small{display:block;font-family:var(--sans);color:var(--muted);font-size:.85rem}
.steps .min{font-family:var(--sans);font-size:.82rem;color:var(--muted);white-space:nowrap}
.tl{list-style:none;margin:0;padding:0;border-inline-start:3px solid var(--vp);display:grid;gap:14px}
.tl li{padding-inline-start:18px;position:relative}.tl li::before{content:"";position:absolute;inset-inline-start:-9px;top:.5em;width:15px;height:15px;border-radius:50%;background:var(--bg);border:3px solid var(--vp)}
.tl b{font-family:var(--sans);font-size:.85rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vp);display:block}
.voices{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.voice{background:var(--card);border:1px solid var(--line);padding:12px 14px;border-radius:6px;font-size:.95rem}
.voice small{display:block;font-family:var(--sans);font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vp);margin-bottom:4px}
.q{margin:0 0 8px;font-weight:600}
.poc{font-family:var(--sans);font-size:.82rem;color:var(--muted);border-top:1px solid var(--line);padding-block:18px}
.tag{display:inline-block;font-family:var(--sans);font-size:.78rem;padding:2px 10px;border-radius:999px;background:var(--vpt);color:var(--fg);margin:0 6px 6px 0;border:1px solid var(--line)}
@media (max-width:620px){.voices{grid-template-columns:1fr}.steps li{grid-template-columns:2.4rem 1fr}.steps .min{grid-column:2}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
"""


def head(title, accent=None):
    v = BY.get(accent)
    style = ":root{--vp:#c5a059;--vpt:#f1ece1;--vpd:#c5a059;--vptd:#113f4e;--on:#0a2533}"
    if v:
        style = f":root{{--vp:{v[4]};--vpt:{v[5]};--vpd:{v[6]};--vptd:{v[7]}}}"
    return f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>{E(title)}</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap"><style>{BASE}{style}</style></head><body>'


def topbar(key=None):
    bar = ""
    if key:
        v = BY[key]
        bar = f'<div class="vbar"><span class="chip">{svg(key, 15)} Viewpoint: {E(v[2])}</span><a href="index.html">switch</a><a href="index.html">reset</a></div>'
    return f'<div class="top"><div class="wrap"><b>islam.museum</b><a href="index.html">Home</a><a href="#">Halls</a><a href="hunt.html">Treasure hunt</a>{bar}</div></div>'


FOOT = '<div class="wrap"><p class="poc">Proof of concept. Sample text in English only; the real pages will be written in all five languages and checked against the museum\'s sources. Links to halls are placeholders.</p></div></body></html>'

HALL = {"arkan": "The five pillars", "ibadat": "Worship", "dua": "Supplication", "usra": "Family", "ukhuwwa": "Brotherhood", "akhlaq": "Character", "halal": "Halal and haram",
        "places": "Places", "ulama": "Scholars", "quran": "The Qur'an", "tafsir": "Tafsir", "seerah": "The sira", "messengers": "The messengers", "umam": "Earlier nations",
        "munazarat": "Debates", "questions": "Questions", "method": "Method", "authenticity": "Authenticity", "cite": "Cite a record", "search": "Search", "graph": "The graph",
        "timeline": "Timeline", "madhahib": "Schools of law", "learn": "Courses and trails", "wander": "Wander", "signs": "Signs", "miracles": "Miracles", "cosmos": "The cosmos",
        "companions": "Companions", "ahkam": "Rulings", "converts": "People who came to Islam", "story": "Story of the day", "islam30": "Islam in 30 minutes", "developers": "Open data"}


def steps(items):
    return '<ol class="steps">' + "".join(f'<li><div><a href="#">{E(HALL.get(h, h))}</a><small>{E(t)}</small></div><span class="min">{m} min</span></li>' for h, t, m in items) + "</ol>"


def cards(items):
    return '<div class="grid">' + "".join(f'<div class="card"><h3>{E(a)}</h3><p>{E(b)}</p></div>' for a, b in items) + "</div>"


def timeline(items):
    return '<ul class="tl">' + "".join(f"<li><b>{E(a)}</b>{E(b)}</li>" for a, b in items) + "</ul>"


def voices(items):
    return "".join(f'<div class="card" style="margin-bottom:12px"><p class="q">{E(q)}</p><div class="voices"><div class="voice"><small>{E(l1)}</small>{E(a1)}</div><div class="voice"><small>{E(l2)}</small>{E(a2)}</div></div></div>' for q, l1, a1, l2, a2 in items)


P = {
    "new": dict(h="Welcome. You do not need to know anything yet.", thoughts=["Am I doing this right?", "Do I have to change everything at once?", "How do I tell my family?", "Where do I even start?"],
        steps=[("arkan", "What the five pillars are, in plain words.", 10), ("ibadat", "The first prayers, one step at a time.", 15), ("usra", "Relatives, spouses and what scholars say about family ties.", 8), ("converts", "Stories of people who came to Islam, and what they found hard.", 30), ("learn", "The first Ramadan and how people describe it.", 10), ("questions", "Questions that tend to come in the second year.", 10)],
        vt="From the first week to the second year", sub="What converts commonly describe, in the order they tend to meet it.",
        v=timeline([("Week one", "Saying the shahada, and the first prayers that feel awkward."), ("Month one", "Telling people. Some are glad, some are hurt, some say nothing."), ("Month three", "Food, drink and daily life questions pile up."), ("The first Ramadan", "Often the moment it becomes real."), ("The first year", "Doubt and loneliness are common; so is a sudden calm."), ("The second year", "Looking for knowledge, and for friends who are not new either.")])),
    "back": dict(h="Welcome back. No one is keeping score here.", thoughts=["I forgot how to pray.", "I am ashamed of the years away.", "Everything feels unfamiliar and familiar at once.", "Will people judge me?"],
        steps=[("ibadat", "Prayer again, starting small and clear.", 12), ("dua", "Words to say when you do not know what to say.", 8), ("arkan", "A fresh look at the pillars as an adult.", 10), ("ulama", "Teachers and their ways of explaining mercy and return.", 15), ("places", "Mosques and places of study near the traditions you grew up with.", 10)],
        vt="Three things people say when they return", sub="From memoirs and interviews; sample text.",
        v=cards([("Start where you are", "Many describe beginning with one prayer a day, not five."), ("What did not change", "The words are the same ones you heard as a child."), ("Finding people again", "A community is often one person who says your name.")])),
    "five": dict(h="You know the basics. Here is the long road.", thoughts=["I am tired and I do not want to quit.", "I am asked to speak for all Muslims.", "My children are growing up between two worlds.", "I want to study properly."],
        steps=[("madhahib", "How the schools of law reason, and why they differ.", 20), ("tafsir", "Reading the Qur'an with its commentators.", 25), ("seerah", "The sira in depth, with its sources.", 30), ("converts", "Memoirs and studies by people five, ten, thirty years in.", 25), ("ulama", "Scholars to read, and how to choose a teacher.", 15)],
        vt="The long road, year by year", sub="Themes that converts report as the years pass; sample text.",
        v=timeline([("Years 1 to 2", "Learning the practice, and who to ask."), ("Years 2 to 3", "Burnout, or the opposite: a wish to correct everyone."), ("Years 3 to 5", "Marriage, children, work, and where you belong."), ("Year 5 and after", "Becoming the person others ask. Ageing and what it means to be buried as a Muslim.")])),
    "curious": dict(h="Wander. Nothing here asks you to decide.", thoughts=["What is this, really?", "Show me something I would not expect.", "Who are these people?", "What do Muslims believe, in short?"],
        steps=[("wander", "A random object, place or person each visit.", 5), ("islam30", "The whole picture in half an hour.", 30), ("story", "One story, one image.", 4), ("signs", "Things people point to as signs.", 8)],
        vt="Today's wonder", sub="A different one every visit; sample text.",
        v='<div class="card"><h3>The Night Journey</h3><p>One night, the Prophet is taken from the sacred mosque in Mecca to the farthest mosque, and then up through the heavens. Scholars have read it as a body journey, a vision, or both. Read what each side says.</p></div>'),
    "doubt": dict(h="Your questions are welcome, and so are the hard ones.", thoughts=["Is it true?", "Why does God allow suffering?", "What if I do not feel anything?", "I am afraid of asking."],
        steps=[("questions", "Questions, each with two or more voices and no verdict.", 15), ("quran", "What the Qur'an says about doubt and about asking.", 12), ("messengers", "The messengers and the nations that doubted them.", 15), ("munazarat", "Debates between scholars, in their own words.", 20), ("signs", "Signs and miracles, with how scholars grade them.", 10)],
        vt="Questions with more than one voice", sub="Each shows the Sunni positions first, then the academic view; the museum gives no verdict. Sample text.",
        v=voices([("Why does God allow suffering?", "Sunni position", "Trial and wisdom beyond what we see; patience is rewarded.", "Academic view", "A long theological debate (theodicy) across traditions."), ("Can I be Muslim and doubt?", "Sunni position", "Doubt is distinct from rejection; seek knowledge.", "Convert memoirs", "Many describe doubt in year one and again in year five.")])),
    "research": dict(h="Every claim has a source. Start with the method.", thoughts=["Where does this date come from?", "Can I cite this?", "Can I download the data?", "How is a report graded?"],
        steps=[("method", "How records are written and sourced.", 10), ("authenticity", "How reports are graded, and by whom.", 12), ("search", "Search across languages and classes.", 5), ("graph", "Explore people, places and works as a graph.", 15), ("developers", "The open data: formats, licences, API.", 10)],
        vt="Method and sources", sub="What a researcher sees first; sample text.",
        v=cards([("Cite any record", "Every page has a stable ID and a citation line."), ("Provenance on every record", "Who or what produced it, and from which sources."), ("Open data", "Data is CC0, prose CC BY-SA, code MIT."), ("Limits stated", "Which records are drafts or not yet read by a person.")])),
    "learn": dict(h="From what to do, to why it is done.", thoughts=["I pray, but I do not know why this way.", "What is the evidence for this ruling?", "Why do scholars differ?", "Where do I go next?"],
        steps=[("arkan", "The pillars with their sources.", 12), ("ibadat", "Worship in detail, with the reasons.", 25), ("ahkam", "Rulings and how they are derived.", 20), ("madhahib", "Why schools differ, with examples.", 20), ("learn", "Courses and trails, level by level.", 40)],
        vt="Rulings with their reasons", sub="A taste of the format; sample text.",
        v=cards([("Prayer: what", "Five times a day at set times, facing the Qur'an's direction of prayer."), ("Prayer: why", "Scholars connect it to remembrance, discipline and community."), ("Prayer: where it comes from", "Qur'an passages and reports, each cited."), ("Where scholars differ", "Details such as raising the hands, shown by school.")])),
    "challenge": dict(h="Bring the hardest case. The sources are open.", thoughts=["I do not accept this; show me why you do.", "Who decided this report is sound?", "What do the critics say?", "Is this a tradition or a text?"],
        steps=[("questions", "Disputed topics, each side labelled.", 15), ("authenticity", "How a report is graded, and the limits.", 12), ("munazarat", "Debates and objections in their original form.", 20), ("method", "What the museum does not claim.", 8)],
        vt="Contested topics", sub="Each topic names the community that holds a view before it states it; sample text.",
        v=cards([("The reliability of reports", "How grading works, where graders disagree, what critics say."), ("Differences between the first generations", "Told by Sunni sources, then by others, labelled."), ("Rulings that outsiders find hard", "The textual basis, the range of scholarly opinion, the modern debate."), ("What the museum will not do", "It gives no verdict and no sermon.")])),
    "pass": dict(h="Three minutes, three stops, then go in peace.", thoughts=["I only have a moment.", "Just show me one good thing.", "Is there something I can share?", "Maybe I will come back."],
        steps=[("story", "One story, short.", 1), ("wander", "One object or place, with its picture.", 1), ("islam30", "One sentence on what it is all about.", 1)],
        vt="The three-stop path", sub="A small timer keeps it honest; sample text.",
        v='<div class="card" style="display:flex;align-items:center;gap:16px;flex-wrap:wrap"><div style="font-family:var(--sans);font-size:2.4rem;font-weight:600;font-variant-numeric:tabular-nums;color:var(--vp)">3:00</div><p>Stop 1 of 3 starts when you press go. Nothing is saved, and you can leave at any time.</p><a class="btn main" href="#">Go</a></div>'),
}


def vp_page(key):
    v = BY[key]
    d = P[key]
    body = head(f"{v[2]} · islam.museum", key) + topbar(key)
    body += f'<header class="hero"><div class="wrap"><p class="eyebrow">Viewpoint · {E(v[2])}</p><h1>{E(d["h"])}</h1><p class="lede">{E(v[3])}.</p><a class="btn main" href="#path">{svg(key, 18)} Start your path</a> <a class="btn ghost" href="index.html">Switch viewpoint</a></div></header>'
    body += '<main><div class="wrap"><section class="blk"><h2>Thoughts you may have</h2><p class="sub">You are not the first to think them.</p><div class="grid">' + "".join(f'<p class="thought" style="margin:0">{E(t)}</p>' for t in d["thoughts"]) + "</div></section>"
    body += f'<section class="blk" id="path"><h2>Your reading order</h2><p class="sub">Step by step, in an order that suits this viewpoint. You can skip any of it.</p>{steps(d["steps"])}</section>'
    body += f'<section class="blk"><h2>{E(d["vt"])}</h2><p class="sub">{E(d["sub"])}</p>{d["v"]}</section>'
    body += f'<section class="blk"><h2>What changes on every page</h2><p class="sub">Only on this device, and you can reset it.</p><span class="tag">Accent colour</span><span class="tag">Viewpoint bar</span><span class="tag">Halls re-ordered</span><span class="tag">A "next for you" card</span></section></div></main>'
    return body + FOOT


def index():
    cardsh = ""
    for k, f, n, s, a, t, ad, td in VP:
        cardsh += f'<a class="vp" href="{f}" style="--a:{a};--t:{t};--ad:{ad};--td:{td}"><span class="arw" aria-hidden="true">→</span><span class="ic">{svg(k, 22)}</span><span class="nm">{E(n)}</span><span class="sy">{E(s)}</span></a>'
    css = """
.hero .wrap{padding-block:48px 44px}
.vh{margin-top:26px}.vh h2{font-size:1.05rem;font-family:var(--sans);font-weight:600;color:#f9f8f6;margin:0 0 4px}.vh p{margin:0 0 14px;font-family:var(--sans);font-size:.9rem;color:#c9d3d6}
.vg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.vp{--a:#534AB7;--t:#EEEDFE;position:relative;display:block;min-height:44px;background:#f9f8f6;color:#1a1a1a;border:1px solid transparent;border-radius:8px;padding:14px 14px 12px;text-decoration:none;transition:background .22s,border-color .22s,transform .22s;overflow:hidden}
.vp .ic{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:var(--t);color:var(--a);transition:transform .28s}
.vp .nm{display:block;font-family:var(--sans);font-weight:600;font-size:.98rem;margin:9px 0 2px}
.vp .sy{display:block;font-family:var(--sans);font-size:.84rem;color:#4a4a4a;line-height:1.4;min-height:2.4em}
.vp .arw{position:absolute;top:12px;inset-inline-end:12px;color:var(--a);font-family:var(--sans);opacity:0;transform:translateX(-6px);transition:opacity .2s,transform .2s}
.vp:hover,.vp:focus-visible{background:var(--t);border-color:var(--a);transform:translateY(-3px)}
.vp:hover .ic,.vp:focus-visible .ic{transform:rotate(-8deg) scale(1.12);background:#f9f8f6}
.vp:hover .arw,.vp:focus-visible .arw{opacity:1;transform:none}
.hunt{display:flex;align-items:center;gap:14px;margin-top:14px;padding:14px 18px;border:2px dashed var(--gold);border-radius:8px;color:#f9f8f6;text-decoration:none;transition:border-style .1s,background .2s,transform .22s}
.hunt:hover,.hunt:focus-visible{border-style:solid;background:rgba(197,160,89,.14);transform:translateY(-3px)}
.hunt .ic{color:var(--gold);transition:transform .6s}.hunt:hover .ic,.hunt:focus-visible .ic{transform:rotate(180deg) scale(1.12)}
.hunt b{display:block;font-family:var(--sans);font-size:1rem}.hunt span.s{font-family:var(--sans);font-size:.86rem;color:#c9d3d6}
.wings{display:grid;grid-template-columns:repeat(auto-fit,minmax(10rem,1fr));gap:12px}
.wing{background:var(--card);border:1px solid var(--line);border-top:4px solid var(--c);border-radius:6px;padding:14px 16px;font-family:var(--sans)}
.wing b{display:block;margin-bottom:2px}.wing span{font-size:.85rem;color:var(--muted)}
@media (max-width:760px){.vg{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:420px){.vg{grid-template-columns:1fr}}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .wing{background:var(--card)}}
"""
    body = head("Viewpoints on islam.museum").replace("</style>", css + "</style>") + topbar()
    body += f'<header class="hero"><div class="wrap"><p class="eyebrow">islam.museum</p><h1>A museum of Islam, open to everyone</h1><p class="lede">People, places, books, ideas and living culture, with every claim sourced.</p><a class="btn main" href="#">Take the Grand Tour</a> <a class="btn ghost" href="#">Search the museum</a>'
    body += f'<div class="vh"><h2>Where are you looking from?</h2><p>The museum is the same for everyone. Choose a viewpoint and the way in changes.</p><nav class="vg" aria-label="Viewpoints">{cardsh}</nav>'
    body += f'<a class="hunt" href="hunt.html"><span class="ic">{svg("hunt", 34)}</span><span><b>Treasure hunt</b><span class="s">Follow the clues through the museum and find the treasure</span></span></a></div></div></header>'
    wings = [("Time", "#8c6d3b"), ("Place", "#1b4958"), ("People", "#9e4a38"), ("Ideas", "#1c4e40"), ("Objects", "#b27b42"), ("Words", "#2d3748"), ("Living Islam", "#2a7b88"), ("Today", "#335c67")]
    body += '<main><div class="wrap"><section class="blk"><h2>The halls of the museum</h2><p class="sub">Below the Viewpoints, the halls as they are today. A chosen viewpoint puts its halls first.</p><div class="wings">' + "".join(f'<div class="wing" style="--c:{c}"><b>{n}</b><span>Sample hall card</span></div>' for n, c in wings) + "</div></section></div></main>"
    return body + FOOT


CLUES = [("The Night Journey", "One night, from a sacred mosque to the farthest. Which city holds the farthest one?", "jerusalem"), ("The first revelation", "A cave on a mountain near Mecca, a single word to begin. What is the mountain called?", "hira"),
         ("The year of the elephant", "A king came with an elephant to a house of worship and turned back. Which house?", "kaaba"), ("The first to believe", "The first person to accept the message, after hearing it at home. Who?", "khadija"),
         ("A flight by night", "The Prophet and his friend hid in a cave on the road to Medina. Which mountain?", "thawr"), ("A trench", "A city defended by digging, a Persian idea. Whose?", "salman"), ("The farewell", "A last pilgrimage and a sermon to the people. On which plain?", "arafat")]


def hunt():
    css = """
.tr{list-style:none;margin:0;padding:0;display:grid;gap:12px;counter-reset:c}
.tr li{counter-increment:c;display:grid;grid-template-columns:2.6rem 1fr;gap:12px;align-items:start;position:relative}
.tr li::before{content:counter(c);width:2.4rem;height:2.4rem;border-radius:50%;display:grid;place-items:center;font-family:var(--sans);font-weight:600;background:var(--card);border:2px solid var(--line);color:var(--muted)}
.tr li.open::before{border-color:var(--gold);color:var(--gold-text);background:var(--card)}
.tr li.done::before{content:"✓";background:var(--gold);border-color:var(--gold);color:#0a2533}
.tr li.lock{opacity:.6}.tr li:not(:last-child)::after{content:"";position:absolute;inset-inline-start:1.2rem;top:2.4rem;height:calc(100% - 1.2rem);border-inline-start:2px dashed var(--line)}
.clue{background:var(--card);border:1px solid var(--line);border-radius:6px;padding:14px 16px;min-width:0}
.clue h3{font-size:1.05rem;margin:0 0 4px}.clue p{margin:0 0 10px;font-size:.98rem}
.ans{display:flex;gap:8px;flex-wrap:wrap}.ans input{flex:1;min-width:10rem;min-height:44px;padding:0 12px;border:1.5px solid var(--line);border-radius:6px;background:var(--bg);color:var(--fg);font:inherit;font-family:var(--sans)}
.ans button{min-height:44px;padding:0 18px;border-radius:999px;border:0;background:var(--gold);color:#0a2533;font-family:var(--sans);font-weight:600;cursor:pointer}
.msg{font-family:var(--sans);font-size:.88rem;margin:8px 0 0;min-height:1.3em;color:var(--muted)}
.prog{font-family:var(--sans);font-size:.9rem;color:#e6d5b8;margin:6px 0 0}
.chest{display:none;text-align:center;border:2px solid var(--gold);border-radius:8px;padding:22px;margin-top:16px;background:var(--card)}
.chest.on{display:block}
"""
    body = head("Treasure hunt · islam.museum", None).replace("</style>", css + "</style>") + topbar()
    body += '<header class="hero" style="border-bottom-color:#c5a059"><div class="wrap"><p class="eyebrow">Treasure hunt</p><h1>Seven clues. One treasure.</h1><p class="lede">Each clue points to a page in the museum. The answer is a word you find there. No account, nothing sent anywhere.</p><p class="prog ui" id="prog">0 of 7 found</p></div></header>'
    body += '<main><div class="wrap"><section class="blk"><h2>The Prophet\'s road</h2><p class="sub">Today\'s hunt. Sample clues; the final hunts will each link to the real page.</p><ol class="tr" id="tr">'
    for i, (t, c, a) in enumerate(CLUES):
        body += f'<li data-a="{a}"><div class="clue"><h3>{E(t)}</h3><p>{E(c)}</p><div class="ans"><input type="text" aria-label="Your answer to clue {i + 1}" placeholder="Your answer"><button type="button">Check</button></div><p class="msg" role="status"></p></div></li>'
    body += '</ol><div class="chest" id="chest"><h2>You found the treasure</h2><p>Open the museum\'s record of the day: a remarkable page chosen for you.</p><a class="btn main" href="#" style="--vp:#c5a059;--on:#0a2533">Open the treasure</a></div></section>'
    body += '<section class="blk"><h2>More hunts</h2><div class="grid"><div class="card"><h3>Daily hunt</h3><p>Seven new clues every day.</p></div><div class="card"><h3>For children</h3><p>Shorter clues, bigger pictures.</p></div><div class="card"><h3>By viewpoint</h3><p>A hunt for each viewpoint: new to Islam, researching, curious.</p></div></div></section></div></main>'
    body += """<script>
(function(){var K="poc-hunt",done=[];try{done=JSON.parse(localStorage.getItem(K)||"[]")}catch(e){}
var items=[].slice.call(document.querySelectorAll("#tr li"));
function paint(){var n=0;items.forEach(function(li,i){var d=done.indexOf(i)>-1;if(d)n++;li.className=d?"done":(i===0||done.indexOf(i-1)>-1)?"open":"lock";li.querySelectorAll("input,button").forEach(function(x){x.disabled=li.className!=="open"})});
document.getElementById("prog").textContent=n+" of 7 found";document.getElementById("chest").className="chest"+(n===7?" on":"")}
items.forEach(function(li,i){var b=li.querySelector("button"),inp=li.querySelector("input"),m=li.querySelector(".msg");
function go(){if(inp.value.trim().toLowerCase()===li.getAttribute("data-a")){m.textContent="Found it.";if(done.indexOf(i)<0)done.push(i);try{localStorage.setItem(K,JSON.stringify(done))}catch(e){}paint()}else{m.textContent="Not quite. Look again at the page the clue points to."}}
b.addEventListener("click",go);inp.addEventListener("keydown",function(e){if(e.key==="Enter")go()})});
paint()})();
</script>"""
    return body + FOOT


def main():
    out = {"index.html": index(), "hunt.html": hunt()}
    for v in VP:
        out[v[1]] = vp_page(v[0])
    for name, text in out.items():
        open(os.path.join(OUT, name), "w", encoding="utf8").write(text)
    print(len(out), "pages", sum(len(t) for t in out.values()), "bytes")


main()
