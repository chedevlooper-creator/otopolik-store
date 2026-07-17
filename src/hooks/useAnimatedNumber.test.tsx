import { renderHook, act, waitFor } from "@testing-library/react";
import { useAnimatedNumber } from "./useAnimatedNumber";
import { describe, it, expect, vi } from "vitest";
import { useRef } from "react";

// Mock framer-motion as proper React hooks to maintain instance stability across renders
vi.mock("framer-motion", () => {
  return {
    useMotionValue: (initial: number) => {
      // Use React's useRef to return the same motionValue object on subsequent renders
      const ref = useRef<any>(null);
      if (!ref.current) {
        let currentVal = initial;
        const listeners = new Set<(v: number) => void>();
        ref.current = {
          get: () => currentVal,
          set: (v: number) => {
            currentVal = v;
            listeners.forEach((l) => l(v));
          },
          on: (event: string, cb: (v: number) => void) => {
            if (event === "change") {
              listeners.add(cb);
            }
            return () => listeners.delete(cb);
          },
        };
      }
      return ref.current;
    },
    useSpring: (motionValue: any) => {
      // Mock spring as the stable motion value itself for instant updates
      return motionValue;
    },
  };
});

describe("useAnimatedNumber Hook", () => {
  it("should return the formatted initial value", () => {
    const formatter = (n: number) => `TL ${n.toFixed(2)}`;
    const { result } = renderHook(() => useAnimatedNumber(100, formatter));
    
    expect(result.current).toBe("TL 100.00");
  });

  it("should use custom formatter correctly", () => {
    const formatter = (n: number) => `€ ${Math.round(n)}`;
    const { result } = renderHook(() => useAnimatedNumber(49.9, formatter));

    expect(result.current).toBe("€ 50");
  });

  it("should update display value when input value changes", async () => {
    const formatter = (n: number) => n.toFixed(0);
    const { result, rerender } = renderHook(
      ({ val }) => useAnimatedNumber(val, formatter),
      { initialProps: { val: 100 } }
    );

    expect(result.current).toBe("100");

    // Change input value
    act(() => {
      rerender({ val: 200 });
    });

    // Wait for the useEffect state update to reflect
    await waitFor(() => {
      expect(result.current).toBe("200");
    });
  });
});
