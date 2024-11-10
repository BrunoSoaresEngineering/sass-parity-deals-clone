/* eslint-disable camelcase */
import { revalidateTag, unstable_cache } from 'next/cache';
import { cache } from 'react';

export const CACHE_TAGS = {
  products: 'products',
  subscription: 'subscription',
} as const;

export function getGlobalTag(tag: keyof typeof CACHE_TAGS) {
  return `global:${CACHE_TAGS[tag]}` as const;
}

export function getUserTag(userId: string, tag: keyof typeof CACHE_TAGS) {
  return `user:${userId}-${CACHE_TAGS[tag]}` as const;
}

export function getIdTag(id: string, tag: keyof typeof CACHE_TAGS) {
  return `id:${id}-${CACHE_TAGS[tag]}` as const;
}

type ValidTags =
  | ReturnType<typeof getGlobalTag>
  | ReturnType<typeof getUserTag>
  | ReturnType<typeof getIdTag>

// eslint-disable-next-line @typescript-eslint/no-explicit-any, function-paren-newline
export function dbCache<T extends (...args: any[]) => Promise<any>>(
  cb: Parameters<typeof unstable_cache<T>>[0],
  { tags }: { tags: ValidTags[] },
) {
  return cache(unstable_cache(cb, undefined, { tags: [...tags, '*'] }));
}

export function revalidateDbCache ({
  tag,
  userId,
  id,
}: {
  tag: keyof typeof CACHE_TAGS,
  userId?: string,
  id?: string
}) {
  revalidateTag(getGlobalTag(tag));

  if (userId) {
    revalidateTag(getUserTag(userId, tag));
  }

  if (id) {
    revalidateTag(getIdTag(id, tag));
  }
}

export function clearFullCache() {
  revalidateTag('*');
}
