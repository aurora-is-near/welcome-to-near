import { AuroraTriangle, NearLogoFull } from "@/icons";
import Container from "./Container";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t">
      <Container className="py-12">
        <div className="flex flex-col flex-wrap items-center justify-between gap-7 xsm:flex-row">
          <NearLogoFull className="w-28" />
          <Link
            href="https://aurora.dev"
            target="_blank"
            rel="noreferrer noopener"
            className="group flex select-none gap-1 rounded-full bg-sand-4 px-3 py-[6px] text-sm hover:bg-aurora-gradient"
          >
            <span className="text-sand-10 group-hover:text-black">
              Powered by
            </span>
            <AuroraTriangle />
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
