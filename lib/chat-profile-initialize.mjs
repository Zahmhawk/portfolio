import {prepareForBackend} from './sql-backend.mjs';
// chat_profiles has one unique key, user_id. Existing profile values must not
// be changed by initialization and callers do not inspect affected-row counts.
export function prepareChatProfileInitialization(database) {
  return prepareForBackend(database,
    'INSERT OR IGNORE INTO chat_profiles(user_id,model,updated_at) VALUES(?,?,?)',
    'INSERT INTO chat_profiles(user_id,model,updated_at) VALUES(?,?,?) ON DUPLICATE KEY UPDATE user_id=user_id',
  );
}
