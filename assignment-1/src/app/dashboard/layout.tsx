import Breadcrumbs from '@/components/Breadcrumbs';

export default function DashboardLayout({ children }: LayoutProps<'/dashboard'>) {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Breadcrumbs />
      {children}
    </main>
  );
}
