# Package 3 — About Us Page (`about.html`)

## Your job
You own `about.html`. Don't need to touch `login.html` or `index.html` — those live in
the other two packages.

## Colours
Styled with University of Pretoria colours (navy/gold/red) — token list at the top of
`assets/css/style.css`. These are approximated from UP's public site and Wikipedia's
"blue, gold, and red" listing, since I couldn't pull exact Pantone/hex values from UP's
official brand PDF (link was down when I checked). **Before final submission, swap in
the exact hex values from UP's Brand Hub** (ask your module coordinator, or check
`up.ac.za/article/3175330/university-of-pretoria-brand`).

## What's already built in, based on your group's own UX reports
The Coursera report specifically flagged that the About Us page landed mid-range on
every UEQ criterion with no standout — "a stable, unremarkable info page" — and
recommended giving it a clearer identity, e.g. a stronger story about the platform's
values, rather than leaving it as generic boilerplate. This page acts on that directly:

- Opens with a point-of-view statement ("we think you learn best with your hands on
  something real") instead of a neutral corporate description — this is the identity
  the Coursera report said was missing.
- The "Our approach" section ties back to the same three ideas (build first, real
  feedback, one account everywhere) that run through the landing page copy, so the
  platform's voice stays consistent across pages rather than each page inventing its
  own tone.
- Team section is scaffolded and ready — swap in your actual group members' names,
  roles, and photos before submission.

## Running it
Open `about.html` directly in a browser, or serve the folder:
```bash
python3 -m http.server
```

## Merging with your teammates
1. Everyone clones the same repo and works on their own branch, e.g. `feature/about`.
2. `assets/` and `data/` are byte-identical across all three packages right now, so when
   you all push and merge into `main`, there should be **zero conflicts** on those files.
3. Only touch `assets/css/style.css` or `assets/js/components.js` if the whole group has
   agreed to it — those are shared across every page. If you need an about-only style
   tweak, scope it with a class instead of changing shared rules.
4. Push your branch, open a PR, get a teammate to glance at it, merge into `main`.
5. Fill in the real team member names/roles in the "Our team" section before submission.
