# yorkeyeassociates

> **Unofficial copy — not York Eye Associates' website.** This repository is a development copy of
> a redesign, published for build review. It is not operated by, affiliated with, or endorsed by
> York Eye Associates. The practice's real site is https://www.yorkeyeassociates.com/.

A **total redesign** of **yorkeyeassociates.com** (York Eye Associates, P.C., an optometry practice in
Gainesville, Texas) — 237 pages — built by the `site-reforge` pipeline and hardened for
public hosting. The design system is called **"Large Print"**.

**Preview: https://chris-sgen.github.io/yorkeyeassociates/**

This is a pure static site with no build step, no dependencies and no backend. Serve the
folder, or use the preview link above.

> **Some of this copy's pictures, and all of its video loops, are AI-generated illustrations made
> for this redesign. They are not photographs of the practice.**

Two terms used below. The **handoff build** is the private build of this redesign that this copy
was made from, together with its documentation and audit files; it is not published ("handoff" is
the pipeline's name for its packaged output, and says nothing about a recipient). This **preview**
is that build with the changes listed under *Hardening*.

## What this is, and what it is not

This is **not** a pixel-faithful clone. It is a redesign:

| | |
| --- | --- |
| **Content, branding, contact details, URLs** | All from `yorkeyeassociates.com`. No page copy was written: every sentence of body text comes from the practice's live site, much of it the eye-health library copy the practice republished. The redesign adds only interface text: menu-group labels, section labels such as "In this section" and "Office Hours", button labels such as "Get directions" and "Read more", the notices on the forms, the descriptions of the archive pages, and alt text for some pictures. Where a label touches a fact (the address, the hours, the phone number), the fact is the live site's own. |
| **Generated imagery** | **24 still pictures and 5 silent video loops were generated for this redesign** on fal.ai and Higgsfield (models in `PROVENANCE.md`), and 68 of the 239 pages show at least one of them. They show objects and light only (lenses, eyewear, optical instruments, drops of water, paper and abstract light), never a person, the practice's premises, staff or doctors, or a clinical result. Each one sits inside a white mat, which sets it apart from the practice's photographs (those run edge to edge). Every generated picture has empty alt text (74 placements), so screen readers skip it, and none carries a claim. They are illustrations, **not the practice's own photographs**. |
| **Other imagery** | Every other picture was published on the practice's site (414 of them). 149 come from the practice's own upload folder: its photographs of the team, the building, the exam rooms, the optical and the doctors, product and device pictures, and a few stock photographs its posts use. 150 come from its web platform's shared catalogues (frame-brand, contact-lens and insurance logos, instrument pictures). The other 115 come from the platform's other shared folders: 101 from its article library (stock photographs and diagrams in the eye-health articles), 12 from its clip-art (brand logos, product pictures) and two from other sites' folders on the platform. The header's eye mark, the favicon and the touch icon were cut by the build from the practice's own one-line eye drawing. The catalogue and library pictures are not the practice's own. |
| **Navigation model and page anatomy** | Modelled on `eyetrendsclearlake.com`: a top bar, a Services menu grouped into care clusters, an Eyewear menu with featured categories, and a persistent appointment call to action. **No content or asset came from that site.** |
| **Visual design** | New. It is the "Large Print" system: a white ground with warm stone bands and the periwinkle of the live site's own section bands, flat ruled rows instead of cards, and the practice's one-line eye drawing run as a rule between sections. The type is Overpass with Inclusive Sans, set large, with a three-step text-size control on every page. |
| **Platform** | Removed: no WordPress, no EyeCarePro theme, no Beaver Builder, no Gravity Forms, no trackers. |

Because this is a redesign rather than a clone, matching the old design pixel for pixel is not
a goal.

## Verification

These figures were measured by the pipeline, not judged by eye, and filled in from the
measurement files. The first six rows come from the handoff build's audit. The last four were
re-read from this tree. The browser figures (rendering, video loops, forms, frames) were measured at the public URL (https://chris-sgen.github.io/yorkeyeassociates/). The tree has 239 pages: the 237 rebuilt ones plus `/404.html` and `/search/`, which the build makes itself.

| Check | Result |
| --- | --- |
| Content recall vs the live source, every rebuilt page | **99.40% mean; 206 of 237 pages at 100%; the others are explained in the handoff documentation (5 below the floor, where a passage was deliberately not carried); floor 95%** |
| Pages mapped | **237 / 242** at their original URLs; the 5 not rebuilt are explained below |
| Claims traced to the live site (`sr-fabrication`) | **SOURCED: 692 claims across 239 files, 0 untraced** |
| Platform decontamination | **CLEAN: 0 findings across 249 files** |
| Responsive + a11y sweep, 390 / 768 / 1024 / 1440 px | **0 blocker · 0 major** across 956 page × width sweeps. Also 22 minor (20 × “Text clipped by overflow:hidden”, 2 × “Image far larger than its display size”: 12 of the clipped texts are screen-reader-only (headings, a link label, a table head), one pixel high by design; 8 other clipped texts) and 0 nit. |
| Gate (`sr-gate.mjs`) | 23 PASS · 6 FAIL · 0 UNPROVEN. The verdict is NOT-READY, and the private build was packaged with a recorded override. Each red is explained below |
| Preview hardening, re-read from the shipped bytes | **239 / 239 pages** |
| Reference audit: every local `href` / `src` / `srcset` / `url()` / video-loop source resolved | **40,064 checked; 0 escape the site root, 0 missing, and 0 root-relative outside `404.html`, whose 146 references are absolute under `/yorkeyeassociates/` by design (GitHub Pages serves it at any depth)** |
| Rendering at this preview's subpath, every page except `404.html` (tested separately, at depth) at 1440 and 390 px | **476 page loads (238 pages × 1440 / 390 px): 0 requests ≥ 400, 0 broken images, 0 console errors, 0 same-site requests outside `/yorkeyeassociates/`, 0 horizontal overflow at 390** |
| Video loops at this preview's subpath | **all 5 loops played: 2 on the home page, 1 on `/advanced-services/`, 1 on `/contact-lenses/` and 1 on `/eye-care-services/dry-eye-optometrist/`; each loaded from inside `/yorkeyeassociates/`, its playback time advanced, and it had no controls** |

**Why the red gate checks are red:**

- **C04, C06 — conditions of the source site.** Six of its pages have almost no text, and
  12 of its archive pages have an empty `<title>`. The rebuild does not invent content
  for them: the pages keep their URLs, and an untitled page takes its title from its own heading.
- **C16, C17, C19 — deliberately not carried**, by change-control decision: 5 source
  URLs are not rebuilt, and a few passages of other pages are left out. The handoff
  documentation lists each one with its reason.
- **C22, pixel parity.** This check measures fidelity to the old design, which a redesign sets out
  to *replace*. The drift it reports is the redesign itself.

## Hardening applied to this public copy

`PROVENANCE.json` counts every one of these changes.

1. **`noindex, nofollow, noarchive, nosnippet, noimageindex` on every page.** This is the only control here that search engines honour. It
   is a request; the major ones follow it. A `robots.txt` with `Disallow: /` is also shipped,
   but it has **no effect** here: crawlers read `robots.txt` only at the host root
   (`chris-sgen.github.io/robots.txt`, which this project site cannot provide), not under
   `/yorkeyeassociates/`. GitHub Pages cannot send an `X-Robots-Tag` header either. That leaves
   the non-HTML files with no index control of their own, such as the images, the video loops,
   `search-index.json` and the three scanned pages linked from the privacy page (the practice's
   two-page privacy notice and its blank acknowledgement form). `noimageindex` asks search
   engines not to index the pictures a page shows, and on this site those files are linked only
   from pages marked `nofollow`. The repository itself is public, and github.com shows its files
   like any public repository's.
2. `og:url` points at this preview, `og:description` / `twitter:description` carry the
   disclosure, and `og:site_name` reads "Unofficial preview (not York Eye Associates)". `og:image` and `twitter:image` are removed.
   `noindex` does not stop link-unfurl crawlers, so without this a pasted link would render a card
   indistinguishable from the practice's own. What a card shows depends on the app:
   - Apps that take a link's description or site name from the Open Graph or Twitter tags show
     the disclosure.
   - Apps that show only a title and an icon (iMessage, for one) show the practice's page title
     and icon with the `chris-sgen.github.io` address, and nothing else tells the card apart.
   - Apps that pick a picture from the page itself when a page names none may show one of the
     page's pictures.
3. **JSON-LD removed.** It asserted the practice's identity, address, telephone and opening
   hours.
4. **All six practice forms made inert, with or without JavaScript** (the patient registration
   form, the dry eye questionnaire, the myopia quiz, and three result forms: the myopia quiz's,
   the dry eye questionnaire's and one for a children's vision assessment). Three safeguards are
   layered:
   - **A hidden, disabled submit button is placed first in each form**, followed by a hidden,
     disabled text field. A form whose default button is disabled is not submitted when Enter is
     pressed in it, with or without JavaScript (the HTML standard's implicit-submission rule;
     tested here in Chrome). A browser that skips a disabled button when it looks for the default
     one decides by counting the form's single-line fields, and submits only when there is exactly
     one; the hidden field makes it two. That matters here because three of these forms show a
     single text or number field, and a form with one such field and no submit button submits on
     Enter.
   - Each **visible submit button is replaced by a disabled `type="button"`**. One result form
     has no button of its own, and another keeps its button hidden (the live form shows it only
     at one particular score); both are the same in the handoff build. The handoff build marks
     each button for its script to enable on load; the marker is removed here, so the button
     stays disabled with scripting on.
   - Each form gets `action=""`, `onsubmit="return false"`, `method="dialog"` and
     `data-preview="inert"`. A form whose method is `dialog` and that is not inside a `<dialog>`
     does nothing when it is submitted, in a browser that knows the `dialog` element.

   Around the forms:
   - **The two questionnaires are not scored here, and the result pages show no result.** In the
     handoff build a questionnaire is scored in the browser and opens its result page with the
     score in the page address; nothing is sent in either build. Here the address of the result
     page is taken off the questionnaire, the result pages no longer read a score from their own
     address, and the parts of a result page that depend on a score stay hidden.
   - A visible notice at the top of each form says that it is disabled and gives the practice's
     phone number. A line at the end of the form says it too, where someone who filled in a long
     form ends up; the site script can no longer write its own sentence there.

   The patient registration form collects health information, and on a public URL nobody should
   believe they submitted it. **Site search still works**: its 252 forms send the query only to
   this site's own `/search/` page, as part of that page's address.
5. `<meta name="referrer" content="no-referrer">`, so outbound clicks don't reveal this URL to
   third parties. The one embedded YouTube video gets `referrerpolicy="strict-origin"` on its
   frame, because the player refuses to play when it is sent no origin at all. Under that policy
   the frame is sent only this site's bare origin (`https://chris-sgen.github.io`), never the page
   address.
6. **No on-page disclosure banner**, by the publisher's standing rule since 2026-09-24. The
   disclosure is carried by `og:description` / `twitter:description` and `og:site_name` (in apps
   that show them; see 2) and by this README. On the pages themselves there are only two kinds of
   note: each practice form says that it is disabled, and the two pages whose own text speaks
   about "this website" (`/disclaimer/` and `/website-accessibility-policy/`) say that the text is the live site's and describes the live
   site.
7. `sitemap.xml` and `llms.txt` are not shipped, because both advertise the practice's real
   URLs and invite crawlers. The Netlify-only `_headers` / `_redirects` are not shipped either,
   since GitHub Pages ignores them.
8. **The map embed uses no API key.** The two map pages use Google's keyless embed of the
   practice's name and address. No API key is in this tree or in the handoff build.
9. `<link rel="canonical">` is **kept** pointing at the practice's real page. That is correct for a
   duplicate, and deliberately different from `og:url`. The two pages the build makes itself
   (`/404.html` and `/search/`) have no live counterpart, so their canonicals name addresses the live site does
   not have.
10. **Files cleaned or left out.** One SVG picture carried an editor-private data block that is not part of the drawing. It is taken out here, and the picture itself is byte-identical. `PROVENANCE.json` names the file. 17 files of the handoff build that no page, stylesheet, script or data file names are not shipped: 16 picture files from the live site that no page uses and one build record.

## Known limits

- **The six practice forms do not submit, the questionnaires are not scored, and the result pages
  show no result.** This is deliberate (see 4 above). In the handoff build the forms are complete
  but unwired, and the questionnaires are scored in the browser.
- **The words on the pages are the live site's, and some of them speak about the live site.** The
  two pages named in 6 carry a note saying so. Elsewhere the practice's words ("our website",
  "submit this form") are carried as written; above each practice form, the notice says that
  nothing is sent whatever the form's own text says.
- **The generated pictures and loops are placeholders, not the practice's photographs.** They are
  the redesign's decorative still lifes, each set inside a white mat to tell it apart from the
  practice's photographs. No caption on the pages labels them. The practice's own photographs are
  used wherever one could be downloaded (some were refused, below), and the stock pictures the
  live articles used stay where they were. Each generated picture can be replaced by a real
  photograph of the same subject.
- **The video loops have no pause control.** This is deliberate in this design: the loops have no
  pause or play button and ignore clicks, taps and keys. They are silent and play only while on
  screen. When the device asks for reduced motion or data saving they do not play at all, and the
  still picture shows instead. WCAG 2.2.2 (Pause, Stop, Hide) asks for a way to pause moving content
  that starts by itself and lasts more than five seconds; this design does not provide one.
- **The text-size control remembers its setting in the browser** (one `localStorage` value,
  `yea-text`, on the `chris-sgen.github.io` origin). Nothing is sent anywhere.
- **Three pages load a third-party frame** when viewed: www.youtube-nocookie.com on `/eyeglasses/neurolens/`; maps.google.com on `/hours-location/`, `/location/york-eye-associates-pc/`. Measured in a browser, with each frame's own requests included (each page was then left, so that what a frame sends on the way out is counted too), viewing the 2 map pages contacts `fonts.googleapis.com`, `fonts.gstatic.com`, `maps.google.com`, `maps.googleapis.com`, `maps.gstatic.com`, `places.googleapis.com` and `www.google.com`, and viewing the video page contacts `fonts.gstatic.com`, `i.ytimg.com`, `jnn-pa.googleapis.com`, `www.google.com`, `www.gstatic.com`, `www.youtube-nocookie.com` and `yt3.ggpht.com` (18 of the requests were POSTs, over the 6 measured loads). The map frames are sent no Referer; the video frame is sent the bare origin (see *Hardening*, 5). A frame can still read the origin of the page that embeds it. No other page contacts any third party: fonts, images, scripts and styles are all self-hosted. Outbound links (the practice's social pages, its booking and payment services, Google Maps directions) are ordinary links, and `no-referrer` keeps this URL out of those requests.
- **56 pictures of the live site are not here**: 55 were refused (HTTP 403), 54 by the live site's image CDN (`da4e1j5r7gw87.cloudfront.net`) and 1 by its web platform's own server (`www.eyecarepro.net`), and 1 is no longer there (HTTP 404). The practice's logo file is among them, so the header sets the practice's name in type beside its eye mark. The pipeline does not retry past a refusal. Where the live site placed one, the rebuild shows no picture, or a generated still life in a mat. The originals are not available to this build.
- **Where two of the live site's pages differ on a detail, the rebuild keeps each as written.**
  Choosing between them is not the redesign's to do; the handoff `CHANGE-LOG.md` lists them.
  33 library articles that the live site itself marks `noindex, nofollow` keep that directive in the handoff build; here every page is `noindex` anyway.
- **The search index is the handoff build's own file.** It was made from the text extracted from
  the live pages, so a handful of its words are not on the page they find (a label of the live
  form plugin, for example).
- **Tested in Chrome only.** The checks above ran in headless Chrome; Firefox and Safari were not run.
- **Commit metadata is public**: the author's name and e-mail address, and the commit times.

## Licence / ownership

This repository is an unaffiliated development artifact and asserts no rights over any of its
content.
- The practice's own writing, its own photographs and the York Eye Associates name and logo
  belong to the practice.
- The practice's site also republished third-party material, and this copy carries it as found:
  the eye-health library articles and their stock photographs and diagrams, a few stock
  photographs in the practice's own posts, and the frame-brand, contact-lens, insurance and
  instrument pictures from its web platform's shared catalogues. The owners' rights remain
  theirs; the trademarks among them belong to their owners.
- The generated pictures and loops were made for this redesign with the models named in
  `PROVENANCE.md`, under those services' terms. None shows a person, and none carries a brand mark.
- The typefaces are Overpass (SIL Open Font License 1.1) and Inclusive Sans (SIL Open Font License 1.1), self-hosted.
