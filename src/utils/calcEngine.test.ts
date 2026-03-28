import { describe, expect, it } from "vitest";
import { calcReducer, createInitialCalcState } from "@/utils/calcEngine";

function pressSequence(seq: Array<string>): string {
  let s = createInitialCalcState();
  for (const token of seq) {
    if (/^[0-9]$/.test(token)) {
      s = calcReducer(s, { type: "digit", digit: token });
      continue;
    }
    if (token === "+" || token === "-" || token === "*" || token === "/") {
      s = calcReducer(s, { type: "operator", operator: token });
      continue;
    }
    if (token === "=") {
      s = calcReducer(s, { type: "equals" });
      continue;
    }
    if (token === "C") {
      s = calcReducer(s, { type: "clear" });
      continue;
    }
    if (token === "BS") {
      s = calcReducer(s, { type: "backspace" });
      continue;
    }
    throw new Error(`Unknown token: ${token}`);
  }
  if (s.error) return `ERR:${s.error}`;
  return s.operand;
}

describe("calcEngine", () => {
  it("computes 12 × 3 = 36", () => {
    expect(pressSequence(["1", "2", "*", "3", "="])).toBe("36");
  });

  it("supports continuous operations via equals result", () => {
    expect(pressSequence(["1", "0", "+", "5", "="])).toBe("15");
    expect(pressSequence(["1", "0", "+", "5", "=", "*", "2", "="])).toBe("30");
  });

  it("chains operations without equals", () => {
    expect(pressSequence(["1", "2", "*", "3", "+", "4", "="])).toBe("40");
  });

  it("allows typing 0 as the second operand", () => {
    expect(pressSequence(["8", "*", "0", "="])).toBe("0");
  });

  it("prevents divide by zero", () => {
    expect(pressSequence(["8", "/", "0", "="])).toBe("ERR:除数不能为 0");
  });

  it("backspace removes digits and can lead to incomplete input", () => {
    expect(pressSequence(["1", "2", "BS"])).toBe("1");
    expect(pressSequence(["1", "BS", "BS"])).toBe("0");
    expect(pressSequence(["7", "+", "BS", "="])).toBe("ERR:输入不完整");
  });

  it("clear resets all state", () => {
    expect(pressSequence(["9", "*", "9", "C"])).toBe("0");
  });
});

