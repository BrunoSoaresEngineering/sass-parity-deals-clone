import { z } from 'zod';

export const productDetailsSchema = z.object({
  name: z.string().min(1, 'Required'),
  url: z.string().url().min(1, 'Required'),
  description: z.string().optional(),
});

export const productCountryDiscountsSchema = z.object({
  groups: z.array(z.object({
    countryGroupId: z.string().min(1, 'Required'),
    discountPercentage: z
      .number()
      .max(100)
      .min(1)
      .or(z.nan())
      .transform((n) => (Number.isNaN(n) ? undefined : n))
      .optional(),
    coupon: z.string().optional(),
  }).refine(
    (value) => {
      const hasCoupon = value.coupon != null && value.coupon.length > 0;
      const hasDiscount = value.discountPercentage != null;
      return !(hasCoupon && !hasDiscount);
    },
    {
      message: 'A discount is required if a coupon code is provided',
      path: ['root'],
    },
  )),
});

export const productCustomizationSchema = z.object({
  locationMessage: z.string().min(1, 'Required'),
  backgroundColor: z.string().min(1, 'Required'),
  textColor: z.string().min(1, 'Required'),
  fontSize: z.string().min(1, 'Required'),
  isSticky: z.boolean(),
  bannerContainer: z.string().min(1, 'Required'),
  classPrefix: z.string().optional(),
});
