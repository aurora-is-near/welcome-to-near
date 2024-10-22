"use client";

import { NearLogoFull } from "@/icons";
import Container from "./Container";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./Button";
import { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import ConnectWalletButton from "@/app/(index)/ConnectWalletButton";
import FreeTransactionCounter, {
  useFreeTxAmount,
} from "./FreeTransactionCounter";

const links = [
  {
    name: "Portfolio",
    url: "/portfolio",
  },
  {
    name: "Staking",
    url: "/staking",
  },
  {
    name: "Explore",
    url: "/explore",
  },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const data = useFreeTxAmount();
  useEffect(() => setMobileMenuOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-20 border-b border-sand-6 bg-white">
      <Container className="flex h-20 items-center justify-between">
        <div className="xl:min-w-[350px] flex items-center justify-start">
          <Link href="/">
            <span className="sr-only">Home</span>
            <NearLogoFull className="w-28" />
          </Link>
        </div>
        <div className="lg:hidden flex gap-3">
          <FreeTransactionCounter
            left={data?.left}
            max={data?.max}
            resetDate={data?.next_reset}
          />
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <nav className="lg:block hidden">
          <ul className="flex items-center space-x-2.5">
            {links.map((link) => {
              const active = pathname.startsWith(link.url);

              return (
                <li key={link.url}>
                  <Button
                    href={link.url}
                    size="sm"
                    style={active ? "primary" : "white"}
                  >
                    {link.name}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="lg:flex lg:items-center lg:justify-end xl:min-w-[350px] hidden gap-3">
          <FreeTransactionCounter
            left={data?.left}
            max={data?.max}
            resetDate={data?.next_reset}
          />{" "}
          <ConnectWalletButton />
        </div>
      </Container>
      <Dialog
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white">
          <Container className="border-b border-sand-6">
            <div className="flex h-20 items-center justify-between">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <span className="sr-only">Home</span>
                <NearLogoFull className="w-28" />
              </Link>

              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </Container>

          <Container>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-sand-6">
                <div className="space-y-2 py-6">
                  {links.map((link) => {
                    const active = link.url === pathname;

                    return (
                      <Link
                        key={link.url}
                        href={link.url}
                        className={clsx(
                          "-mx-3 block rounded-lg px-3 py-2 font-mono font-semibold leading-normal tracking-wide",
                          active ? "bg-sand-12 text-white" : "text-sand-12"
                        )}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
                <div className="py-6">
                  <ConnectWalletButton />
                </div>
              </div>
            </div>
          </Container>
        </DialogPanel>
      </Dialog>
    </header>
  );
};

export default Navbar;
