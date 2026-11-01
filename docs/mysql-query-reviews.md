# Reviewed SQL migration cases

This is a limited review, not a certification of the remaining inventory. The MySQL statements have not been executed on a real MySQL server. The Hostinger build remains blocked.

1. **Apple OAuth state** — `localAuth` previously used `DELETE FROM login_tokens ... kind='apple' ... RETURNING user_id`. The shared helper keeps D1's atomic delete and dispatches to the MySQL adapter's `SELECT ... FOR UPDATE` followed by delete on the same transaction. The draft schema has `token_hash` as the sole primary key. Real MySQL locking and the OAuth callback are untested.
2. **Google OAuth state** — same design with kind `google`. Same limitations.
3. **Verification** — same design with kind `verify`. Same limitations. Existing verification update remains a later statement, matching the previous flow; full flow must still be reviewed for failure behavior.
4. **Password reset and one-time code** — same design with parameterized kind `reset` or `reset_otp`. Expiry remains an ISO text comparison. Later password/session operations are unchanged and require integration and failure testing.
5. **Assistant survey table detection** — D1 uses `sqlite_master`; the MySQL pair queries `INFORMATION_SCHEMA.TABLES` in `DATABASE()` for the same table name. SQLite presence/absence tests and MySQL statement-selection mock tests pass; MySQL naming/case behavior is unverified.
6. **Notification settings upsert** — D1 keeps `ON CONFLICT(id)`; MySQL uses `ON DUPLICATE KEY UPDATE` against the draft schema's sole `settings.id` primary key. The statement does not inspect affected-row counts. SQLite insert/update tests and MySQL selection mock tests pass; MySQL insert/update and concurrent read-modify-write behavior are unverified.

See `mysql-sql-inventory.md` for the automatically extracted current `prepare()` calls. It does not establish semantic review or include every form of SQL execution.

7. **Assistant preferences upsert** — draft `assistant_preferences.user_id` is the sole primary key. Both SQL variants update only memories, skills, budget and updated time. No affected-row result is used. SQLite insert/update passes; MySQL variant has only a selection mock test.
8. **Chat profile key upsert** — draft `chat_profiles.user_id` is the sole primary key. Both variants update only encrypted key, model and updated time; other profile values are preserved. No affected-row result is used. SQLite insert/update passes; MySQL variant and encryption flow require real integration testing.
9. **Survey upsert** — draft `surveys.id` is the sole primary key. Both variants update title, description, consent, questions, status and config; version and created timestamp remain unchanged on conflict. SQLite insert/update passes; MySQL variant and surrounding response/authorization checks require real integration testing.

The three MySQL variants use `VALUES(column)` syntax supported by MySQL 8 but deprecated by MySQL. Actual server version, strict mode, unique-index definitions and collision behavior must be verified on staging before the guard is removed.
