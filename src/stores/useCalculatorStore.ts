import { create } from "zustand";
import { CalcAction, CalcState, calcReducer, createInitialCalcState } from "@/utils/calcEngine";

type CalculatorStore = {
  state: CalcState;
  dispatch: (action: CalcAction) => void;
  pressDigit: (digit: string) => void;
  pressOperator: (op: "+" | "-" | "*" | "/") => void;
  pressEquals: () => void;
  pressBackspace: () => void;
  pressClear: () => void;
};

export const useCalculatorStore = create<CalculatorStore>((set, get) => ({
  state: createInitialCalcState(),
  dispatch: (action) => {
    const next = calcReducer(get().state, action);
    set({ state: next });
  },
  pressDigit: (digit) => get().dispatch({ type: "digit", digit }),
  pressOperator: (operator) => get().dispatch({ type: "operator", operator }),
  pressEquals: () => get().dispatch({ type: "equals" }),
  pressBackspace: () => get().dispatch({ type: "backspace" }),
  pressClear: () => get().dispatch({ type: "clear" }),
}));

