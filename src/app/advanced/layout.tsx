import LayoutWrapper from "@/components/Staking/components/LayoutWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advanced",
};

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <LayoutWrapper title="Advanced" color="white">
    {children}
  </LayoutWrapper>
);

export default Layout;
