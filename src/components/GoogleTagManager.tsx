import Script from "next/script";
import { SHOULD_SEND_ANALYTICS } from "@/utils/googleAnalytics";

export const GoogleAnalytics = () => {
  const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  return SHOULD_SEND_ANALYTICS && MEASUREMENT_ID ? (
    <>
      <Script
        id="google-tag-manager-analytics"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
      ></Script>
      <Script
        id="google-tag-manager-analytics-inline-script"
        dangerouslySetInnerHTML={{
          __html: `function gtag(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","${MEASUREMENT_ID}");`,
        }}
      ></Script>
    </>
  ) : null;
};
