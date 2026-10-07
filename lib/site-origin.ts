import { headers } from 'next/headers';

const defaultOrigin = 'https://osump.chooh.moe';

export async function getSiteOrigin(): Promise<string> {
  const origins = (process.env.SITE_ORIGINS ?? defaultOrigin)
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => new URL(value));

  const requestHeaders = await headers();
  const hosts = [
    requestHeaders.get('x-forwarded-host')?.split(',')[0].trim(),
    requestHeaders.get('host'),
  ];

  return origins.find((origin) => hosts.includes(origin.host))?.origin
    ?? origins[0].origin;
}
