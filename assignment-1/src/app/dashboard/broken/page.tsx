export const dynamic = 'force-dynamic';

export default function Broken(): never {
  throw new Error('Deliberately broken to demonstrate error.tsx');
}
