'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export function AuthBrandPanel() {
  const t = useTranslations('auth.brand');

  const features = [t('feature_1'), t('feature_2'), t('feature_3')];

  return (
    <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-linear-to-br from-sky-500 via-sky-600 to-sky-800">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-16 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-12 w-80 h-80 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="absolute top-1/2 right-8 w-48 h-48 rounded-full bg-white/5 blur-2xl" />

      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full px-14 py-12 text-white">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-xl font-bold">
            P
          </div>
          <div>
            <div className="font-bold text-lg leading-tight">{t('app_name')}</div>
            <div className="text-sky-200 text-xs">{t('cms_admin')}</div>
          </div>
        </motion.div>

        {/* Main copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-4xl font-bold leading-snug mb-5">{t('tagline')}</h1>
          <p className="text-sky-100 text-base leading-relaxed max-w-sm">{t('description')}</p>

          <ul className="mt-10 space-y-4">
            {features.map((feature, i) => (
              <motion.li
                key={feature}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 text-sky-50"
              >
                <CheckCircle2 className="text-white/70 size-4 shrink-0" />
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Footer quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-t border-white/20 pt-8"
        >
          <p className="text-sky-200 text-sm italic">&ldquo;{t('footer_quote')}&rdquo;</p>
        </motion.div>
      </div>
    </div>
  );
}
