import Breadcrumbs from '@/components/Breadcrumbs';

export default function DashboardLayout({ children }: LayoutProps<'/dashboard'>) {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <Breadcrumbs />
      {children}
    </main>
  );
}
