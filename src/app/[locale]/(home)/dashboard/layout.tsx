import { BaseLayout } from '@/components/layouts/base-layout/BaseLayout';

export default function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <BaseLayout>{children}</BaseLayout>;
}
