# Dreamy Photography

A travel journal by Jahidul Islam — posts and photographs from three mornings
above the cloud line in Bandarban, November 2025.

No build step, no framework, no `npm install`. It is one HTML file and eight
photographs.

**Live:** <https://jahid-dev-analytics.github.io/dreamy-photography/>

---

## Running it locally

Open `index.html` in a browser. That is all.

If you want a real local server (so the paths behave exactly as they will on
GitHub Pages):

```bash
npx serve .
```

---

## What is in here

| Path                 | What it is                                                        |
|----------------------|-------------------------------------------------------------------|
| `index.html`         | The whole site — markup, styles and scripts in one file            |
| `404.html`           | Shown for any unknown path. Same tokens, kept in sync by hand      |
| `assets/`            | The eight photographs, resized to 1700px on the long edge, as both `.jpg` and `.webp` |
| `design/`            | The design system this was built from — see below                  |
| `build-artifact.mjs` | Inlines the photos as data URIs for hosts that block relative media |
| `dist/`              | Output of that build. Git-ignored; not needed for GitHub Pages      |

### `design/`

- `design-spec.md` — the design language, reverse-engineered from a reference
  site: palette, type scale, spacing rhythm, radius and shadow rules.
- `tokens.css` — the same system as Tailwind v4 `@theme` variables. `index.html`
  inlines these as plain custom properties so it runs with no build step. **If
  you change a colour or a size, change it in both places.**
- `directions.html` — the three design directions the site was chosen from.
  Not part of the live site.

---

## Editing the content

Everything you are likely to change sits in two objects near the top of the
`<script>` block at the bottom of `index.html`.

**`FRAMES`** — the two photo series. Each entry:

```js
{ no:'01', cls:'p-cloud', src:'assets/f1-cabin-lean.jpg',
  t:'Against the cabin wall', c:'Bandarban — 14 Nov 2025' }
```

`t` is the title shown on the frame, `c` the credit line in the lightbox, `cls`
the CSS gradient shown if the file is missing.

**`POSTS`** — the journal. Each post is an array of blocks:

```js
['p',     'a paragraph']
['h3',    'a subheading']
['pull',  'a pull quote, ultramarine rule down the left']
['shot',  'assets/f3-window.jpg', 'p-cloud', 'the caption']
['draft', 'a note marked in ultramarine']
```

### Adding a photograph

Resize it to about 1700px on the long edge, drop it in `assets/`, and add an
entry to `FRAMES` pointing at the `.jpg`.

**Then make the `.webp` beside it.** `img()` builds a `<picture>` and derives
the WebP path from the JPEG name, so every `assets/x.jpg` wants an
`assets/x.webp` next to it:

```bash
npx --yes sharp-cli --input assets/your-photo.jpg --output assets/ --format webp --quality 82
```

No install, and q82 is what the existing eight were encoded at — that command
reproduces them byte for byte.

Skip it and the photograph will not show up. `<picture>` commits to the
`<source>` it picks and does not retry the `<img>` when that 404s, so you get
the CSS gradient plate instead of your photo. A JPEG with no WebP sibling is
the one case where the fallback works against you.

Missing the JPEG as well — mid-edit, before you have copied anything in — still
degrades to the gradient plate rather than a broken image.

### The placeholders

Anything in ultramarine on the page is a placeholder waiting for you — search
`index.html` for `class="todo"`. Two are left: **your city** and **your camera**.

The three journal posts are drafts written from the photographs, not an account
of the actual trip. Each ends with a line saying so. Replace them with your own
words and delete those lines.

---

## Publishing to GitHub Pages

Once this is pushed, in the repository: **Settings → Pages → Build and
deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save.**

The site appears at `https://<username>.github.io/<repo>/` within a minute or
two. Every later `git push` redeploys it.

Pages only serves public repositories on the free plan.

---

## A note on the contact details

This is a public repository, so anything in it is on the open web — indexed by
search engines and readable by scrapers.

The site deliberately shows **an email address and the enquiry form only**. No
phone number and no WhatsApp link, and neither has ever been committed, so they
are not recoverable from the git history either.

If you later add a phone number, know that removing it again does not undo it:
git keeps every previous version and search engines keep their own copies.
