# Smash & Stack — Burger Restaurant Website

A fast, fully responsive, static marketing site for a fictional smash-burger
restaurant. No build step, no dependencies — just open it.

## Run it

```bash
cd site
python3 -m http.server 8000
# then visit http://localhost:8000
```

Or simply open `site/index.html` in a browser.

## Pages

- **`index.html`** — landing page: hero, feature highlights, fan-favorite
  burgers, story, how-we-cook, testimonials, opening hours (today auto-
  highlighted), and a reservation form with live validation.
- **`menu.html`** — full menu with category filters and dietary badges.

## Structure

```
site/
├── index.html        # landing page
├── menu.html         # full menu
├── css/styles.css    # design tokens + all styles
├── js/main.js        # nav, scroll reveal, hours, reservation form
├── js/menu.js        # menu category filtering
└── assets/favicon.svg
```

## Design system

Generated with the `ui-ux-pro-max` skill ("Vibrant & Block-based" direction):

- **Colors:** appetizing red `#DC2626` + warm gold `#A16207` on a warm cream
  background, with a dark "char" band for contrast.
- **Type:** Playfair Display SC (display) / Karla (body), via Google Fonts.
- **Food visuals** are hand-built inline SVG, so the site renders perfectly
  with zero external image dependencies.

## Accessibility & quality

- Semantic landmarks, skip link, labeled icon buttons, visible focus rings.
- Reservation form: visible labels, inline validation on blur, error text per
  field, `aria-live` status, focus moves to first invalid field.
- Respects `prefers-reduced-motion`; responsive from 375px up; touch targets
  ≥ 44px; WCAG-minded color contrast.

> Forms are front-end only (simulated submit) — wire them to a backend or a
> service like Formspree to go live.
