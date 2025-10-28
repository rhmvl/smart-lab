import { Bar } from "../../../../types/bar";

export const bubbleSort = async (
  bars: Bar[],
  swapBars: (i: number, j: number) => Promise<void>,
  render: (active?: number[], swap?: number[], done?: boolean) => void,
  delay: number
) => {
  const n = bars.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      render([j, j + 1]); 
      await new Promise((r) => setTimeout(r, delay));

      if (bars[j].value > bars[j + 1].value) {
        await swapBars(j, j + 1);
      }
    }
  }

  render([], [], true);
};
