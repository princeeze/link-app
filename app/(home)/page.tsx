import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.svg";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <div className="w-full px-4 py-6 flex items-center justify-between">
        <Image src={logo} alt="logo" />
      </div>
      <div className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-10">
                <h1 className="heading-s sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Supercharge your dev experience
                </h1>
                <p className="mx-auto max-w-[700px] body-m md:text-xl dark:text-gray-400">
                  The best app for managing your tasks and projects.
                </p>
                <div className="space-x-4">
                  <Link
                    href="/dashboard/links
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
          </div>
        </section>
      </div>
      <div className="w-full h-20 flex items-center justify-center border-t text-gray-600 dark:border-gray-800 dark:text-gray-300">
        <p>&copy; 2024 Devlinks. All rights reserved.</p>
      </div>
    </div>
  );
}
