import { NearLogo, NearLogoFull } from "@/icons";
import Container from "./Container";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="border-t">
      <Container className="py-12">
        <div className="flex flex-col flex-wrap items-center justify-between gap-7 md:flex-row">
          <NearLogoFull className="w-28" />
          <Link
            href="https://aurora.dev"
            target="_blank"
            rel="noreferrer noopener"
            className="group flex select-none items-center whitespace-nowrap rounded-full bg-sand-4 px-3 py-[6px] text-xs hover:bg-aurora-gradient xsm:text-sm"
          >
            <span className="text-sand-10 group-hover:text-black">
              Powered by
            </span>

            <NearLogo className="mx-1 h-4 w-4 min-w-4 xsm:h-[18px] xsm:w-[18px] xsm:min-w-[18px]" />
            <span className="text-sand-10 group-hover:text-black">
              <span className="font-semibold text-black">NEAR</span>, developed
              by
            </span>

            <Image
              src="/img/aurora-triangle.svg"
              height={20}
              width={20}
              alt="Aurora"
              className="mx-[2px] h-[18px] w-[18px] min-w-[18px] xsm:mx-[2.5px] xsm:h-[20px] xsm:w-[20px] xsm:min-w-[20px]"
            />

            <span className="font-semibold text-black">Aurora</span>
          </Link>
          <div className="text-sm text-sand-12">
            &copy; {new Date().getFullYear()} Near.org
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
