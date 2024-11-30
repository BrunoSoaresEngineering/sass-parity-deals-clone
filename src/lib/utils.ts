import { clsx, type ClassValue } from 'clsx';
import { NextRequest } from 'next/server';
import { twMerge } from 'tailwind-merge';
import { geolocation } from '@vercel/functions';
import { env } from '@/data/env/server';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCountryCode(request: NextRequest) {
  const geo = geolocation(request);
  if (!geo.country) {
    return process.env.NODE_ENV === 'development' ? env.TEST_COUNTRY_CODE : null;
  }

  return geo.country;
}

export function removeTrailingSlash(path: string) {
  return path.replace(/\/$/, '');
}

export function createHrefWithUpdatedSearchparams(
  href: string,
  oldSearchParams: Record<string, string>,
  newSearchParams: Record<string, string | undefined>,
) {
  const params = new URLSearchParams(oldSearchParams);
  Object.entries(newSearchParams).forEach(([key, value]) => {
    if (!value) {
      params.delete(key);
      return;
    }
    params.set(key, value);
  });

  return `${href}?${params.toString()}`;
}
