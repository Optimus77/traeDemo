export type Operator = "+" | "-" | "*" | "/";

export type CalcAction =
  | { type: "digit"; digit: string }
  | { type: "operator"; operator: Operator }
  | { type: "equals" }
  | { type: "backspace" }
  | { type: "clear" };

export type CalcState = {
  operand: string;
  stored: number | null;
  operator: Operator | null;
  hasTyped: boolean;
  justEvaluated: boolean;
  lastResult: number | null;
  error: string | null;
};

export function createInitialCalcState(): CalcState {
  return {
    operand: "0",
    stored: null,
    operator: null,
    hasTyped: false,
    justEvaluated: false,
    lastResult: null,
    error: null,
  };
}

export function opSymbol(op: Operator): string {
  switch (op) {
    case "+":
    case "-":
      return op;
    case "*":
      return "×";
    case "/":
      return "÷";
  }
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "错误";
  if (value === 0) return "0";

  const abs = Math.abs(value);
  if (abs >= 1e12 || abs < 1e-6) {
    return value.toExponential(6).replace("+", "");
  }

  const fixed = value.toFixed(10);
  const trimmed = fixed.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
  return trimmed;
}

function clampOperand(next: string): string {
  const normalized = next.replace(/^(-?)0+(\d)/, "$1$2");
  if (normalized === "-") return "0";
  if (normalized.length > 16) return normalized.slice(0, 16);
  return normalized;
}

function parseOperand(operand: string): number {
  const n = Number(operand);
  return Number.isFinite(n) ? n : 0;
}

function applyOperator(stored: number, operator: Operator, current: number): { ok: true; value: number } | { ok: false; error: string } {
  switch (operator) {
    case "+":
      return { ok: true, value: stored + current };
    case "-":
      return { ok: true, value: stored - current };
    case "*":
      return { ok: true, value: stored * current };
    case "/":
      if (current === 0) return { ok: false, error: "除数不能为 0" };
      return { ok: true, value: stored / current };
  }
}

export function calcReducer(state: CalcState, action: CalcAction): CalcState {
  if (action.type === "clear") return createInitialCalcState();

  if (action.type === "backspace") {
    if (state.error) {
      return { ...state, error: null };
    }
    if (!state.hasTyped) return state;
    const next = state.operand.length <= 1 ? "0" : state.operand.slice(0, -1);
    return {
      ...state,
      operand: next,
      hasTyped: next !== "0",
      justEvaluated: false,
    };
  }

  if (action.type === "digit") {
    if (!/^[0-9]$/.test(action.digit)) return state;

    if (state.error) {
      const next = action.digit === "0" ? "0" : action.digit;
      return {
        ...createInitialCalcState(),
        operand: next,
        hasTyped: true,
      };
    }

    if (state.justEvaluated && state.operator === null) {
      const next = action.digit === "0" ? "0" : action.digit;
      return {
        ...createInitialCalcState(),
        operand: next,
        hasTyped: true,
      };
    }

    const base = state.hasTyped ? state.operand : "0";
    const appended = base === "0" ? action.digit : base + action.digit;
    const next = clampOperand(appended);
    return {
      ...state,
      operand: next,
      hasTyped: true,
      justEvaluated: false,
    };
  }

  if (action.type === "operator") {
    if (state.error) return state;

    const current = parseOperand(state.operand);

    if (state.stored === null) {
      return {
        ...state,
        stored: current,
        operator: action.operator,
        operand: "0",
        hasTyped: false,
        justEvaluated: false,
      };
    }

    if (state.operator && state.hasTyped) {
      const computed = applyOperator(state.stored, state.operator, current);
      if (computed.ok === false) {
        return {
          ...state,
          error: computed.error,
        };
      }
      return {
        ...state,
        stored: computed.value,
        lastResult: computed.value,
        operator: action.operator,
        operand: "0",
        hasTyped: false,
        justEvaluated: false,
      };
    }

    return {
      ...state,
      operator: action.operator,
      operand: "0",
      hasTyped: false,
      justEvaluated: false,
    };
  }

  if (action.type === "equals") {
    if (state.error) return state;

    if (state.stored === null || state.operator === null || !state.hasTyped) {
      return { ...state, error: "输入不完整" };
    }

    const current = parseOperand(state.operand);
    const computed = applyOperator(state.stored, state.operator, current);
    if (computed.ok === false) {
      return {
        ...state,
        error: computed.error,
      };
    }

    return {
      ...state,
      operand: formatNumber(computed.value),
      stored: computed.value,
      operator: null,
      hasTyped: false,
      justEvaluated: true,
      lastResult: computed.value,
    };
  }

  return state;
}

export function getSubdisplay(state: CalcState): string {
  if (state.error) return "";
  if (state.stored !== null && state.operator !== null) {
    return `${formatNumber(state.stored)} ${opSymbol(state.operator)}`;
  }
  if (state.justEvaluated && state.lastResult !== null) {
    return `上次结果：${formatNumber(state.lastResult)}`;
  }
  return "";
}
