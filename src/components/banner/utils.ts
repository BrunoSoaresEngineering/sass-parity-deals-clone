import { createElement } from 'react';
import Banner from './Banner';

type BannerProps = {
  canRemoveBranding: boolean,
  mappings: {
    country: string,
    discount: string,
    coupon: string
  },
  customization: {
    locationMessage: string;
    backgroundColor: string;
    textColor: string;
    fontSize: string;
    isSticky: boolean;
    bannerContainer: string;
    classPrefix?: string | null;
  }
}

async function getJavaScriptForBanner(
  customization: BannerProps['customization'],
  discount: {
    coupon: string,
    percentage: number,
  },
  country: string,
  canRemoveBranding: boolean,
) {
  const mappings = {
    coupon: discount.coupon,
    discount: (discount.percentage * 100).toString(),
    country,
  };

  // Avoids Next.js error on importing the lib statically
  const { renderToStaticMarkup } = await import('react-dom/server');
  const bannerHTML = renderToStaticMarkup(createElement(Banner, {
    customization,
    mappings,
    canRemoveBranding,
  }), {
  });

  const javascript = `
    const banner = document.createElement("div");
    banner.innerHTML = '${bannerHTML}';
    document.querySelector("body").prepend(banner);
  `.replace(/(\r\n|\r|\n)/g, '');

  return javascript;
}

export {
  getJavaScriptForBanner,
};
