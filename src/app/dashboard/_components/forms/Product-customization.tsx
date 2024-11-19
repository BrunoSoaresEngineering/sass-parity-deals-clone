/* eslint-disable react/jsx-props-no-spreading */

'use client';

import RequiredLabelIcon from '@/components/Required-label-icon';
import { Button } from '@/components/ui/button';
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { productCustomizationSchema } from '@/schemas/products';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Props = {
  customization: {
    locationMessage: string;
    backgroundColor: string;
    textColor: string;
    fontSize: string;
    isSticky: boolean;
    bannerContainer: string;
    classPrefix?: string | null;
  },
  canCustomizeBanner: boolean,
  canRemoveBranding: boolean
};

function ProductCustomizationForm({ customization, canCustomizeBanner }: Props) {
  const form = useForm<z.infer<typeof productCustomizationSchema>>({
    resolver: zodResolver(productCustomizationSchema),
    defaultValues: {
      ...customization,
      classPrefix: customization.classPrefix ?? '',
    },
  });
  return (
    <>
      <div>
        Banner
      </div>
      <Form {...form}>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="locationMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    PPP Discount Message
                    <RequiredLabelIcon />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-20 resize-none"
                      disabled={!canCustomizeBanner}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {'Data Parameters: {country}, {coupon}, {discount}'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="backgroundColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Background Color
                      <RequiredLabelIcon />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!canCustomizeBanner}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="textColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Text Color
                      <RequiredLabelIcon />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!canCustomizeBanner}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fontSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Font Size
                      <RequiredLabelIcon />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!canCustomizeBanner}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isSticky"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sticky?</FormLabel>
                    <FormControl>
                      <Switch
                        className="block"
                        disabled={!canCustomizeBanner}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bannerContainer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Banner Container
                      <RequiredLabelIcon />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!canCustomizeBanner}
                      />
                    </FormControl>
                    <FormDescription>
                      HTML container selector where you want to place the banner.
                      Ex: #container, .container, body
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="classPrefix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CSS Prefix</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!canCustomizeBanner}
                      />
                    </FormControl>
                    <FormDescription>
                      An optional prefix added to all CSS classes to avoid conflicts
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {canCustomizeBanner && (
            <Button type="submit">
              Save
            </Button>
          )}
        </form>
      </Form>
    </>
  );
}
export default ProductCustomizationForm;
