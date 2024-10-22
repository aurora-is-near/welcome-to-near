import Container from "@/components/Container";
import clsx from "clsx";

const LayoutWrapper = ({
  title,
  color,
  children,
}: Readonly<{
  title: string;
  color: "green" | "violet" | "cyan" | "white";
  children: React.ReactNode;
}>) => (
  <section
    className={clsx("bg-stars sm:pb-28 sm:pt-20 flex-1 pb-20 pt-16", {
      "bg-[#00EC97]": color === "green",
      "bg-[#9797FF]": color === "violet",
      "bg-cyan-9": color === "cyan",
      "bg-sand-2": color === "white",
    })}
  >
    <Container
      maxWidthClassName={clsx("sm:pb-12 sm:pt-8 max-w-[38rem] pb-9 pt-6", {
        "bg-[#00EC97]": color === "green",
        "bg-[#9797FF]": color === "violet",
        "bg-cyan-9": color === "cyan",
        "bg-sand-2": color === "white",
      })}
    >
      <h1
        className={clsx(
          "text sm:text-[42px] font-sans text-4xl font-medium leading-[1.3] text-green-12",
          {
            "text-green-12": color === "green",
            "text-violet-12": color === "violet",
            "text-cyan-12": color === "cyan",
            "text-sand-12": color === "white",
          }
        )}
      >
        {title}
      </h1>
      <div className="sm:mt-8 mt-6 space-y-5">{children}</div>
    </Container>
  </section>
);

export default LayoutWrapper;
