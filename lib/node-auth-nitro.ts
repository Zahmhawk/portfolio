import { localAuth } from './local-auth';
import { getDatabase } from './database-provider-node.mjs';
import { resolveClientIp } from './client-ip-node.mjs';
import { loadEnvFile } from './env-loader.mjs';

type NodeAuthOptions = { database: any; settings?: Record<string, string | undefined>; trustedProxies?: string[] };

export function createNodeAuthMiddleware(options: NodeAuthOptions) {
  return async function nodeAuth(event: any, next: () => Promise<Response>) {
    const incoming = event.req;
    const nodeReq = incoming.runtime?.node?.req;
    const headers = new Headers(incoming.headers);
    for (const name of [...headers.keys()]) {
      if (name.startsWith('oai-authenticated-user-')) headers.delete(name);
    }
    if (nodeReq?.headers) {
      for (const name of Object.keys(nodeReq.headers)) {
        if (name.toLowerCase().startsWith('oai-authenticated-user-')) delete nodeReq.headers[name];
      }
    }
    const sessions = (headers.get('cookie') || '').split(';').map((x: string) => x.trim()).filter((x: string) => x.startsWith('portfolio_session='));
    if (sessions.length > 1) return new Response('Invalid session', { status: 400, headers: { 'Cache-Control': 'no-store' } });
    const peer = nodeReq?.socket?.remoteAddress;
    const ip = resolveClientIp(peer, headers.get('x-forwarded-for'), options.trustedProxies || []);
    headers.delete('cf-connecting-ip');
    const clean = new Request(incoming, { headers });
    const auth = await localAuth(clean, { ...options.settings, DB: options.database, CLIENT_IP: ip || 'unknown' } as any);
    if (auth.response) return auth.response;
    const request = auth.request || clean;
    if (nodeReq?.headers) {
      for (const [k, v] of request.headers.entries()) {
        if (k.startsWith('oai-authenticated-user-')) nodeReq.headers[k] = v;
      }
    }
    Object.assign(request, { context: incoming.context, runtime: incoming.runtime });
    event.req = request;
    return next();
  };
}

export default async function nodeAuth(event: any, next: () => Promise<Response>) {
  loadEnvFile();
  const trustedProxies = (process.env.TRUSTED_PROXY_IPS || '').split(',').map(x => x.trim()).filter(Boolean);
  return createNodeAuthMiddleware({ database: getDatabase(), settings: process.env, trustedProxies })(event, next);
}
