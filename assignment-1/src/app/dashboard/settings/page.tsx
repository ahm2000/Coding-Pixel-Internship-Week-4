import Code from '@/components/Code';
import InfoCard from '@/components/InfoCard';

export default function Settings() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
      <div className="mt-4">
        <InfoCard>
          <Code>/dashboard/settings</Code> - a nested route under the dashboard segment. It inherits the dashboard
          layout&apos;s breadcrumbs without repeating any of that code.
        </InfoCard>
      </div>
    </div>
  );
}
