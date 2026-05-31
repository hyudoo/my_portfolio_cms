'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InfiniteSelect } from '@/components/ui/infinite-select';
import { Switch } from '@/components/ui/switch';
import { useInfiniteSelect } from '@/hooks/use-infinite-select';
import { roleRequest } from '@/requests/role.request';
import { CreateUserBody } from '@/types/requests/user.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const userFormSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  isActive: z.boolean(),
  roles: z.array(z.object({ id: z.number() })),
});

type UserFormValues = z.infer<typeof userFormSchema>;

type UserFormProps = {
  initialValue?: Partial<CreateUserBody>;
  onChange: (value: Partial<CreateUserBody>) => void;
  isEdit?: boolean;
};

export const UserForm: React.FC<UserFormProps> = ({ initialValue, onChange, isEdit }) => {
  const t = useTranslations();

  const fetchRoles = useCallback(async ({ search, skip, take }: { search: string; skip: number; take: number }) => {
    const res = await roleRequest.list({ keyword: search, skip, take });
    return {
      items: res.roles.map((r) => ({ value: String(r.id), label: r.name })),
      total: res.total,
    };
  }, []);

  const roleSelect = useInfiniteSelect(fetchRoles);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: initialValue?.username ?? '',
      email: initialValue?.email ?? '',
      isActive: initialValue?.isActive ?? true,
      roles: initialValue?.roles ?? [],
    },
  });

  useEffect(() => {
    onChange(form.getValues());
    const { unsubscribe } = form.watch((values) => onChange(values as Partial<CreateUserBody>));
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('users.form.display_name')}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('users.form.display_name_placeholder')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('users.form.email')}</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder={t('users.form.email_placeholder')} disabled={isEdit} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('users.form.roles')}</FormLabel>
              <InfiniteSelect
                multiple
                value={field.value.map((r) => String(r.id))}
                onChange={(ids) => field.onChange(ids.map((id) => ({ id: Number(id) })))}
                placeholder={t('users.form.roles_placeholder')}
                searchPlaceholder={t('users.form.roles_search')}
                {...roleSelect}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-3">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>{t('users.form.is_active')}</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

