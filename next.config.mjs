import { withSentryConfig } from "@sentry/nextjs";

const cspHeader = `
  default-src 'self';
  script-src 'self' www.googletagmanager.com 'unsafe-inline' beacon-v2.helpscout.net;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  img-src 'self' blob: data: cdn.zerion.io assets.ref.finance https://api.web3modal.org;
  font-src 'self' fonts.gstatic.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  worker-src 'self' blob:;
  frame-ancestors 'self' *.walletconnect.com *.walletconnect.org;
  connect-src 'self' d3hb14vkzrxvla.cloudfront.net beaconapi.helpscout.net chatapi.helpscout.net *.near.org *.ref-finance.com *.ref.finance *.aurora.dev api.web3modal.com *.walletconnect.org *.walletconnect.com *.sentry.io wss://relay.walletconnect.com wss://relay.walletconnect.org *.walletlink.org wss://www.walletlink.org *.coinbase.com https://rpc.testnet.near.org https://closerpc.aurora.dev https://api.web3modal.org www.googletagmanager.com *.google-analytics.com;
  frame-src  *.walletconnect.org *.walletconnect.com;
`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // REF WIDGET NETWORK CONFIG
    NEAR_ENV: process.env.nearEnv,
    nearEnv: process.env.nearEnv,
    explorerUrl: process.env.explorerUrl,
    walletExplorerUrl: process.env.walletExplorerUrl,
    ethRpcForNear: process.env.ethRpcForNear,
    nearNativeRpc: process.env.nearNativeRpc,
    chainId: process.env.chainId,
    WC_PROJECT_ID: process.env.WC_PROJECT_ID,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dashboard-assets.dappradar.com",
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    });

    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
        path: false,
        os: false,
      },
    };
    return config;
  },
  headers: async () => {
    if (!process.env.NEXT_PUBLIC_VERCEL_ENV) return [];
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};

const sentryConfig = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  tunnelRoute: "/monitoring-tunnel",
};

export default withSentryConfig(nextConfig, sentryConfig);
