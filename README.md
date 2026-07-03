# Harding website — skeleton

## What's in here

```
Harding/
├── index.html        ← Homepage (scroll-built sentence)
├── solutions.html     ← Solutions page (problem/solution vignettes)
├── about.html          ← About page (bio, testimonials, contact)
├── styles.css          ← All styling, in one file
├── script.js            ← Scroll effects, mobile menu
└── assets/
    └── harding-logo.png
```

No build tools, no npm — just plain files. Netlify will serve them as-is.

## Everything marked `[Placeholder]` is safe to edit

Open any `.html` file in a text editor and replace the placeholder text —
you don't need to touch the CSS or JS to change words. Look for:

- The five phrases in `index.html` that build into one sentence
- The three vignettes in `solutions.html` (duplicate the `<article class="vignette">` block to add more)
- The bio, photo, and testimonials in `about.html`
- The `mailto:hello@example.com` link — swap in your real email

## To get this live

1. Copy these files into your `Harding` folder:
   `C:\Users\ljohn\OneDrive\Documents\Website\Harding`
2. In Terminal, from inside that folder:
   ```
   git add .
   git commit -m "Add site skeleton"
   git push
   ```
3. Netlify will pick up the push and publish automatically.

## About your photo

Drop your image into `assets/` (e.g. `assets/your-photo.jpg`), then in
`about.html` find the line that says `Photo placeholder` and replace the
whole `<div class="frame">...</div>` with:

```html
<div class="frame">
  <img src="assets/your-photo.jpg" alt="Photo of [Your Name]">
</div>
```
