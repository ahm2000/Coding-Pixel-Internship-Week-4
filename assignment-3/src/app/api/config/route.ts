import { readConfig } from '@/lib/config';

export async function GET() {
  try {
    const config = readConfig(process.env);
    return Response.json({ status: 'ok', apiBaseUrl: config.apiBaseUrl });
  } catch (error) {
    return Response.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
