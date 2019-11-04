import valueParser from "postcss-value-parser";

export default function getBreakpointBounds(breakpoints) {
  return breakpoints.map((bp, idx, array) => {
    if (idx === array.length - 1) {
      return bp;
    }

    const { min } = array[idx + 1];
    const val = valueParser.unit(min);

    const max =
      val.unit === "px"
        ? `${val.number - 1}px`
        : `${val.number - 0.0001}${val.unit}`;
    return { ...bp, max };
  });
}
