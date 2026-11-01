import {prepareForBackend} from './sql-backend.mjs';
// chat_limits has one unique key, user_id. No caller consumes the insert's
// affected-row count; a duplicate must leave quota and lock values unchanged.
export function prepareChatLimitInitialization(database) {
  return prepareForBackend(database,
    'INSERT OR IGNORE INTO chat_limits(user_id,window_start,count,busy_until) VALUES(?,?,0,0)',
    'INSERT INTO chat_limits(user_id,window_start,count,busy_until) VALUES(?,?,0,0) ON DUPLICATE KEY UPDATE user_id=user_id',
  );
}
