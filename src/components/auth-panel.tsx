import { ArrowRight, HeartHandshake, Leaf, Sparkles, UsersRound } from "lucide-react";

type AuthPanelProps = {
  mode: "login" | "register";
};

export default function AuthPanel({ mode }: AuthPanelProps) {
  const isRegister = mode === "register";

  return (
    <aside className="relative hidden min-h-[38rem] overflow-hidden rounded-[2rem] bg-[#173f37] p-9 text-white lg:flex lg:flex-col lg:justify-between xl:p-12 dark:bg-[#102c28]">
      <div aria-hidden="true" className="absolute -right-32 -top-32 size-96 rounded-full border border-white/10" />
      <div aria-hidden="true" className="absolute -right-20 -top-20 size-72 rounded-full border border-white/10" />
      <div aria-hidden="true" className="absolute -bottom-36 -left-20 size-[26rem] rounded-full bg-emerald-400/10" />
      <div className="relative">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-emerald-100">
          <Sparkles aria-hidden="true" className="size-4" />
          A little good goes a long way
        </p>
        <h2 className="mt-8 max-w-md text-4xl font-semibold leading-tight xl:text-5xl">
          {isRegister ? "Your community is better with you in it." : "Good things happen when we show up."}
        </h2>
        <p className="mt-5 max-w-md leading-7 text-emerald-50/75">
          {isRegister
            ? "Create your account and find your people, discover local events, and bring your own ideas to life."
            : "Find a cause that moves you, meet people who care, and make a difference right where you live."}
        </p>
      </div>

      <div className="relative my-8 flex min-h-48 items-center justify-center">
        <div className="absolute size-48 rounded-full bg-emerald-300/10" />
        <div className="absolute size-36 rounded-full border border-emerald-100/20" />
        <div className="absolute -translate-x-14 -translate-y-5 flex size-16 items-center justify-center rounded-2xl bg-emerald-200 text-emerald-950 shadow-xl shadow-emerald-950/20 rotate-[-8deg]">
          <Leaf aria-hidden="true" className="size-8" />
        </div>
        <div className="absolute translate-x-12 translate-y-8 flex size-16 items-center justify-center rounded-2xl bg-amber-200 text-amber-950 shadow-xl shadow-emerald-950/20 rotate-[8deg]">
          <HeartHandshake aria-hidden="true" className="size-8" />
        </div>
        <div className="absolute -translate-x-2 -translate-y-16 flex size-14 items-center justify-center rounded-2xl bg-sky-200 text-sky-950 shadow-xl shadow-emerald-950/20 rotate-[5deg]">
          <UsersRound aria-hidden="true" className="size-7" />
        </div>
      </div>

      <div className="relative flex items-center justify-between border-t border-white/15 pt-5 text-sm text-emerald-50/80">
        <span>Meet your neighbors. Make it matter.</span>
        <ArrowRight aria-hidden="true" className="size-4" />
      </div>
    </aside>
  );
}
