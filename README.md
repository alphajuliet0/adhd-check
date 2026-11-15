# ADHD check-in (static site, no build, no dependencies)

Plain files for any static host. This build keeps answers only in the tab's memory: nothing is written to localStorage, cookies, IndexedDB or any other browser storage, so closing or reloading the tab clears them. The result page offers a report download and print/PDF for keeping a copy. A CSP meta tag blocks all network connections and inline scripts.

- `index.html`, `style.css`, `main.js` (in-memory answer store), `app.js` (the whole UI), `asrs.js`, `report.js` (report/export builder), `content.js`, `test.mjs` (`node test.mjs`).

## Parts and sources
1. **Adult, Part 1:** ASRS-v1.1 6-question screener, exact items and options, with the two-level shading and the 4-of-6 rule (NYU Langone patient-facing PDF), and the Harvard 2024 scoring update (0-24, cutpoint 14) shown as a separate method. Never combined.
2. **Adult, Part 2 (optional):** our own 30 plain-language statements in six areas plus three context questions (`content.js`). Not the ASRS, not validated, no score or cut-off. Output is a count of agreed statements per area and a copyable summary.
3. **Child (switched off, not in this package):** SNAP-IV 26-item scale (Swanson, Nolan, Pelham) for a parent or carer. Items, 4 options and the printed "suggested scoring guideline" are from the UCSF CAPP copy: https://capp.ucsf.edu/sites/g/files/tkssra5836/f/SNAP-IV-26-item-Teacher-and-Parent-rating-scale.pdf . No age range is stated beyond "child/adolescent" because the source gives none; the 18+ boundary comes from NYU's ASRS page.
4. **Guidance:** closely paraphrased from nhs.uk (adults page and the children and young people page, last reviewed 19 March 2025 when read): https://www.nhs.uk/conditions/adhd-adults/ and https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/symptoms/

## Licence position (read before deploying)
- ASRS 6Q: NYU's licensing page (https://license.tov.med.nyu.edu/product/asrs6Qscreener) lists the screener as free for clinical and non-clinical use, including commercial, with attribution, and no modifications other than creating electronic versions. Credit line: (c) New York University and President and Fellows of Harvard College. Harvard now says permissions are managed by NYU.
- The 18-question ASRS checklist and ASRS-5 are NOT used. NYU's pages for them describe an order process signed by an institution's authorised signatory and say "educational and research use only". Not reproduced or reworded here.
- SNAP-IV: several secondary sources describe it as public domain / open licence. The author's own terms could not be reached when this was built, so this is not primary-source verified.
- Vanderbilt scales are not used (3rd edition is paid; 2nd edition is all rights reserved).
- Wording not from a source is ours: Part 2 statements, the summary, the plain-language framing.

## Hosting and privacy (read before deploying)

This build keeps answers only in page memory, so no residual health answers sit in browser storage after the tab is closed. That is not full isolation: `localStorage`/memory scoping is per origin (scheme + host + port), not per path, so while the page is open, a script on another page of the same origin could in principle read what this page holds. A project page at `alphajuliet0.github.io/<repo>/` shares an origin with `alphajuliet0.github.io/pay.brb/` and `/food.brb/`.

Full isolation options for later:
- A custom subdomain on the repo (for example a new subdomain of a domain the owner controls), which gives its own origin.
- A separate GitHub user or organisation, whose `<name>.github.io` is a different origin.
- Another static host with its own hostname.

Whichever hosting is used, the host keeps ordinary visit logs, separate from answers. Answers are never sent by this app (the CSP in `index.html` blocks network connections).
Visit logs belong to the host; the site itself stores nothing server-side.

## Reports and exports
- On the adult result page, "Print or save as PDF" opens the browser print window (choose "Save as PDF"). This is browser print-to-PDF, not a one-click PDF file. "Download as a web page (HTML)" saves a self-contained file (inline CSS, no external requests). Both are built in the browser by report.js. Nothing is uploaded.
- The report holds: ASRS-v1.1 answers with the darkly-shaded check, the result under the form's own counting rule and, separately, the Harvard 2024 points (never combined), the 30 own statements (labelled not part of the ASRS, not validated, no score), the context answers, NHS guidance, "what you can try while waiting" with evidence grades, sources and the NYU credit line. No name or identifier is asked for. A warning says it is private health information.
- "What you can try while waiting" lives in content.js (WAIT) with its sources. Evidence is graded: NHS advice; small or mixed research (single exercise bouts, white/pink noise, music); unproven (binaural beats).
- Hosted-in-a-frame caveat: if you embed this site in a sandboxed iframe without allow-downloads and allow-modals, export is blocked. Pass mount(root, store, { exports: false }) to show the on-page report instead.
- Child questionnaire: off. SNAP-IV reuse rights were not verified. Code is not in this package.
- Isolation: this build avoids residual stored answers (memory only, cleared on close/reload). Full origin isolation on github.io is not possible from a project page; use a custom subdomain, a separate GitHub account/org, or another static host.
- Scoring tests: node test.mjs (10 pass).
