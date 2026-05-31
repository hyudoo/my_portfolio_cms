'use client';

import Link from 'next/link';

export const Error404: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-96 gap-4 text-center">
    <div className="text-8xl font-bold text-neutral-200 dark:text-neutral-700">404</div>
    <h1 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">Page not found</h1>
    <p className="text-neutral-500 dark:text-neutral-400">The page you&apos;re looking for doesn&apos;t exist.</p>
    <Link
      href="/"
      className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium transition-colors"
    >
      Back Home
    </Link>
  </div>
);
