import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

declare global {
  interface Window {
    stakingInitialPage: string | null;
  }
}
/**
 * @description If user comes through a link to a validator page or some other non root validator page then send him back to ROOT of staking page
 */
export function setIntialStakingPage(pathname: string) {
  window.stakingInitialPage = pathname === "/staking" ? null : pathname;
}

export function goBack(router: AppRouterInstance) {
  return () => {
    if (window.stakingInitialPage === null) {
      router.back();
      return;
    }
    window.stakingInitialPage = null;
    router.push("/staking");
  };
}
