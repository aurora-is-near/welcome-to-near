"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import CookieBanner from "@/components/CookieBanner";
import { GoogleAnalytics } from "@/components/GoogleTagManager";
import HelpScout from "./HelpScout";

const COOKIES_CONSENT_NAME = "cookie-consent-given";

export default function CookiesConsent() {
  const [cookies, setCookie] = useCookies();
  const [consentGiven, setIsConsentGiven] = useState(false);
  useEffect(() => {
    setIsConsentGiven(cookies?.[COOKIES_CONSENT_NAME] === true);
  }, []);

  const giveConsent = useCallback(() => {
    const yearFromNow = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    );
    setCookie(COOKIES_CONSENT_NAME, true, { expires: yearFromNow });
    setIsConsentGiven(true);
  }, []);

  return (
    <>
      <HelpScout />
      {consentGiven ? (
        <>
          <GoogleAnalytics />
        </>
      ) : (
        <>
          <CookieBanner onClick={giveConsent} />
        </>
      )}
    </>
  );
}
