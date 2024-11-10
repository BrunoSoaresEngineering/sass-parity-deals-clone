/* eslint-disable react/jsx-props-no-spreading */

'use client';

import { z } from 'zod';
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productDetailsSchema } from '@/schemas/products';
import RequiredLabelIcon from '@/components/Required-label-icon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createProduct, updateProduct } from '@/server/actions/products';
import { useToast } from '@/hooks/use-toast';

type ProductDetailsFormProps = {
  product?: {
    id: string,
    name: string,
    url: string,
    description: string | null,
  }
}

function ProductDetailsForm({ product }: ProductDetailsFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof productDetailsSchema>>({
    resolver: zodResolver(productDetailsSchema),
    defaultValues: product ? { ...product, description: product.description ?? '' } : {
      name: '',
      url: '',
      description: '',
    },
  });

  async function onSubmit(values: z.infer<typeof productDetailsSchema>) {
    const action = product ? updateProduct.bind(null, product.id) : createProduct;
    const data = await action(values);

    if (data?.message) {
      toast({
        title: data.error ? 'Error' : 'Success',
        variant: data.error ? 'destructive' : 'default',
        description: data.message,
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Product Name
                  <RequiredLabelIcon />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Enter your website URL
                  <RequiredLabelIcon />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Include the protocol (http/https) and the full path to the sales page
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description</FormLabel>
              <FormControl>
                <Textarea className="min-h-20 resize-none" {...field} />
              </FormControl>
              <FormDescription>
                An optional description to help distinguish your product from other products
              </FormDescription>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="self-end"
        >
          Save
        </Button>
      </form>
    </Form>
  );
}
export default ProductDetailsForm;
