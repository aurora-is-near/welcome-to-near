import Button from "@/components/Button";
import Container from "@/components/Container";
import {
  BookOpenIcon,
  BookPageIcon,
  DocIcon,
  ReceiptIcon,
  UsersIcon,
} from "@/icons";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

const links = {
  learn: [
    {
      title: "Docs",
      description:
        "Read the NEAR documentation and learn to build and publish blockchain applications.",
      icon: DocIcon,
      link: "https://docs.near.org",
    },
    {
      title: "Blog",
      description:
        "The latest news about the NEAR Protocol and innovations from the community.",
      icon: ReceiptIcon,
      link: "https://near.org/blog",
    },
    {
      title: "Learn Center",
      description:
        "Starter kit to learn about blockchain technology, web3, and the NEAR protocol.",
      icon: BookOpenIcon,
      link: "https://learn.near.org",
    },
  ],
  community: [
    {
      title: "DevHub",
      description:
        "DevHub is a decentralized community where NEAR developers can share ideas, match solutions, and access support and funding.",
      imgUrl: "/img/devhub.png",
      link: "https://dev.near.org/devhub.near/widget/app?page=communities",
    },
    {
      title: "Horizon",
      description:
        "Horizon is an early stage accelerator for Web3 founders to build, connect, and grow.",
      imgUrl: "/img/horizon.png",
      link: "https://near.org/horizon",
    },
    {
      title: "NEAR Digital Collective (NDC)",
      description:
        "The NDC is a grassroots, community-led movement to build decentralized governance on NEAR.",
      imgUrl: "/img/ndc.png",
      link: "https://app.neardc.org/",
    },
  ],
  news: [
    {
      title: "NEAR Protocol on X",
      description: "@NEARProtocol",
      imgUrl: "/img/near-x.png",
      link: "https://twitter.com/nearprotocol",
    },
    {
      title: "NEARWEEK",
      description: "nearweekapp.com",
      imgUrl: "/img/near-week.png",
      link: "https://dev.near.org/nearweekapp.near/widget/nearweek.com",
    },
    {
      title: "Discord",
      description: "@NEARProtocol",
      imgUrl: "/img/discord.png",
      link: "http://near.chat/",
    },
  ],
};

const Link = ({
  title,
  description,
  link,
  icon: Icon,
  imgUrl,
}: {
  title: string;
  description: string;
  link: string;
  icon?: any;
  imgUrl?: string;
}) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="block rounded-2xl border-2 border-sand-dark-7 p-6 hover:bg-sand-dark-5 focus:outline-sand-dark-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:p-10"
  >
    {imgUrl ? (
      <Image
        height={72}
        width={72}
        src={imgUrl}
        className="h-14 w-14 overflow-hidden rounded-full object-contain sm:h-18 sm:w-18"
        alt=""
      />
    ) : (
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sand-dark-7 sm:h-18 sm:w-18">
        <Icon className="h-6 w-6 text-sand-dark-12 sm:h-8 sm:w-8" />
      </div>
    )}
    <h4 className="mt-4 font-sans text-xl leading-[1.3] tracking-wide text-sand-dark-12 sm:mt-6">
      {title}
    </h4>
    <p className="mt-1.5 text-sm leading-normal tracking-wider text-sand-dark-11">
      {description}
    </p>
  </a>
);

const LearnSection = () => {
  return (
    <section className="!mt-0 bg-sand-dark-1 py-20 sm:py-28">
      <Container>
        <h2 className="text-center font-sans text-2xl font-medium leading-[1.3] text-sand-dark-12 sm:text-[42px]">
          Learn, connect & collaborate.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-base leading-normal tracking-wider text-sand-dark-12 sm:mt-4">
          Join a vibrant community of innovators and builders creating a more
          open web.
        </p>
        <div className="mt-10 space-y-5">
          <div className="rounded-2xl bg-sand-dark-4 px-4 py-8 sm:p-10">
            <div className="flex items-center gap-x-4">
              <BookPageIcon className="h-7 w-7 text-green-10 sm:h-8 sm:w-8" />
              <h3 className="font-sans text-2xl font-medium leading-[1.3] text-green-10 sm:text-3xl">
                Learn
              </h3>
            </div>
            <div className="mt-6 grid gap-5 sm:mt-10 md:grid-cols-3">
              {links.learn.map((item) => (
                <Link key={item.title} {...item} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-sand-dark-4 px-4 py-8 sm:p-10">
            <div className="flex flex-col items-start gap-y-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-x-4">
                <UsersIcon className="h-7 w-7 text-cyan-10 sm:h-8 sm:w-8" />
                <h3 className="font-sans text-2xl font-medium leading-[1.3] text-cyan-10 sm:text-3xl">
                  Community
                </h3>
              </div>
              <Button
                style="light-border"
                className="border-opacity-30"
                href="https://near.org/ecosystem"
                target="_blank"
                rel="noreferrer noopener"
              >
                Explore the ecosystem
                <ArrowRightIcon className="h-5 w-5 text-sand-10" />
              </Button>
            </div>
            <div className="mt-6 grid gap-5 sm:mt-10 md:grid-cols-3">
              {links.community.map((item) => (
                <Link key={item.title} {...item} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-sand-dark-4 px-4 py-8 sm:p-10">
            <div className="flex items-center gap-x-4">
              <UsersIcon className="h-7 w-7 text-violet-6 sm:h-8 sm:w-8" />
              <h3 className="font-sans text-2xl font-medium leading-[1.3] text-violet-6 sm:text-3xl">
                News
              </h3>
            </div>
            <div className="mt-6 grid gap-5 sm:mt-10 md:grid-cols-3">
              {links.news.map((item) => (
                <Link key={item.title} {...item} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default LearnSection;
