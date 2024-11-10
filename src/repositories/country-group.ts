import { db } from '@/db';
import { CountryGroupTable } from '@/db/schema';
import { clearFullCache } from '@/lib/cache';
import { sql } from 'drizzle-orm';

export async function addCountryGroups(data: typeof CountryGroupTable.$inferInsert[]) {
  const { rowCount } = await db
    .insert(CountryGroupTable)
    .values(data)
    .onConflictDoUpdate({
      target: CountryGroupTable.name,
      set: {
        recommendedDiscountPercentage: sql.raw(
          `excluded.${CountryGroupTable.recommendedDiscountPercentage.name}`,
        ),
      },
    });

  const isUpdated = rowCount > 0;

  if (isUpdated) {
    clearFullCache();
  }

  return rowCount;
}

export async function getAll(options: Parameters<typeof db.query.CountryGroupTable.findMany>[0]) {
  return db.query.CountryGroupTable.findMany(options);
}

// { filters: Record<keyof typeof CountryGroupTable.$inferSelect, boolean> }
