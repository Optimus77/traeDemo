import { Link } from "react-router-dom";

export default function HelpPage() {
  return (
    <div className="min-h-dvh bg-[color:var(--bg)] px-4 py-10">
      <div className="mx-auto w-full max-w-[420px]">
        <header className="flex items-center justify-between">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-sm text-[color:var(--muted)] transition hover:bg-white/5 hover:text-[color:var(--text)]"
          >
            ← 返回计算器
          </Link>
          <div className="text-sm font-semibold tracking-wide">交互说明</div>
          <div className="w-[104px]" />
        </header>

        <main className="mt-5 space-y-4">
          <section className="rounded-2xl bg-[color:var(--panel)] p-5">
            <h2 className="text-sm font-semibold">按键说明</h2>
            <dl className="mt-3 grid grid-cols-[92px_1fr] gap-x-3 gap-y-2 text-sm">
              <dt className="text-[color:var(--muted)]">数字键</dt>
              <dd>输入数字（0-9）。</dd>

              <dt className="text-[color:var(--muted)]">+ / - / × / ÷</dt>
              <dd>选择运算符：加、减、乘、除。</dd>

              <dt className="text-[color:var(--muted)]">=</dt>
              <dd>执行计算并显示结果。</dd>

              <dt className="text-[color:var(--muted)]">C</dt>
              <dd>清空：重置所有状态。</dd>

              <dt className="text-[color:var(--muted)]">⌫</dt>
              <dd>退格：删除当前输入最后一位。</dd>
            </dl>
          </section>

          <section className="rounded-2xl bg-[color:var(--panel)] p-5">
            <h2 className="text-sm font-semibold">使用示例</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
              <li>
                <span className="text-[color:var(--muted)]">基础运算：</span>12 × 3 = 36
              </li>
              <li>
                <span className="text-[color:var(--muted)]">连续运算：</span>10 + 5 = 15，然后 × 2 = 30
              </li>
            </ol>
          </section>

          <section className="rounded-2xl bg-[color:var(--panel)] p-5">
            <h2 className="text-sm font-semibold">异常与恢复</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
              <li>
                <span className="text-[color:var(--muted)]">除以 0：</span>会提示“除数不能为 0”，可按 C 清空后继续。
              </li>
              <li>
                <span className="text-[color:var(--muted)]">输入不完整：</span>直接按 = 会提示“输入不完整”，补全数字或按 C 重置。
              </li>
              <li>
                <span className="text-[color:var(--muted)]">键盘支持：</span>数字键、+ - * /、Enter、Backspace、Esc 可直接操作。
              </li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}

