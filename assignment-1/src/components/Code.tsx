import type { ReactNode } from 'react';

const Code = ({ children }: { children: ReactNode }) => (
  <code className="font-mono text-[13px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md border border-slate-200">
    {children}
  </code>
);

export default Code;
