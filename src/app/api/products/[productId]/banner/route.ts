import { getJavaScriptForBanner } from '@/components/banner/utils';
import { getCountryCode } from '@/lib/utils';
import { getProductForBanner } from '@/repositories/product';
import { createProductView } from '@/repositories/product-views';
import { checkRemoveBranding } from '@/server/permissions';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }>},
) {
  const { productId } = await params;

  const webHeaders = await headers();
  const requestUrl = webHeaders.get('referer') || webHeaders.get('origin');
  if (!requestUrl) {
    return notFound();
  }

  const countryCode = getCountryCode(request);
  if (!countryCode) {
    return notFound();
  }

  const {
    customization,
    discount,
    country,
    userId,
  } = await getProductForBanner({ id: productId, countryCode, url: requestUrl });
  if (!customization || !discount || !country) {
    return notFound();
  }

  const bannerJavaScript = await getJavaScriptForBanner(
    customization,
    discount,
    country.name,
    await checkRemoveBranding(userId),
  );

  await createProductView(productId, country.id);

  return new Response(bannerJavaScript, { headers: { 'content-type': 'text/javascript' } });
}
