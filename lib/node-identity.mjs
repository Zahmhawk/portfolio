import {hashToken} from './password-crypto.mjs';

// Request adapter for a future Node entrypoint; it is not wired into Nitro yet.
// No client-provided identity header survives, including unknown suffixes.
export async function resolveNodeIdentity(request, database, now = new Date()) {
  const headers = new Headers(request.headers);
  for (const key of [...headers.keys()]) if (key.startsWith('oai-authenticated-user-')) headers.delete(key);
  const cookies=(headers.get('cookie')||'').split(';').map(x=>x.trim()).filter(x=>x.startsWith('portfolio_session='));
  let user=null;
  if (cookies.length === 1) {
    const raw=cookies[0].slice('portfolio_session='.length);
    if (/^[A-Za-z0-9_-]{43}$/.test(raw)) {
      user=await database.prepare('SELECT c.user_id,c.email,c.name,a.role FROM login_sessions s JOIN login_credentials c ON c.user_id=s.user_id JOIN accounts a ON a.user_id=c.user_id WHERE s.token_hash=? AND s.expires_at>?').bind(hashToken(raw),now.toISOString()).first();
    }
  }
  if (user) {
    headers.set('oai-authenticated-user-id',user.user_id);
    headers.set('oai-authenticated-user-email',user.email);
    headers.set('oai-authenticated-user-full-name',encodeURIComponent(user.name));
    headers.set('oai-authenticated-user-full-name-encoding','percent-encoded-utf-8');
  }
  return {request:new Request(request,{headers}),user};
}
