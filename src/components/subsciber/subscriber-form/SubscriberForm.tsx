'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CreateSubscriberBody } from '@/types/requests/subscriber.type';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type SubscriberFormProps = {
  initialValue?: Partial<CreateSubscriberBody & { isConfirmed: boolean }>;
  onChange: (value: Partial<CreateSubscriberBody & { isConfirmed: boolean }>) => void;
  isEdit?: boolean;
};

export const SubscriberForm: React.FC<SubscriberFormProps> = ({ initialValue, onChange, isEdit }) => {
  const t = useTranslations();
  const [value, setValue] = useState({
    email: '',
    isConfirmed: false,
    ...initialValue,
  });

  const update = (patch: Partial<typeof value>) => {
    const next = { ...value, ...patch };
    setValue(next);
    onChange(next);
  };

  useEffect(() => {
    onChange(value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>{t('subscribers.form.email')}</Label>
        <Input
          type="email"
          value={value.email}
          onChange={(e) => update({ email: e.target.value })}
          placeholder={t('subscribers.form.email_placeholder')}
          disabled={isEdit}
        />
      </div>
      <div className="flex items-center gap-3">
        <Switch
          checked={value.isConfirmed}
          onCheckedChange={(checked) => update({ isConfirmed: checked })}
        />
        <Label>{t('subscribers.form.is_confirmed')}</Label>
      </div>
    </div>
  );
};

