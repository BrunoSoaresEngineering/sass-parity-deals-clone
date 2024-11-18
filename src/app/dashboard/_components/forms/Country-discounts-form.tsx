'use client';

/* eslint-disable react/jsx-props-no-spreading */
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { productCountryDiscountsSchema } from '@/schemas/products';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateCountryDiscounts } from '@/server/actions/products';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type CountryDiscountsFormProps = {
  productId: string,
  countryGroups: {
    id: string,
    name: string,
    recommendedDiscountPercentage: number | null,
    countries: {
      name: string,
      code: string,
    }[],
    discount?:{
      coupon: string,
      discountPercentage: number,
    }
  }[]
}

function CountryDiscountsForm({ productId, countryGroups }: CountryDiscountsFormProps) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(productCountryDiscountsSchema),
    defaultValues: {
      groups: countryGroups.map(({
        id,
        discount,
        recommendedDiscountPercentage,
      }) => {
        const groupDiscount = discount?.discountPercentage ?? recommendedDiscountPercentage;
        return {
          countryGroupId: id,
          discountPercentage: groupDiscount ? groupDiscount * 100 : undefined,
          coupon: discount?.coupon ?? '',
        };
      }),
    },
  });

  async function onSubmitHandler(values: z.infer<typeof productCountryDiscountsSchema>) {
    const data = await updateCountryDiscounts(productId, values);

    if (data.message) {
      toast({
        title: data.error ? 'Error' : 'Success',
        description: data.message,
        variant: data.error ? 'destructive' : 'default',
      });
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmitHandler)}
      >
        {countryGroups.map((countryGroup, index) => (
          <Card key={countryGroup.id}>
            <CardContent className="pt-6 flex gap-16 items-center justify-between">
              <div>
                <h2 className="text-muted-foreground text-sm font-semibold mb-2">{countryGroup.name}</h2>
                <div className="flex flex-wrap gap-2">
                  {countryGroup.countries.map((country) => (
                    <Image
                      key={country.code}
                      src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country.code.toUpperCase()}.svg`}
                      alt={country.name}
                      width={24}
                      height={16}
                      className="border"
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-min flex-shrink-0">
                <div className="flex gap-4">
                  <div className="flex flex-col ">
                    <FormField
                      control={form.control}
                      name={`groups.${index}.discountPercentage`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount %</FormLabel>
                          <FormControl>
                            <Input
                              className="w-24"
                              type="number"
                              min={0}
                              max={100}
                              value={field.value ?? ''}
                              onChange={(value) => field.onChange(value.target.valueAsNumber)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col ">
                    <FormField
                      control={form.control}
                      name={`groups.${index}.coupon`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coupon</FormLabel>
                          <FormControl>
                            <Input
                              className="w-48"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormMessage>
                  {form.formState.errors.groups?.[index]?.root?.message}
                </FormMessage>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="submit"
          className="self-end"
          disabled={form.formState.isSubmitting}
        >
          Save
        </Button>
      </form>
    </Form>
  );
}

export default CountryDiscountsForm;
