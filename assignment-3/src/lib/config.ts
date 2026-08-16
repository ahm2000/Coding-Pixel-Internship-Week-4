export interface AppConfig {
  apiBaseUrl: string;
}

// Fails loudly on a missing variable instead of returning undefined and
// letting the problem surface somewhere far from its actual cause.
export const readConfig = (env: NodeJS.ProcessEnv | Record<string, string | undefined>): AppConfig => {
  const apiBaseUrl = env.API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error('API_BASE_URL is missing. Set it in .env.local (see .env.example).');
  }
  return { apiBaseUrl };
};
