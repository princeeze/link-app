import { Icon } from "@phosphor-icons/react";

export function Tab({
  Icon,
  children,
}: {
  Icon: Icon;
  children: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center justify-center text-grey-default whitespace-nowrap rounded-lg px-[27px] py-[11px] heading-s gap-2 ring-offset-white hover:text-purple-default transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-purple-light data-[state=active]:text-purple-default  dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:data-[state=active]:bg-slate-950 dark:data-[state=active]:text-slate-50">
      <Icon />
      {children}
    </div>
  );
}
