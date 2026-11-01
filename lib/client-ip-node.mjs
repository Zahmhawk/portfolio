import {isIP} from 'node:net';

// The HTTP server must supply the actual socket peer, never a request header.
// Only explicitly configured exact proxy addresses are trusted. The proxy must
// append the directly connected client address to X-Forwarded-For. Configure
// no proxies until Hostinger's routing behavior has been independently verified.
export function resolveClientIp(socketPeer, forwardedFor, trustedProxies = []) {
  const peer = typeof socketPeer === 'string' ? socketPeer.trim() : '';
  if (!isIP(peer)) return null;
  if (!trustedProxies.includes(peer) || typeof forwardedFor !== 'string') return peer;
  const chain=forwardedFor.split(',').map(value=>value.trim());
  const candidate=chain[chain.length-1];
  return candidate && isIP(candidate) ? candidate : peer;
}
