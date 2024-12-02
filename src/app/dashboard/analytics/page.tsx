import { CHART_INTERVALS } from '@/repositories/product-views';
import { createHrefWithUpdatedSearchparams } from '@/lib/utils';
import { getProducts } from '@/repositories/product';
import { auth } from '@clerk/nextjs/server';
import AnalyticsDropdown from './_components/Analytics-dropdown';
import ViewsByDayCard from './_components/_views_by_day/Card';
import ViewsByPPPGroupCard from './_components/_views_by_ppp_group/Card';

type SearchParams = Promise<{
  interval?: keyof typeof CHART_INTERVALS,
  timezone?: string,
  productId?: string,
}>

function getProductDropdownInformation(
  products: Awaited<ReturnType<typeof getProducts>>,
  searchParams: Awaited<SearchParams>,
) {
  return products.reduce(
    (
      productsDropdownAccumulator: Record<string, { key: string; label: string; href: string; }>,
      product,
    ) => {
      const productsDropdownNext = {
        ...productsDropdownAccumulator,
      };
      productsDropdownNext[`${product.id}`] = {
        key: product.id,
        label: product.name,
        href: createHrefWithUpdatedSearchparams(
          '/dashboard/analytics',
          searchParams,
          { productId: product.id },
        ),
      };

      return productsDropdownNext;
    },
    {
      'All Products': {
        key: 'All Products',
        label: 'All Products',
        href: createHrefWithUpdatedSearchparams(
          '/dashboard/analytics',
          searchParams,
          { productId: undefined },
        ),
      },
    },
  );
}

async function AnalyticsPage(props: { searchParams: SearchParams}) {
  // eslint-disable-next-line react/destructuring-assignment
  const searchParams = await props.searchParams;

  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }

  const { interval = 'last7Days', productId, timezone = 'UTC' } = searchParams;

  const currentInterval = CHART_INTERVALS[interval];
  const intervalsDropdown = Object.entries(CHART_INTERVALS).map(([key, value]) => ({
    key,
    label: value.label,
    href: createHrefWithUpdatedSearchparams(
      '/dashboard/analytics',
      searchParams,
      { interval: key },
    ),
  }));

  const currentProduct = productId ?? 'All Products';
  const products = await getProducts(userId);
  const productsDropdown = getProductDropdownInformation(products, searchParams);
  const currentProductLabel = productsDropdown[currentProduct].label;

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezoneDropdown = [
    {
      key: 'UTC',
      label: 'UTC',
      href: createHrefWithUpdatedSearchparams(
        '/dashboard/analytics',
        searchParams,
        { timezone: 'UTC' },
      ),
    },
    {
      key: userTimezone,
      label: userTimezone,
      href: createHrefWithUpdatedSearchparams(
        '/dashboard/analytics',
        searchParams,
        { timezone: userTimezone },
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-row justify-between gap-2">
        <h1 className="text-3xl font-semibold flex-grow">Analytics</h1>

        <AnalyticsDropdown currentLabel={currentInterval.label} items={intervalsDropdown} />
        <AnalyticsDropdown
          currentLabel={currentProductLabel}
          items={Object.values(productsDropdown)}
        />
        <AnalyticsDropdown currentLabel={timezone} items={timezoneDropdown} />
      </div>
      <div className="mt-6 flex flex-col gap-8">
        <ViewsByDayCard
          userId={userId}
          productId={productId}
          interval={currentInterval}
          timezone={timezone}
        />
        <ViewsByPPPGroupCard
          userId={userId}
          productId={productId}
          interval={currentInterval}
          timezone={timezone}
        />
      </div>
    </>
  );
}
export default AnalyticsPage;
