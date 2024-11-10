import { db } from '@/db';
import { CountryTable } from '@/db/schema';
import { clearFullCache } from '@/lib/cache';
import { sql } from 'drizzle-orm';

export async function addCountries(data: typeof CountryTable.$inferInsert[]) {
  const { rowCount } = await db
    .insert(CountryTable)
    .values(data)
    .onConflictDoUpdate({
      target: CountryTable.code,
      set: {
        name: sql.raw(`excluded.${CountryTable.name.name}`),
        countryGroupId: sql.raw(`excluded.${CountryTable.countryGroupId.name}`),
      },
    });

  const isUpdated = rowCount > 0;

  if (isUpdated) {
    clearFullCache();
  }

  return rowCount;
}
