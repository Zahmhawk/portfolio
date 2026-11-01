import { env } from 'cloudflare:workers';

// Cloudflare implementation of the storage boundary. Authentication and file
// visibility remain enforced by the file route, never by direct object URLs.
export function getFileStorage() {
  return env.BUCKET ?? null;
}
