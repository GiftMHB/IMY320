# Package 2 — Landing Page (`index.html`)

## Your job
You own `index.html`. Don't need to touch `login.html` or `about.html` — those live in
the other two packages.

## Colours
Styled with University of Pretoria colours (navy/gold/red) — token list at the top of
`assets/css/style.css`. These are approximated from UP's public site and Wikipedia's
"blue, gold, and red" listing, since I couldn't pull exact Pantone/hex values from UP's
official brand PDF (link was down when I checked). **Before final submission, swap in
the exact hex values from UP's Brand Hub** (ask your module coordinator, or check
`up.ac.za/article/3175330/university-of-pretoria-brand`).

## What's already built in, based on your group's own UX reports
Your three reports agreed the landing page is where users are *most* tolerant of — and
reward — visual richness and exploration, unlike the login page. The Khan Academy report
specifically flagged that its landing page scored lower on "Supportive" (5.0) than its
login/about pages (6.0 each), suggesting a landing page needs a clearer nudge toward the
next step. This page is built to act on both findings:

- The hero carries the one "signature" visual element (the animated skill-progress
  panel) — this is where your group's "innovation budget" per the Udemy report's
  guideline is spent, not on the login flow.
- Two clear, differently-weighted CTAs sit right in the hero ("Start your first build" /
  "Browse courses") so a first-time visitor isn't left to guess the next step — directly
  addressing the "Supportive" gap the Khan Academy report flagged.
- A second CTA block repeats the primary action lower on the page for anyone who scrolled
  past the hero without converting.
- Feature cards use real, specific copy (not filler lorem ipsum) since generic copy read
  as templated in your Coursera report's discussion of the About page.

## Running it
Open `index.html` directly in a browser, or serve the folder:
```bash
python3 -m http.server
```

## Merging with your teammates
1. Everyone clones the same repo and works on their own branch, e.g. `feature/landing`.
2. `assets/` and `data/` are byte-identical across all three packages right now, so when
   you all push and merge into `main`, there should be **zero conflicts** on those files.
3. Only touch `assets/css/style.css` or `assets/js/components.js` if the whole group has
   agreed to it — those are shared across every page. If you need a landing-only style
   tweak, scope it with a class instead of changing shared rules.
4. Push your branch, open a PR, get a teammate to glance at it, merge into `main`.
