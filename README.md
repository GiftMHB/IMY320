# CodeCampus

A coding education platform built for **IMY 320: Multimedia Trends** (University of Pretoria, 2026).
CodeCampus sells hands-on, project-based lessons across eight languages and technologies:
Python, C++, PostgreSQL, Java, TypeScript, HTML, CSS and ReactJS.

Built by **Late to the Party**.

**Live site:** [giftmhb.github.io/IMY320](https://giftmhb.github.io/IMY320/)

---

## Team

| Name | Student number | GitHub |
| --- | --- | --- |
| _IZ Maduna_ | 22555740 | [ZiphoZ](https://github.com/ZiphoZ) |
| _G Mohuba_ | 23545527 | [GiftMHB](https://github.com/GiftMHB) |
| _T Mokwena_ | 22496336 | [tl21thebe](https://github.com/tl21thebe) |

---

## About the project

The module asks each group to build the front end of an online teaching service (think Udemy or Zenva)
over five submissions. Users must be able to log in, browse courses, add courses to a cart, check out
and track their progress. There is no real backend: the site is static HTML, CSS and JavaScript, and
everything that "remembers" something (accounts, cart, enrolments, orders, reviews) is saved in the
browser's `localStorage`, with the course catalogue loaded from JSON files.

### Persona

All design decisions were made for **Thabo M., the Career-Switching Builder**: someone who has started
many courses and finished few, studies in short bursts between work and family, and wants a real project
he can point to rather than another unfinished certificate.

---

## How the project grew

Each submission came with a client statement and a UX law from class. For every one, each of us
evaluated an existing learning platform (Coursera, Udemy or Khan Academy) with the shortened User
Experience Questionnaire (UEQ-S), looked at which criteria scored high or low, and turned that into
design guidelines. The reports are in `documents/`.

### Group Design A: Login, landing and About (Jakob's Law)

**Client:** "a new login/register innovation... generic/flexible/smart enough to be used not only for the
main site but also some sister sites down the line."

**Law:** Jakob's Law. Users spend most of their time on other sites, so they expect yours to work the
same way.

**What the research told us**
- On all three sites, *Innovative* was the lowest or one of the lowest criteria on the login page
  (Khan Academy 5.7, Udemy 5.3, Coursera 4.3), while *Easy to use*, *Clarity* or *Efficient* scored highest.
  People reward a login page for being predictable.
- Landing pages told the opposite story. Udemy's scored highest on Boring-Exciting (6.7) and Coursera's
  on Innovative and Interesting (5.3), but Coursera's was also lowest on Efficient (4.3), so a rich landing
  page still needs one clear call to action.
- About pages were the most forgettable. Udemy's, built on mission language and real numbers, scored 6.7
  on Interesting, while Coursera's sat in the middle on everything.

**What we built**
- `login.html`: one conventional, single-column form. Registration asks only for the essentials
  (display name, email, password), shows the password rules before the user gets them wrong, and has a
  show/hide password toggle. The page's personality sits around the form (gold accent bands and
  photography that changes between the login and register tabs), not in it.
- `index.html`: the landing page is where the personality goes. An animated hero with a rotating
  language, two differently weighted calls to action ("Start your first build" and "Browse courses"),
  language tiles, featured courses and a repeat call to action further down.
- `about.html`: a mission statement and real numbers instead of filler copy.
- The auth code is one reusable component. Field order, validation and button placement stay the same,
  and only branding changes, which is what lets it be reused on sister sites.

### Group Design B: Course catalogue and course page (Fitts's Law)

**Client:** "I really hate seeing things as cells... I want good old lists! An informative list with all
the relevant information. Something I can sort and search through!"

**Law:** Fitts's Law. The time to hit a target depends on its size and distance, so bigger, closer,
predictably placed targets are faster and cause fewer errors.

**What the research told us**
- All three reference sites use cards. *Efficient* was highest on Khan Academy (5.7), whose tiles are
  simple, and lower on Udemy and Coursera (4.7 each), whose cards pack a thumbnail, rating, badges and
  title into one small area, splitting it into competing targets.
- Cards scored better for *Innovative* and *Modern*, but those scores varied a lot from person to person,
  while *Efficient* was more consistent. We took that as support for a plain, functional list.

**What we built**
- `catalogue.html`: a vertical list where every row is a single large click target with the language
  icon, title, level badge, duration and a short description. Search and sort sit in a fixed bar at the
  top, with language, level and price filters that work together.
- `course-detail.html`: the course page, reached with one click from a row, with the main action in a
  large high-contrast button near the top and a clear way back to the catalogue.
- Rows are evenly spaced so neighbouring targets do not compete.

### Group Design C: Customer experience (Peak-End Rule)

**Client:** "...theirs are just so... bland. I need ours to pop! Whether it's them checking out a course,
pushing a button, or finishing a course, something needs to stand out!"

**Law:** The Peak-End Rule. People judge an experience mostly by its most intense moment and by how it
ends.

**What the research told us**
- Across the three sites, *Exciting* and *Interesting* only reached about 4.3 to 4.7, and participants
  described the final moments as functional but bland.
- 83 to 92% of participants asked for a more celebratory course-completion experience.
- Checkout was rated efficient (cross-site *Efficient* average 5.57) but none of the sites created a
  memorable "you're in" moment.

**What we built**
- **Checkout** (`cart.html`, `checkout.html`, `order-success.html`): a simulated payment flow that ends on
  a full-screen "You're in!" page with confetti, a large checkmark, the order summary and two clear
  next actions.
- **Button feedback**: primary buttons respond immediately with a toast ("Nice work"), a progress bar
  update and sidebar checkmarks, so each press is a small peak.
- **Course completion** (`course-complete.html`): the high point of the whole journey, with a large
  heading, confetti, a personalised certificate you can download as a PDF, key stats and clear next steps.

### Group Design D: UX evaluation

The group ran a usability test on CodeCampus itself (9 October 2026) using realistic tasks instead of
asking users whether they "liked" it. The findings were turned into a fix list that the three of us split
by area, and these changes feed into the final submission:

- **Accounts and data:** each user now gets their own cart, enrolments and progress, so a new account
  starts clean. Signed-in users go straight to the courses page.
- **Buying flow:** clearer Add to Cart wording, free courses enrol immediately, the course-card plus
  button was removed, and the unfinished sign-up options and footer links were cleaned up.
- **Navigation and home page:** My Learning moved into the main nav, language tiles lead to a filtered
  course list, and featured courses are a simple list.
- **Course pages and learning:** About, prerequisites and instructor come first on the course page, with
  an instructor photo, ratings and a link to the reviews. The learning page has a clearer layout and
  progress bar, completed courses open in a completed state, and learners can review a course after
  finishing it.
- **Consistency:** hover effects and hand cursors were removed from anything that is not clickable.

### Group Design E: Final website

The final submission brings every component together and revises earlier ones. The complete flow is:
sign up, browse, add to cart, check out, learn, complete a course, leave a review.

---

## Pages

| Page | File | What it does |
| --- | --- | --- |
| Landing | `index.html` | Hero, language tiles, featured courses, calls to action |
| Login / register | `login.html` | One form with login and register tabs and password rules |
| About | `about.html` | Mission, numbers and instructor profiles |
| Courses | `catalogue.html` | Searchable, sortable, filterable list of courses |
| Course details | `course-detail.html` | Description, prerequisites, instructor, curriculum, reviews |
| Cart | `cart.html` | Courses waiting to be bought |
| Checkout | `checkout.html` | Contact and payment details (simulated) |
| Order success | `order-success.html` | The "You're in!" celebration |
| Learning | `course-player.html` | Lesson player with contents list and progress bar |
| Course complete | `course-complete.html` | Celebration, certificate and review pop-up |
| My Learning | `profile.html` | In-progress courses, completed courses and order history |

`courses.html` is an older copy of the catalogue and is not linked from the site.

---

## Features

- **Accounts:** sign up and log in, with per-user data in `localStorage` (keys are suffixed with the
  user's email).
- **Browse:** search, sort (price, duration, title) and filter by language, level and price, with a
  "Clear filters" link. The language filter can be opened from a link such as `catalogue.html?language=Python`.
- **Buy:** add to cart, check out, and see an order confirmation. Free courses enrol immediately.
- **Learn:** a lesson player with collapsible modules, per-module progress, previous and next buttons,
  and a progress bar that resumes where you stopped.
- **Finish:** confetti, a downloadable PDF certificate, and a five-star review with a comment.
- **Track:** My Learning lists in-progress and completed courses (with your rating) and order history.

---

## Project structure

```
index.html, login.html, about.html, catalogue.html, course-detail.html,
cart.html, checkout.html, order-success.html, course-player.html,
course-complete.html, profile.html

assets/
  css/      global.css (shared design tokens) plus one file per page, and reviews.css
  js/       app.js, auth.js, components.js, cart.js (shared state), plus one file per page
  images/   login and register photography
  img/      course images and page imagery

data/
  courses.json         the catalogue
  course-details.json  descriptions, curriculum, instructors and reviews

documents/
  Design A, B and C UX reports, the design support documents, the raw Google Form
  results behind them, and the UX design document
```

**Shared code:** `components.js` draws the header, footer and toasts on every page, and `cart.js` holds
every read and write of cart, enrolment, progress, order and review data. Page code goes through those
functions instead of touching `localStorage` directly.

**Data saved in the browser:** `codecampus_current_user`, `codecampus_cart`, `codecampus_enrollments`,
`codecampus_orders`. The last three are stored per user.

---

## Design

- **Colours:** University of Pretoria navy and gold, defined as tokens at the top of `assets/css/global.css`.
- **Type:** Plus Jakarta Sans for headings, Inter for body text and JetBrains Mono for labels and numbers.
- **Feedback everywhere:** toasts, loading states on forms, progress bars, confetti and animated counters,
  so every action visibly does something.

---

## Libraries and credits

As the module requires, everything we did not write ourselves is listed here.

- [jsPDF](https://github.com/parallax/jsPDF) 2.5.1: generates the PDF certificate
- [Devicon](https://devicon.dev/): language and technology icons
- [Google Fonts](https://fonts.google.com/): Plus Jakarta Sans, Inter, JetBrains Mono
- [Unsplash](https://unsplash.com/): stock portraits for the instructor profiles on the About page
- [Random User](https://randomuser.me/): placeholder portraits for course instructors
- Confetti is our own code (`assets/js/celebrate.js`)

---

## Running it locally

The site loads JSON with `fetch`, so opening the HTML files directly will not work. Serve the folder instead.

**VS Code:** install the Live Server extension, right-click `index.html` and choose *Open with Live Server*.

**Or with Python:**

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Data is saved per address, so use the same one each time
(`localhost` and `127.0.0.1` keep separate data).

To reset everything, clear the site's data in your browser's developer tools.

---

## Working together

- Work on your own branch, push, open a pull request, have a teammate look it over, then merge into `dev`
  and `main`.
- `components.js`, `cart.js`, `auth.js` and `global.css` affect every page, so agree changes first.
- Page-specific styling belongs in that page's own CSS file.

---

## References

- Fitts, P.M., 1954. The information capacity of the human motor system in controlling the amplitude of
  movement. *Journal of Experimental Psychology*, 47(6), pp.381-391.
- Laws of UX, n.d. Jakob's Law. [lawsofux.com](https://lawsofux.com/jakobs-law/)
- Schrepp, M., Hinderks, A. and Thomaschewski, J., 2017. Design and evaluation of a short version of the
  user experience questionnaire (UEQ-S). *International Journal of Interactive Multimedia and Artificial
  Intelligence*, 4(6), pp.103-108.
- Wong, Y., 2026. IMY 320: Trends in multimedia [Lecture slides]. Pretoria: University of Pretoria.
