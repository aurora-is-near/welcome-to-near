import LayoutWrapper from "@/components/Staking/components/LayoutWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
};

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <LayoutWrapper title="Account" color="white">
    {children}
  </LayoutWrapper>
);

export default Layout;
