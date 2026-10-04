# PROVENANCE

This tree is a **redesign** of `https://www.yorkeyeassociates.com/` (the "Large Print" design), which
was then modified for public hosting. It is an unofficial copy: it is not operated by, affiliated
with or endorsed by York Eye Associates.

The **handoff build** named below is the private build of the redesign that this tree was made
from, with its documentation and audit files ("handoff" is the pipeline's name for its packaged
output, and says nothing about a recipient). It is not published. Because this tree was modified,
**it is not that build** and must not be cited as it. Machine-readable counts are in
`PROVENANCE.json`. Every deviation is listed below.

## Capture

| | |
| --- | --- |
| Content source | `https://www.yorkeyeassociates.com/`: 242 pages, found through the sitemap and a same-origin BFS crawl. robots.txt was honoured, no host refused a page, and the crawl was not truncated. |
| Structure source | `https://eyetrendsclearlake.com/`: **navigation model and page anatomy only**, crawled in full (43 pages). No content, image, asset or word from that site appears here. |
| Captured | 2026-10-01 (UTC) |
| Method | The `site-reforge` pipeline (crawl → extract → assets → capture → tokens → motion → plan → build → SEO → rebase), plus a zero-dependency Chrome DevTools Protocol bridge for the browser stages, image generation on fal.ai and Higgsfield, and ffmpeg for the video loops |
| Platform of origin | WordPress with the EyeCarePro theme, Beaver Builder and Gravity Forms. None of it is in this tree. |
| Design baseline | Computed style measured in a real browser at 390 / 768 / 1024 / 1440 px, not read from source CSS |

## What the redesign changed, and what it preserved

| | |
| --- | --- |
| **Preserved** | Every rebuilt page's text (99.40% mean; 206 of 237 pages at 100%; the others are explained in the handoff documentation (5 below the floor, where a passage was deliberately not carried); floor 95%). URLs are unchanged. Titles, meta descriptions and canonicals are the live pages' own, except where the live value was empty or did not fit its page; each exception is listed in the handoff `CHANGE-LOG.md` under *Head fields*. All six forms keep every field, label and option, and the contact details and hours are the live site's own. |
| **Written** | No page copy. All body text comes from the live site. The only new text is interface text: menu-group labels, section labels ("In this section", "Office Hours", "On this page"), button labels ("Get directions", "Read more"), the forms' notices, the descriptions of the archive pages, and alt text for some pictures. Any fact a label touches is from the live site. |
| **Added** | 16 sections and pages, by change-control decision: Site search page; Host 404 page; home: today’s hours, address and phone beside the name; home: eye care services list; home: insurance band; home: visit band; home: closing statement; Doctor band; Related care list; Booking band before the footer; Questionnaire scored in the browser; Text size control; Phone action bar; Get directions link; Generated still lifes and video loops; Head actions. |
| **Removed** | The 1,712 change-control rows are 846 PRESERVE, 844 IMPROVE, 6 REMOVE, 16 ADD. The REMOVE rows are the 5 source URLs that are not rebuilt and one section of another page; a few more passages are left out by the build's own overrides. Each is listed with its reason in the handoff documentation. The platform's plumbing is not here: the EyeCarePro / WordPress runtimes, the trackers, the "Powered by" credit in the footer and the platform's login link. The practice's own Disclaimer page still names the platform in its text (see deviation #7). |
| **Generated** | 24 still pictures and 5 silent video loops (see *Generated media* below), plus the header's eye mark, the favicon and the touch icon, which the build cut from the practice's own eye drawing. Every other picture was published on the practice's site. |

## Generated media

24 still pictures (each shipped as responsive WebP) and 5 silent loops (H.264 MP4 renditions; each loop's poster is its source still). Models: stills fal.ai · `fal-ai/nano-banana-pro` (16) and Higgsfield · `xai/grok-imagine-image-2.0` (8); loops fal.ai · `blackforestlabs/flux-3/first-last-frame-to-video` (2), Higgsfield · `kling-video/v2.5-turbo/pro/image-to-video` (2) and Higgsfield · `minimax/hailuo-2.3/standard/image-to-video` (1).

| Still | Model |
| --- | --- |
| `contact-case` | fal.ai · `fal-ai/nano-banana-pro` |
| `contact-dish` | fal.ai · `fal-ai/nano-banana-pro` |
| `dry-beads` | fal.ai · `fal-ai/nano-banana-pro` |
| `dry-dropper` | fal.ai · `fal-ai/nano-banana-pro` |
| `dry-water` | fal.ai · `fal-ai/nano-banana-pro` |
| `exam-lenses` | fal.ai · `fal-ai/nano-banana-pro` |
| `frames-case` | fal.ai · `fal-ai/nano-banana-pro` |
| `frames-light` | fal.ai · `fal-ai/nano-banana-pro` |
| `infant` | Higgsfield · `xai/grok-imagine-image-2.0` |
| `kids-frames` | fal.ai · `fal-ai/nano-banana-pro` |
| `lens-blanks` | fal.ai · `fal-ai/nano-banana-pro` |
| `lens-caustic` | fal.ai · `fal-ai/nano-banana-pro` |
| `lens-tints` | Higgsfield · `xai/grok-imagine-image-2.0` |
| `lid-care` | Higgsfield · `xai/grok-imagine-image-2.0` |
| `light-warm` | Higgsfield · `xai/grok-imagine-image-2.0` |
| `low-vision` | fal.ai · `fal-ai/nano-banana-pro` |
| `news` | Higgsfield · `xai/grok-imagine-image-2.0` |
| `prism` | fal.ai · `fal-ai/nano-banana-pro` |
| `reading` | fal.ai · `fal-ai/nano-banana-pro` |
| `ripples` | fal.ai · `fal-ai/nano-banana-pro` |
| `rose-lens` | fal.ai · `fal-ai/nano-banana-pro` |
| `specialty` | Higgsfield · `xai/grok-imagine-image-2.0` |
| `stationery` | Higgsfield · `xai/grok-imagine-image-2.0` |
| `sunglasses` | Higgsfield · `xai/grok-imagine-image-2.0` |

| Loop | Made from | Model | After generation |
| --- | --- | --- | --- |
| `beads` | the `dry-beads` still | fal.ai · `blackforestlabs/flux-3/first-last-frame-to-video` | the 8.04 s clip played forward then backward (16.04 s), compressed to 480 px and 720 px |
| `contact` | the `contact-dish` still | Higgsfield · `minimax/hailuo-2.3/standard/image-to-video` | the 5.88 s clip played forward then backward (11.71 s), compressed to 480 px and 720 px |
| `dry` | the `dry-water` still | Higgsfield · `kling-video/v2.5-turbo/pro/image-to-video` | the 5.04 s clip played forward then backward (10.04 s), compressed to 480 px and 720 px |
| `frames` | the `frames-light` still | fal.ai · `blackforestlabs/flux-3/first-last-frame-to-video` | the 8.04 s clip played forward then backward (16.04 s), compressed to 480 px and 720 px |
| `lens` | the `lens-caustic` still | Higgsfield · `kling-video/v2.5-turbo/pro/image-to-video` | the 5.04 s clip played forward then backward (10.04 s), compressed to 480 px and 720 px |

Nothing was retouched after generation; the loops were only trimmed, looped and compressed. Each file's full prompt and request id (and its seed, where the model returns one) are recorded in its JSON record in the handoff package (`assets/generated/<name>.json`), and `docs/GENERATED-MEDIA.md` there summarises them. Neither is published here.

## Deviations applied for public hosting

The "Rendered?" column says whether the change can affect what is painted on the page.

| # | Change | Pages | Rendered? |
| --- | --- | --- | --- |
| 1 | `robots` set to `noindex, nofollow, noarchive, nosnippet, noimageindex` (150 pages say `index, follow` in the handoff build). **This is the effective index control**; see #9. | 239 | No |
| 2 | `<meta name="referrer" content="no-referrer">` inserted | 239 | No |
| 3 | `<title>` **not** prefixed, by the publisher's standing rule. The link-card tags of #4 carry the disclosure instead. | — | — |
| 4 | Link-card tags: `og:url` repointed at this preview; `og:description` and `twitter:description` set to the disclosure (12 pages had neither tag, and get both); `og:site_name` set to "Unofficial preview (not York Eye Associates)"; `og:image` / `twitter:image` removed (237 and 237), so no image-bearing meta remains. The plain `<meta name="description">` of two pages, which promised a HIPAA-compliant form, is replaced with the disclosure too. | 239 | No |
| 5 | `schema.org` JSON-LD removed (239 blocks). It asserted the practice's identity, address, telephone and opening hours. | 239 | No |
| 6 | The six practice forms cannot submit. Each is marked `data-preview="inert"` and gets a hidden, disabled submit button and a hidden, disabled text field as its first elements (6 forms), so that Enter submits nothing; `action=""`, `onsubmit="return false"` and `method="dialog"`; and its visible **submit button becomes a disabled `type="button"`** (5 buttons; one result form has none of its own, and another keeps its button hidden). The handoff build's `data-js-enable` marker on those buttons (5 removed), which tells its script to enable them on load, is dropped. The other 252 forms are the site-search boxes; they are not changed and they work, sending the query to this site's own `/search/` page. | 6 | **Yes** (button shown disabled) |
| 7 | Notes on the pages. A visible notice at the top of each practice form — "This form is disabled in this preview", then the practice's phone number from the build's sourced config — in place of the handoff build's "Online submission is not available yet" lines (4 removed) and of the one line that said a questionnaire is scored in the browser. Each form's status line says that nothing is sent (6 forms), and is no longer the slot the site script writes into. The disabled button no longer reacts to the pointer. A note of the same kind heads the two pages whose own text speaks about "this website" (`/disclaimer/` and `/website-accessibility-policy/`): it says that the text is the live site's and describes the live site and its web platform, not this preview. | 8 | **Yes** |
| 8 | **No rendered disclosure banner** (the publisher's standing rule since 2026-09-24). The verifier fails any page that carries a banner element or its wording. The preview stylesheet, `styles/preview.css`, is linked on every page for the notes and the disabled buttons (#6, #7). | 239 | No |
| 9 | `robots.txt` replaced with `Disallow: /`. **It has no effect here**, because crawlers read only `https://chris-sgen.github.io/robots.txt` (the host root) and never a project subpath. GitHub Pages cannot send `X-Robots-Tag`, so non-HTML files (images, video, JSON, the markdown) have no index control. The file is kept only in case this tree is ever served from a domain root. | — | No |
| 10 | `sitemap.xml` and `llms.txt` not shipped, because both advertise the practice's real URLs. `_headers` and `_redirects` are Netlify-only and GitHub Pages ignores them. | — | No |
| 11 | `404.html` references made absolute under `/yorkeyeassociates/`. GitHub Pages answers a missing path at any depth with it, so it is the one page that cannot use relative references. | 1 | Yes |
| 12 | `.nojekyll` added | — | No |
| 13 | Frames: the two map frames get `referrerpolicy="no-referrer"`; the one YouTube frame gets `referrerpolicy="strict-origin"`, because under a page-wide `no-referrer` the player refuses to play. The map is Google's keyless embed in the handoff build already; no API key is in either build. | 3 | No |
| 14 | Line endings normalised to LF (0 pages needed it). The repository's `.gitattributes` would make git do this on commit anyway, and an HTML parser treats both forms the same. Doing it here means the bytes verified are the bytes published. | 0 | No |
| 15 | The questionnaires are not scored, and the result pages show no result. The address of its result page is taken off each questionnaire (2 removed). On the three result pages the score field is no longer the one the site script fills from the page address (3 detached), the rules that show a part of the page for a given score are removed (7; those parts stay hidden, as they are in the handoff build while there is no score), and the line "Your score appears here after …" is removed (2). | 5 | **Yes** |
| 16 | One SVG picture carried an editor-private data block that is not part of the drawing. It is taken out here, and the picture itself is byte-identical. `PROVENANCE.json` names the file. | — | No |
| 17 | 17 files of the handoff build that no page, stylesheet, script or data file names are not shipped: 16 picture files from the live site that no page uses and one build record. | — | No |

## Deliberately NOT changed

| | Why |
| --- | --- |
| `<link rel="canonical">` → the practice's own URL, on every page | Correct for a duplicate, and deliberately different from `og:url`, which drives unfurl cards. The two pages the build makes itself (`/404.html` and `/search/`) have no live counterpart, so their canonicals name addresses the live site does not have; like every page here they are `noindex`. |
| `<meta name="description">` | As in the handoff build (the live page's own, with the exceptions listed under *Preserved*), except the two of deviation #4. Link-unfurl cards read `og:description` / `twitter:description`, which carry the disclosure. |
| `<title>`, `og:title`, `twitter:title` | As in the handoff build (the live page's own, with the exceptions listed under *Preserved*); see deviation #3. |
| Details on which the live site's own pages differ | These are the practice's own words, so choosing between them is not the redesign's to do. The handoff `CHANGE-LOG.md` lists them. |
| `site.css`, `tokens.css`, `motion.css`, `scripts/site.js`, `search-index.json`, the video loops and every other non-HTML file, except the named preview additions and the SVG of #16 | Byte-identical to the handoff build; `preview-verify.mjs` compares them. The note and disabled-button styles live only in `preview.css`. The loops therefore behave exactly as in the handoff build, with no pause control (see the README's *Known limits*). |

## Not published here

These are **not** in this repository:

- The `audit/` tree: the raw capture of the practice's site, computed-style captures,
  screenshots and reports. It is bulky, it carries absolute build paths from the capture machine,
  and a preview has no use for a full raw copy of the practice's site.
- `src/`, the generator and tools, and `docs/`, the handoff documentation (including
  `GENERATED-MEDIA.md`, the summary of the generated media).
- `assets/source/`, the original downloads, and `assets/generated/`: the full-size generated
  originals, each with its JSON record (full prompt, request id, and seed where the model returns
  one).

All of them stay with the private build.

## Verification after modification

Every figure below was re-read by `src/tools/preview-verify.mjs` (in the handoff project) from this
tree and from a browser rendering of it. None was taken from the tool that wrote them.

- **Hardening**: 239/239 pages carry exactly one robots meta reading `noindex, nofollow, noarchive, nosnippet, noimageindex`. On every page:
  - the referrer is set;
  - there is no JSON-LD;
  - there is no disclosure banner (its element and its wording are both absent), and the preview stylesheet is linked;
  - the canonical is still the practice's own;
  - `og:url` is this preview; `og:description` and `twitter:description` are the disclosure, one of each (239/239); `og:site_name` is "Unofficial preview (not York Eye Associates)" (239/239);
  - the plain description does not promise a HIPAA-compliant form (239/239);
  - there is no image-bearing meta (`og:image`, `twitter:image`, `og:featured_image`, `image_src`);
  - there is nothing the site script could write a sentence into, fill a score into or reveal: no `data-form-status`, `data-score`, `data-noscore` or `data-form-offline` (239/239);
  - there are no CR bytes;
  - there is exactly one `<h1>`.

  Other hardening results:
  - 3 iframes carry the permitted referrer policy (`no-referrer` on the map frames, `strict-origin` on the video frame).
  - Of the 258 forms, 252 are site-search forms: unmarked, `method="get"`, their action this site's own `search/` page. The other 6 are the practice forms, all marked inert (6/6).
  - All 6 practice forms have `action=""`, `onsubmit="return false"`, `method="dialog"`, an empty `data-endpoint` and no `data-result`. Each begins with the hidden, disabled submit button, which is its **only submit control**, and the hidden, disabled text field (6/6); its visible button, where it has one, is a disabled `type="button"` (6/6; 1 of them has no button of its own). None keeps a `data-js-enable` control (6/6 clean). Each has its notice (6) and the preview's status line (6/6).
  - The 3 result forms keep no score field for the script to fill and no score rule (3/3).
  - The 2 pages listed for it carry the live-text note, and no other page names the live site's web platform in its text.
  - No title carries a prefix, and none of the 478 `og:title` / `twitter:title` values is empty.
- **Not carried**: every shipped text file was searched for the addresses of the 5 source URLs that were not rebuilt and for the opening words of the 5 passages the handoff change log records as left out (10 markers). There were 0 hits.
- **Byte identity**: 1,072 non-HTML files are byte-identical to the handoff build. The only others are the named preview additions (`.gitattributes`, `.gitignore`, `.nojekyll`, `PROVENANCE.json`, `PROVENANCE.md`, `README.md`, `robots.txt`, `styles/preview.css`) and 1 cleaned SVG (`assets/img/2yc2c0viqxkn0qbc.svg`): its root element and its embedded picture are the handoff file's, byte for byte, and it carries no editor-private data, metadata block, foreign object, script or external reference.
  - 17 files of the handoff build are not here because nothing names them (checked against every shipped page, stylesheet, script and data file), and no file that is shipped is unnamed. No text file carries CR bytes.
- **Secrets**: 253 text files, this one included, were scanned for credential-shaped strings (Google API keys, GitHub, OpenAI, Slack and AWS tokens, the media services' key format, private keys) and for build-machine paths and local server addresses. There were 0 hits.
  - The 1,067 binary files (3 JPG, 1,048 WEBP, 3 PNG, 10 MP4, 3 WOFF2) were opened too. Their container metadata was checked against an allowlist: no EXIF, XMP, C2PA or text chunks in the WebP and PNG pictures, no `uuid` boxes or metadata items beyond the encoder tag in the videos, no metadata blocks in the fonts. The picture embedded in the SVG went through the same check (1 embedded picture). The 3 JPEG files are the scanned pages linked from the privacy page, as the live site serves them; their Exif and XMP hold image geometry only (resolution, size, sampling), which the check allows and nothing else. Their printable strings, decompressed streams included, went through the same patterns. 0 problems, 0 hits. The video files name their encoder (ffmpeg / x264 and its settings); nothing identifies a person or a machine.
- **Reference audit**: 40,064 local references (35,175 href, 1,637 src, 252 action, 2,978 srcset, 16 data-loop, 6 css url()) were resolved against the file that carries each one, except the video-loop sources, which the site script resolves against the site root and were checked from there.
  - 0 escape the site root, 0 point at a missing file, and 0 are root-relative.
  - The exception is `404.html`, whose 146 references are all absolute under `/yorkeyeassociates/` by design.
- **Rendering at the preview's subpath** (measured on a local emulation of GitHub Pages: the same bytes served only under /yorkeyeassociates/, a missing path answered by 404.html; not yet re-measured at the public URL):
  - Every page except `404.html` (tested at depth below) was loaded in headless Chrome at 1440 and 390 px (476 loads), with lazy images forced to load.
  - The result was 0 responses ≥ 400, 0 broken images, 0 console errors, 0 same-site requests outside the prefix, 0 horizontal overflow at 390, and no banner on any load (each page rendered at least 200 characters of text for that absence to be read from).
  - Third parties: every child target (the frames included) was attached and its network watched, and each page that has a frame was left before its requests were counted, so that a frame's parting requests fall on the page that made them. Off-site requests came only from inside the frames on the 3 pages that have one, to `fonts.googleapis.com`, `fonts.gstatic.com`, `i.ytimg.com`, `jnn-pa.googleapis.com`, `maps.google.com`, `maps.googleapis.com`, `maps.gstatic.com`, `places.googleapis.com`, `www.google.com`, `www.gstatic.com`, `www.youtube-nocookie.com` and `yt3.ggpht.com` (22 of them POST). The pages themselves contacted no third party, and no other page contacted any.
  - Chrome cancelled 1 request itself (`Image assets/img/dsc04409-scaled-1600.webp`), and no image was left broken.
- **404 at depth**: `no-such-page/`, `a/b/c/d/no-such-page`, `eye-care-services/nope/` each returned 404 and rendered the styled page with no banner, 0 failed subresources and 0 broken images.
- **Search**: `/search/?q=dry eye` returned 60 results at the subpath, all inside `/yorkeyeassociates/`. The first one opens (HTTP 200).
- **Video loops**: every distinct loop was played in the browser: on the home page (HTTP 200), `beads` and `frames`; on `/advanced-services/` (HTTP 200), `lens`; on `/contact-lenses/` (HTTP 200), `contact`; on `/eye-care-services/dry-eye-optometrist/` (HTTP 200), `dry`. Each loop was scrolled into view; the video the site script builds for it (inside a shadow root) loaded from inside `/yorkeyeassociates/`, its playback time advanced, and it had no controls.
- **Practice forms, JavaScript on**: on all 6 practice forms, Enter was pressed inside the form (in its first visible single-line field or, where the form shows none, on its first radio button) and, on the 4 that show a button, the button was clicked with the mouse (hit-tested). That fired 0 submit events, sent 0 requests, and left every page where it was.
  - A submit event made by script was cancelled on every form, and the status line still read as shipped: the site script did not write into it.
  - Control: with the hidden button's `disabled` taken off, the same Enter fired a submit event on every form (6 in all), still cancelled and still sending nothing. So the keypress reaches the form, and the disabled default button is what stops it.
  - The disabled button was still disabled after the site script had run. With the pointer over it, its fill and border did not change (4 buttons, for example rgb(27, 26, 33) → rgb(27, 26, 33)).
- **Result pages**: each of the 3 result pages was loaded with `?score=3`, `?score=9`, `?score=15`, `?score=25` and `?score=120` in its address. Every time the score field stayed empty and the page read exactly as it does without a score.
- **Practice forms, JavaScript off**: all 6 practice forms were loaded with scripts disabled. Enter was pressed inside each one (`/children-vision-assessment-score/`: its read-only text field; `/contact-us/patient-registration-form/`: a text field; `/deq-5-questionnaire-results/`: its read-only number field; `/eye-care-services/dry-eye-optometrist/speed-questionnaire/`: a radio button; `/eye-care-services/myopia-management-optometrist/myopia-management-quiz/`: a text field; `/myopia-management-quiz-results/`: its read-only number field). On the 4 forms that show a button, a click also landed on it (hit-tested). Together that produced 0 non-GET requests, and every page stayed put.
  - Each safeguard alone: with the form's method set back to `post` but the hidden button left disabled, Enter sent 0 requests; with the hidden button enabled but the method left as `dialog`, Enter sent 0. On the 3 forms that show a single field, with the hidden button removed and the method set back to `post`, the hidden second field alone stopped Enter (0 requests); with that field removed too, Enter was caught on each of them (3 submissions).
  - Positive control: with the method set back to `post`, the hidden button enabled and the visible button re-armed, all through the DevTools protocol with no page script, the same two things were done again. Every form was then **caught** submitting on Enter, and each of the 4 that show a button on the click (10 submissions caught, for example `POST /yorkeyeassociates/children-vision-assessment-score/`). That proves the test can see a submission.
  - Every non-GET request was failed locally, so none left the machine.
- **Nothing covers a control**: hit-tested at each control's centre, the focused skip link is topmost at 390 px and 1440 px, and the open mobile drawer's close button is topmost at 390 px.
- **Tree**: `sitemap.xml`, `llms.txt`, `_headers`, `_redirects`, `audit/` and `src/` are absent. `.nojekyll` is present. `robots.txt` reads `Disallow: /`, which has no effect at this subpath (deviation #9).
- **After this file was written**, `preview-docs.mjs` re-ran the static checks (tree, byte identity, secrets, hardening, references) over the finished tree, including README.md, PROVENANCE.md and PROVENANCE.json. It would have refused to finish unless they passed.
