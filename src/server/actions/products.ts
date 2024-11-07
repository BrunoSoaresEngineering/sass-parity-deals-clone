'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { productDetailsSchema } from '@/schemas/products';
import { auth } from '@clerk/nextjs/server';
import { createProduct as createProductDB } from '@/repositories/product';

// eslint-disable-next-line consistent-return
export async function createProduct(
  unsafeData: z.infer<typeof productDetailsSchema>,
): Promise<{ error: boolean, message: string} | undefined> {
  const { userId } = await auth();
  const { success, data } = productDetailsSchema.safeParse(unsafeData);

  if (!userId || !success) {
    return {
      error: true,
      message: 'There was an error creating your product. Please try again.',
    };
  }

  const { id } = await createProductDB({ clerkUserId: userId, ...data });

  redirect(`/dashboard/products/${id}/edit?tab=countries`);
}
