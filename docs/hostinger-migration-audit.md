# Hostinger migration: initial audit

This is an initial audit, not a deployment or a complete migration plan. Branch: `hostinger-node-mysql-migration`. The existing Cloudflare configuration and local state are retained. Do not deploy the current application to Node as-is.

## Runtime and dependencies

- `vite.config.ts` uses Vinext, the Cloudflare Vite plugin, Sites and connector-preview plugins. `scripts/run-local.mjs` prepares D1, seeds local state and starts Vinext. `scripts/run-framework.mjs` selects the build runner. `next.config.ts` specifies standalone output but does not itself replace Cloudflare bindings.
- `lib/server.ts` provides the D1-style database interface used by application routes. `db/index.ts` imports Cloudflare's environment and constructs a SQLite Drizzle client; `db/schema.ts` and `drizzle.config.ts` target SQLite. Existing SQL migrations are in `drizzle/`.
- Direct `cloudflare:workers` imports also occur in `app/api/admin/route.ts`, `app/api/files/route.ts`, `app/api/chat/route.ts` and `lib/chat-connections.ts`. These cover object storage, AI configuration and provider credentials as well as DB access.
- SQL and binding-related occurrences span `lib/local-auth.ts`, `lib/admin-history.ts`, `lib/assistant-environment.ts`, `lib/chat-quota.ts`, `lib/chat-request.ts`, `scripts/run-local.mjs`, `build/connector-preview-worker.mjs`, and API routes for admin, assistant, translate, chat, preferences, usage, voice, files, notifications, publication copy, research, site update views, subscribe and survey. Search again during implementation: the initial search also includes commented-out historical code, and it is not a substitute for statement-by-statement review.
- `build/sites-worker.ts` calls `localAuth` before the Vinext fetch handler and supplies request-scoped connector bindings. `app/chatgpt-auth.ts` consumes injected identity headers. A Node implementation must authenticate the session and strip untrusted client-supplied identity headers before they can reach this code; removing the Worker without a secure replacement would permit identity spoofing. Preserve OAuth callbacks, token consumption, logout, CSRF behavior and cookie security.
- `lib/local-auth.ts` uses D1 batches, SQLite upserts, `DELETE ... RETURNING`, and `cf-connecting-ip`. Atomic one-time-token consumption must remain safe under concurrency. Proxy IP headers require an explicit trusted proxy boundary.
- `app/api/files/route.ts` uses `BUCKET` and the `files` table. Migrate both metadata and R2 objects and preserve access controls; do not expose storage directly. `CHAT_ENCRYPTION_KEY` must be copied securely and unchanged, never regenerated or printed.
- Current Vinext documentation describes Nitro Node builds, but compatibility of this project's pinned `1.0.0-beta.5` with a particular Nitro version and its output has not been tested. Neither `nitro` nor `mysql2` is listed as a direct dependency. `node_modules` is absent, and no local MySQL or Docker executable was detected.

## Local state inspection

The local Wrangler state includes a D1 database and R2 metadata/blob directories. A read-only SQLite inspection found 29 tables, including two Cloudflare/D1 metadata tables. This is a point-in-time inspection of the local state, not proof that it is the latest production backup. Selected counts: accounts 2, login credentials 2, login sessions 3, chat connections 2, chat messages 26, content 17, files 1, audit 143. No records or secrets were exported. The separately mentioned `.wrangler.zip` was not located in the project root.

Before migration, take a consistent SQLite backup including any WAL and verify the intended backup is authoritative. Inventory schema, indexes, constraints, defaults and R2 objects against the same snapshot. Preserve ISO timestamp comparison semantics and determine MySQL collations, index lengths and unique constraints explicitly. Compare every application table and object, not just selected counts. Treat sessions and single-use tokens deliberately with regard to expiry and cutover.

## Remaining gates

1. Reproduce the existing app and tests with installed pinned dependencies; inspect full live schema and SQL semantics.
2. Implement and test an isolated Node runtime, transactional MySQL adapter and migrations, secure auth/proxy boundary, and storage abstraction without altering the existing Cloudflare workflow.
3. Build a repeatable, transaction-aware data and object transfer with per-table/object verification. Use a staging database and preserve the encryption key.
4. Run production-mode integration and security tests, including concurrent token consumption and actual upload/download. Verify real providers separately using securely configured credentials.
5. Inspect Hostinger app configuration and logs; diagnose the reported 403 before any domain cutover. This environment currently has no connected Hostinger or MySQL access, and the domain could not be fetched by the research tool. Do not assume the cause of the 403.
6. Deploy to staging and verify data, functionality, TLS and routing before touching the main domain. Preserve existing DNS/MX and rollback resources.

## Subsequent local work

The installed Vinext 1.0.0-beta.5 README explicitly documents `vinext()` with `nitro()` and `NITRO_PRESET=node`; the Node command is `.output/server/index.mjs`. Nitro and mysql2 were added without changing Vinext. The separate build is deliberately disabled until the Node identity boundary and data migration are complete. An exploratory build reached Vite but failed resolving the Tailwind CSS import; it also reported selecting the existing root `index.html` as a Nitro renderer template. Both must be resolved and the actual output inspected before enabling this build. Do not deploy it.

`scripts/snapshot-sqlite.mjs` uses SQLite's backup API against a read-only source and refuses to overwrite a snapshot or report. The resulting private, ignored `outputs/hostinger-audit/` snapshot passed `integrity_check`; its inventory contains 29 tables, 31 indexes including implicit SQLite indexes, zero declared foreign keys and zero triggers. The report records all row counts and schema metadata. It is not proof this local state is the authoritative backup.

`db/mysql-adapter.mjs` is isolated and is not connected to the application. Its pool-backed D1-shaped operations and batch rollback have mock tests only. It intentionally performs no SQLite SQL conversion and cannot run the existing application unchanged. A real MySQL integration test, compatible schema, explicit SQL rewrites, secure auth, file storage and data migration are still required.

## Hostinger read-only inspection (2026-11-01)

Chrome hPanel shows the current deployment from `main` commit `3a727f9f` with framework detected as Create React App, build command `npm run build`, output directory `build`, entry file `none`, and Node 24.x. The build log states Vinext generated `dist/standalone/server.js`, while publish synchronized `public_html` from the configured output. The visible `public_html` listing contains build support source files and no root index. This configuration strongly explains the 403, though the complete request routing has not been independently verified. Runtime logs showed no entries for the latest deployment. No Hostinger configuration, DNS, or production data was changed. Do not deploy the existing standalone output as a fix: it still depends on Worker bindings and the Worker authentication boundary.

The staging-only `scripts/migrate-sqlite-to-mysql.mjs` targets the 27 application tables from the snapshot, refuses nonempty destination tables, requires matching column order and InnoDB, transfers in a transaction, and compares every table's row count before commit. `MIGRATION_TARGET=staging` is a safeguard, not proof that the configured database is staging. It does not yet validate complete schema definitions, uniqueness/referential assumptions, or object data; it has only been tested against a mock MySQL connection and must not be used until a reviewed MySQL schema and real staging tests are available. The app, SQL conversion, storage, auth and build remain incomplete.

## MySQL schema and SQL inventory update

A draft MySQL 8 schema now describes all 27 application tables in `db/mysql-migrations/0001_schema.sql`; see its README for explicit charset, collation, index length and default limitations. Static checks compare the draft against snapshot columns, primary keys and index names; no real MySQL execution has occurred. The staging importer now refuses incompatible types, nullability, defaults, collations, unique indexes, source storage classes and oversized VARCHAR data. It still needs real-server verification and full-value/relationship validation before use.

The syntax-tree inventory `docs/mysql-sql-inventory.md` lists 238 active `prepare` calls as triage only: 21 SQLite syntax, 4 returning/transactional, 2 casts, 2 date/time, 1 JSON, 1 SQLite schema introspection, 7 dynamic and 200 other calls requiring compatibility/schema review. These categories do not establish complete coverage or compatibility; conversion and authentication remain unfinished. The Hostinger build guard remains in place.

## File storage boundary update

The file route now obtains storage through `lib/file-storage.ts`, which retains the original R2 binding under the Cloudflare configuration. The guarded Hostinger configuration maps that import to `lib/file-storage-node.mjs`; the Node implementation requires an explicitly configured absolute `FILE_STORAGE_DIR`, restricts IDs to UUID-shaped filenames, prevents overwriting an existing object, and stores no files under a web-served route. File visibility and admin checks remain in the application route. Filesystem tests cover binary roundtrip, collision and path traversal; these do not test route authorization or integration with the Node server. Windows does not guarantee POSIX permission bits or `O_NOFOLLOW`; the configured directory must have private OS-level access controls. Hostinger persistence and existing R2 object transfer remain unverified. Do not enable the build guard until authentication, data access, storage integration and the remaining requirements are complete.

`npm run build` completed after this change using the existing Cloudflare/Vinext configuration. This is a build check only, not end-to-end validation of R2 operations or the generated standalone output.

## Database and security components update

The application's `lib/server.ts` now resolves `db()` through the Cloudflare provider; the separate Hostinger Vite configuration aliases the same import to a lazy singleton MySQL provider. This is source-level wiring only: the Hostinger build remains deliberately blocked, other direct Cloudflare imports remain, and the SQLite statements have not been converted. It is not a functioning MySQL application yet. The existing Cloudflare build and TypeScript check passed after the provider change.

`lib/node-identity.mjs` strips client-supplied identity headers and resolves the existing session through a database query; it is not installed in a Node request pipeline. Its tests use a mock database, not actual routes. `consumeLoginToken` on the MySQL adapter uses a transaction and row lock; it is not wired to existing auth flows and its concurrent test models locks without a real database. `lib/client-ip-node.mjs` is a standalone helper, not installed in the server: trusted proxy addresses must only be configured after verifying the proxy appends the actual socket client IP. No proxy is trusted by default.

Password login, registration, OAuth, reset, verification, logout, CSRF, rate limiting, actual file-route authorization and provider credential decryption remain unverified on Node. The Hostinger guard must remain in place.

## Token dispatch and reviewed SQL pairs

The four active Apple/Google/verification/reset token-consumption call sites now use `lib/consume-login-token.mjs`: D1 executes its atomic `DELETE ... RETURNING`, while the MySQL adapter's separately implemented row-locking transaction is selected when available. SQLite tests cover expiry, wrong kind and single use; MySQL concurrency remains mock-tested, not real-server validated. Node authentication is still not installed in the Nitro pipeline.

`lib/sql-backend.mjs` selects explicitly authored SQL pairs, without textual rewriting. Two source paths use it: assistant survey-table detection and notification settings upsert. `docs/mysql-query-reviews.md` records assumptions and remaining integration tests. TypeScript and the existing Cloudflare build passed after these changes. All other SQL, auth, provider, storage and security gates remain incomplete.

## Additional SQL pair review

Three more SQL pairs are now explicit in `lib/sql-upserts.mjs`: assistant preferences, chat profile key settings and survey updates. Draft schema primary keys were inspected and SQLite tests verify insert, update and preservation of unaffected columns. MySQL selection is mock-tested only. The inventory now includes 232 `prepare`, five backend-pair and three MySQL adapter execution call sites; dynamic and other execution paths still require manual review. The `npm run build:hostinger` guard was verified to stop the build with its intended message. Existing `npm run build` and TypeScript checks passed. Actual Node request authentication, all remaining SQL, MySQL integration and storage authorization are not complete.
