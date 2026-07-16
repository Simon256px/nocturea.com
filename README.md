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
  _data.yml         Nav, footer links, copyright, OG image — shared by every page
  _includes/
    layouts/
      base.vto      The page shell: head, nav, footer
  *.vto             One file per page: front matter + content only
  global.css        All shared styles
  public/           Images, fonts, OG image (copied as-is)
_site/              Build output. Generated — never edit, never commit.
```

## Editing

**Content of a page** — edit the matching `src/*.vto`. Everything above the
second `---` is front matter:

| Key | Purpose |
| --- | --- |
| `title` | `<title>` and the OG/Twitter title |
| `description` | Meta description and OG description |
| `navSub` | The `// LABEL` under the logo in the nav |
| `active` | Which nav item is highlighted (`home`, `about`, `contact`) |
| `styles` | Optional page-scoped CSS, injected into that page's `<head>` |
| `wrap` | Set `false` to skip the `<main><div class="noc-wrap">` wrapper (404 only) |

**Nav, footer, or copyright year** — edit `src/_data.yml` once. It applies to
every page. This is the whole point of the Lume migration: these used to be
copy-pasted into all 12 files.

**Shared styles** — `src/global.css`.

## URLs

`prettyUrls` is deliberately **off** in `_config.ts`, so pages build to
`/about.html`, not `/about/`. This preserves the live site's existing URLs —
turning it on would break every inbound link and lose the SEO on them.

## Deploying

Production is nginx serving static files. No Deno process runs on the server.

```sh
deno task build
rsync -avz --delete _site/ user@server:/var/www/nocturea.com/
```

nginx config (caching, gzip, 404 handling) lives in `nginx.conf.example`.
