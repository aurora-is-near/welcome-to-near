import LayoutWrapper from "@/components/Staking/components/LayoutWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
};

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <LayoutWrapper title="Portfolio" color="green">
    {children}
  </LayoutWrapper>
);

export default Layout;
