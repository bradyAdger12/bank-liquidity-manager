# UI Style Guide

Tailwind + daisyui, custom theme `liquidity` (see `client/tailwind.config.js`).
Custom overrides live in `client/src/style.css`. Keep markup declarative —
prefer the classes below over ad hoc utility strings so new UI stays visually
consistent.

## Color palette

Three colors, each with one job. Don't reach for `primary` outside of a CTA, or
the color loses its meaning.

| Role | Color | Token | Used for |
| --- | --- | --- | --- |
| Theme — cool | Navy `#1B3358` | `secondary` / `neutral` | Chrome: borders, focus rings, secondary emphasis |
| Theme — warm | Gold `#D9A441` | `accent` | Accent highlights (complements navy) |
| CTA | Raspberry `#E63972` | `primary` | `btn-primary` only — the one color that means "click me" |

## Fonts

Loaded from Google Fonts in `client/index.html`.

| Use | Font | Tailwind class |
| --- | --- | --- |
| Headings (`h1`–`h6`, applied globally) | Plus Jakarta Sans | `font-heading` |
| Body text (applied globally) | Inter | `font-sans` |

## Principles

- Soft, flat surfaces: thin `base-200` borders instead of heavy shadows.
- One focus style everywhere: a slim `secondary`-colored ring, not daisyui's
  default blocky 2px outline (see **Focus states** below).
- Inline feedback (errors, warnings, success) uses the banner classes, not bare
  colored text — it should read as a distinct UI element, not a stray sentence.
- `primary` is reserved for CTAs — don't use it for borders, focus rings, or
  decoration.

## Typography

| Use | Class | Example |
| --- | --- | --- |
| Page heading (one per page) | `page-title` | `<h1 class="page-title">Dashboard</h1>` |
| Section / card heading | `section-title` | `<h2 class="section-title">Place Order</h2>` |
| Hint / helper text under a field | `field-hint` | `<span class="field-hint">Up to 2 decimal places</span>` |

## Buttons

Use daisyui's `btn` classes as-is — `style.css`/theme config already handle
the pill shape and focus ring globally, no extra classes needed. All buttons
are fully rounded (`--rounded-btn: 9999px`).

- Primary action / CTA: `btn btn-primary`
- Secondary / cancel: `btn`
- Compact (e.g. pagination): `btn btn-sm`

## Cards

```html
<div class="card bg-base-100 border border-base-200 shadow-sm">
  <div class="card-body">
    <h2 class="section-title">...</h2>
    ...
  </div>
</div>
```

Corner radius is tuned globally via the `--rounded-box` theme variable — don't
override radius per-card.

## Forms & inputs

```html
<label class="form-control">
  <span class="label-text">Amount (USD)</span>
  <input class="input input-bordered" ... />
  <span class="field-hint">Enter digits only, no commas</span>
</label>
```

`input` / `select` / `textarea` focus styles are overridden globally (see below)
— don't add `focus:` utilities to individual fields.

## Alert banners

Use for any inline success/error/warning feedback shown in a form or page,
in place of bare `text-error` / `text-success` paragraphs:

```html
<p class="alert-banner-error">Enter a valid amount</p>
<p class="alert-banner-warning">Curve may reflect yesterday's rates.</p>
<p class="alert-banner-success">Order placed.</p>
```

## Focus states

daisyui's default focus style on `.input`/`.select`/`.textarea`/`.btn` is a
solid 2px outline offset from the border — it reads as a double ring. This is
overridden globally in `style.css` to just a border-color change, tinted to
`secondary` (navy) — not `primary`, so focus indication never gets confused
with a CTA. No glow/ring box-shadow, intentionally. No per-component action
needed; don't add `focus:outline-none` or `focus:ring-*` utilities locally,
since the global rule already handles it.
