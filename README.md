# yorkeyeassociates

> **Unofficial copy — not York Eye Associates' website.** This repository is a development copy of
> a redesign, published for build review. It is not operated by, affiliated with, or endorsed by
> York Eye Associates. The practice's real site is https://www.yorkeyeassociates.com/.

A **total redesign** of **yorkeyeassociates.com** (York Eye Associates, P.C., an optometry practice in
Gainesville, Texas): 237 pages, built by the `site-reforge` pipeline and hardened for
public hosting. This is the second design published here. It replaces the earlier "Large Print"
preview, which remains in this repository's history.

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

|  |  |
| --- | --- |
| **Content, contact details, URLs** | All from `yorkeyeassociates.com`. No page copy was written: every sentence of body text comes from the practice's live site (much of it the eye-health library copy the practice republished). The redesign adds only interface text: menu-group labels, section labels such as "In this section" and "On this page", button labels such as "Read more", the messages of the search page, the notices on the forms, and descriptions (alt text) of the practice's own photographs where they lead a page. Review dates are printed as month and year where the live site prints "2 weeks ago". 30 short texts of the live site are left out or corrected, each with a recorded reason (relative review dates, text of the form platform, one spelling, the addresses of a different practice that one article carries, and the home page's working title where the live sitemap page prints it). In the page heads, the home page's link-card title is printed without that working title. |
| **Generated imagery** | **26 still pictures and 4 silent video loops were generated for this redesign** on fal.ai and Higgsfield (models in `PROVENANCE.md`); 151 of the 239 pages show at least one. They show objects and light only (eyewear, lenses, drops of water, stationery), never a person, the practice's premises, its staff or doctors, a clinical result or a named product. No page whose address names a brand, a product or a named programme (26 pages, found by the 17 words of the build's list) is led by a generated picture, and no card that leads to such a page shows one; on 3 of those pages (`/eye-care-services/eye-disease-management/co-management-cataract-surgery/panoptix-iol-alcon/`, `/finding-relief-with-avulux-lenses-for-migraine-and-light-sensitivity/`, `/tag/neurolens/`) one appears on the card of another article. The home page's "Designer Eyewear" band shows a generated loop of a pair of frames above the frame makers' logos; the frame is not a product of any of them. Every generated picture has empty alt text (261 placements), so screen readers skip it, and every generated file is served from `assets/generated/`, kept separate from the live site's pictures in `assets/img/`. Nothing on the pages themselves labels them. |
| **Other imagery** | Every other picture was published on the practice's site (410 source pictures are used): the practice's own photographs, the stock photographs and diagrams of its articles, and the frame-brand, contact-lens and insurance logos of its web platform's shared catalogues. |
| **Navigation model and page anatomy** | Modelled on `eyetrendsclearlake.com`: a top bar, a Services menu grouped into care clusters, an Eyewear menu with featured categories, a "Visit Us" band before the footer and a persistent appointment call to action. **No content or asset came from that site.** |
| **Visual design** | New. The navy and periwinkle are the live site's own, measured in a browser; an amber is added for the path to an appointment. Type is Figtree with Instrument Serif italic for single words. Pictures sit in lens, arch and pill shapes; cards lift on hover; on phones cards become rows and long pages fold into chapters. |
| **Platform** | Removed: no WordPress, no EyeCarePro theme, no Beaver Builder, no Gravity Forms, no trackers. |

Because this is a redesign rather than a clone, matching the old design pixel for pixel is not
a goal.

## Verification

These figures were measured by the pipeline, not judged by eye, and filled in from the
measurement files. The first eight rows come from the handoff build's audit. The others were
re-read from this tree. The browser figures (rendering, video loops, forms) were measured on a local server that serves this tree under `/yorkeyeassociates/` the way GitHub Pages serves a project site; it had not yet been re-measured at the public URL when this file was written. The tree has 239 pages: the 237 rebuilt ones plus `/404.html` and `/search/`, which the build makes itself. Tested in Chrome only.

| Check | Result |
| --- | --- |
| Every text unit of the live pages looked for on its rebuilt page (sentences, headings, list entries, labels) | **9,692 checked: 9,662 found, 30 left out or corrected with a recorded reason, 0 missing; 0 sentences of eight or more words in the build that are not the live site's** |
| Content recall vs the live source (`sr-parity`) | **99.87% mean** over 237 pages; threshold 95%; 1 page below it (`/children-vision-assessment-score/` at 94.9%, explained under C17) |
| Pages mapped | **237 / 242** at their original URLs; the 5 not rebuilt are explained below |
| Claims traced to the live site (`sr-fabrication`) | 1,135 claims checked, 2 flagged; both are sentences of the live site (explained below, C20) |
| Platform decontamination | **CLEAN: 0 findings across 246 files** |
| Responsive sweep, 390 / 768 / 1024 / 1440 px | **0 blocker · 0 major** across 948 page × width sweeps. Also 663 minor (621 × "Text clipped by overflow:hidden", 42 × "Image far larger than its display size") and 8 nit. |
| Forms of the handoff build against the live forms (6 forms) | 63 checks, 4,030 assertions, 0 failed. (In this preview the forms are disabled; see Hardening.) |
| Gate (`sr-gate.mjs`) | 21 PASS · 8 FAIL · 0 UNPROVEN. The verdict is NOT-READY, and the private build was packaged with a recorded override. Each red is explained below |
| Preview hardening, re-read from the shipped bytes | **239 / 239 pages**; 6 practice forms inert; 263 search forms that send a GET to `/search/` (one query was run in the browser); 238 map frames, each sent no Referer |
| Reference audit: every local `href` / `src` / `srcset` / `url()` / video-loop source / search-form address | **44,747 local references resolved when this tree was built: 0 name no file, 0 leave the site root**; read again from the shipped pages: 0 root-relative outside `404.html`, whose 167 references are absolute by design (GitHub Pages serves it at any depth) |
| Binary files read for metadata | 8 woff2, 8 mp4, 1,533 webp, 1 svg (with 1 PNG picture embedded in it): no EXIF, XMP, IPTC or C2PA; the WebP files carry only the encoder's stock sRGB colour profile |
| Rendering under `/yorkeyeassociates/`, every page except `404.html` at 1440 and 390 px | **476 page loads: 0 failed requests on this site, 0 requests on this host outside `/yorkeyeassociates/`, 0 script errors, 0 broken pictures, 0 sideways scroll at 390**; `404.html` loaded at depth with its stylesheet and pictures |
| Video loops | **4 loops played** (`/eye-care-services/`, `/eyeglasses/eyeglass-basics/lens-options-for-eyeglasses/`, `/eyeglasses/sunglasses/prescription-sunglasses/`, `/`), each from inside `/yorkeyeassociates/`, muted, without controls |
| Practice forms, each tried with scripts on and off | **6 forms. As shipped (12 trials): Enter pressed in a field of every form and the form's button clicked where one is shown (8 trials) sent nothing and went nowhere.** Each safeguard on its own: with only `method="dialog"` / `action=""` / `onsubmit` left and a live submit button added (12 trials), and with only the hidden disabled button and field left and a real address put back (12 trials), nothing was sent. With all three taken off (12 control trials) every form was seen to submit, so the trials can see a submission. Each result page opened with a score in its address showed no result (6 trials) |

**Why the red gate checks are red:**

- **C04 Content captured for every page** (5 page(s) with under 50 chars of body text: /faq, /promotions, /tag/mm_treatments, /tag/scl_keratoconus…). Five pages of the live site have almost no text: two with only a heading (`/faq/`, `/promotions/`) and three tag listings with one entry each. The rebuild carries what they have.
- **C06 SEO inventory captured** (12 source page(s) had no title). Twelve pages of the live site have no title. The rebuild gives each a title made from its heading.
- **C07 Image inventory completed with real dimensions** (2 same-origin image(s) never downloaded). Two background pictures named in the live stylesheets could not be downloaded: one is on the live site's image host, one on its web platform's own server, and both refused the request.
- **C16 Every source page exists in the rebuild** (5 missing: /template/footer, /template/header, /template/header-2, /template/inner-header…). The five addresses that are "missing" are the live platform's own header and footer fragments (`/template/...`). They are not pages.
- **C17 Content survived the rebuild** (1 content-loss finding(s)). The parity report flags two pages; both are deliberate. One article ends with the addresses of a different practice of the same name, in another state; that block is not carried. One result page titles its form with the page heading, word for word; the rebuild prints those words once.
- **C19 Forms and contact details are intact** (1 finding(s): Phone number missing from rebuild). The phone number reported missing is that other practice's.
- **C20 No invented content** (0 blocker + 2 major unsourced claims). Two sentences of the live site that contain "best" or "leading" are the last words of their page. The tracer reads fifty characters past such a word, into the next section of the rebuilt page, and does not find that run on the live site. The sentence check (above) finds no sentence in the build that is not the live site's.
- **C22 Design matches the source pixel-for-pixel at every breakpoint** (worst drift 98.304% on sitemap.390.png). This is a redesign. The check asks whether the rebuild is pixel-identical to the live site; it is not meant to be.

## Hardening applied to this public copy

`PROVENANCE.json` counts every one of these changes.

1. **`noindex, nofollow, noarchive, nosnippet, noimageindex` on every page.** This is the only control here that search engines honour. It
   is a request; the major ones follow it. A `robots.txt` with `Disallow: /` is also shipped,
   but it has **no effect** here: crawlers read `robots.txt` only at the host root
   (`chris-sgen.github.io/robots.txt`, which this project site cannot provide), not under
   `/yorkeyeassociates/`. GitHub Pages cannot send an `X-Robots-Tag` header either. That leaves
   the non-HTML files (the pictures, the video loops, the search index) with no index control of
   their own; `noimageindex` asks search engines not to index the pictures a page shows, and those
   files are linked only from pages marked `nofollow`. The repository itself is public, and
   github.com shows its files like any public repository's.
2. `og:url` points at this preview, `og:description` / `twitter:description` carry the
   disclosure, and `og:site_name` reads "Unofficial preview (not York Eye Associates)". `og:image` and `twitter:image` are removed (304 tags).
   `noindex` does not stop link-unfurl crawlers, so without this a pasted link would render a card
   indistinguishable from the practice's own. What a card shows depends on the app: apps that take a
   link's description or site name from these tags show the disclosure; apps that show only a title
   and an icon show the practice's page title with the `chris-sgen.github.io` address, and nothing
   else tells the card apart; apps that pick a picture from the page itself may show one of its pictures.
3. **JSON-LD removed** (1,698 blocks). It asserted the practice's identity, address, telephone and opening hours.
4. **All 6 practice forms made inert, with or without JavaScript** (the patient registration
   form, the dry eye questionnaire, the myopia quiz, and three result forms). Three safeguards are layered:
   - **A hidden, disabled submit button is placed first in each form**, followed by a hidden,
     disabled text field. A form whose default button is disabled is not submitted when Enter is
     pressed in it; a browser that skips a disabled button decides by counting the form's
     single-line fields; where a form has such a field of its own, the hidden field makes them two.
   - Each **submit button is replaced by a disabled `type="button"`** (6 buttons).
   - Each form gets `action=""`, `onsubmit="return false"`, `method="dialog"` and
     `data-preview="inert"`, and the hooks by which the handoff build's script finds a form are
     removed, so that script does not touch these forms at all.

   Around the forms: **the two questionnaires are not scored here, and the result pages show no
   result** (the 6 parts of a result page that depend on a score stay hidden). A visible notice
   above each form says that it is disabled and gives the practice's phone number; a line at the end
   of the form says it again. The patient registration form asks for health information, and on a
   public URL nobody should believe they submitted it. **Site search still works**: its 263 forms
   send the query only to this site's own `/search/` page, as part of that page's address.
5. `<meta name="referrer" content="no-referrer">`, so outbound clicks don't reveal this URL to
   third parties. The one embedded video (`/eyeglasses/neurolens/`; nothing is requested from the video host until play is pressed) gets
   `referrerpolicy="strict-origin"` on its frame, because the player refuses to play when it is
   sent no origin at all; the frame is then sent only this site's bare origin, never the page address.
   The 238 map frames carry `referrerpolicy="no-referrer"` themselves, because an attribute on a frame
   overrules the page's tag: they are sent no Referer.
6. **No on-page disclosure banner**, by the publisher's standing rule since 2026-09-24. The
   disclosure is carried by the link-preview tags (in apps that show them; see 2) and by this
   README. On the pages themselves there are only two kinds of note: each practice form says that
   it is disabled, and the 2 pages whose own text speaks about "this website"
   (`/disclaimer/` and `/website-accessibility-policy/`) say that the text is the live site's and describes the live site.
7. `sitemap.xml` and `llms.txt` are not shipped, because both advertise the practice's real
   URLs and invite crawlers. The `_redirects` file is not shipped either, since GitHub Pages ignores it.
8. **The map embed uses no API key.** It is Google's keyless embed of the practice's name and address.
9. `<link rel="canonical">` is **kept** pointing at the practice's real page. That is correct for a
   duplicate, and deliberately different from `og:url`. The two pages the build makes itself
   (`/404.html` and `/search/`) have no live counterpart, so their canonicals name addresses the
   live site does not have. 9 page descriptions that promised an online form, a questionnaire, a quiz or its result (`/children-vision-assessment-score/`, `/contact-us/appointment-request-form/`, `/contact-us/contact-form/`, `/contact-us/`, `/contact-us/patient-registration-form/`, `/deq-5-questionnaire-results/`, `/eye-care-services/dry-eye-optometrist/speed-questionnaire/`, `/eye-care-services/myopia-management-optometrist/myopia-management-quiz/`, `/myopia-management-quiz-results/`) are replaced by the disclosure. So are the descriptions of 5 pages (`/eyeglasses/sunglasses/bajio-california-cool-shades-made-for-surf-sport-and-sun/`, `/finding-relief-with-avulux-lenses-for-migraine-and-light-sensitivity/`, `/tag/avulux/`, `/tag/bajio-sunglasses/`, `/tag/sunglasses/`) that the live site took from a different practice of the same name, in Pennsylvania: the handoff build keeps them in the page head as the live site declares them and keeps them out of its search results; this copy does not repeat them.
10. **Files cleaned or left out.** 1 SVG picture carried an editor's private data block that is not part of the drawing; it is taken out here (451,178 → 72,999 bytes). 141 files of the handoff build that no page, stylesheet or script of this copy names are not shipped (mostly the link-preview and structured-data renditions of pictures, which lost their only use in 2 and 3).

## Known limits

- **The 6 practice forms do not submit, the questionnaires are not scored, and the result pages
  show no result.** This is deliberate (see 4 above). In the handoff build the forms are complete
  but not connected to a receiver, and the questionnaires are scored in the browser.
- **The words on the pages are the live site's, and some of them speak about the live site.** The
  pages named in 6 carry a note saying so. Elsewhere the practice's words ("our website",
  "submit this form") are carried as written.
- **The generated pictures and loops are illustrations, not the practice's photographs.** No
  caption or frame on the pages tells them apart; `PROVENANCE.md` lists each one. The practice's
  own photographs are used wherever one could be downloaded, and the stock pictures the live
  articles used stay where they were.
- **The video loops have no pause control.** This is deliberate in this design: the loops have no
  pause or play button and ignore clicks, taps and keys. They are silent and play only while on
  screen. When the device asks for reduced motion or data saving they do not play at all, and the
  still picture shows instead. WCAG 2.2.2 (Pause, Stop, Hide) asks for a way to pause moving content
  that starts by itself and lasts more than five seconds; this design does not provide one.
- **238 of the 239 pages carry a Google Maps frame** (in the "Visit Us" band before the
  footer, and on the two location pages). It loads when it nears the screen, and the browser then
  talks to Google's servers. The frame is sent no Referer (see 5), so Google is not told which page
  it sits on; the frame's own requests were not measured for this file. The video page contacts
  `www.youtube-nocookie.com` only after play is pressed.
- **The booking, payment and patient-form buttons are live.** "Book an Appointment", "Patient
  Payment Portal" and "New Patient Forms" are the live site's own links to the practice's real
  booking page, payment portal and patient portal, on those services' own sites. They work from
  this copy as they do from the practice's site, and what a visitor does there reaches the
  practice. The phone links dial the practice.
- **56 pictures of the live site are not here**: 55 were refused (HTTP 403) by the live site's
  image host or its platform's server, and 1 is no longer there (HTTP 404). The practice's logo
  file is among them, so the header sets the practice's name in type beside its eye mark. The
  pipeline does not retry past a refusal. Where the live site placed one, this copy shows no
  picture, or a generated still life where the picture only illustrated a topic.
- **4 documents the live pages link are not linked here**: the three scanned pages of the
  practice's privacy notice and one PDF sit on the same host. Their link text is on the page; the link is not.
- **83 of the rebuilt pages are `noindex` on the live site itself**; here every page is `noindex` anyway.
- **The search index is the handoff build's file with two changes.** The entries of the 6 practice-form pages keep only their titles (the handoff index also holds the text of the forms, including words of the live form platform and the result texts this copy hides), and the 3 summaries of other pages that promise an online form are blanked.
  A search for a word of a form's own text therefore does not find the form's page; its title does.
- **Tested in Chrome only.** The checks above ran in headless Chrome; Firefox and Safari were not run.
- **Commit metadata is public**: the author's name and e-mail address, and the commit times.

## Licence / ownership

This repository is an unaffiliated development artifact and asserts no rights over any of its
content.
- The practice's own writing, its own photographs and the York Eye Associates name and logo
  belong to the practice.
- The practice's site also republished third-party material, and this copy carries it as found:
  the eye-health library articles and their stock photographs and diagrams, a few stock
  photographs in the practice's own posts, and the frame-brand, contact-lens and insurance
  pictures from its web platform's shared catalogues. The owners' rights remain theirs; the
  trademarks among them belong to their owners.
- The generated pictures and loops were made for this redesign with the models named in
  `PROVENANCE.md`, under those services' terms. None shows a person, and none carries a brand mark.
- The typefaces are Figtree (SIL Open Font License 1.1) and Instrument Serif (SIL Open Font License 1.1), self-hosted.
