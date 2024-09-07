import {
  ArrowRight,
  GithubLogo,
  LinkedinLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/utils";

interface CardProps {
  variant: "github" | "youtube" | "linkedin" | undefined;
  link: string | undefined;
}

const Card = ({ variant, link }: CardProps) => {
  const cardLogo = () => {
    switch (variant) {
      case "github": {
        return <GithubLogo weight={"fill"} />;
      }
      case "youtube": {
        return <YoutubeLogo weight={"fill"} />;
      }
      case "linkedin": {
        return <LinkedinLogo weight={"fill"} />;
      }
      // No default
    }
  };

  const cardContent = (
    <div
      className={cn(
        "flex w-full items-center justify-between rounded-lg px-4 py-3 text-white",
        {
          "bg-[#1A1A1A]": variant === "github",
          "bg-[#EE3939]": variant === "youtube",
          "bg-[#2D68FF]": variant === "linkedin",
          "bg-[#eee]": variant === undefined,
        },
      )}
    >
      <div className="flex items-center gap-2">
        {cardLogo()}
        <span className="text-xs capitalize">{variant}</span>
      </div>
      {<ArrowRight className={cn({ "opacity-0": variant === undefined })} />}
    </div>
  );

  return link ? (
    <a href={link} target="_blank" className="w-full">
      {cardContent}
    </a>
  ) : (
    <div
      className={cn("w-full cursor-not-allowed opacity-50", {
        "opacity-100": variant == undefined,
      })}
    >
      {cardContent}
    </div>
  );
};

export default Card;
