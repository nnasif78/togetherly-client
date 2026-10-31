import { Check, Circle } from "lucide-react";

const requirements = [
  { label: "At least 6 characters", test: (password: string) => password.length >= 6 },
  { label: "At least 1 uppercase letter", test: (password: string) => /[A-Z]/.test(password) },
  { label: "At least 1 lowercase letter", test: (password: string) => /[a-z]/.test(password) },
];

export default function PasswordRequirements({ password }: { password: string }) {
  return (
    <ul aria-label="Password requirements" className="space-y-1 text-xs">
      {requirements.map(({ label, test }) => {
        const satisfied = test(password);
        const Icon = satisfied ? Check : Circle;

        return (
          <li key={label} className={satisfied ? "flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400" : "flex items-center gap-1.5 text-muted-foreground"}>
            <Icon aria-hidden="true" className="size-3.5" />
            {label}
          </li>
        );
      })}
    </ul>
  );
}
