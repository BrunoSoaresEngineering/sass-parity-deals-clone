import { getJavaScriptForBanner } from '@/components/banner/utils';
import { getCountryCode } from '@/lib/utils';
import { getProductForBanner } from '@/repositories/product';
import { notFound } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }>},
) {
  const { productId } = await params;
  const countryCode = getCountryCode(request);

  if (!countryCode) {
    return notFound();
  }

  const {
    customization,
    discount,
    country,
  } = await getProductForBanner({ id: productId, countryCode });
  if (!customization || !discount || !country) {
    return notFound();
  }

  const bannerJavaScript = await getJavaScriptForBanner(customization, discount, country.name);

  return new Response(bannerJavaScript, { headers: { 'content-type': 'text/javascript' } });
}
