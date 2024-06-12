import { NearLogoFull } from "@/icons";
import Container from "./Container";

const Footer = () => {
  return (
    <footer className="border-t">
      <Container className="py-12">
        <div className="flex items-center justify-between">
          <NearLogoFull className="w-28" />
          <div className="text-sm text-sand-12">
            &copy; {new Date().getFullYear()} Near.org
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
