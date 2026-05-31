'use client';

import Link from 'next/link';

export const Error403: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-96 gap-4 text-center">
    <div className="text-8xl font-bold text-neutral-200 dark:text-neutral-700">403</div>
    <h1 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">Permission denied</h1>
    <p className="text-neutral-500 dark:text-neutral-400">You don&apos;t have permission to access this page.</p>
    <Link
      href="/"
      className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium transition-colors"
    >
      Back Home
    </Link>
  </div>
);
