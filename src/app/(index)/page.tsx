import Button from "@/components/Button";
import Container from "@/components/Container";
import { NearLogo, PlantIcon } from "@/icons";
import {
  ArrowDownIcon,
  ArrowTopRightOnSquareIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { CheckIcon } from "@heroicons/react/16/solid";
import { GiftIcon } from "@heroicons/react/24/outline";
import Explore from "./Explore";
import dynamic from "next/dynamic";
import Spinner from "@/components/Spinner";
import ConnectWalletButton from "./ConnectWalletButton";
import LearnSection from "./LearnSection";
import WalletsList from "./WalletsList";
import NearPrice from "./NearPrice";
import { Suspense } from "react";
import ChartLoader from "./ChartLoader";
import GetNearOptions from "./GetNearOptions";
import ManualConfigurationTrigger from "./ManualConfigurationTrigger";

const Swap = dynamic(() => import("./Swap"), {
  ssr: false,
  loading: () => <Spinner className="mx-auto" />,
});

export default function Home() {
  return (
    <div className="bg-sand-2">
      <section className="bg-stars bg-white pb-20 pt-16 sm:py-20">
        <Container maxWidthClassName="max-w-lg bg-white pb-20 pt-16 sm:py-24">
          <h1 className="text-center font-sans text-5xl font-medium leading-none tracking-tighter text-sand-12 sm:text-6xl md:text-7xl">
            Get started <br />
            with NEAR.
          </h1>
          <p className="mt-4 text-center font-sans text-lg leading-[1.3] tracking-wide text-sand-12 sm:mt-8 sm:text-xl">
            Gain an understanding of the open web and the role of NEAR in that
            vision.
          </p>
          <div className="mt-6 flex justify-center sm:mt-8">
            <Button href="#connect-wallet">
              Get started
              <ArrowDownIcon className="h-5 w-5 text-sand-dark-11" />
            </Button>
          </div>
        </Container>
      </section>

      <div className="relative space-y-10">
        <Container as="section" className="-mt-24 grid gap-5 lg:grid-cols-2">
          <Suspense fallback={<ChartLoader />}>
            <NearPrice />
          </Suspense>

          <div className="relative mx-auto flex w-full justify-between rounded-2xl bg-sand-1 p-4 shadow-custom-lg ring-1 ring-black/[0.03] sm:p-6 md:max-w-lg lg:max-w-none">
            <NearLogo className="absolute right-12 top-1/2 h-[180px] w-[180px] -translate-y-1/2 text-sand-5 opacity-50 sm:opacity-100" />
            <div className="relative ml-2 max-w-80 py-4 sm:ml-4 sm:py-6">
              <h3 className="font-sans text-2xl font-bold leading-[1.3] text-sand-12 sm:text-3xl">
                Learn more about NEAR Protocol.
              </h3>
              <p className="mt-2 text-base leading-normal tracking-wider text-sand-12 sm:mt-3.5">
                NEAR brings users to the main stage, setting up Web3 for mass
                adoption.
              </p>
            </div>
            <Button
              href="https://near.org/"
              target="_blank"
              rel="noreferrer noopener"
              className="relative w-12 bg-white"
              style="light-border"
            >
              <span className="sr-only">Learn more</span>
              <PlusIcon className="h-5 w-5 flex-shrink-0 text-sand-12" />
            </Button>
          </div>
        </Container>

        <Container as="section" id="connect-wallet">
          <div
            className="bg-small-stars relative overflow-hidden rounded-2xl bg-[#00EC97] shadow-custom"
            style={{
              backgroundImage: "url(/img/bg-stars-green.png)",
            }}
          >
            <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 pb-4 pt-12 sm:pb-6 sm:pt-16">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-12 sm:h-14 sm:w-14">
                <span className="mt-1 font-sans text-lg font-bold leading-normal tracking-wide text-green-1 sm:text-xl">
                  1
                </span>
              </div>
              <h2 className="mt-4 text-center font-sans text-2xl font-medium leading-[1.3] text-green-12 sm:text-[42px]">
                Connect your wallet
              </h2>
              <p className="mt-2 text-center text-base leading-normal tracking-wider text-green-12 sm:mt-4">
                NEAR Protocol supports both NEAR native and Ethereum wallets.
                Install your preferred wallet, set up your account, and connect
                below.
              </p>
              <div className="mt-6 sm:mt-8">
                <ConnectWalletButton />
              </div>
              <ManualConfigurationTrigger />
              <p className="mt-10 text-center text-sm font-semibold leading-normal tracking-wider text-green-11 sm:mt-14">
                Don’t have a wallet yet? Install any of the wallets below:
              </p>
            </div>

            <WalletsList />
          </div>
        </Container>

        <Container as="section">
          <div className="relative flex flex-col items-start gap-4 overflow-hidden rounded-2xl bg-sand-1 px-6 py-12 shadow-custom lg:flex-row lg:items-center lg:justify-between lg:gap-0 lg:py-14 lg:pl-8 lg:pr-16">
            <div className="absolute inset-y-0 -right-20 w-1/2 bg-red-200 bg-gradient-to-r from-sand-1 from-0% via-[#FFECBC] via-40% to-[#CFCFFF] to-90% opacity-60" />
            <div className="relative flex flex-col gap-13 sm:flex-row sm:items-center">
              <div className="relative hidden lg:block">
                <GiftIcon
                  className="h-[136px] w-[136px] text-sand-12"
                  style={{
                    strokeWidth: "1px",
                  }}
                />
                <div className="absolute -bottom-2.5 -right-3 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-sand-12">
                  <NearLogo className="h-[30px] w-[30px] text-sand-1" />
                </div>
              </div>
              <div>
                <h2 className="font-sans text-2xl font-bold leading-[1.3] text-sand-12 sm:text-3xl">
                  Earn NEAR by completing quests
                </h2>
                <p className="mt-2 text-base leading-normal tracking-wider text-sand-12">
                  Earn tokens by learning and completing onchain actions.
                </p>
                <div className="mt-3 inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-[#F3BA63] bg-[#FFECBC] px-3">
                  <CheckIcon className="h-4 w-4 text-[#FFA01C]" />
                  <span className="text-xs leading-[1.4] tracking-wider text-[#4E2009]">
                    Up to 2 NEAR in rewards
                  </span>
                </div>
              </div>
            </div>
            <Button
              className="relative"
              href="https://flipsidecrypto.xyz/earn/quests/near"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join on Flipside
              <ArrowTopRightOnSquareIcon className="h-5 w-5 text-sand-dark-11" />
            </Button>
          </div>
        </Container>

        <Container as="section">
          <div
            className="bg-small-stars overflow-hidden rounded-2xl bg-[#9797FF] shadow-custom"
            style={{
              backgroundImage: "url(/img/bg-stars-violet.png)",
            }}
          >
            <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 pb-4 pt-12 sm:pb-16 sm:pt-16">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-12 sm:h-14 sm:w-14">
                <span className="mt-1 font-sans text-lg font-bold leading-normal tracking-wide text-violet-1 sm:text-xl">
                  2
                </span>
              </div>
              <h2 className="mt-4 text-center font-sans text-2xl font-medium leading-[1.3] text-violet-12 sm:text-[42px]">
                Get NEAR
              </h2>
              <p className="mt-2 text-center text-base leading-normal tracking-wider text-violet-12 sm:mt-4">
                NEAR tokens can be acquired by purchasing them on cryptocurrency
                exchanges or by earning them through staking rewards, ecosystem
                participation, and airdrops.
              </p>
              <GetNearOptions />
            </div>
          </div>
        </Container>

        <Container as="section">
          <div className="relative flex flex-col items-start gap-4 overflow-hidden rounded-2xl bg-sand-1 px-6 py-12 shadow-custom lg:flex-row lg:items-center lg:justify-between lg:gap-0 lg:py-14 lg:pl-8 lg:pr-16">
            <div className="absolute inset-y-0 -right-20 w-1/2 bg-red-200 bg-gradient-to-r from-sand-1 from-0% via-[#CFCFFF] via-50% to-[#B2FFE3] opacity-60" />
            <div className="relative flex flex-col gap-13 sm:flex-row sm:items-center">
              <div className="relative hidden lg:block">
                <PlantIcon className="h-[136px] w-[136px] text-sand-12" />
                <div className="absolute -bottom-2.5 -right-3 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-sand-12">
                  <NearLogo className="h-[30px] w-[30px] text-sand-1" />
                </div>
              </div>
              <div>
                <h2 className="font-sans text-2xl font-bold leading-[1.3] text-sand-12 sm:text-3xl">
                  Stake NEAR and earn rewards.
                </h2>
                <p className="mt-2 text-base leading-normal tracking-wider text-sand-12">
                  Simply choose a validator that you like and delegate your
                  tokens to them.
                </p>
                <div className="mt-3 inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-[#F3BA63] bg-[#FFECBC] px-3">
                  <CheckIcon className="h-4 w-4 text-[#FFA01C]" />
                  <span className="text-xs leading-[1.4] tracking-wider text-[#4E2009]">
                    Up to 9% in rewards
                  </span>
                </div>
              </div>
            </div>
            <Button className="relative" href="/staking">
              Stake now
              <ArrowTopRightOnSquareIcon className="h-5 w-5 text-sand-dark-11" />
            </Button>
          </div>
        </Container>

        <Container as="section">
          <div
            className="bg-small-stars overflow-hidden rounded-2xl bg-cyan-9 shadow-custom"
            style={{
              backgroundImage: "url(/img/bg-stars-cyan.png)",
            }}
            id="swap"
          >
            <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 pb-4 pt-12 sm:pb-16 sm:pt-16">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-12 sm:h-14 sm:w-14">
                <span className="mt-1 font-sans text-lg font-bold leading-normal tracking-wide text-cyan-1 sm:text-xl">
                  3
                </span>
              </div>
              <h2 className="mt-4 text-center font-sans text-2xl font-medium leading-[1.3] text-cyan-12 sm:text-[42px]">
                Swap on NEAR
              </h2>
              <p className="mt-2 text-center text-base leading-normal tracking-wider text-cyan-12 sm:mt-4">
                We find the best price route for your swap by aggregating all
                the major liquidity sources on NEAR. Try your first swap now!
              </p>
              <div className="mt-6 w-full max-w-[480px] sm:mt-8">
                <Swap />
              </div>
            </div>
          </div>
        </Container>

        <section className="bg-sand-3">
          <Container className="flex flex-col items-center py-12 sm:py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sand-12 sm:h-14 sm:w-14">
              <PlusIcon className="h-6 w-6 text-sand-dark-12" />
            </div>
            <div className="max-w-lg">
              <h2 className="mt-4 text-center font-sans text-2xl font-medium leading-[1.3] text-sand-12 sm:text-[42px]">
                Explore dapps
              </h2>
              <p className="mt-2 text-center text-base leading-normal tracking-wider text-sand-12 sm:mt-4">
                Ready to explore NEAR further? Check out this list of dApps
                curated by the community.
              </p>
            </div>

            <Explore />

            <Button className="mt-6 sm:mt-8" href="/explore">
              Explore more
            </Button>
          </Container>
        </section>

        <LearnSection />
      </div>
    </div>
  );
}
