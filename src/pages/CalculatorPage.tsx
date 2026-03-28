import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import CalcKey from "@/components/CalcKey";
import { getSubdisplay, opSymbol } from "@/utils/calcEngine";
import { useCalculatorStore } from "@/stores/useCalculatorStore";

type KeyDef = {
  label: string;
  onPress: () => void;
  variant?: "default" | "operator" | "primary" | "danger";
  className?: string;
  ariaLabel?: string;
};

export default function CalculatorPage() {
  const { state, pressBackspace, pressClear, pressDigit, pressEquals, pressOperator } = useCalculatorStore();

  const keys: KeyDef[] = useMemo(
    () => [
      { label: "C", onPress: pressClear, variant: "danger", ariaLabel: "清空" },
      { label: "⌫", onPress: pressBackspace, variant: "default", ariaLabel: "退格" },
      { label: opSymbol("/"), onPress: () => pressOperator("/"), variant: "operator", ariaLabel: "除" },
      { label: opSymbol("*"), onPress: () => pressOperator("*"), variant: "operator", ariaLabel: "乘" },

      { label: "7", onPress: () => pressDigit("7") },
      { label: "8", onPress: () => pressDigit("8") },
      { label: "9", onPress: () => pressDigit("9") },
      { label: opSymbol("-"), onPress: () => pressOperator("-"), variant: "operator", ariaLabel: "减" },

      { label: "4", onPress: () => pressDigit("4") },
      { label: "5", onPress: () => pressDigit("5") },
      { label: "6", onPress: () => pressDigit("6") },
      { label: opSymbol("+"), onPress: () => pressOperator("+"), variant: "operator", ariaLabel: "加" },

      { label: "1", onPress: () => pressDigit("1") },
      { label: "2", onPress: () => pressDigit("2") },
      { label: "3", onPress: () => pressDigit("3") },
      { label: "=", onPress: pressEquals, variant: "primary", ariaLabel: "等于" },

      { label: "0", onPress: () => pressDigit("0"), className: "col-span-2" },
    ],
    [pressBackspace, pressClear, pressDigit, pressEquals, pressOperator]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      if (/^[0-9]$/.test(key)) {
        e.preventDefault();
        pressDigit(key);
        return;
      }

      if (key === "+" || key === "-" || key === "*" || key === "/") {
        e.preventDefault();
        pressOperator(key);
        return;
      }

      if (key === "Enter" || key === "=") {
        e.preventDefault();
        pressEquals();
        return;
      }

      if (key === "Backspace") {
        e.preventDefault();
        pressBackspace();
        return;
      }

      if (key === "Escape" || key === "Delete") {
        e.preventDefault();
        pressClear();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pressBackspace, pressClear, pressDigit, pressEquals, pressOperator]);

  const sub = getSubdisplay(state);
  const hint = state.error
    ? state.error
    : state.operator
      ? state.hasTyped
        ? "按 = 计算"
        : "请输入第二个数字"
      : state.hasTyped
        ? "选择运算符继续"
        : "先输入数字，再选择运算符";

  return (
    <div className="min-h-dvh bg-[color:var(--bg)] px-4 py-10">
      <div className="mx-auto w-full max-w-[420px]">
        <header className="flex items-center justify-between">
          <div className="text-sm font-semibold tracking-wide">traeDemo 计算器</div>
          <Link
            to="/help"
            className="rounded-lg px-3 py-2 text-sm text-[color:var(--muted)] transition hover:bg-white/5 hover:text-[color:var(--text)]"
          >
            交互说明
          </Link>
        </header>

        <main className="mt-5">
          <section className="rounded-2xl bg-[color:var(--panel)] p-5 shadow-sm">
            <div className="min-h-5 text-right text-xs text-[color:var(--muted)]">{sub}</div>
            <div className="mt-2 break-all text-right text-4xl font-semibold tabular-nums">
              {state.error ? "错误" : state.operand}
            </div>
          </section>

          <section className="mt-4 grid grid-cols-4 gap-3">
            {keys.map((k) => (
              <CalcKey
                key={k.label}
                label={k.label}
                onClick={k.onPress}
                variant={k.variant}
                className={k.className}
                ariaLabel={k.ariaLabel}
              />
            ))}
            <div className="col-span-2" />
          </section>

          <section
            role={state.error ? "alert" : "status"}
            className={
              "mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition " +
              (state.error ? "text-[color:var(--danger)]" : "text-[color:var(--muted)]")
            }
          >
            {hint}
          </section>
        </main>
      </div>
    </div>
  );
}

