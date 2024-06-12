declare namespace NodeJS {
  interface ProcessEnv {
    SUPABASE_SERVICE_ROLE_KEY: string;
    NEXT_PUBLIC_VERCEL_ENV: string;
    NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: string;
    NEXT_PUBLIC_VERCEL_BRANCH_URL: string;
    SUPABASE_URL: string;
    COINGECKO_API_KEY: string;
    WC_PROJECT_ID: string;
    NEXT_PUBLIC_SENTRY_ENABLED: string;
    NEXT_PUBLIC_HELP_SCOUT_BEACON_ID: string;
    NEXT_PUBLIC_GA_MEASUREMENT_ID: string;
    NEXT_PUBLIC_SENTRY_DSN: string;
    NEXT_PUBLIC_CUSTOM_NEAR_RPC: string;
    nearEnv: string;
    explorerUrl: string;
    walletExplorerUrl: string;
    ethRpcForNear: string;
    nearNativeRpc: string;
    chainId: string;
  }
}

interface Window {
  gtag?: <T extends Record<string, any>>(
    commandName: string,
    eventName: string,
    additionalPayload?: T
  ) => void;
}
