'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { CreateRoleBody } from '@/types/requests/role.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const roleFormSchema = z.object({
  name: z.string().min(1),
  isDefault: z.boolean(),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

type RoleFormProps = {
  initialValue?: Partial<CreateRoleBody>;
  onChange: (value: Partial<CreateRoleBody>) => void;
};

export const RoleForm: React.FC<RoleFormProps> = ({ initialValue, onChange }) => {
  const t = useTranslations();

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: initialValue?.name ?? '',
      isDefault: initialValue?.isDefault ?? false,
    },
  });

  useEffect(() => {
    onChange(form.getValues());
    const { unsubscribe } = form.watch((values) => onChange(values as Partial<CreateRoleBody>));
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('roles.form.name')}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('roles.form.name_placeholder')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-3">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>{t('roles.form.is_default')}</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

