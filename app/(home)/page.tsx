import Image from "next/image";
import Link from "next/link";

import logo from "@/public/logo.svg";

import { buttonVariants } from "@/components/ui/button";
import { FlipWords } from "@/components/ui/flip-words";

const words = ["professional", "career", "personal", "creative", "business"];

export default function Home() {
  return (
    <div className="relative mx-auto flex h-screen max-w-screen-xl items-center justify-center bg-white px-4 bg-dot-black/[0.2] dark:bg-[#000000] dark:bg-dot-white/[0.2] md:px-10">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <div className="relative z-20 w-full space-y-10 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent">
        <Image src={logo} alt="logo" className="w-36" />
        <h1 className="heading-m text-4xl font-medium text-grey-dark lg:text-5xl">
          Showcase your{" "}
          <FlipWords
            className="-ml-2 block py-3 text-gray-600 sm:inline sm:py-0"
            words={words}
          />
          <br className="hidden sm:inline" /> links with style.
        </h1>
        <p className="body-m text-grey-default md:text-xl">
          Easily manage and share all your essential links in one streamlined
          profile.
        </p>
        <div className="space-x-4">
          <Link
            href="/links
                    "
            className={buttonVariants({
              variant: "default",
            })}
          >
            Get Started
          </Link>
          <a
            href="https://www.github.com/princeeze"
            target="_blank"
            className={buttonVariants({
              variant: "secondary",
            })}
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}
