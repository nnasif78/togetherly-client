const categoryStyles: Record<string, string> = {
  environment: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200",
  cleanup: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200",
  plantation: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200",
  education: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200",
  health: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200",
  community: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200",
  charity: "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-200",
  donation: "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-200",
  other: "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
};

const filterAliases: Record<string, string[]> = {
  environment: ["environment", "cleanup", "plantation"],
  charity: ["charity", "donation", "fundraising"],
};

export function getEventCategoryStyles(category: string) {
  return categoryStyles[category.trim().toLowerCase()] ?? categoryStyles.other;
}

export function eventMatchesCategory(eventCategory: string, filterCategory: string) {
  const event = eventCategory.trim().toLowerCase();
  const filter = filterCategory.trim().toLowerCase();

  if (!filter || filter === "all events") return true;

  return (filterAliases[filter] ?? [filter]).includes(event);
}
