import { env } from '@/data/env/client';

/* eslint-disable react/no-danger */
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

function Banner({ canRemoveBranding, customization, mappings }: BannerProps) {
  const bannerMessage = Object.entries(mappings).reduce(
    (mappedMessage, [key, value]) => mappedMessage.replace(new RegExp(`{${key}}`, 'g'), value),
    customization.locationMessage.replace(/'/g, '&#39;'),
  );

  const prefix = customization.classPrefix ?? '';

  return (
    <>
      <style type="text/css">
        {`
          .${prefix}easy-ppp-container {
            all: revert;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5em;
            background-color: ${customization.backgroundColor};
            color: ${customization.textColor};
            font-size: ${customization.fontSize};
            font-family: inherit;
            ${customization.isSticky ? 'position: sticky;' : ''}
            left: 0;
            right: 0;
            top: 0;
            text-wrap: balance;
            text-align: center;
          }

          .${prefix}easy-ppp-branding {
            color: inherit;
            font-size: inherit;
            display: inline-block;
            text-decoration: underline;
          }
        `}
      </style>

      <div className={`${prefix}easy-ppp-container ${prefix}easy-ppp-override`}>
        <span
          className={`${prefix}easy-ppp-message ${prefix}easy-ppp-override`}
          dangerouslySetInnerHTML={{
            __html: bannerMessage,
          }}
        />

        {!canRemoveBranding && (
        <a
          className={`${prefix}easy-ppp-branding`}
          href={env.NEXT_PUBLIC_SERVER_URL}
        >
          Powered by Easy PPP
        </a>
        )}
      </div>
    </>

  );
}
export default Banner;
