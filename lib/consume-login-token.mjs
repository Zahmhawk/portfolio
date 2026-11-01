// D1's DELETE ... RETURNING is atomic. The MySQL adapter implements the same
// contract using a transaction and a row lock; callers must not emulate it with
// an unlocked SELECT followed by DELETE.
export async function consumeLoginToken(database, tokenHash, kind, now) {
  if (typeof database.consumeLoginToken === 'function') {
    return database.consumeLoginToken(tokenHash, kind, now);
  }
  return database.prepare('DELETE FROM login_tokens WHERE token_hash=? AND kind=? AND expires_at>? RETURNING user_id')
    .bind(tokenHash, kind, now).first();
}
