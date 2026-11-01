import {prepareForBackend} from './sql-backend.mjs';
// The sole unique key is user_id. This initialization result is not inspected.
export function prepareVoiceLimitInitialization(database) {
  return prepareForBackend(database,
    'INSERT OR IGNORE INTO voice_limits(user_id,window_start,count) VALUES(?,?,0)',
    'INSERT INTO voice_limits(user_id,window_start,count) VALUES(?,?,0) ON DUPLICATE KEY UPDATE user_id=user_id',
  );
}
