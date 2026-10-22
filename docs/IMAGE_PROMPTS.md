# {{BRAND_NAME}}: Image Prompt Library and Visual Guidelines

**Brand consistent photography, illustration and graphics for the German B2B software review platform**
Companion to `WEBSITE_BUILD_PROMPT.md` · Version 1.0 · 19 October 2026

---

## 0. How to use this file

Every image on the website comes from this file. That is how the brand stays consistent across hundreds of pages.

1. **Build the brand board first** (Section 6.3). Generate the six anchor images, approve them, and use them as style references for everything that follows.
2. **Assemble every prompt** as: `MASTER BLOCK` + `SCENE` + `COMPOSITION` + `NEGATIVE BLOCK` + aspect ratio.
3. **Prompts are written in English** because image models follow English best. Alt texts are German because they appear on the website.
4. **Post process** every image with the same grade (Section 6.4) and export to the slot sizes (Section 6.1).
5. **Log** every approved image in `docs/image-log.md`: ID, tool, model version, seed, reference images used, date.

Text never goes inside an image. Headlines, numbers, prices and logos are always rendered in HTML on top of or next to the image.

---

## 1. Visual identity at a glance

**Mood:** ruhig, präzise, warm, glaubwürdig. Calm, precise, warm, credible. Real German working life, seen by a good documentary photographer or a thoughtful editorial illustrator.

**Palette in imagery**

| Color | Hex | Role in images |
|---|---|---|
| Canvas lavender | `#eceefe` | Walls, backgrounds, large calm areas |
| Ink | `#0a0e09` | Outlines in illustrations, matte black objects in photos |
| Orange | `#ffa028` | The accent: one or two small objects per photo, key shapes in illustrations |
| Deep orange | `#e06601` | Shadows of orange shapes, secondary accent |
| Periwinkle | `#c9cdf3` | Secondary fills in illustrations |
| Soft orange tint | `#ffe6c4` | Pattern blocks, light fills |
| Indigo | `#4a4fc4` | Rare accent in illustrations (max 5 percent of the area) |
| White | `#ffffff` | Paper, screens, highlights |

**The three image families**

| Family | Used for | Made with |
|---|---|---|
| A. Photography "Arbeitsalltag" | Heroes, category images, feature sections, Ratgeber heroes | AI generation following this file, later real photo shoots |
| B. Editorial illustration | Step graphics, empty states, trust pages, advisory visuals, some Ratgeber heroes | AI generation, then vectorized or redrawn as SVG |
| C. Brand graphics | Blockraster pattern, guide covers, OG images, chart visuals | Built in code, never generated |

**Two things that are never AI generated**
1. **Product screenshots.** Only real screenshots from real test accounts, with date.
2. **People presented as real.** Authors, advisors, the editorial team and customers are photographed for real (Section 7.9). Until then the illustrated cast stands in. AI generated faces are never presented as real staff or real customers.

---

## 2. Global rules

### 2.1 Consistency anchors (every image)

- **Light:** soft daylight from a side window, neutral to slightly cool white balance (5000 to 5400 K), gentle contrast, no flash, no dramatic spotlights.
- **Space:** clean contemporary interiors, light walls in lavender grey, white and light oak surfaces, matte black details, real plants allowed in photos.
- **Orange rule:** one or two small warm orange objects per photo (mug, folder spine, notebook, chair, safety vest, tissue paper). Never an orange color cast, never orange walls.
- **Calm composition:** one clear subject, generous negative space, nothing cut awkwardly at joints.
- **Screens:** only soft, abstract, out of focus interface shapes in lavender, white and orange. No readable text, no real product interfaces, no logos.
- **Camera:** full frame look, 35 mm for environments, 50 mm for people at work, 85 mm for portraits; f/2.8 to f/4; eye level.

### 2.2 German realism

Images must feel like Germany, not like a generic US stock library.
- Tilt and turn windows (Dreh-Kipp-Fenster), radiators under windows, parquet or grey carpet tiles, high ceilings in older buildings, practical Mittelstand offices, Handwerk workshops, logistics halls with Euro pallets.
- DIN A4 paper, lever arch folders without labels, Euro coins or notes only if currency appears at all.
- Weather and light of Central Europe: soft, often slightly overcast daylight.
- Avoid close ups of keyboards (models cannot render QWERTZ reliably).
- Never: dollar signs, US letter paper, US power outlets, US flags, American school buses, yellow legal pads as a motif.

### 2.3 People and casting

- Adults from about 22 to 63, reflecting the real German workforce: many backgrounds, skin tones, body types, a few visible glasses, natural hair.
- Business casual: knitwear, shirts, blouses, overshirts, work jackets in trades. Suits only in a Steuerberatung or board context.
- People work: they read, write, talk, test, sort, pack, sign. They do not pose, do not grin at the camera, do not give thumbs up, do not shake hands for the camera, do not point at screens.
- Natural skin texture, no beauty retouching.
- No look alikes of real or famous people.

### 2.4 Forbidden content (all families)

Sparkles, glitter, glowing particles, light rays, neon, holograms, futuristic HUDs, floating icons, robots, brains, rockets, lightning bolts, magic wands, crystal balls, light bulbs as an "idea" symbol, trophies, crowns, gems, confetti, lens flares, glossy 3D blobs, isometric tech scenes, purple AI gradients, emoji, any text, any logo, any watermark.

### 2.5 Legal and ethics

- No real brand names, logos, or recognizable product designs in generated images.
- AI generated people only as anonymous illustrative figures. Never label them as "unser Team", "Ihr Berater", "Kundin" or similar.
- Respect the image tool's license terms for commercial use and document the tool and plan in the image log.

---

## 3. Master blocks (copy and paste)

### 3.1 PHOTO_MASTER

```
Authentic editorial documentary photograph taken in a real workplace in Germany. Natural daylight from a side window, soft and even, neutral to slightly cool white balance around 5200 K, gentle contrast, true to life skin texture. Full frame camera look, 50 mm lens, f/2.8, eye level perspective, shallow depth of field with a softly blurred background. Calm, focused, competent mood: people are absorbed in real work and are not posing. Clean contemporary interior with light walls in a cool lavender grey close to #eceefe, white and light oak surfaces, matte black details close to #0a0e09. Exactly one or two small warm orange accents between #ffa028 and #e06601. Uncluttered composition with generous negative space. Subtle color grade with slightly cool shadows, clean warm highlights and natural saturation. Any screen shows only soft, abstract, out of focus interface shapes in lavender, white and orange with no readable text. No text and no logos anywhere in the image.
```

### 3.2 ILLUSTRATION_MASTER

```
Modern editorial flat vector illustration with a calm, intelligent tone. Clean geometric shapes and confident uniform outlines in ink black #0a0e09, about 2 px at 1x scale. Flat fills from this strict palette only: warm orange #ffa028, deep orange #e06601, lavender #eceefe, periwinkle #c9cdf3, soft orange tint #ffe6c4, indigo #4a4fc4 used sparingly, white #ffffff and ink black #0a0e09. Very fine paper grain on fills, no gradients, no drop shadows, no glow. Adult characters with natural proportions and slightly elongated limbs, simplified faces with small dot eyes, a short nose line and no mouth or a subtle short mouth line, varied skin tones and hairstyles, business casual clothing. Characters perform one concrete, recognizable work task. Objects use the same outline weight. Generous negative space on a plain background, a small cluster of square grid blocks in orange tints in one corner as the brand motif. Balanced, uncluttered composition. No text.
```

Background variants: add "plain lavender #eceefe background" for use on white cards, or "plain white background" for use on the lavender canvas. For transparent use, generate on white and remove the background.

### 3.3 NEGATIVE_PHOTO

```
text, letters, words, numbers, captions, watermark, signature, logo, brand name, readable screen content, legible user interface, keyboard close up, sparkles, glitter, glowing particles, light rays, neon, hologram, futuristic interface, floating icons, robot, brain graphic, rocket, lightning bolt, light bulb, lens flare, heavy bokeh, HDR look, oversaturated colors, orange color cast, teal and orange grading, plastic skin, airbrushed face, extra fingers, deformed hands, distorted face, uncanny eyes, forced smile, looking at camera, thumbs up, handshake pose, pointing at screen, high five, dollar sign, US flag, letter size paper, US power outlet, suit and tie, cluttered desk, tangled cables, 3D render, CGI, illustration, cartoon
```

Remove "looking at camera" only for portraits, and "suit and tie" only where a formal context is intended.

### 3.4 NEGATIVE_ILLUSTRATION

```
text, letters, numbers, logo, watermark, gradient, 3D, isometric, glossy, drop shadow, glow, sparkles, stars, magic, rocket, lightning, robot, brain, light bulb, trophy, crown, gem, emoji, floating UI cards with text, chibi, mascot, oversized heads, photorealism, detailed facial features, neon colors, rainbow palette, purple gradient, any color outside the palette
```

### 3.5 Tool notes

| Tool | How to use |
|---|---|
| Midjourney (current version) | Master + scene + composition, negatives via `--no`, aspect ratio via `--ar`, `--style raw`, low stylize (around 50). After approval of the brand board add the style reference parameter with the anchor image URLs and keep a fixed seed per family. For the illustrated cast use the character or omni reference feature of your version. |
| ChatGPT image generation, Gemini, Imagen | Natural language works best. Write the aspect ratio in words ("wide 16:9 landscape"). Attach the approved anchors and add: "Match the style, palette, lighting and level of detail of the reference images exactly." Put negatives as "Do not include: ...". |
| Flux and similar open models | Master + scene. If negative prompts are not supported, phrase them as "without ...". For large volumes train a small style LoRA on the approved anchors. |
| Recraft, Illustrator, Figma | Vectorize or redraw approved illustrations as clean SVG with the palette locked. Final illustrations ship as SVG whenever possible. |

---

## 4. Illustrated cast

A fixed cast makes illustrations feel like one world. Names are internal references only, never shown on the website.

| Name | Role | Look |
|---|---|---|
| **Anna** | Buchhaltung in a mid sized company | Woman, mid 30s, light skin, shoulder length dark blond hair in a low ponytail, round thin glasses, lavender cardigan over a white shirt, ink trousers |
| **Murat** | Elektromeister, owns a trade business | Man, mid 40s, olive skin, short black hair, short trimmed beard, ink work jacket with orange reflective piping, rugged tablet |
| **Lena** | HR and advisory | Woman, around 30, dark brown skin, short natural curls, deep orange blouse, white trousers, small hoop earrings |
| **Jonas** | Project lead in an agency | Man, late 30s, light skin, light brown tousled hair, stubble, white T-shirt under an ink overshirt with rolled sleeves |
| **Sabine** | Geschäftsführerin | Woman, mid 50s, light skin, short grey bob, ink blazer over a white top, minimal jewelry |
| **Tobias** | IT lead | Man, early 40s, light skin, shaved head, periwinkle shirt with rolled sleeves, wristwatch |
| **Mai** | Owner of an online shop | Woman, late 20s, East Asian heritage, straight black hair in a bun, orange apron over a white T-shirt |

**Character sheet prompt (run once per character, approve, then use as character reference):**

```
[ILLUSTRATION_MASTER] Character reference sheet of [LOOK FROM TABLE], shown in front view, three quarter view and side view, plus two poses: sitting at a desk with a laptop, and standing while holding a tablet. Plain white background, evenly spaced figures, consistent proportions in every view. [NEGATIVE_ILLUSTRATION] Wide 16:9.
```

**Object library (same outline weight, same palette):** laptop with ink body and a lavender screen showing abstract orange blocks; smartphone; rugged tablet; lever arch folder with orange or periwinkle spine and no label; white receipts; DIN A4 paper stack; wall calendar with an empty grid; orange coffee mug; stylized plant drawn in periwinkle and ink; desk lamp; whiteboard with sticky notes in orange, periwinkle and white; card terminal; desktop scanner; server cabinet with tiny orange status dots; cardboard shipping box; simple balance scale; magnifying glass; clipboard with checkbox rows.

---

## 5. Brand graphics built in code (no generation)

These are part of the design system and must not be generated as images:

- **Blockraster pattern:** deterministic SVG component of 8 px grid squares in staircase clusters (`brand-100`, `brand-200` on `brand-500`, or `line` on canvas).
- **Guide covers (Leitfäden):** orange cover, Blockraster in the corners, white stickers with Outfit 800 uppercase ink text.
- **OG images:** `next/og` templates with logo tile, score, category, brand fonts and colors.
- **Floating hero data cards:** HTML components on top of the hero photo, filled with real data.
- **Charts and stat tiles:** components, never pictures of charts.

Optional texture (only if CSS noise is not enough):

```
Seamless tileable paper grain texture, very fine, neutral light grey, uniform, no visible repeats, no objects, flat lighting, square 1:1, 1024 px.
```

Use at 3 to 5 percent opacity as an overlay on large flat areas.

---

## 6. Technical specifications

### 6.1 Slots

| Slot | Family | Ratio | Master export | Notes |
|---|---|---|---|---|
| Home hero | Photo | 4:5 (desktop column) and 4:3 (mobile) | 1600 × 2000 and 1600 × 1200 | Keep the upper area calm for floating data cards |
| Feature section image | Photo | 4:3 | 1600 × 1200 | Subject on one side, quiet other side |
| Category image (Kaufberatung header, featured tile) | Photo | 16:9, tile crop 4:3 | 2400 × 1350 | Subject in the right half so the 4:3 crop works |
| Ratgeber hero | Photo or illustration | 16:9, card crop 3:2 | 2400 × 1350 | Safe area: center 60 percent |
| Step and spot illustrations | Illustration | 1:1 | SVG, or PNG 1200 × 1200 | Transparent or plain background |
| Empty states | Illustration | 4:3 | SVG, or PNG 1200 × 900 | Displayed at 240 to 360 px width |
| Trust page images | Photo or illustration | 16:9 | 2400 × 1350 | |
| Portraits (real) | Photo | 4:5 and 1:1 | 1600 × 2000 | Section 7.9 |

**Formats:** photo masters as high quality JPEG (quality 90) or PNG in `public/images/`; `next/image` delivers AVIF and WebP. Illustrations as optimized SVG (SVGO), PNG only as a fallback.

**Naming:** `{family}-{page}-{subject}-{nn}.{ext}`, for example `photo-home-hero-01.jpg`, `photo-kat-zeiterfassung-01.jpg`, `ill-schritt-vergleichen-01.svg`, `ill-leer-suche-01.svg`.

**Folders:** `public/images/photo/`, `public/images/illustration/`, `public/images/texture/`.

### 6.2 Alt text rules (German)

- Describe what is shown and why it matters in the context, maximum about 125 characters.
- No "Bild von" or "Foto von".
- Decorative illustrations get `alt=""` and `aria-hidden="true"`.
- Every prompt below includes a suggested alt text.

### 6.3 Brand board (do this first)

Generate 8 to 12 variations of each anchor, choose one, document it, and use all six as style references afterwards.

| ID | Anchor |
|---|---|
| B-01 | Office photo: H-01 scene |
| B-02 | Trade photo: C-05 scene |
| B-03 | Logistics photo: C-08 scene |
| B-04 | Illustration with Anna: S-02 scene |
| B-05 | Illustration with Murat: S-03 scene |
| B-06 | Still life illustration: T-05 scene |

Review the board as a grid. If one anchor feels different in light, palette or level of detail, regenerate it before producing anything else.

### 6.4 Post processing grade (photos)

- White balance 5000 to 5400 K, neutral skin tones.
- Shadows lifted slightly with a very faint lavender tint.
- Highlights clean and warm, no clipped whites.
- Global saturation minus 5 to 10, orange accents protected.
- Grain 3 to 5 percent.
- Remove any accidental text, logos or artifacts with inpainting.
- Check: orange appears only on the intended objects.

Save the grade as a preset (Lightroom, Capture One or similar) and apply it to every photo.

---

## 7. Prompt library

Assemble each prompt as described in Section 0. `[PHOTO_MASTER]`, `[ILLUSTRATION_MASTER]`, `[NEGATIVE_PHOTO]` and `[NEGATIVE_ILLUSTRATION]` refer to Section 3.

### 7.1 Two fully assembled examples

**H-01 Home hero (photo, 4:5)**

```
Authentic editorial documentary photograph taken in a real workplace in Germany. Natural daylight from a side window, soft and even, neutral to slightly cool white balance around 5200 K, gentle contrast, true to life skin texture. Full frame camera look, 50 mm lens, f/2.8, eye level perspective, shallow depth of field with a softly blurred background. Calm, focused, competent mood: people are absorbed in real work and are not posing. Clean contemporary interior with light walls in a cool lavender grey close to #eceefe, white and light oak surfaces, matte black details close to #0a0e09. Exactly one or two small warm orange accents between #ffa028 and #e06601. Uncluttered composition with generous negative space. Subtle color grade with slightly cool shadows, clean warm highlights and natural saturation. Any screen shows only soft, abstract, out of focus interface shapes in lavender, white and orange with no readable text. No text and no logos anywhere in the image.

Scene: Two colleagues of a German mid sized company sit side by side at a light oak desk and compare two software options on an open laptop. A woman in her early forties with shoulder length brown hair and a cream knit sweater explains something with an open hand resting beside the laptop. A man in his early thirties with short dark hair and a white shirt listens and writes in an orange notebook. Behind them a lavender grey wall, a tilt and turn window with soft daylight and a tall green plant.

Composition: vertical 4:5, both people in the lower two thirds, calm empty wall area in the upper third for overlay cards, laptop screen angled away so only a soft glow of abstract shapes is visible.

Do not include: [NEGATIVE_PHOTO]
```

Alt: "Zwei Mitarbeitende vergleichen in einem hellen Büro Softwarelösungen am Laptop"
Also produce a 4:3 version with the same scene, subjects in the right two thirds.

**S-02 Step "Vergleichen" (illustration, 1:1)**

```
Modern editorial flat vector illustration with a calm, intelligent tone. Clean geometric shapes and confident uniform outlines in ink black #0a0e09, about 2 px at 1x scale. Flat fills from this strict palette only: warm orange #ffa028, deep orange #e06601, lavender #eceefe, periwinkle #c9cdf3, soft orange tint #ffe6c4, indigo #4a4fc4 used sparingly, white #ffffff and ink black #0a0e09. Very fine paper grain on fills, no gradients, no drop shadows, no glow. Adult characters with natural proportions and slightly elongated limbs, simplified faces with small dot eyes, a short nose line and no mouth or a subtle short mouth line, varied skin tones and hairstyles, business casual clothing. Characters perform one concrete, recognizable work task. Objects use the same outline weight. Generous negative space on a plain background, a small cluster of square grid blocks in orange tints in one corner as the brand motif. Balanced, uncluttered composition. No text.

Scene: Anna (mid 30s, light skin, dark blond low ponytail, round glasses, lavender cardigan over a white shirt) and Jonas (late 30s, light brown tousled hair, stubble, white T-shirt under an ink overshirt) stand in front of a large board with two big cards side by side. Each card shows a simple bar chart and a row of five circles, some filled in orange. Jonas holds an orange marker, Anna holds an open laptop and looks at the cards thoughtfully.

Composition: square 1:1, both figures full body, centered, plain white background.

Do not include: [NEGATIVE_ILLUSTRATION]
```

Alt: decorative, `alt=""`.

### 7.2 Startseite

| ID | Family, ratio | Scene | Alt text |
|---|---|---|---|
| H-01 | Photo, 4:5 and 4:3 | See 7.1 | Zwei Mitarbeitende vergleichen in einem hellen Büro Softwarelösungen am Laptop |
| H-02 | Photo, 4:3 | A data protection officer in her mid fifties with short grey hair and reading glasses sits at a tidy desk and reviews a printed DIN A4 contract with a pen in hand. Beside her an open laptop with abstract interface shapes and a lever arch folder with an orange spine. Lavender grey wall, daylight from the left. Composition: subject in the right half, calm left half. | Datenschutzbeauftragte prüft einen Vertrag zur Auftragsverarbeitung |
| H-03 | Photo, 16:9 | Over the shoulder view of a bookkeeper's desk: on the left a paper invoice on DIN A4, on the right a monitor showing the same document as abstract structured blocks. A hand holds a pen between both. An orange folder stands in the softly blurred background. Composition: desk surface fills the lower two thirds, quiet wall above. | Papierrechnung und elektronische Rechnung liegen nebeneinander auf einem Schreibtisch |
| S-01 | Illustration, 1:1 | Sabine sits at a desk with a clipboard checklist and holds a pen thoughtfully near her chin. Behind her three blank sticky notes on the wall in orange, periwinkle and white. | Decorative |
| S-02 | Illustration, 1:1 | See 7.1 | Decorative |
| S-03 | Illustration, 1:1 | Murat sits at a workbench and tests an app on a rugged tablet. Lena stands beside him and ticks the last box on a clipboard checklist. A wall calendar with an empty grid has one day circled in orange. | Decorative |
| H-04 | Illustration, 4:3 | Lena wears a light headset and talks warmly with a client on a video call. The client appears on the laptop screen as a simple illustrated person. A notepad with a checklist and an orange mug on the desk. Used for the advisory band and the AdvisorPanel until real photos exist. | Beraterin im Videogespräch mit einem Kunden |
| H-05 | Illustration, 3:2 | A neat stack of envelopes tied with an orange band lies on a desk next to a calendar page with an empty month grid, one day marked in orange. For the newsletter block. | Decorative |

### 7.3 Category images (photo, 16:9 with 4:3 tile crop)

Subject always in the right half. Calm area on the left.

| ID | Category | Scene | Alt text |
|---|---|---|---|
| C-01 | Buchhaltung | A bookkeeper in her late thirties at a light oak desk in a small office sorts paper receipts into a lavender tray. Open laptop with abstract charts, a calculator, a ring binder, an orange coffee mug. Tilt and turn window with daylight. | Buchhalterin sortiert Belege an ihrem Schreibtisch |
| C-02 | Rechnungsprogramme und E-Rechnung | An office manager in his thirties at a standing desk compares a printed invoice with a monitor showing abstract structured blocks. A small stack of envelopes, an orange sticky note on the monitor frame. | Office Manager gleicht eine Rechnung am Bildschirm ab |
| C-03 | Lohnabrechnung | A payroll specialist in her forties, headset resting around her neck, reviews an abstract table on a large monitor. A wall calendar with an empty grid, an orange pen on the desk, quiet office. | Lohnbuchhalterin prüft Abrechnungsdaten am Monitor |
| C-04 | HR-Software | An HR manager in her early thirties welcomes a new employee at a small round table. A laptop, a welcome folder with an orange spine, two glasses of water, plants, lavender wall. Friendly, professional conversation. | Personalerin begrüßt eine neue Kollegin zum Onboarding |
| C-05 | Zeiterfassung | An electrician in his forties in an ink work jacket on a residential renovation site checks in on a rugged smartphone. Cable drums and tools around him, daylight through an unfinished window, an orange tool bag. | Elektriker erfasst seine Arbeitszeit auf der Baustelle per Smartphone |
| C-06 | Projektmanagement | Three agency team members at a whiteboard wall with blank paper sticky notes arranged in columns. One person moves an orange note to the next column. Laptops on a high table, light concrete and white walls. | Agenturteam plant Aufgaben an einer Wand mit Haftnotizen |
| C-07 | CRM | A sales manager in her thirties in a bright office takes a call on a wireless headset and writes notes in an orange notebook. Laptop with abstract columns. Relaxed, attentive posture. | Vertriebsmitarbeiterin telefoniert mit einem Kunden und macht Notizen |
| C-08 | ERP und Warenwirtschaft | A warehouse lead in a clean, mid sized German warehouse scans a carton with a handheld scanner. Shelving racks and Euro pallets in the background, a tablet on a rolling cart, an orange safety vest. | Lagerleiter scannt einen Karton in einem Lager mit Euro-Paletten |
| C-09 | Shopsysteme | The owner of a small online shop at a packing station folds a knitted product into a kraft cardboard box. Label printer, paper tape, orange tissue paper, laptop with abstract order list. | Onlinehändlerin verpackt eine Bestellung an ihrem Packtisch |
| C-10 | Kollaboration | Hybrid meeting in a glass walled meeting room: two people at the table, a large wall display shows a video call grid with blurred abstract participants. Coffee cups, one orange chair. | Hybrides Meeting mit zugeschalteten Kolleginnen und Kollegen |
| C-11 | Dokumentenmanagement | An office worker feeds a stack of documents into a compact desktop scanner. Archive shelves with lever arch folders softly blurred in the background, laptop with abstract folder structure, one orange folder. | Mitarbeiter digitalisiert Papierdokumente mit einem Scanner |
| C-12 | E-Mail-Marketing | A marketing manager in her late twenties at two monitors reviews an abstract newsletter layout made of color blocks. A notebook with a sketched layout, an orange highlighter. | Marketingmanagerin prüft das Layout eines Newsletters |
| C-13 | Kassensysteme | A barista at the counter of a small café taps a tablet point of sale system while a customer holds a contactless card near a card terminal. Pastries in the display, warm morning light, orange ceramic cups. | Barista kassiert an einem Tablet-Kassensystem in einem Café |
| C-14 | E-Signatur | In a meeting room one person signs a document on a tablet with a stylus while a colleague reviews a printed copy. Calm, professional atmosphere, an orange folder on the table. | Mitarbeiterin unterschreibt einen Vertrag digital auf einem Tablet |

### 7.4 Ratgeber heroes (16:9)

**Template**

```
[PHOTO_MASTER or ILLUSTRATION_MASTER] Scene: {one concrete moment in which a person performs a task that embodies the topic}. Composition: wide 16:9, subject in the right third, calm negative space on the left, safe area in the central 60 percent for the 3:2 card crop. Do not include: [NEGATIVE_PHOTO or NEGATIVE_ILLUSTRATION]
```

| ID | Topic | Family | Scene | Alt text |
|---|---|---|---|---|
| R-01 | E-Rechnungspflicht | Photo | The owner of a small bakery sits at a desk in the back office and reviews incoming invoices on a laptop, flour sacks softly blurred in the background, an orange mug. | Bäckermeisterin prüft eingehende Rechnungen am Laptop |
| R-02 | DSGVO und Auftragsverarbeitung | Illustration | Sabine and Tobias sit at a table and review a contract together, a folder with a simple shield shape on its cover. | Decorative |
| R-03 | GoBD-konforme Archivierung | Photo | A woman in an archive room digitizes lever arch folders with a document scanner, open box of folders next to her. | Mitarbeiterin digitalisiert Ordner aus dem Archiv |
| R-04 | Arbeitszeiterfassung im Betrieb | Photo | Employees of a production company arrive in the morning and hold a chip card to a wall mounted time clock terminal, soft morning light, one orange safety vest. | Beschäftigte stempeln morgens an einem Zeiterfassungsterminal ein |
| R-05 | Software im Team einführen | Illustration | Jonas leads a short training for three colleagues in front of a large screen with abstract shapes, everyone with a laptop. | Decorative |
| R-06 | Kosten und Lizenzmodelle | Illustration | Anna compares three boxes of different sizes, each with a blank price tag, a few euro coins on the table. | Decorative |
| R-07 | Betriebsrat und neue Software | Photo | Works council members and an HR manager at a long table with documents and coffee, serious but cordial discussion. | Betriebsrat und Personalabteilung besprechen die Einführung neuer Software |
| R-08 | Datenmigration | Illustration | Tobias carries a stack of folders from an old cabinet toward a laptop, a dashed path connects both. | Decorative |

### 7.5 Leitfäden

Covers are built in code (Section 5). For the detail page hero:

| ID | Family, ratio | Scene | Alt text |
|---|---|---|---|
| L-01 | Illustration, 16:9 | Sabine reads a printed guide booklet with a plain orange cover at a café table, coffee cup, notebook beside her. | Decorative |

### 7.6 Empty states and system pages (illustration, 4:3)

| ID | Use | Scene |
|---|---|---|
| E-01 | 404 | Murat holds a folded paper map and looks at a signpost with three blank arrow signs, calm and slightly amused. |
| E-02 | Keine Suchtreffer | Anna looks into an open, empty lever arch folder with a magnifying glass. |
| E-03 | Noch keine Nutzerbewertungen | An empty speech bubble card leans against a mug on a desk, a pen lies next to it, inviting someone to write. |
| E-04 | Anfrage gesendet | A paper envelope slides into a stylized orange wall mounted mailbox. |
| E-05 | Newsletter bestätigen | Lena opens an envelope and finds a card with a large check mark. |
| E-06 | Serverfehler | Tobias kneels calmly next to an open server cabinet with a small toolbox and reconnects a cable. |
| E-07 | Vergleich noch leer | Two empty picture frames hang side by side on a wall, a small hook between them, a chair below. |

All empty state illustrations are decorative (`alt=""`); the message is in HTML.

### 7.7 Trust and service pages

| ID | Page | Family, ratio | Scene | Alt text |
|---|---|---|---|---|
| T-01 | Redaktion (until real team photos exist) | Illustration, 16:9 | Anna, Jonas and Tobias around a table with printouts and laptops, Jonas writes on a whiteboard with columns of blank sticky notes. | Decorative |
| T-02 | Über uns | Photo, 16:9 | A bright office in the morning without people: desks with laptops and plants, a coffee cup, tilt and turn windows, lavender wall, one orange chair. | Helles Büro am Morgen |
| T-03 | Für Anbieter | Illustration, 16:9 | Sabine presents a large blank product card with an empty logo tile to Jonas and Lena, feedback cards pinned on a board. | Decorative |
| T-04 | Bewertung schreiben | Illustration, 4:3 | Murat sits on a workbench and types on his phone, above him a row of five circles, four filled in orange. | Decorative |
| T-05 | Methodik | Illustration, 4:3 | Still life on lavender: clipboard with checkbox rows, magnifying glass, simple balance scale with two blocks, ruler, a card with five horizontal bars of different lengths. | Decorative |
| T-06 | Beratung | Illustration, 16:9 | Lena with a headset at a desk, on the laptop screen a client at a video call, a checklist and an orange mug. Same character and style as H-04, wider framing. | Beraterin im Videogespräch |

### 7.8 Category spot illustrations (optional, 1:1)

For Kaufberatung sections and the Softwarefinder results. One per category, same cast:

| Category | Scene |
|---|---|
| Buchhaltung | Anna sorts receipts into two trays, laptop beside her. |
| Rechnungsprogramme | Anna sends an envelope that turns into a document shape on her laptop. |
| Lohnabrechnung | Lena checks a list next to a stack of payslips without text. |
| HR-Software | Lena hands a welcome folder to a new colleague. |
| Zeiterfassung | Murat taps his phone next to a large simple clock. |
| Projektmanagement | Jonas moves a card on a three column board. |
| CRM | Sabine on the phone with a contact card in her hand. |
| ERP | Tobias with a tablet in front of shelves with boxes. |
| Shopsysteme | Mai packs a box at her packing table. |
| Kollaboration | Jonas and Lena in a video call, each on one half of the image. |
| Dokumentenmanagement | Anna places a document into a laptop folder. |
| E-Mail-Marketing | Mai looks at a laptop with abstract newsletter blocks. |
| Kassensysteme | Mai at a counter with a tablet and a card terminal. |
| E-Signatur | Sabine signs on a tablet with a stylus. |

### 7.9 Real portraits (photo shoot brief, not AI)

Authors, advisors and the editorial team are photographed for real. Brief for the photographer:

- **Backdrop:** seamless paper in a cool lavender grey close to `#eceefe`.
- **Light:** large softbox 45 degrees camera left, white bounce camera right, soft background light, no hard shadows.
- **Lens and framing:** 85 mm, f/4, eye level, chest up, 4:5 and 1:1 crops with headroom.
- **Wardrobe:** solid neutrals (white, light grey, ink, lavender), optional single orange accessory, no logos, minimal jewelry. Glasses welcome, check for reflections.
- **Expression:** natural, calm, approachable. A relaxed smile or a focused look, no forced grin.
- **Grade:** same preset as Section 6.4.
- **Releases:** signed model releases for web use.

Until real portraits exist, use the illustrated cast (H-04, T-01, T-06). Never use AI generated faces as stand ins for named people.

---

## 8. Quality checklist (every image before approval)

- [ ] Matches the brand board in light, palette and level of detail.
- [ ] Photos: one or two orange accents, no orange cast. Illustrations: only palette colors.
- [ ] No text, letters, numbers, logos or watermarks anywhere (zoom to 100 percent).
- [ ] Hands, faces, eyes and proportions are correct.
- [ ] German details are plausible, nothing American slipped in.
- [ ] Screens show only abstract shapes.
- [ ] People work instead of posing; none of the forbidden motifs from 2.4.
- [ ] Composition respects the slot's safe area and crops (Section 6.1).
- [ ] Graded with the shared preset, exported at master size, named correctly.
- [ ] German alt text written (or marked decorative).
- [ ] Logged in `docs/image-log.md` with tool, model, seed and references.
- [ ] No AI generated person is presented as a real staff member, author, advisor or customer.
