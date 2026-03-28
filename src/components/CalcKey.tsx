import { cn } from "@/lib/utils";

type Variant = "default" | "operator" | "primary" | "danger";

export default function CalcKey(props: {
  label: string;
  onClick: () => void;
  variant?: Variant;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const variant = props.variant ?? "default";

  return (
    <button
      type="button"
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label={props.ariaLabel ?? props.label}
      className={cn(
        "h-14 w-full select-none rounded-xl border border-white/10 bg-white/5 text-base font-medium text-[color:var(--text)] shadow-sm transition",
        "hover:bg-white/10 active:translate-y-px disabled:opacity-50 disabled:hover:bg-white/5",
        variant === "operator" && "bg-white/10",
        variant === "primary" && "bg-[color:var(--accent)] text-white hover:brightness-95",
        variant === "danger" && "text-[color:var(--danger)] hover:bg-white/10",
        props.className
      )}
    >
      {props.label}
    </button>
  );
}
