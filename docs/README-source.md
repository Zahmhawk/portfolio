# Abdul Wahid personal portfolio

Public routes include: `/`, `/profile`, `/services`, `/research`, `/publications`, `/contact`, `/test-and-survey`, plus `/account`.
Owner administration: `/admin`. Public pages are published; owner administration is protected server-side.

## Current release

- English and Urdu, responsive layout, editable professional content.
- Services, training registration, capacity/deadline checks and enquiries.
- Owner-only administration with draft/published/archived content, ordering and per-entry version restoration.
- Private/public PNG, JPEG, WebP and PDF uploads through R2, 8 MB limit.
- Anonymous voluntary questionnaires with single-choice, rating and text questions.
- Response locking, descriptive reports, per-question missingness and CSV/JSON export.
- Durable Cloudflare D1 records and R2 files, not browser-local product data.

## Owner initialization

The initial site is owner-private. `OWNER_BOOTSTRAP_ENABLED=true` permits the first authenticated owner to initialize `/admin`. The operation stores that account ID as the sole application owner and seeds project-brief content. All subsequent administration checks the stored account ID on the server. Repeat initialization is rejected.

Before expanding the site's audience, confirm initialization, set `OWNER_BOOTSTRAP_ENABLED=false` through Sites runtime secrets and deploy again. Never make an uninitialized site public with bootstrap enabled. No initial email address or password has been hardcoded. Public sign-in uses Sites identity; this app does not implement passwords or OAuth itself.

## Content review

Profile copy is based on the user-provided brief. Dates, qualifications, international certificates, images and contact channels should be supplied/verified by the owner. No testimonials, event dates or certificates are invented. Initial contact email and WhatsApp are blank. Set these in Website settings. Upload a public photograph/CV under Files, then paste its link into Profile & identity.

## Data and operations

Migrations are in `drizzle/`. Hosted Sites applies them during publication. Seeding occurs on explicit owner initialization, never in schema migrations. Requests are in `submissions`; questionnaire definitions in `surveys`; anonymous answers in `answers`. Do not alter an answered questionnaire; duplicate it to create a new separately identified instrument. Reports are descriptive, with no clinical diagnosis or inferential claims.

Full JSON export includes application data, but not uploaded bytes, access credentials, owner accounts or complete disaster recovery state. Before public operation configure operational database/file backups, restore procedures, monitoring, research retention and proportionate anti-abuse controls. Deleting identifiable enquiries is irreversible and requires confirmation. Research response removal/retention automation is not implemented.

## Validation

- `node node_modules/typescript/bin/tsc --noEmit`
- `node <sites-plugin-root>/scripts/build-site.mjs`
- `node tests/integration.mjs` (isolated Miniflare/D1/R2 integration checks; no production records)

Integration tests cover authorization, owner setup, five server-rendered pages, consent, enquiries, registrations, duplicate and capacity handling, questionnaire publication/validation/locking, descriptive report calculations, version restoration, private file access and exports. These are server-side tests; interactive browser/mobile visual QA is still required before public launch.

## Later releases

Email notifications, payments, team roles, automatic backups, scheduled publishing, richer page building, validated scale scoring and inferential statistics are not included in this first release. The UI explains current capabilities. The public site stays private until the owner approves launch.

## Publications library

The Publications navigation item opens `/publications`. Published books, university articles, research papers and other works can be filtered by type, subject, subcategory and keyword. Subject categories are owner-entered and become visible when published records use them. Existing publications without classification are treated as books under Education.

In Administration → Publications → Add publication, choose a type, subject and optional subcategory; enter author/year and description; upload a PDF directly (8 MB maximum), then save as Published. Documents uploaded through this editor are public files and accessible to site visitors with their link even while a listing is draft. Only upload material intended for sharing. Private uploaded files cannot be attached to published publication entries. HTTPS journal/repository links are supported as an alternative.

Uploaded PDFs support an inline reader, an open-in-new-tab fallback and download. Viewing a document is not proof of reading it. Document copyrights and distribution permissions remain with the appropriate rights holder. External providers may control access to their documents.

## Navigation and header editor

Open `/admin?section=navigation` or choose Navigation & header. Menu labels in English/Urdu, order, visibility, destinations and new-tab behaviour are stored in site settings. Removing a link does not delete the page. Up to 12 links are supported; one must remain visible. Internal paths and HTTPS URLs are validated on the server. Adding a link does not build a new page.

Seven modern design presets include minimal, pills, floating, glass, outline, solid and classic gradient. The classic variant retains seven colour themes. Layout, alignment, colours, typeface, sizing, radius, sticky positioning, shadow, monogram/logo, subtitle and contact button are editable. Existing publication and profile records are preserved. Logo uploads are public image files. Save changes to apply pending edits; the preview only shows the current unsaved menu style.

## Animated banners

Administration → Banners & backgrounds (`/admin?section=banners`) manages up to twelve slides. Each slide has an uploaded desktop/mobile image, bilingual text/button, safe destination, focal position and visibility. Global controls cover section visibility, home/all pages, width, height, overlay, alignment, interval, autoplay, arrows, indicators and fade/slide/zoom transitions. No banners, all slides hidden, or a disabled section restores the regular home introduction.

Initial backgrounds are original abstract educational SVG illustrations in `public/banners/`; they can be replaced or removed. They are not photographs copied from the reference college website. Banner uploads are public PNG/JPEG/WebP images up to 8 MB. Removing a slide removes it from the banner settings; the uploaded image remains in file storage.

Automatic movement pauses on hover, keyboard focus, a hidden browser tab and reduced-motion preferences. Visible pause controls are available when autoplay is enabled. Browser/mobile visual and timing QA is still required before public launch.

## Impact and visitor engagement

Banners support fixed captions (default) or per-slide captions. Each image has cover/contain fit, 40–180 percent size, horizontal/vertical shifts, independent top/right/bottom/left percentage spacing and background colour. Captions in fixed mode are outside the transitioning image slides.

Achievements & counts stores owner-entered integer counts, suffixes, icons/images, details and galleries. Counts animate once when visible and respect reduced-motion preferences. No achievement quantities are seeded or inferred from registration. Published featured trainings/people are shown in display order, up to three per group. Details open in a dismissible dialog.

Feedback & subscribers moderates feedback and exports active subscriber emails. Only approved feedback with publication consent is exposed; public queries exclude contacts. Newsletter signup records consent and normalizes/deduplicates emails. It does not verify email ownership or send mail. Token-protected unsubscribe uses an explicit POST; GET only displays the confirmation page. New subscribers receive their management link on-screen. A later email provider must include that link or implement a compatible token flow. Operational abuse prevention and opt-in verification need review before a public launch.

Footer & social links supports icon, text, both and custom uploaded image modes; WhatsApp numbers are converted to wa.me destinations. Social destinations and image sources are validated. Website display toggles for impact, featured work and feedback are under Feedback & subscribers.

## Account-scoped Gemini companion

The floating chat uses the existing Sites ChatGPT identity. Separate Google OAuth or email/password signup is not implemented. Each visitor supplies their own Gemini key in Settings; the server verifies it against Google's model catalogue and encrypts it using AES-256-GCM with the stable account ID as authenticated data. Configure `CHAT_ENCRYPTION_KEY` as a hosted secret containing 32 random bytes encoded as base64. Never rotate this secret without migrating saved credentials; otherwise users must reconnect their keys. Never add actual secret values to source or browser storage.

Chat history is scoped to the authenticated account, capped at 30 conversations and 50 exchanges per conversation. The last 20 messages are sent as context. Users can delete individual chats and remove their key. Each account has a server-enforced 20-message/hour limit, with one request at a time. Messages persist until the user deletes the chat. PNG/JPEG/WebP attachments up to 2 MB are sent inline for the current exchange and are not stored. No survey records, private reports, system secrets or site-editing tools are provided to the model. Google API quotas and billing apply to each visitor's key.

New named real survey attempts require authenticated identity and an account-bound timed session. Completion dates/counts are visible to the participant without exposing answers or reports. Retakes require confirmation. Existing anonymous and historical unlinked records are not retroactively attached to identities.

Validation includes isolated Miniflare/D1 integration tests with a mocked Google transport; a live Gemini key is required for a real provider smoke test. Browser/mobile visual QA was not available in the authoring environment.

### Connect and personal dashboard

The header Connect action starts the supported top-level ChatGPT sign-in flow with `/account` as the return path. Signed-in visitors see My account. `/account` requires platform identity and only displays the current account's Gemini connection status and named survey completion counts/dates, never credentials or private reports. Admin can switch the header action back to a custom link in Navigation settings. Independent Google/Apple/email-password authentication is not implemented; provider choices belong to the platform's actual sign-in page.

Gemini credentials are treated as opaque printable strings up to 4096 characters, including dotted authorization keys. Common surrounding quotes and invisible paste markers are normalized; internal whitespace/control characters are rejected. Google verifies the key. Provider error reasons are mapped to safe messages without returning raw response bodies or keys.

## Multiple AI providers and Gemini Live

Chat supports user-owned OpenRouter, Gemini and NVIDIA connections (maximum six). Keys are AES-GCM encrypted with account/provider/connection-bound authenticated data. The existing single Gemini key remains available as a virtual legacy connection and can be upgraded via Edit / Refresh without re-entry. Model catalogues are discovered with the user's key: Gemini `/v1beta/models` (paged), OpenRouter `/api/v1/models/user` after `/api/v1/key` verification, and NVIDIA `/v1/models`. Catalogues describe provider-advertised capabilities; individual permissions, balance and regional limits can still affect invocation. Only compatible text models are selectable in Chat. Gemini Live models are selected separately.

Fallback is explicit and off by default. When enabled, quota/credit exhaustion, timeout or temporary provider failures try the next compatible saved connection in priority order (at most three attempts per message); auth/policy errors do not retry. An unsupported image is never silently stripped. The actual provider/model is returned with each reply. History is account-scoped, independent of the selected provider.

Voice uses the Gemini Live constrained WebSocket API, with server-minted single-use tokens expiring in 10 minutes; permanent keys never reach the browser. Tokens are bound to the selected Live model, AUDIO responses, voice and system instruction. Voice starts are limited to 12/hour/account. AudioWorklet sends mono 16-kHz PCM; Gemini PCM output is played using Web Audio. Browser speech synthesis is not used. Muting sends silence. End, closing the chat or leaving Voice stops microphone tracks and closes audio resources. Voice transcripts stay in the current client session, and continuity text can be sent to a backup Gemini connection when fallback is enabled. Native Live quota/unavailable disconnects can reconnect to a different compatible saved Gemini key; a pause is possible.

Validation uses isolated D1 and mocked provider transports, including quota fallback, key isolation, model selection and voice token constraints. A real-key/provider smoke test and browser microphone/audio validation are still required for live end-to-end verification.

### Gemini Live wire-format correction

The direct REST `AuthToken` body uses `bidiGenerateContentSetup`, not the SDK-only `liveConnectConstraints` option. Inside the raw `BidiGenerateContentSetup`, response modalities and speech configuration belong under `generationConfig`. The same exact wire setup is bound into the token and sent as the first WebSocket message. The source of truth is Google's public v1beta discovery schema at `https://generativelanguage.googleapis.com/$discovery/rest?version=v1beta`. Test mocks reject SDK-only fields so this format regression cannot silently pass again. Diagnostics record HTTP status, allowlisted Google status and field paths, never raw provider messages or credentials.

## Full-screen navigation and brand icons

Desktop and mobile now share a single-row header with language control and a hamburger button. The native full-viewport dialog provides focus trapping, Escape/Close dismissal, page scroll locking and focus restoration. Existing menu names, order, visibility, links and brand settings remain admin-managed. Account / custom CTA buttons live inside the menu. The original default Profile label is presented as About Me until navigation settings are saved with the new label-version flag; subsequent custom names remain editable.

Footer & social links now includes `inMenu` per link, and Navigation & header includes the global menu-social switch. Social destinations, order, visibility, icon/name/image styles and image uploads share the existing admin controls. Both menu and footer use locally hosted brand artwork, without monochrome CSS filters. Asset provenance: Facebook/WhatsApp/YouTube from `https://cdn.simpleicons.org/` in their brand colours; LinkedIn from `https://cdn.jsdelivr.net/npm/simple-icons@11/icons/linkedin.svg` with LinkedIn blue; Instagram from `https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg`. Simple Icons artwork is CC0; brand trademarks remain with their owners. Assets are used only as links to configured social profiles.

Browser/mobile visual testing was unavailable. TypeScript, production build and server integration checks cover generated navigation, safe links, configuration persistence and asset references. Native dialog keyboard/viewport behaviour still needs an interactive browser check.

### Compact menu, themes and owner website assistant

- The full-page menu now uses compact unnumbered links on the left, with My Account and social links immediately underneath. The decorative introduction and per-link arrows are removed. Existing banner, counter, chart and voice animations retain their timings.
- Menu controls provide System (monitor), Light (sun) and Dark (moon). Browser-local preference persists; System tracks OS changes. A small pre-hydration script applies the saved appearance. Theme covers public pages, forms, admin and AI surfaces; visual browser/mobile QA remains pending because the supported browser-control skill is unavailable in this environment.
- `/api/admin/assistant` rechecks the real owner role on every request. Regular members retain a conversational assistant and cannot prepare/apply/undo changes. The model can suggest only allowlisted settings, content and questionnaire mutations; it has no source-code, arbitrary SQL, credential, role-management or private-participant tools.
- Advice stays conversation. Explicit edits create an owner-only preview; Apply uses validated data and an atomic compare-and-swap batch. Imported questionnaires are forced to Draft, and survey validation retains category, question types, test keys, consent and response-lock rules. The owner reviews AI-generated content; model interpretation may need correction.
- Change history is available inside the owner chat and Admin → History & export. Delete beside content/questionnaire editing moves the record into recoverable history. Questionnaires with responses cannot be deleted or edited this way: close them instead. Undo compares the complete current record and refuses to overwrite later edits. Existing permanent participant-data deletion keeps its original privacy behavior.
- Attachment paperclip reads PNG/JPEG/WebP, PDF, TXT/CSV/JSON/Markdown, DOCX and XLSX (2 MB; 90,000 extracted text characters). DOCX/XLSX text is extracted locally with bounded ZIP/XML processing; formulas/macros are never executed. Legacy `.doc`/`.xls`, encrypted containers and large files require export to PDF/CSV. PDF reading currently requires a compatible Gemini connection; extracted text works across connected text providers. Attachments are sent to the chosen provider only for that exchange; chat saves text and filename, not file bytes. Optional **Upload for website** explicitly publishes a supported image/PDF to existing R2 storage and provides its actual URL for an edit.
- Owner assistant exchanges use existing account-scoped chat persistence. History contains preview snapshots, not API keys or research answers. A shared per-user rate limit and a longer owner-generation lock bound work. Chat/Voice headings use neutral Assistant branding; provider identity stays available in Settings/model selection. Voice remains conversational and does not execute website edits.
- Migration `0007_concerned_zombie.sql` adds `admin_changes`; all earlier data/bindings are preserved. Integration uses mocked provider transports, not live user keys. Real model comprehension, file extraction in supported browsers, visual theme coverage and microphone sessions still need interactive acceptance testing.

### Urdu authoring, navigation motion and returning subscribers

- Real hosted identity remains the platform's ChatGPT sign-in. Anonymous visitors receive a dismissible first-visit sign-in/sign-up prompt; authenticated visitors do not. My Account shows the trusted signed-in email and actual account-scoped AI connections. Direct Google OAuth is not exposed by the current hosting integration; no imitation Google login, password capture or replacement session stack is added.
- Admin English/Urdu pairs now include **Auto Urdu**, **Translate**, status and a manual off switch across profile, content, navigation, banner, footer, intake, category and question editors. Changed English is debounced; known names/terms use a curated glossary, other text uses that owner's saved model. Names explicitly request transliteration. Requests are owner-only, bounded to 8,000 characters and a separate 180/hour quota. In-flight stale results cannot overwrite newer English or manual Urdu. Save is held while a translation is pending, then the owner can review and save. Existing initial Urdu is not silently replaced; use Translate to refresh it.
- Live voice setup receives Pakistani Urdu pronunciation hints, including Abdul Wahid / عبدالواحد, Niaz Zeeshan / نیاز ذیشان and the saved English/Urdu owner name. These are model instructions, not a guaranteed pronunciation engine; real microphone/audio QA remains pending.
- The full-page menu copies measured header geometry, brand typography and language/close sizing. Only the menu body animates, so the header is not translated during opening. One moving underline follows menu hover/focus and returns to the active page; one sliding theme highlight follows hover/focus and returns to the selected mode. Banner/counter/chart animations remain unchanged.
- Custom dropdowns retain an off-screen native select for real form submission and validation while presenting a styled combobox/listbox. They support controlled/uncontrolled values, multiple selection, option groups, disabled options, keyboard navigation, typeahead, form reset and native Popover positioning. Interactive browser/mobile and assistive-technology acceptance checks remain pending.
- `/api/subscribe` GET returns only the current signed-in account's email subscription, or a validated anonymous browser capability. New anonymous subscriptions receive a Secure, HttpOnly, SameSite=Lax cookie; GET validates its token hash without permitting arbitrary-email lookup. Returning subscribers see **Subscribed**, and unsubscribe/admin status changes are reflected in subsequent checks. Email addresses remain unverified newsletter submissions; this does not claim email delivery or double opt-in verification.
- A small branded loading indicator appears only when same-origin document navigation or an actual route-loading boundary lasts over one second. It excludes API/download, external, new-tab, hash-only and authentication links; lifecycle/back-forward/Escape cleanup prevents a persistent loader. There are no fake completion percentages or forced navigation delays.
- TypeScript/build and integration cover APIs, authentication isolation, subscription capability tampering, actual provider wire fixtures, pronunciation setup, server-rendered dropdowns and menu markers. Browser geometry/motion, actual AI translation quality, native popovers and real voice output still require interactive verification.

### Centred document and form windows

The publication reader includes a labelled Maximize/Restore toggle next to Close. It expands the existing dialog to the viewport and restores its original size without replacing the PDF iframe or changing print/download destinations. This is an application-window toggle, not a browser/OS fullscreen permission request. Publication access and ordinary modal dialogs now explicitly use fixed viewport centring (`inset:0; margin:auto`), independent of scroll position and CSS preflight defaults. Share feedback uses a native centred dialog with Close/Escape, and Admin editing/report drawers use centred bounded windows. Side AI chat, the full-page menu and field-anchored dropdowns retain their intended positioning. Responsive limits keep forms scrollable on smaller screens; real browser/PDF and geometry QA remains pending.

### Publication access and searchable locations

The reader no longer displays the extra Open/print, Download, Share feedback toolbar or its fallback note. Normal reader width is 30px narrower; maximize/restore and close remain available. Pointer interaction suppresses the generic yellow focus ring, while keyboard navigation retains a visible focus indicator.

Migration 0008 adds account/publication access grants. After a consented publication intake, the server records a grant only for the trusted hosted identity. Reopening the same published book checks that identity and book on the server and uses its current file URL without another form. Another account, another book or an anonymous visitor cannot reuse the grant. Deleting the linked submission revokes it; archived books remain unavailable. Existing anonymous submissions are not retrospectively associated by an unverified email. File links themselves retain their existing public sharing behaviour.

Location inputs use searchable Country, State/Province, District and City controls. Parent changes clear dependent values. A unique country/region or chosen city supplies its IANA timezone; countries with several zones require a choice until the location resolves it. Location fields are one compact profile group and their names/timezone persist with the submission. GeoNames CC BY 4.0 source attribution is displayed. Generated local data includes country territories, worldwide cities500 and Pakistan populated places, with honest unspecified-area groups and a Not listed manual fallback where source coverage is incomplete. This is not a guarantee of every current administrative boundary. Rebuild assets with scripts/build-geography.py and downloaded GeoNames source dumps.

TypeScript, production build, API integration and server-rendered component checks cover this update. Interactive browser, native popover and document geometry acceptance checks remain pending.

### Resources and video collection

The existing /publications address remains compatible, while the default navigation and admin label are Resources. Existing default Publications labels are upgraded on read; custom navigation labels remain editable. The Resources page separates Books & Articles from Videos using keyboard-accessible tabs. Admins add a publication with type YouTube videos and a valid HTTPS YouTube watch, short, live or youtu.be link. The server validates the host and video ID, stores the canonical YouTube URL and generates its thumbnail; public cards open YouTube in a new tab without the document intake. Video availability/thumbnail delivery depend on YouTube. No sample video is presented as the owner's work.

The document heading loses 30px of desktop vertical padding, its separator is removed, and the loading label only exists while the iframe is loading. Reader width and maximize/restore remain unchanged.

Social links support X, Twitter, Threads, Telegram, TikTok, Pinterest, GitHub, Vimeo and Snapchat alongside existing brands. Known destination hosts can select the correct local brand asset even when configured as Website. Unknown services retain the globe or an admin-uploaded image. X/Threads use their actual monochrome mark; original brand colours are retained elsewhere. Additional SVG assets use Simple Icons (CC0) via cdn.simpleicons.org or simple-icons@11 via jsDelivr. Trademarks remain their owners'.

### Inline navigation, image resources and current profile identity

Full-screen navigation and its hamburger are replaced by compact visible links beside the brand. The same navigation wraps beneath the brand at tablet/mobile widths; My Account remains available even if the optional custom CTA is hidden. The single theme button cycles System → Light → Dark → System, persists the choice and follows OS appearance in System mode. Navigation retains one moving hover/focus underline. Footer links now render icon/image only, without decorative frames or backgrounds; names remain accessible labels. Admin copy reflects these controls and Resources replaces the remaining Publications sidebar label. Existing /publications links continue working.

Resources now has Books & Articles, Videos and Images tabs. Admins select Images and upload a PNG/JPEG/WebP under 8 MB, then save as Published. Manual editing and owner assistant checks enforce a real public uploaded image; PDFs and private files cannot be published as image resources. Gallery thumbnails offer a hover/focus plus, an explicit View image button and a native modal viewer with 100–400% zoom, reset, keyboard +/- and Close/Escape. Large images scroll inside the viewport. Existing document access grants and video links are unchanged.

Admin brand/badge and Account brand use the saved profile name. Every ordinary chat request loads the latest public profile as authoritative owner identity data; voice setup also receives it, and the admin assistant already receives current settings. Hardcoded owner names were removed from general AI introductions. Saved historical chat text is preserved. The authenticated visitor identity and ownership permissions do not change when the public profile name changes. Model output/pronunciation remains provider-dependent.

My Account has a bilingual Back to website link. Public-page navigation stores the last same-tab route, including query/hash, in sessionStorage; opening Account records it too. The return component accepts internal public paths only, rejects external destinations and account/admin/auth loops, and defaults to Home. Existing sign-in, data and access checks remain server enforced. Responsive rules cover the header, resource tabs/cards, image viewer, account and narrow admin forms/tables. Interactive browser, real device and provider output acceptance testing remain pending.

### Comfortable navigation spacing and contrast

Inline links now explicitly use theme ink for normal, hover, focus and current states, overriding legacy solid/gradient white foreground rules on transparent links. Font sizes are 13px desktop/tablet and 12px mobile, with 44px minimum control height, increased gaps and responsive header padding. Below 1280px the links wrap beneath the brand rather than being compressed. The header uses a subtle tinted surface instead of pure white. Admin navigation is 272px wide (248px on narrower desktops), with roomier labels/padding, a soft green light surface, dark green dark surface and contrasting selected states. At 900px it becomes a wrapping navigation panel, with larger mobile controls and content padding. Existing animation timings and destinations are retained. Source/build validation is available; interactive browser/device visual acceptance remains pending.

### Brand alignment and standalone navigation

Initials are rendered as individually spaced letters with a separate, vertically centred dot; the name and mark share centre alignment without the old negative tracking/baseline offset. Contact and My Account links now have contrasting filled button treatment in light and dark appearances. The moving indicator remeasures after fonts settle, browser pageshow, link/root resize and pointer movement, preserving the hovered/focused target across resize. A CSS underline provides a fallback before hydration. Banner behaviour is unchanged, per the owner's confirmation that it is working. Standalone/new-tab visual verification still requires a supported interactive browser.

Requested independent-host administrator username: NIAZIS11. This is a migration requirement, not a created password account. The current implementation uses Cloudflare Workers, D1, R2 and Sites request identity. Independent deployment requires the destination hosting/provider and secure deployment access, an identity provider/session replacement, a mapping of existing account IDs (including encrypted AI-key ownership), and a database/file migration. No credentials or unconfigured Google/Apple buttons have been introduced, and no deployment outside Sites is claimed.

## Unified resource, research and assistant release

### Administration and appearance
- Overview is now Dashboard. Owner-only /api/admin/dashboard aggregates persisted content, requests/subscribers, live response counts, questionnaires, account records and file metadata, plus a 30-day request histogram. Synthetic demo records are excluded. This does not invent visitor counts, uptime, sales or completed training totals.
- Published content can optionally carry a future publication timestamp; public page loads and publication access checks hide it until due. Drafts remain hidden, and this does not make public uploaded file URLs private.
- Resource management has separate Books & Articles, Videos and Images collections with type-specific Add controls. One Delete action moves an entry to the existing recoverable Trash; duplicate Remove from website controls are removed. Buttons submit only on click/keyboard activation, not hover.
- Shared Forest/Ocean/Plum/Terracotta/Custom palettes and version are managed in Website settings. Colours affect public/Admin surfaces and respond to the visitor's Light/Dark preference. Header custom colours can be selected independently by disabling Use shared theme colours. Navigation design/font/padding/radius values again affect the actual public header.
- /api/site-state returns whitelisted public settings and a settings revision, never account credentials, survey answers or assistant preferences. A 30-second visible-page poll updates public settings/themes; changed versions/settings also offer a dismissible Refresh notification. No in-progress form is forcibly reloaded. Already-open tabs from before this feature need one initial reload to obtain its polling code.
- Banner blur is 0–24px on the image only. Header subtitle is initially hidden by migration 0010, independently from banner wording and dynamic browser metadata. All three purpose-strip items remain present on mobile. Contact remains a normal link; My Account is the only filled navigation action. Signed-in members have a genuine Logout action. Mobile/tablet public links use a toggle panel; Admin uses a dismissible drawer with notification/menu tools.
- Manual settings saves now pass through validated, optimistic owner change history, so configurations can be reviewed and undone from History & export. This is configuration recovery, not a complete D1/R2 backup.

### Private survey results
- /api/research/results provides newest-first, 50-record paginated actual responses with category, questionnaire, search and Pakistan-date filters. Today/7/14/30 days and custom ranges link into existing individual/cohort charts, reports, PDF viewing/printing/download, questionnaire editing and duplication. Reports remain owner-only; no synthetic demo participant is inserted in this index.
- Named participant contact details can be corrected with a reason and retained previous values; anonymous responses cannot be relabelled as named participants. Answer corrections, manual marking and follow-up notes retain their existing rules and history. Exploration reports remain guidance for discussion, not IQ/mental-health diagnoses or definitive career decisions.
- Actual Sanghar/Tando Adam/Shahdadpur entries are prioritised in their source district, with Urdu/alternate-spelling search aliases. Failed city asset loads now show an error and real retry. GeoNames coverage is not asserted to contain every current village; manual fallback remains available for truly absent places.

### Assistant commands, memory, usage and providers
- Duplicate model/history controls are removed from the main chat. /help, /new, /stop (/shop alias), /retry, /model, /plan, /execute, /undo, /skills, /memory, /apis (/api alias, case-insensitive) open compact controls or perform the named local action. Settings still manages connections and models. Ctrl/Cmd+Enter sends; Enter inserts a line. The user message appears optimistically before the pending assistant reply. Errors preserve the draft. Request IDs cache successful text/admin-message results per authenticated user so Retry cannot charge/generate twice after a lost successful response. Stop cancels client waiting; already-started provider work may still finish and be billed.
- Plan-mode message requests cannot prepare changes, and explicitly plan-marked mutation requests are rejected. Existing proposals are hidden until /execute. Normal admin changes still need reviewed Apply and private owner authorization; these controls do not grant editing to members.
- Account-scoped explicit memories and versioned skills are durable rows, viewable/editable/deletable through their command windows. Enabled instructions are actually added to the selected text-provider prompt and new Gemini Live sessions as subordinate preference data; they never bypass server permissions. Voice must be restarted to load changed preferences. Historical chat text is preserved.
- Chat connections support Gemini, OpenRouter, NVIDIA, OpenAI, Groq and AWS Bedrock (region/API key/model-list permissions required). Up to 12 keys are independently encrypted with the existing account-bound secret; discovery and invocation use official endpoints. Catalogues are not a promise that every listed model is usable with every API/capability. Fallback attempts at most six compatible connections and does not bypass authentication/permission denial. Live voice remains Gemini-specific.
- Dictation uses browser SpeechRecognition for live interim text where supported. Other browsers can record up to 60 seconds/8 MB then transcribe on Stop via an owned OpenAI/Groq transcription model. Language selection includes Urdu, English, Arabic, Hindi and optional Roman Urdu transliteration through the selected text provider. User consent/permissions are required; multilingual recognition accuracy is provider/browser dependent. Closing dictation tears down microphone tracks and suppresses unintended uploads. Voice self-reference instructions follow the configured voice's grammatical gender.
- /apis polls account-isolated ai_usage records. Returned token counts and provider-reported USD costs are stored; missing prices remain unknown, never fabricated bills. Charts show daily/provider counts and hover detail. Provider bills, older calls, live voice, recorded dictation and external application use are not reconstructed. A 30-day reported-cost limit/80% warning covers only known recorded costs; unpriced/external charges cannot be capped by it.
- Migrations 0009/0010 add preferences, usage, connection region and idempotency records. They retain existing account IDs, encrypted connection ownership, grants, submissions and research records.

### Remaining external setup and validation boundaries
Independent hosting/password/Google/Apple login and two-factor recovery are not enabled: the destination host/domain/access has not been supplied. No fake provider sign-in or NIAZIS11 password account is claimed. Complete scheduled D1/R2 backups, off-site retention and destructive full recovery drills still require the target hosting/operational backup setup; existing exports omit file bytes and secrets. Backend/provider transport tests use explicit fixtures, not live paid accounts. Supported interactive browser/mobile/audio QA is unavailable, so visual geometry, popover focus, actual microphone/transcription/voice quality and real provider credentials still need acceptance verification.
