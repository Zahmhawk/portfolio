# Active SQL call inventory

Syntax-tree inventory of active `prepare()` calls, explicit backend pairs and MySQL adapter execution calls; commented code is excluded. SQL is source code, not database records. Categories are automated triage, not semantic review or evidence of MySQL compatibility. Dynamic arguments, other SQL execution, query semantics, indexes, transactions and security require manual review. See mysql-query-reviews.md for reviewed cases. Hostinger build remains blocked.

## 1. app/api/admin/assistant/route.ts:26

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE assistant_survey_drafts SET state=?,updated_at=? WHERE user_id=? AND proposal_id=?
```

## 2. app/api/admin/assistant/route.ts:36

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE chat_limits SET count=CASE WHEN window_start<=? THEN 1 ELSE count+1 END,window_start=CASE WHEN window_start<=? THEN ? ELSE window_start END,busy_until=? WHERE user_id=? AND busy_until<=? AND (window_start<=? OR count<20)
```

## 3. app/api/admin/assistant/route.ts:41

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM chat_threads WHERE id=? AND user_id=?
```

## 4. app/api/admin/assistant/route.ts:43

- Function: `handlePost`
- Call kind: prepare
- Triage: `DYNAMIC_SQL_REVIEW`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Dynamic expression:

```sql
thread?'SELECT count(*) AS n FROM chat_messages WHERE thread_id=?':'SELECT count(*) AS n FROM chat_threads WHERE user_id=?'
```

## 5. app/api/admin/assistant/route.ts:45

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT role,body FROM (SELECT role,body,created_at,id FROM chat_messages WHERE thread_id=? ORDER BY created_at DESC,id DESC LIMIT 8) ORDER BY created_at,id
```

## 6. app/api/admin/assistant/route.ts:46

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM assistant_survey_drafts WHERE user_id=? AND thread_id=? AND state IN ('collecting','review')
```

## 7. app/api/admin/assistant/route.ts:49

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT id,kind,data,status,position FROM content ORDER BY position LIMIT 100
```

## 8. app/api/admin/assistant/route.ts:86

- Function: `handlePost`
- Call kind: prepare
- Triage: `REWRITE_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO assistant_survey_drafts(user_id,thread_id,data,source_text,generation,proposal_id,state,updated_at) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(user_id,thread_id) DO UPDATE SET data=excluded.data,source_text=excluded.source_text,generation=excluded.generation,proposal_id=excluded.proposal_id,state=excluded.state,updated_at=excluded.updated_at
```

## 9. app/api/admin/assistant/route.ts:92

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO chat_threads(id,user_id,title,created_at,updated_at) VALUES(?,?,?,?,?)
```

## 10. app/api/admin/assistant/route.ts:93

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO chat_messages(id,thread_id,role,body,created_at) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM chat_threads WHERE id=? AND user_id=?)
```

## 11. app/api/admin/assistant/route.ts:93

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO chat_messages(id,thread_id,role,body,created_at) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM chat_threads WHERE id=? AND user_id=?)
```

## 12. app/api/admin/assistant/route.ts:93

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE chat_threads SET updated_at=? WHERE id=? AND user_id=?
```

## 13. app/api/admin/assistant/route.ts:96

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE chat_limits SET busy_until=0 WHERE user_id=?
```

## 14. app/api/admin/dashboard/route.ts:2

- Function: `GET`
- Call kind: prepare
- Triage: `JSON_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT status,count(*) AS n FROM content WHERE id NOT LIKE 'demo-%' AND (status!='published' OR json_extract(data,'$.publishAt') IS NULL OR json_extract(data,'$.publishAt')='' OR json_extract(data,'$.publishAt')<=?) GROUP BY status
```

## 15. app/api/admin/dashboard/route.ts:2

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT kind,status,count(*) AS n FROM submissions GROUP BY kind,status
```

## 16. app/api/admin/dashboard/route.ts:2

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT status,count(*) AS n FROM surveys WHERE id NOT LIKE 'demo-%' GROUP BY status
```

## 17. app/api/admin/dashboard/route.ts:2

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT count(*) AS n FROM answers WHERE expires_at IS NULL OR expires_at>?
```

## 18. app/api/admin/dashboard/route.ts:2

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT count(*) AS n FROM accounts
```

## 19. app/api/admin/dashboard/route.ts:2

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT count(*) AS n FROM files
```

## 20. app/api/admin/dashboard/route.ts:2

- Function: `GET`
- Call kind: prepare
- Triage: `DATE_TIME_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT date(created_at,'+5 hours') AS day,count(*) AS n FROM submissions WHERE created_at>=? GROUP BY day ORDER BY day
```

## 21. app/api/admin/route.ts:17

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT user_id FROM accounts WHERE role='owner' LIMIT 1
```

## 22. app/api/admin/route.ts:17

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM content ORDER BY position
```

## 23. app/api/admin/route.ts:17

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT data FROM settings WHERE id='site'
```

## 24. app/api/admin/route.ts:17

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM surveys ORDER BY created_at DESC
```

## 25. app/api/admin/route.ts:17

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM submissions ORDER BY created_at DESC LIMIT 1000
```

## 26. app/api/admin/route.ts:17

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM revisions ORDER BY created_at DESC LIMIT 100
```

## 27. app/api/admin/route.ts:17

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM audit ORDER BY created_at DESC LIMIT 100
```

## 28. app/api/admin/route.ts:17

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM files ORDER BY created_at DESC
```

## 29. app/api/admin/route.ts:19

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT user_id FROM accounts WHERE role='owner' LIMIT 1
```

## 30. app/api/admin/route.ts:19

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO accounts (user_id,email,role) VALUES (?,?,?)
```

## 31. app/api/admin/route.ts:19

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO settings (id,data) VALUES (?,?)
```

## 32. app/api/admin/route.ts:19

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO content (id,kind,data,status,position,updated_at) VALUES (?,?,?,?,?,?)
```

## 33. app/api/admin/route.ts:22

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT mime,is_public FROM files WHERE id=?
```

## 34. app/api/admin/route.ts:22

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT mime,is_public FROM files WHERE id=?
```

## 35. app/api/admin/route.ts:23

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT mime,is_public FROM files WHERE id=?
```

## 36. app/api/admin/route.ts:23

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT mime,is_public FROM files WHERE id=?
```

## 37. app/api/admin/route.ts:23

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM content WHERE id=?
```

## 38. app/api/admin/route.ts:23

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO revisions (id,content_id,data,created_at) VALUES (?,?,?,?)
```

## 39. app/api/admin/route.ts:23

- Function: `POST`
- Call kind: prepare
- Triage: `REWRITE_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO content (id,kind,data,status,position,updated_at) VALUES (?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET kind=excluded.kind,data=excluded.data,status=excluded.status,position=excluded.position,updated_at=excluded.updated_at
```

## 40. app/api/admin/route.ts:24

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE content SET status='archived',updated_at=? WHERE id=?
```

## 41. app/api/admin/route.ts:25

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM revisions WHERE id=?
```

## 42. app/api/admin/route.ts:25

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM content WHERE id=?
```

## 43. app/api/admin/route.ts:25

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO revisions (id,content_id,data,created_at) VALUES (?,?,?,?)
```

## 44. app/api/admin/route.ts:25

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE content SET kind=?,data=?,status=?,position=?,updated_at=? WHERE id=?
```

## 45. app/api/admin/route.ts:26

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE submissions SET status='unsubscribed' WHERE id=? AND kind='subscriber'
```

## 46. app/api/admin/route.ts:27

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT data FROM submissions WHERE id=? AND kind='feedback'
```

## 47. app/api/admin/route.ts:27

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE submissions SET status=? WHERE id=? AND kind='feedback'
```

## 48. app/api/admin/route.ts:28

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE submissions SET status=? WHERE id=? AND kind IN ('enquiry','registration')
```

## 49. app/api/admin/route.ts:29

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
DELETE FROM publication_access WHERE submission_id=?
```

## 50. app/api/admin/route.ts:29

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
DELETE FROM submissions WHERE id=?
```

## 51. app/api/admin/route.ts:31

- Function: `POST`
- Call kind: prepare
- Triage: `REWRITE_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT OR IGNORE INTO surveys(id,title,description,consent,questions,status,version,config,created_at) VALUES(?,?,?,?,?,?,?,?,?)
```

## 52. app/api/admin/route.ts:31

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE surveys SET status=? WHERE id=?
```

## 53. app/api/admin/route.ts:33

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM content
```

## 54. app/api/admin/route.ts:33

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM settings
```

## 55. app/api/admin/route.ts:33

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM surveys
```

## 56. app/api/admin/route.ts:33

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM answers
```

## 57. app/api/admin/route.ts:33

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM submissions
```

## 58. app/api/admin/route.ts:33

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM publication_access
```

## 59. app/api/admin/translate/route.ts:3

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE chat_limits SET count=CASE WHEN window_start<=? THEN 1 ELSE count+1 END,window_start=CASE WHEN window_start<=? THEN ? ELSE window_start END WHERE user_id=? AND (window_start<=? OR count<180)
```

## 60. app/api/chat/preferences/route.ts:5

- Function: `POST`
- Call kind: backend pair
- Triage: `DYNAMIC_SQL_REVIEW`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Dynamic expression:

```sql
...upsertSql.assistantPreferences
```

## 61. app/api/chat/route.ts:14

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT encrypted_key,model FROM chat_profiles WHERE user_id=?
```

## 62. app/api/chat/route.ts:14

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT id,title FROM chat_threads WHERE id=? AND user_id=?
```

## 63. app/api/chat/route.ts:14

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT id,role,body,created_at FROM chat_messages WHERE thread_id=? ORDER BY created_at,id
```

## 64. app/api/chat/route.ts:14

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
SELECT id,title,updated_at FROM chat_threads WHERE user_id=? ORDER BY updated_at DESC LIMIT 30
```

## 65. app/api/chat/route.ts:15

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM chat_profiles WHERE user_id=?
```

## 66. app/api/chat/route.ts:15

- Function: `handlePost`
- Call kind: backend pair
- Triage: `DYNAMIC_SQL_REVIEW`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Dynamic expression:

```sql
...upsertSql.chatProfile
```

## 67. app/api/chat/route.ts:15

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE chat_profiles SET encrypted_key=NULL,model=? WHERE user_id=?
```

## 68. app/api/chat/route.ts:15

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT id FROM chat_threads WHERE id=? AND user_id=?
```

## 69. app/api/chat/route.ts:15

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
DELETE FROM chat_messages WHERE thread_id=?
```

## 70. app/api/chat/route.ts:15

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
DELETE FROM chat_threads WHERE id=? AND user_id=?
```

## 71. app/api/chat/route.ts:15

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM chat_threads WHERE id=? AND user_id=?
```

## 72. app/api/chat/route.ts:15

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT count(*) AS n FROM chat_threads WHERE user_id=?
```

## 73. app/api/chat/route.ts:15

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT count(*) AS n FROM chat_messages WHERE thread_id=?
```

## 74. app/api/chat/route.ts:15

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT role,body FROM (SELECT role,body,created_at,id FROM chat_messages WHERE thread_id=? ORDER BY created_at DESC,id DESC LIMIT 20) ORDER BY created_at,id
```

## 75. app/api/chat/route.ts:15

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE chat_limits SET count=CASE WHEN window_start<=? THEN 1 ELSE count+1 END,window_start=CASE WHEN window_start<=? THEN ? ELSE window_start END,busy_until=? WHERE user_id=? AND busy_until<=? AND (window_start<=? OR count<20)
```

## 76. app/api/chat/route.ts:15

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO chat_threads(id,user_id,title,created_at,updated_at) VALUES(?,?,?,?,?)
```

## 77. app/api/chat/route.ts:15

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO chat_messages(id,thread_id,role,body,created_at) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM chat_threads WHERE id=? AND user_id=?)
```

## 78. app/api/chat/route.ts:15

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO chat_messages(id,thread_id,role,body,created_at) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM chat_threads WHERE id=? AND user_id=?)
```

## 79. app/api/chat/route.ts:15

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE chat_threads SET updated_at=? WHERE id=? AND user_id=?
```

## 80. app/api/chat/route.ts:15

- Function: `handlePost`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE chat_limits SET busy_until=0 WHERE user_id=?
```

## 81. app/api/chat/usage/route.ts:2

- Function: `GET`
- Call kind: prepare
- Triage: `DATE_TIME_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT date(created_at,'+5 hours') AS day,provider,count(*) AS requests,sum(coalesce(input_tokens,0)) AS inputTokens,sum(coalesce(output_tokens,0)) AS outputTokens,sum(CAST(cost_usd AS REAL)) AS knownCostUsd,sum(CASE WHEN cost_usd IS NULL THEN 1 ELSE 0 END) AS unpriced FROM ai_usage WHERE user_id=? AND created_at>=? GROUP BY day,provider ORDER BY day
```

## 82. app/api/chat/usage/route.ts:2

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT provider,model,status,input_tokens,output_tokens,cost_usd,duration_ms,created_at FROM ai_usage WHERE user_id=? ORDER BY created_at DESC LIMIT 50
```

## 83. app/api/chat/usage/route.ts:2

- Function: `GET`
- Call kind: prepare
- Triage: `REWRITE_REVIEW`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT count(*) AS requests,sum(coalesce(input_tokens,0)) AS inputTokens,sum(coalesce(output_tokens,0)) AS outputTokens,sum(CAST(cost_usd AS REAL)) AS knownCostUsd,sum(CASE WHEN cost_usd IS NULL THEN 1 ELSE 0 END) AS unpriced FROM ai_usage WHERE user_id=? AND created_at>=?
```

## 84. app/api/chat/voice/route.ts:8

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE voice_limits SET count=CASE WHEN window_start<=? THEN 1 ELSE count+1 END,window_start=CASE WHEN window_start<=? THEN ? ELSE window_start END WHERE user_id=? AND (window_start<=? OR count<12)
```

## 85. app/api/chat/voice/route.ts:8

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT data FROM settings WHERE id='site'
```

## 86. app/api/contact/route.ts:2

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO submissions (id,kind,ref,name,contact,data,status,created_at) VALUES (?,?,?,?,?,?,?,?)
```

## 87. app/api/feedback/route.ts:2

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO submissions (id,kind,ref,name,contact,data,status,created_at) VALUES (?,?,?,?,?,?,?,?)
```

## 88. app/api/files/route.ts:2

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM files WHERE id=?
```

## 89. app/api/files/route.ts:3

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO files (id,name,mime,is_public,created_at) VALUES (?,?,?,?,?)
```

## 90. app/api/notifications/route.ts:3

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT data FROM settings WHERE id=?
```

## 91. app/api/notifications/route.ts:3

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT id,kind,name,contact,ref,data,created_at FROM submissions ORDER BY created_at DESC LIMIT 200
```

## 92. app/api/notifications/route.ts:3

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT a.id,a.survey_id,a.participant,a.created_at,s.title FROM answers a JOIN surveys s ON s.id=a.survey_id ORDER BY a.created_at DESC LIMIT 200
```

## 93. app/api/notifications/route.ts:4

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT data FROM settings WHERE id=?
```

## 94. app/api/notifications/route.ts:4

- Function: `POST`
- Call kind: backend pair
- Triage: `REWRITE_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO settings(id,data) VALUES (?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data
```

## 95. app/api/publication-copy/route.ts:6

- Function: `publication`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT data FROM content WHERE id=? AND kind='publication' AND status='published'
```

## 96. app/api/publication-copy/route.ts:7

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT 1 FROM publication_access WHERE user_id=? AND publication_id=?
```

## 97. app/api/publication-copy/route.ts:8

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT 1 FROM publication_access WHERE user_id=? AND publication_id=?
```

## 98. app/api/publication-copy/route.ts:8

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO submissions(id,kind,ref,name,contact,data,status,created_at) VALUES (?,'publicationCopy',?,?,?,?, 'completed',?)
```

## 99. app/api/publication-copy/route.ts:8

- Function: `POST`
- Call kind: prepare
- Triage: `REWRITE_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO publication_access(user_id,publication_id,submission_id,created_at) VALUES(?,?,?,?) ON CONFLICT(user_id,publication_id) DO NOTHING
```

## 100. app/api/register/route.ts:3

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM content WHERE id=? AND kind='training' AND status='published'
```

## 101. app/api/register/route.ts:3

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO submissions (id,kind,ref,name,contact,data,status,created_at) SELECT ?,'registration',?,?,?,?, 'new',? WHERE NOT EXISTS(SELECT 1 FROM submissions WHERE kind='registration' AND ref=? AND contact=?) AND ( ?=0 OR (SELECT count(*) FROM submissions WHERE kind='registration' AND ref=? AND status!='closed') < ?)
```

## 102. app/api/research/results/route.ts:2

- Function: `GET`
- Call kind: prepare
- Triage: `DYNAMIC_SQL_REVIEW`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Dynamic expression:

```sql
'SELECT a.id,a.survey_id,a.version,a.participant,a.created_at,a.review,s.title,s.config'+sql+' ORDER BY a.created_at DESC,a.id DESC LIMIT ? OFFSET ?'
```

## 103. app/api/research/results/route.ts:2

- Function: `GET`
- Call kind: prepare
- Triage: `DYNAMIC_SQL_REVIEW`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Dynamic expression:

```sql
'SELECT count(*) AS n'+sql
```

## 104. app/api/research/route.ts:9

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM answers WHERE id=? AND (expires_at IS NULL OR expires_at>?)
```

## 105. app/api/research/route.ts:9

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE answers SET participant=?,review=? WHERE id=? AND participant=? AND review=?
```

## 106. app/api/research/route.ts:9

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM answers WHERE id=? AND (expires_at IS NULL OR expires_at>?)
```

## 107. app/api/research/route.ts:9

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE answers SET data=?,review=? WHERE id=? AND data=? AND review=?
```

## 108. app/api/research/route.ts:9

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT id,survey_id,data,review FROM answers WHERE id=? AND (expires_at IS NULL OR expires_at>?)
```

## 109. app/api/research/route.ts:9

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE answers SET review=? WHERE id=?
```

## 110. app/api/research/route.ts:9

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
DELETE FROM answers WHERE id=?
```

## 111. app/api/research/route.ts:9

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM surveys WHERE id=?
```

## 112. app/api/research/route.ts:9

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT count(*) AS n FROM answers WHERE survey_id=?
```

## 113. app/api/research/route.ts:9

- Function: `POST`
- Call kind: backend pair
- Triage: `DYNAMIC_SQL_REVIEW`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Dynamic expression:

```sql
...upsertSql.survey
```

## 114. app/api/site-state/route.ts:3

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT data FROM settings WHERE id='site'
```

## 115. app/api/site-update-seen/route.ts:3

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
SELECT version FROM site_update_views WHERE user_id=? ORDER BY seen_at DESC LIMIT 50
```

## 116. app/api/site-update-seen/route.ts:4

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT data FROM settings WHERE id='site'
```

## 117. app/api/site-update-seen/route.ts:4

- Function: `POST`
- Call kind: prepare
- Triage: `REWRITE_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO site_update_views(user_id,version,seen_at) VALUES(?,?,?) ON CONFLICT(user_id,version) DO NOTHING
```

## 118. app/api/subscribe/route.ts:11

- Function: `accountEmail`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT email,verified FROM login_credentials WHERE user_id=?
```

## 119. app/api/subscribe/route.ts:20

- Function: `remembered`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT contact,data,status FROM submissions WHERE id=? AND kind='subscriber'
```

## 120. app/api/subscribe/route.ts:30

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT status FROM submissions WHERE id=? AND kind='subscriber'
```

## 121. app/api/subscribe/route.ts:45

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT data FROM submissions WHERE id=? AND kind='subscriber'
```

## 122. app/api/subscribe/route.ts:47

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE submissions SET status='unsubscribed' WHERE id=? AND kind='subscriber'
```

## 123. app/api/subscribe/route.ts:56

- Function: `POST`
- Call kind: prepare
- Triage: `REWRITE_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO submissions (id,kind,ref,name,contact,data,status,created_at) VALUES (?,'subscriber',NULL,'Subscriber',?,?,'active',?) ON CONFLICT(id) DO NOTHING
```

## 124. app/api/subscribe/route.ts:58

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE submissions SET data=?,status='active',created_at=? WHERE id=? AND kind='subscriber' AND status='unsubscribed'
```

## 125. app/api/survey/route.ts:6

- Function: `GET`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT count(*) AS count,max(created_at) AS lastAt FROM answers WHERE survey_id=? AND version=? AND user_id=? AND (expires_at IS NULL OR expires_at>?)
```

## 126. app/api/survey/route.ts:7

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT deletion_hash FROM answers WHERE id=?
```

## 127. app/api/survey/route.ts:7

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
DELETE FROM answers WHERE id=?
```

## 128. app/api/survey/route.ts:7

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT id FROM answers WHERE survey_id=? AND version=? AND user_id=? AND (expires_at IS NULL OR expires_at>?) LIMIT 1
```

## 129. app/api/survey/route.ts:7

- Function: `POST`
- Call kind: prepare
- Triage: `REWRITE_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT OR IGNORE INTO surveys(id,title,description,consent,questions,status,version,config,created_at) VALUES(?,?,?,?,?,?,?,?,?)
```

## 130. app/api/survey/route.ts:7

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
DELETE FROM survey_sessions WHERE expires_at<?
```

## 131. app/api/survey/route.ts:7

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO survey_sessions(id,survey_id,version,token_hash,started_at,expires_at,status,user_id) VALUES(?,?,?,?,?,?,?,?)
```

## 132. app/api/survey/route.ts:7

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM survey_sessions WHERE id=? AND survey_id=? AND version=? AND expires_at>?
```

## 133. app/api/survey/route.ts:7

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE survey_sessions SET status='completed' WHERE id=? AND status='started'
```

## 134. app/api/survey/route.ts:7

- Function: `POST`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO answers (id,survey_id,version,data,participant,deletion_hash,expires_at,created_at,timing,user_id) VALUES (?,?,?,?,?,?,?,?,?,?)
```

## 135. lib/admin-edits.ts:20

- Function: `prepareEdit`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM settings WHERE id='site'
```

## 136. lib/admin-edits.ts:23

- Function: `prepareEdit`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT mime,is_public FROM files WHERE id=?
```

## 137. lib/admin-edits.ts:23

- Function: `prepareEdit`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT mime,is_public FROM files WHERE id=?
```

## 138. lib/admin-edits.ts:28

- Function: `prepareEdit`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM content WHERE id=?
```

## 139. lib/admin-edits.ts:31

- Function: `prepareEdit`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT mime,is_public FROM files WHERE id=?
```

## 140. lib/admin-edits.ts:31

- Function: `prepareEdit`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT mime,is_public FROM files WHERE id=?
```

## 141. lib/admin-edits.ts:37

- Function: `prepareEdit`
- Call kind: prepare
- Triage: `DYNAMIC_SQL_REVIEW`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Dynamic expression:

```sql
'SELECT * FROM '+entity+' WHERE id=?'
```

## 142. lib/admin-edits.ts:39

- Function: `prepareEdit`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT count(*) AS n FROM answers WHERE survey_id=?
```

## 143. lib/admin-edits.ts:44

- Function: `prepareEdit`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM surveys WHERE id=?
```

## 144. lib/admin-edits.ts:46

- Function: `prepareEdit`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT count(*) AS n FROM answers WHERE survey_id=?
```

## 145. lib/admin-edits.ts:48

- Function: `prepareEdit`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT data FROM settings WHERE id='site'
```

## 146. lib/admin-history.ts:3

- Function: `proposeEdit`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO admin_changes(id,user_id,entity,record_id,before_data,after_data,summary,state,created_at) VALUES(?,?,?,?,?,?,?,?,?)
```

## 147. lib/admin-history.ts:4

- Function: `editHistory`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT id,entity,record_id,summary,state,created_at,applied_at FROM admin_changes WHERE user_id=? ORDER BY created_at DESC LIMIT 50
```

## 148. lib/admin-history.ts:5

- Function: `editDetail`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM admin_changes WHERE id=? AND user_id=?
```

## 149. lib/admin-history.ts:7

- Function: `transitionEdit`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE admin_changes SET state='discarded' WHERE id=? AND user_id=? AND state='draft'
```

## 150. lib/admin-history.ts:11

- Function: `transitionEdit`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT count(*) AS n FROM answers WHERE survey_id=?
```

## 151. lib/admin-history.ts:17

- Function: `transitionEdit`
- Call kind: prepare
- Triage: `DYNAMIC_SQL_REVIEW`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Dynamic expression:

```sql
'UPDATE '+entity+' SET '+columns.filter(k=>k!=='id').map(k=>k+'=?').join(',')+' WHERE '+condition+' AND '+gate
```

## 152. lib/admin-history.ts:18

- Function: `transitionEdit`
- Call kind: prepare
- Triage: `DYNAMIC_SQL_REVIEW`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Dynamic expression:

```sql
'INSERT INTO '+entity+'('+columns.join(',')+') SELECT '+columns.map(()=>'?').join(',')+' WHERE '+condition+' AND '+gate
```

## 153. lib/admin-history.ts:19

- Function: `transitionEdit`
- Call kind: prepare
- Triage: `DYNAMIC_SQL_REVIEW`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Dynamic expression:

```sql
'DELETE FROM '+entity+' WHERE '+condition+' AND '+gate
```

## 154. lib/admin-history.ts:21

- Function: `transitionEdit`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE admin_changes SET state=?,applied_at=? WHERE id=? AND user_id=? AND state=? AND changes()=1
```

## 155. lib/admin-history.ts:21

- Function: `transitionEdit`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO audit(id,user_id,action,created_at) SELECT ?,?,?,? WHERE changes()=1
```

## 156. lib/assistant-environment.ts:9

- Function: `assistantEnvironment`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT data FROM settings WHERE id='site'
```

## 157. lib/assistant-environment.ts:10

- Function: `assistantEnvironment`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT data,status FROM content WHERE kind='skill' AND status='published' ORDER BY position LIMIT 60
```

## 158. lib/assistant-environment.ts:11

- Function: `assistantEnvironment`
- Call kind: backend pair
- Triage: `REWRITE_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT name FROM sqlite_master WHERE type='table' AND name='assistant_survey_drafts'
```

## 159. lib/assistant-preferences.ts:2

- Function: `preferences`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM assistant_preferences WHERE user_id=?
```

## 160. lib/chat-connections.ts:10

- Function: `connectionRows`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
SELECT * FROM chat_connections WHERE user_id=? ORDER BY position,updated_at
```

## 161. lib/chat-connections.ts:10

- Function: `connectionRows`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM chat_profiles WHERE user_id=?
```

## 162. lib/chat-connections.ts:13

- Function: `connectionAction`
- Call kind: prepare
- Triage: `REWRITE_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO chat_connections(id,user_id,provider,label,encrypted_key,models,model,voice_model,position,updated_at,region) VALUES(?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET label=excluded.label,encrypted_key=excluded.encrypted_key,models=excluded.models,model=excluded.model,voice_model=excluded.voice_model,position=excluded.position,updated_at=excluded.updated_at,region=excluded.region
```

## 163. lib/chat-connections.ts:13

- Function: `connectionAction`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE chat_profiles SET encrypted_key=NULL WHERE user_id=?
```

## 164. lib/chat-connections.ts:13

- Function: `connectionAction`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE chat_profiles SET active_connection=? WHERE user_id=?
```

## 165. lib/chat-connections.ts:13

- Function: `connectionAction`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE chat_profiles SET encrypted_key=NULL,model=? WHERE user_id=?
```

## 166. lib/chat-connections.ts:13

- Function: `connectionAction`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
DELETE FROM chat_connections WHERE id=? AND user_id=?
```

## 167. lib/chat-connections.ts:13

- Function: `connectionAction`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE chat_profiles SET model=?,active_connection=? WHERE user_id=?
```

## 168. lib/chat-connections.ts:13

- Function: `connectionAction`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE chat_connections SET model=? WHERE id=? AND user_id=?
```

## 169. lib/chat-connections.ts:13

- Function: `connectionAction`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE chat_profiles SET active_connection=? WHERE user_id=?
```

## 170. lib/chat-connections.ts:13

- Function: `connectionAction`
- Call kind: backend pair
- Triage: `DYNAMIC_SQL_REVIEW`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Dynamic expression:

```sql
...upsertSql.chatVoicePreferences
```

## 171. lib/chat-connections.ts:16

- Function: `multiReply`
- Call kind: prepare
- Triage: `REWRITE_REVIEW`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT sum(CAST(cost_usd AS REAL)) AS n FROM ai_usage WHERE user_id=? AND created_at>=?
```

## 172. lib/chat-connections.ts:16

- Function: `recordUsage`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO ai_usage(id,user_id,connection_id,provider,model,status,input_tokens,output_tokens,cost_usd,duration_ms,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)
```

## 173. lib/chat-limit-initialize.mjs:5

- Function: `prepareChatLimitInitialization`
- Call kind: backend pair
- Triage: `REWRITE_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT OR IGNORE INTO chat_limits(user_id,window_start,count,busy_until) VALUES(?,?,0,0)
```

## 174. lib/chat-profile-initialize.mjs:5

- Function: `prepareChatProfileInitialization`
- Call kind: backend pair
- Triage: `REWRITE_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT OR IGNORE INTO chat_profiles(user_id,model,updated_at) VALUES(?,?,?)
```

## 175. lib/chat-quota.ts:3

- Function: `takeDictationQuota`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE chat_limits SET count=CASE WHEN window_start<=? THEN 1 ELSE count+1 END,window_start=CASE WHEN window_start<=? THEN ? ELSE window_start END WHERE user_id=? AND (window_start<=? OR count<20)
```

## 176. lib/chat-request.ts:2

- Function: `withChatRequest`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT result FROM chat_requests WHERE user_id=? AND request_id=?
```

## 177. lib/chat-request.ts:2

- Function: `withChatRequest`
- Call kind: prepare
- Triage: `REWRITE_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT OR IGNORE INTO chat_requests(user_id,request_id,result,created_at) VALUES(?,?,NULL,?)
```

## 178. lib/chat-request.ts:2

- Function: `withChatRequest`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE chat_requests SET result=? WHERE user_id=? AND request_id=?
```

## 179. lib/chat-request.ts:2

- Function: `withChatRequest`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
DELETE FROM chat_requests WHERE user_id=? AND request_id=?
```

## 180. lib/chat-request.ts:2

- Function: `withChatRequest`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
DELETE FROM chat_requests WHERE created_at<? AND result IS NOT NULL
```

## 181. lib/chat-request.ts:2

- Function: `withChatRequest`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
DELETE FROM chat_requests WHERE user_id=? AND request_id=?
```

## 182. lib/consume-login-token.mjs:8

- Function: `consumeLoginToken`
- Call kind: prepare
- Triage: `TRANSACTION_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
DELETE FROM login_tokens WHERE token_hash=? AND kind=? AND expires_at>? RETURNING user_id
```

## 183. lib/intake-server.ts:2

- Function: `intakeSiteSettings`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT data FROM settings WHERE id='site'
```

## 184. lib/local-auth.ts:148

- Function: `localSession`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT c.*,a.role FROM login_sessions s JOIN login_credentials c ON c.user_id=s.user_id JOIN accounts a ON a.user_id=c.user_id WHERE s.token_hash=? AND s.expires_at>?
```

## 185. lib/local-auth.ts:150

- Function: `makeSession`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO login_sessions(token_hash,user_id,expires_at) VALUES(?,?,?)
```

## 186. lib/local-auth.ts:183

- Function: `loginEmail`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT name,email,verified FROM login_credentials WHERE user_id=?
```

## 187. lib/local-auth.ts:205

- Function: `recovery`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO login_tokens(token_hash,user_id,kind,expires_at) VALUES(?,?,?,?)
```

## 188. lib/local-auth.ts:319

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT data FROM settings WHERE id='site'
```

## 189. lib/local-auth.ts:323

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
DELETE FROM login_sessions WHERE token_hash=?
```

## 190. lib/local-auth.ts:333

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO login_tokens(token_hash,user_id,kind,expires_at) VALUES(?,?,?,?)
```

## 191. lib/local-auth.ts:357

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM login_credentials WHERE google_sub=?
```

## 192. lib/local-auth.ts:360

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT user_id FROM login_credentials WHERE email=?
```

## 193. lib/local-auth.ts:364

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO accounts(user_id,email,role) VALUES(?,?,'viewer')
```

## 194. lib/local-auth.ts:364

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO login_credentials(user_id,username,email,name,verified,google_sub,created_at) VALUES(?,?,?,?,1,?,?)
```

## 195. lib/local-auth.ts:376

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM login_credentials WHERE google_sub=?
```

## 196. lib/local-auth.ts:376

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT user_id FROM login_credentials WHERE email=?
```

## 197. lib/local-auth.ts:376

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO accounts(user_id,email,role) VALUES(?,?,'viewer')
```

## 198. lib/local-auth.ts:376

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO login_credentials(user_id,username,email,name,verified,google_sub,created_at) VALUES(?,?,?,?,1,?,?)
```

## 199. lib/local-auth.ts:378

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE login_credentials SET verified=1 WHERE user_id=?
```

## 200. lib/local-auth.ts:382

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT c.*,a.role FROM login_credentials c JOIN accounts a ON a.user_id=c.user_id WHERE lower(c.username)=? OR lower(c.email)=?
```

## 201. lib/local-auth.ts:384

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT user_id FROM login_credentials WHERE email=? OR username=?
```

## 202. lib/local-auth.ts:384

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO accounts(user_id,email,role) VALUES(?,?,'viewer')
```

## 203. lib/local-auth.ts:384

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO login_credentials(user_id,username,email,name,password_hash,verified,created_at) VALUES(?,?,?,?,?,0,?)
```

## 204. lib/local-auth.ts:386

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT user_id FROM login_credentials WHERE email=?
```

## 205. lib/local-auth.ts:386

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE accounts SET email=? WHERE user_id=?
```

## 206. lib/local-auth.ts:386

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE login_credentials SET password_hash=?,force_change=0,email=?,verified=? WHERE user_id=?
```

## 207. lib/local-auth.ts:386

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
DELETE FROM login_sessions WHERE user_id=?
```

## 208. lib/local-auth.ts:388

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM login_credentials WHERE email=?
```

## 209. lib/local-auth.ts:388

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
DELETE FROM login_tokens WHERE user_id=? AND kind='verify'
```

## 210. lib/local-auth.ts:390

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM login_credentials WHERE email=?
```

## 211. lib/local-auth.ts:390

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
DELETE FROM login_tokens WHERE user_id=? AND kind IN ('reset','reset_otp')
```

## 212. lib/local-auth.ts:390

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO login_tokens(token_hash,user_id,kind,expires_at) VALUES(?,?,?,?)
```

## 213. lib/local-auth.ts:392

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
DELETE FROM login_tokens WHERE user_id=? AND kind IN ('reset','reset_otp')
```

## 214. lib/local-auth.ts:392

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
UPDATE login_credentials SET password_hash=?,force_change=0,verified=1 WHERE user_id=?
```

## 215. lib/local-auth.ts:392

- Function: `localAuth`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
DELETE FROM login_sessions WHERE user_id=?
```

## 216. lib/login-attempt-sql.mjs:5

- Function: `prepareLoginAttempt`
- Call kind: backend pair
- Triage: `REWRITE_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO login_attempts(key,started_at,count) VALUES(?,?,1) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN started_at<? THEN 1 ELSE count+1 END,started_at=CASE WHEN started_at<? THEN excluded.started_at ELSE started_at END
```

## 217. lib/login-attempt-sql.mjs:12

- Function: `prepareLoginAttemptCount`
- Call kind: backend pair
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT count FROM login_attempts WHERE key=?
```

## 218. lib/node-identity.mjs:13

- Function: `resolveNodeIdentity`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT c.user_id,c.email,c.name,a.role FROM login_sessions s JOIN login_credentials c ON c.user_id=s.user_id JOIN accounts a ON a.user_id=c.user_id WHERE s.token_hash=? AND s.expires_at>?
```

## 219. lib/research-server.ts:5

- Function: `demosEnabled`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT data FROM settings WHERE id='site'
```

## 220. lib/research-server.ts:6

- Function: `getSurvey`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM surveys WHERE id=?
```

## 221. lib/research-server.ts:6

- Function: `getSurvey`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT data FROM settings WHERE id='site'
```

## 222. lib/research-server.ts:7

- Function: `purgeExpired`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
DELETE FROM answers WHERE expires_at IS NOT NULL AND expires_at<=?
```

## 223. lib/research-server.ts:8

- Function: `getResearchReport`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM answers WHERE survey_id=? AND version=? ORDER BY created_at
```

## 224. lib/research-server.ts:8

- Function: `getResearchReport`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT a.id,a.survey_id,a.participant,a.created_at,s.title FROM answers a JOIN surveys s ON s.id=a.survey_id WHERE a.expires_at IS NULL OR a.expires_at>? ORDER BY a.created_at DESC
```

## 225. lib/server.ts:12

- Function: `admin`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT role FROM accounts WHERE user_id=?
```

## 226. lib/server.ts:13

- Function: `audit`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT INTO audit (id,user_id,action,created_at) VALUES (?,?,?,?)
```

## 227. lib/server.ts:14

- Function: `publicData`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT data FROM settings WHERE id='site'
```

## 228. lib/server.ts:14

- Function: `publicData`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT * FROM content ORDER BY position
```

## 229. lib/server.ts:14

- Function: `publicData`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT user_id FROM accounts WHERE role='owner' LIMIT 1
```

## 230. lib/server.ts:14

- Function: `publicData`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT id,title,description,version,config,status FROM surveys ORDER BY created_at DESC
```

## 231. lib/server.ts:14

- Function: `publicData`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT id,name,data FROM submissions WHERE kind='feedback' AND status='approved' ORDER BY created_at DESC LIMIT 12
```

## 232. lib/server.ts:15

- Function: `throttle`
- Call kind: prepare
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Original SQL:

```sql
SELECT count(*) AS n FROM submissions WHERE contact=? AND kind=? AND created_at>?
```

## 233. lib/sql-backend.mjs:3

- Function: `prepareForBackend`
- Call kind: prepare
- Triage: `DYNAMIC_SQL_REVIEW`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Dynamic expression:

```sql
database.dialect === 'mysql' ? mysqlSql : d1Sql
```

## 234. lib/voice-limit-initialize.mjs:4

- Function: `prepareVoiceLimitInitialization`
- Call kind: backend pair
- Triage: `REWRITE_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: potentially
- Original SQL:

```sql
INSERT OR IGNORE INTO voice_limits(user_id,window_start,count) VALUES(?,?,0)
```

## 235. db/mysql-adapter.mjs:12

- Function: `execute`
- Call kind: adapter execution
- Triage: `DYNAMIC_SQL_REVIEW`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: requires review
- Transaction-sensitive: requires review
- Dynamic expression:

```sql
sql
```

## 236. db/mysql-adapter.mjs:53

- Function: `consumeLoginToken`
- Call kind: adapter execution
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
SELECT user_id FROM login_tokens WHERE token_hash=? AND kind=? AND expires_at>? FOR UPDATE
```

## 237. db/mysql-adapter.mjs:58

- Function: `consumeLoginToken`
- Call kind: adapter execution
- Triage: `REVIEW_REQUIRED`
- MySQL compatibility and rewrite: see reviewed cases; otherwise not semantically reviewed
- Security-sensitive: potentially
- Transaction-sensitive: potentially
- Original SQL:

```sql
DELETE FROM login_tokens WHERE token_hash=? AND kind=? AND expires_at>?
```

