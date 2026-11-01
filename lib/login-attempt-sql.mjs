import {prepareForBackend} from './sql-backend.mjs';
// The login_attempts.key primary key is the sole conflict target. Both variants
// evaluate count first, then window start, preserving the existing 15 min window.
export function prepareLoginAttempt(database) {
  return prepareForBackend(database,
    'INSERT INTO login_attempts(key,started_at,count) VALUES(?,?,1) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN started_at<? THEN 1 ELSE count+1 END,started_at=CASE WHEN started_at<? THEN excluded.started_at ELSE started_at END',
    'INSERT INTO login_attempts(`key`,started_at,count) VALUES(?,?,1) ON DUPLICATE KEY UPDATE count=CASE WHEN started_at<? THEN 1 ELSE count+1 END,started_at=CASE WHEN started_at<? THEN VALUES(started_at) ELSE started_at END',
  );
}

export function prepareLoginAttemptCount(database) {
  return prepareForBackend(database,
    'SELECT count FROM login_attempts WHERE key=?',
    'SELECT count FROM login_attempts WHERE `key`=?',
  );
}
