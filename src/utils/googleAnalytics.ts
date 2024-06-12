import { AnalyticsData, AnalyticsEvent } from "@/types/analytics";

export const SHOULD_SEND_ANALYTICS =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

/**
 * Send an event to Google Analytics.
 *
 * For recommended events:
 * @see https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag
 */
export function sendGaEvent<T extends keyof AnalyticsEvent>({
  name,
  parameters,
}: {
  name: T;
  parameters?: AnalyticsEvent[T];
}) {
  try {
    if (!SHOULD_SEND_ANALYTICS) return;
    if (window.gtag) {
      window.gtag<AnalyticsData>("event", name, parameters || {});
    }
  } catch (error) {
    console.error(error);
  }
}
