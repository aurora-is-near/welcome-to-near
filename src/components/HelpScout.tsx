import Script from "next/script";

const HelpScout = () => {
  const HELP_SCOUT_BEACON_ID = process.env.NEXT_PUBLIC_HELP_SCOUT_BEACON_ID;
  return HELP_SCOUT_BEACON_ID ? (
    <>
      <Script
        id="helpscout"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `!function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});`,
        }}
      />
      <Script
        id="helpscout-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.Beacon('init', "${HELP_SCOUT_BEACON_ID}")`,
        }}
      />
    </>
  ) : null;
};

export default HelpScout;
