import { cn } from "@/lib/utils";
import {
  ArrowRight,
  GithubLogo,
  YoutubeLogo,
  LinkedinLogo,
} from "@phosphor-icons/react/dist/ssr";

interface CardProps {
  variant: "github" | "youtube" | "linkedin";
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
        "rounded-lg w-full flex justify-between items-center py-2.5 text-white px-4",
        {
          "bg-[#1A1A1A]": variant === "github",
          "bg-[#EE3939]": variant === "youtube",
          "bg-[#2D68FF]": variant === "linkedin",
        }
      )}
    >
      <div className="flex gap-2 items-center">
        {cardLogo()}
        <span className="text-xs capitalize">{variant}</span>
      </div>
      <ArrowRight />
    </div>
  );

  return link ? (
    <a href={link} target="_blank" className="w-full">
      {cardContent}
    </a>
  ) : (
    <div className="w-full cursor-not-allowed opacity-50">{cardContent}</div>
  );
};

export default Card;
