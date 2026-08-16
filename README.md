# nocturea.com

Static site built with [Lume](https://lume.land) (Deno). Ships zero JavaScript.

## Requirements

Deno 2.7+ (`deno --version`).

## Commands

| Command | What it does |
| --- | --- |
| `deno task serve` | Dev server on <http://localhost:3000> with live reload |
| `deno task build` | Build the production site into `_site/` |

## Layout

```
_config.ts          Lume config (src, output, prettyUrls, dev server)
deno.json           Deno tasks, imports, permissions
src/
  _data.yml         Nav, footer, copyright, OG image — shared by every page
  _data/
    projects.js     The project list; drives /work.html and every case page
  _includes/
    layouts/
      base.vto      The page shell: head, header, footer
      case.vto      The case study template
  index.vto         Home
  work.vto          Project list
  services.vto      Services and prices
  about.vto         About
  contact.vto       Contact form
  404.vto           Not found
  case.page.js      Generates /work/<slug>.html, one per project
  global.css        All styles
  public/           Images and the OG image (copied as-is)
_site/              Build output. Generated — never edit, never commit.
```

## Editing

**Content of a page** — edit the matching `src/*.vto`. Everything above the
second `---` is front matter:

| Key | Purpose |
| --- | --- |
| `title` | `<title>` and the OG/Twitter title |
| `description` | Meta description and OG description |
| `active` | Which nav item is highlighted (`work`, `services`, `about`, `contact`) |
| `styles` | Optional page-scoped CSS, injected into that page's `<head>` |

**Nav, footer, or copyright year** — edit `src/_data.yml` once. It applies to
every page. The same `nav` list renders both the header and the footer.

**Projects** — edit `src/_data/projects.js`. One object per project. Adding an
entry adds a row to `/work.html`, a card on the home page (first three only)
and a case study at `/work/<slug>.html`; nothing else needs touching. The
`shot`, `heroShot`, `wideShot`, `tiles` and `strip` fields are the captions
of the hatched placeholder frames — swap each `.noc-shot` for an `<img>` as
the real images arrive.

**Shared styles** — `src/global.css`. It is organised top-down: tokens, base,
layout primitives, typography, then one block per part of the site.

> After changing `global.css`, bump `cssVersion` in `src/_data.yml`. The
> stylesheet is served with a one-year immutable cache while HTML revalidates
> hourly, so without the bump returning visitors get new markup with old
> styles.

## Design system

| | |
| --- | --- |
| Surface | `#09090a`, one step lighter at `#101012` for frames |
| Rules | `#1a1a1c` |
| Text | `#eae7e2`, dimmed through `#a8a49d`, `#88857f`, `#57544f` |
| Accent | `#ff6a3d` (hover `#ff8b66`) — the only colour on the site |
| Type | Archivo, 200 for text and 900 for display |

Everything is a rule, a gap or a letter-spacing. No shadows, no radii, no
second accent.

The hover preview on `/work.html` is CSS-only: `:has()` on the row index
reveals the matching panel, and the panels are stacked in a single grid cell
so the column never resizes.

## URLs

`prettyUrls` is deliberately **off** in `_config.ts`, so pages build to
`/about.html`, not `/about/`. Case studies are the one nested path,
`/work/<slug>.html`.

## Deploying

Production is nginx serving static files. No Deno process runs on the server.

```sh
deno task build
rsync -avz --delete _site/ user@server:/var/www/nocturea.com/
```

nginx config (caching, gzip, 404 handling) lives in `nginx.conf.example`.
