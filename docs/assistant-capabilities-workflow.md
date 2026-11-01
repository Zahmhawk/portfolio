Assistant identity, capabilities and survey workflow implementation

The previous admin prompt supplied owner profile/content and a handwritten action list without a clear assistant/owner boundary. Survey creation relied on model output and recent client history, and manual saving duplicated the reviewed-edit validator. The application now separates identity, resolves capabilities from server authorization/configuration, and keeps a server-side survey draft per owner conversation.

Files changed

Identity and capability context:
- lib/assistant-capabilities.ts (new): structured action metadata, identity rules, deterministic capability/owner-skill answers.
- lib/assistant-environment.ts (new): session role, configured connections, published visible owner skills, schema availability and channel-specific capability context.
- lib/site-identity.ts: shared assistant/owner distinction.
- lib/chat-connections.ts: shared context and source-backed identity answers; existing provider calls remain intact.
- lib/assistant-preferences.ts: private preferences enter model context only for the current database owner.
- app/api/admin/capabilities/route.ts (new): owner-only capability metadata.
- app/api/chat/voice/route.ts: shared identity/capability context with voice's lack of website tools preserved.

Commands and review UI:
- lib/chat-commands.ts (new): existing command list and aliases, shared by help and capability metadata.
- app/chat-command-window.tsx: /skills still edits saved instructions and now explains the distinction from tools, commands and permissions.
- app/ai-chat.tsx: shared deterministic aliases; existing admin guards remain.
- app/admin/assistant-history.tsx: survey success requires backend confirmation and a saved record identifier.

Survey creation:
- lib/survey-schema.ts (new): shared defaults, field metadata, question types and validation using existing question/scoring validators.
- lib/survey-service.ts (new): common proposal/review/apply service for normal manual saves and AI reviews.
- lib/assistant-survey-draft.ts (new): incremental merging, missing fields, generation authorization and source checks.
- lib/admin-edits.ts: shared survey validation; response locks retained.
- lib/admin-history.ts: successful transitions return entity and saved recordId.
- app/admin/research-manager.tsx: shared creation defaults; existing manual editor stays in place.
- app/api/research/route.ts: normal survey/test saves use the shared service. The fixed original exploration branch remains unchanged.
- app/api/admin/route.ts: legacy survey save also uses the shared service.
- app/api/admin/assistant/route.ts: server-owned conversation history, persisted incremental drafts, shared schema in prompts, explicit preview, existing Apply, and no model-authored save confirmation.
- drizzle/0014_assistant_survey_drafts.sql (new): additive/idempotent draft table. Applied to the local database. Other backends must apply this migration through their normal migration process.

Regression checks:
- tests/assistant-workflow.mjs (new): actual route/service functions with isolated SQLite and mocked provider output.
- tests/chat-command-access.mjs: updated module loading/format-independent assertions for shared commands.

Connected versus unavailable

Capabilities are filtered by the current server-authenticated owner role, the actual endpoint/channel, cached provider/model configuration, encryption configuration, and survey draft-table availability. Availability means configured/wired; it does not verify current provider credentials, quota or connectivity. Metadata contains no API keys.

The local owner endpoint reports configured chat, Gemini Live voice, image/document/PDF reading, supported reviewed settings/content/survey changes, Apply/Undo, explicit memory/skills preferences, existing slash commands and recorded usage. A PDF needs a usable Gemini chat connection; image reading needs an image-capable model. Natural-language interpretation/extraction needs the appropriate configured provider. Structured questionnaire JSON can be validated without model rewriting.

Voice can converse but has no website-editing tools or Apply execution. Dynamic slash-command registration, browsing/external-account integrations, shell/code execution and private response querying as model tools are unavailable. /skills remains a saved-instruction editor, not a new tool registry.

Draft safety and persistence

Only current owner sessions can reach the workflow. Missing title, purpose, consent, questions or active audience are collected from the shared schema. Supplied fields persist in the new table across follow-ups. Model-generated fields do not create a survey row. Questions, options, keys, marks and scoring need source evidence or an explicit relevant generation request; bibliographic/license/reviewer evidence cannot simply be fabricated. All AI-assisted content is presented as a draft for review.

Attachments use the existing upload/extraction path and limits. Structured extracted text is validated. Model extraction from PDFs/images is staged for explicit content confirmation, then normal validation/review/Apply. Binary provider extraction is not independently verified OCR. The complete normalized draft is available in the existing review card. Apply revalidates and atomically saves through existing change history. Only the successful result's saved survey identifier produces a creation confirmation.

Checks actually performed

Passed: TypeScript --noEmit; assistant workflow tests; command authorization tests; production build.

Workflow tests use real shared validators and route/service functions against isolated SQLite, with mocked provider replies. They cover assistant versus owner skills, Urdu identity response, dynamic-command refusal, missing fields, persisted follow-ups, no survey before Apply, saved IDs, manual survey/test creation, invalid options/keys, response locks, simulated save failure rollback, unauthorized requests, private preference isolation, imported JSON, generation provenance, and staged mocked PDF extraction.

Live local HTTP check: temporary owner session GET /api/admin/capabilities returned 200 with configuration-derived metadata; temporary visitor session returned 403. Test sessions were deleted. No provider settings or credentials were changed.

Not performed: live AI-provider inference, actual PDF/image OCR, browser interaction with the new workflow, or live microphone/audio tests. Existing broad integration runner is tied to a pnpm node_modules layout absent from this npm checkout; dedicated tests do not depend on it. No fine-tuning or model training was performed.
