# nocturea.com

> The website of Nocturea, an independent design studio. Static, and ships zero
> JavaScript.

Built with [Lume](https://lume.land) on [Deno](https://deno.com). Every page is
plain HTML and CSS, generated ahead of time; even the hover previews on the work
page are CSS-only.

## Contents

- [Getting started](#getting-started)
- [Layout](#layout)
- [Editing](#editing)
- [Design system](#design-system)
- [URLs](#urls)
- [Deploying](#deploying)
- [Support](#support)
- [License](#license)

## Getting started

Requires Deno 2.7 or later (`deno --version`).

```sh
git clone https://github.com/Simon256px/nocturea.com.git
cd nocturea.com
deno task serve
```

| Command           | What it does                                         |
| ----------------- | ---------------------------------------------------- |
| `deno task serve` | Dev server on http://localhost:3000 with live reload |
| `deno task build` | Build the production site into `_site/`              |

## Layout

```
_config.ts          Lume config (src, output, prettyUrls, dev server)
deno.json           Deno tasks, imports, permissions
src/
  _data.yml         Nav, footer, copyright, OG image: shared by every page
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
  public/           Static files, copied as-is
_site/              Build output. Generated: never edit, never commit.
```

## Editing

**A page** — edit the matching `src/*.vto`. Everything above the second `---` is
front matter:

| Key           | Purpose                                                                |
| ------------- | ---------------------------------------------------------------------- |
| `title`       | `<title>` and the OG/Twitter title                                     |
| `description` | Meta description and OG description                                    |
| `active`      | Which nav item is highlighted (`work`, `services`, `about`, `contact`) |
| `styles`      | Optional page-scoped CSS, injected into that page's `<head>`           |

**Nav, footer or copyright year** — edit `src/_data.yml` once; it applies to
every page. The same `nav` list renders both the header and the footer.

**Projects** — edit `src/_data/projects.js`, one object per project. A new entry
adds a row to `/work.html`, a card on the home page (first three only) and a
case study at `/work/<slug>.html`; nothing else needs touching.

Project media live in `src/public/shots` as WebP. Flat UI captures go out
lossless, which beats both PNG and lossy WebP and leaves type untouched:

```sh
ffmpeg -i shot.png -c:v libwebp -lossless 1 -compression_level 6 src/public/shots/shot.webp
```

Photographic shots are the exception: lossless has nothing to exploit in a
photograph, so those go out lossy instead:

```sh
ffmpeg -i shot.png -c:v libwebp -quality 92 src/public/shots/shot.webp
```

Every media entry carries a `ratio` of `"width/height"`, which the templates
turn into `width` and `height` attributes so nothing shifts while it loads. Each
project also has a `stage`: the colour its media are matted on, plus the frame
border and shadow. In the gallery, `raised: true` drops a figure 72 px so the
grid reads as a spread rather than a table.

**Styles** — `src/global.css`, organised top-down: tokens, base, layout
primitives, typography, then one block per part of the site.

> After changing `global.css` or `public/external/nocturea-mark.svg`, bump
> `assetVersion` in `src/_data.yml`. Both keep the same filename across changes
> and are cached heuristically by browsers, favicons for far longer. Without the
> bump, returning visitors keep the old file.

## Design system

|         |                                                           |
| ------- | --------------------------------------------------------- |
| Surface | `#09090a`, one step lighter at `#101012` for frames       |
| Rules   | `#1a1a1c`                                                 |
| Text    | `#eae7e2`, dimmed through `#a8a49d`, `#88857f`, `#57544f` |
| Accent  | `#ff6a3d` (hover `#ff8b66`), the only colour on the site  |
| Type    | Archivo, 200 for text and 900 for display                 |

Everything is a rule, a gap or a letter-spacing. No shadows, no radii, no second
accent.

The hover preview on `/work.html` is CSS-only: `:has()` on the row index reveals
the matching panel, and the panels are stacked in a single grid cell so the
column never resizes.

## URLs

`prettyUrls` is deliberately off in `_config.ts`, so pages build to
`/about.html`, not `/about/`. Case studies are the one nested path,
`/work/<slug>.html`.

## Deploying

Production is nginx on Fedora serving the static files from `/srv/nocturea`; no
Deno process runs on the server.

```sh
deno task build
rsync -avz --delete --rsync-path="sudo rsync" _site/ <server>:/srv/nocturea/
ssh <server> 'sudo chcon -R -t httpd_sys_content_t /srv/nocturea'
```

The `chcon` is not optional: SELinux is enforcing, and files arriving without
the `httpd_sys_content_t` label make nginx return 404 on every page.

`nginx.conf.example` is a proposal: it adds caching and gzip that the live vhost
does not have, and assumes a `/var/www` root. Reconcile the two before copying
it over a running config.

## Support

If you like the studio's work, you can support it at
[ko-fi.com/simon256px](https://ko-fi.com/simon256px).

## License

The site's code is released under the [MIT License](LICENSE).
