import type { ReactNode } from 'react';

interface InfoCardProps {
  children: ReactNode;
  tone?: 'default' | 'accent' | 'danger';
}

const toneClasses: Record<NonNullable<InfoCardProps['tone']>, string> = {
  default: 'bg-white border-slate-200 text-slate-600',
  accent: 'bg-indigo-50/60 border-indigo-100 text-indigo-700',
  danger: 'bg-rose-50 border-rose-200 text-rose-700'
};

const InfoCard = ({ children, tone = 'default' }: InfoCardProps) => (
  <div className={`rounded-2xl border p-5 leading-relaxed text-[15px] ${toneClasses[tone]}`}>{children}</div>
);

export default InfoCard;
