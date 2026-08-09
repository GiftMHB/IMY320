# CodeCampus

A coding education platform built for IMY 320's Group Design A, the login/register
brief under Jakob's Law. CodeCampus sells hands-on lessons across eight languages
and technologies: Python, C++, PostgreSQL, Java, TypeScript, HTML, CSS and ReactJS.

Built by Late to the Party.

<div class="center">
    <h2>The Live link to our website may be accessed:</h2>
    <a href="https://giftmhb.github.io/IMY320/">HERE</a>
</div>

## What's in here

```
index.html          Landing page
login.html           Login / register
about.html            About us
catalogue.html         Course catalogue

assets/
  css/          global.css (shared tokens) + one file per page
  images/       login/register background photography
  img/          course icons and page imagery
  js/           app.js, auth.js, components.js (shared across every page)

data/
  courses.json  course catalogue data

documents/
  Group UX reports (Coursera, Udemy, Khan Academy) and the raw Google Form
  results behind them
```

Nothing here needs a real backend. Cart, login state and purchase history all run
off `localStorage` and `data/courses.json`, but every interaction is meant to feel
fully functional when you click through it.

## Colours

Styled with University of Pretoria colours (navy/gold), defined as tokens at
the top of `assets/css/global.css`. These are currently approximated from UP's
public site and Wikipedia's "blue, gold, and red" listing, since the official
brand PDF wasn't reachable when this was set up.

**Before final submission**, swap in the exact hex values from UP's Brand Hub —
ask your module coordinator, or check
`up.ac.za/article/3175330/university-of-pretoria-brand`.

## Why the pages look the way they do

This isn't guesswork. Every major layout decision on the login and landing pages
traces back to the group's own UEQ evaluations of Coursera, Udemy and Khan
Academy, and to Jakob's Law: keep the login flow conventional, since that's where
users reward familiarity, and spend any visual personality on the pages either
side of it.

**Login / register (`login.html`)**
The form itself stays deliberately plain: email, password, and a supplementary
"Continue with GitHub" option, matching the pattern that scored highest for Easy
to Use and Clarity across all three benchmarked sites. The gold accent bands
above and below the form, and the background photography behind the side panel
(swapped per tab between login and register), are where the page's personality
lives instead, kept well away from the form fields themselves.

**Landing page (`index.html`)**
All three UX reports agreed the landing page is where users are most tolerant
of, and rewarded for, visual richness and exploration, unlike the login page.
The Khan Academy report specifically flagged its landing page scoring lower on
"Supportive" (5.0) than its login or about pages (6.0 each), suggesting a
landing page needs a clearer nudge toward the next step. This page acts on both
findings:

- The hero carries the one signature visual element (the animated skill-progress
  panel). This is where the group's "innovation budget," per the Udemy report's
  guideline, gets spent, not on the login flow.
- Two differently-weighted CTAs sit right in the hero ("Start your first build" /
  "Browse courses") so a first-time visitor isn't left guessing, directly
  addressing the Supportive gap the Khan Academy report flagged.
- A second CTA block repeats the primary action further down the page, for
  anyone who scrolled past the hero without converting.
- Feature card copy is specific rather than generic filler, since templated-
  sounding copy was flagged as a weakness in the Coursera report's discussion of
  its about page.

**About us / catalogue**
Not documented here yet, if you're working on either of these, it's worth adding
a short section here on the design decisions behind them once they're settled,
the same way the pages above are.

## Documentation

The `documents/` folder holds the group's three UX evaluation reports and the
raw Google Form results they're built on. Worth a skim before touching any
page's layout, the reasoning above is pulled directly from them.

## Running it

Open any page directly in a browser, or serve the folder so relative paths and
`localStorage` behave consistently:

```bash
python3 -m http.server
```

## Working together

- `assets/js/app.js`, `auth.js` and `components.js`, and `assets/css/global.css`
  are shared across every page. Only change these if the group's agreed to it,
  since a change here affects all four pages at once.
- Each page's own CSS file (`landing.css`, `login.css`, `about.css`,
  `catalogue.css`) is safe to edit freely, scope any tweaks there rather than in
  `global.css`.
- Work on your own branch (e.g. `feature/catalogue`), push, open a PR, get a
  teammate to glance over it, then merge into `main`.