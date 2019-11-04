import { range } from "ramda";

// import getBreakpointBounds from "./getBreakpointBounds";

function getBreakpointStyles(breakpoint, options) {
  const classes = {};

  let colsCommonClasses = options.grids.map(gridCols => {
    const cols = range(1, gridCols + 1).map(col =>
      gridCols === options.defaultGrid
        ? `.${options.layoutPrefix}col-${breakpoint.name}-${col}`
        : `.${options.layoutPrefix}col-${breakpoint.name}-${col}-${gridCols}`
    );
    const offsets = range(1, gridCols + 1).map(col =>
      gridCols === options.defaultGrid
        ? `.${options.layoutPrefix}col-${breakpoint.name}-offset-${col}`
        : `.${options.layoutPrefix}col-${breakpoint.name}-offset-${col}-${gridCols}`
    );

    return [...cols, ...offsets];
  });
  colsCommonClasses = `.${options.layoutPrefix}col-${breakpoint.name},${colsCommonClasses}`;

  classes[colsCommonClasses] = {
    boxSizing: "border-box",
    flex: "0 0 auto",
    flexBasis: "100%",
    maxWidth: "100%"
  };

  if (breakpoint.gutters && breakpoint.gutters.length > 0) {
    classes[
      colsCommonClasses
    ].paddingLeft = `calc(${breakpoint.gutters} * 0.5)`;
    classes[
      colsCommonClasses
    ].paddingRight = `calc(${breakpoint.gutters} * 0.5)`;
  }

  classes[`.${options.layoutPrefix}col-${breakpoint.name}`] = {
    flexGrow: "1",
    flexBasis: "0",
    maxWidth: "100%"
  };

  for (let g = 0; g < options.grids.length; g += 1) {
    const gridCols = options.grids[g];
    for (let col = 1; col < gridCols + 1; col += 1) {
      const className =
        gridCols === options.defaultGrid
          ? `.${options.layoutPrefix}col-${breakpoint.name}-${col}`
          : `.${options.layoutPrefix}col-${breakpoint.name}-${col}-${gridCols}`;
      classes[className] = {
        flexBasis: `calc(100% / ${gridCols} * ${col})`,
        maxWidth: `calc(100% / ${gridCols} * ${col})`
      };
    }
  }

  classes[`.${options.layoutPrefix}col-${breakpoint.name}-offset-0`] = {
    marginLeft: "0"
  };

  for (let g = 0; g < options.grids.length; g += 1) {
    const gridCols = options.grids[g];
    for (let col = 0; col < gridCols; col += 1) {
      const className =
        gridCols === options.defaultGrid
          ? `.${options.layoutPrefix}col-${breakpoint.name}-offset-${col}`
          : `.${options.layoutPrefix}col-${breakpoint.name}-offset-${col}-${gridCols}`;

      classes[className] = {
        marginLeft: `calc(100% / ${gridCols} * ${col})`
      };
    }
  }

  classes[`.${options.layoutPrefix}start-${breakpoint.name}`] = {
    justifyContent: "flex-start",
    textAlign: "start"
  };

  classes[`.${options.layoutPrefix}center-${breakpoint.name}`] = {
    justifyContent: "center",
    textAlign: "center"
  };

  classes[`.${options.layoutPrefix}end-${breakpoint.name}`] = {
    justifyContent: "flex-end",
    textAlign: "end"
  };

  classes[`.${options.layoutPrefix}top-${breakpoint.name}`] = {
    alignItems: "flex-start"
  };

  classes[`.${options.layoutPrefix}middle-${breakpoint.name}`] = {
    alignItems: "center"
  };

  classes[`.${options.layoutPrefix}bottom-${breakpoint.name}`] = {
    alignItems: "flex-end"
  };

  classes[`.${options.layoutPrefix}around-${breakpoint.name}`] = {
    justifyContent: "space-around"
  };

  classes[`.${options.layoutPrefix}between-${breakpoint.name}`] = {
    justifyContent: "space-between"
  };

  classes[`.${options.layoutPrefix}first-${breakpoint.name}`] = {
    order: "-1"
  };

  classes[`.${options.layoutPrefix}last-${breakpoint.name}`] = {
    order: "1"
  };

  classes[`.${options.layoutPrefix}initial-order-${breakpoint.name}`] = {
    order: "initial"
  };

  return classes;
}

/**
 * Generates styles for the grid.
 *
 * @param {object} options Generator options.
 * @param {array} options.grids Array of grids.
 * @param {number} options.defaultGrid Default grid to shorten class names.
 * @param {array} options.breakpoints Grid breakpoints.
 * @param {string} options.layoutPrefix Prefix for layout classes.
 * @param {string} options.utilityPrefix Prefix for utility classes.
 */
export default function getStyles(options = {}) {
  const breakpoints = options.breakpoints;

  const base = {
    [`.${options.layoutPrefix}container`]: {
      boxSizing: "border-box",
      marginLeft: "auto",
      marginRight: "auto"
    },

    [`.${options.layoutPrefix}container-fluid`]: {},

    [`.${options.layoutPrefix}row`]: {
      boxSizing: "border-box",
      display: "flex",
      flex: "0 1 auto",
      flexDirection: "row",
      flexWrap: "wrap"
    },

    [`.${options.layoutPrefix}row.reverse`]: {
      flexDirection: "row-reverse"
    },

    [`.${options.layoutPrefix}col.reverse`]: {
      flexDirection: "column-reverse"
    }
  };

  const minGutters = breakpoints[0].gutters ? breakpoints[0].gutters : "";
  if (minGutters.length > 0) {
    base[
      `.${options.layoutPrefix}container`
    ].paddingLeft = `calc(${minGutters} * 0.5)`;
    base[
      `.${options.layoutPrefix}container`
    ].paddingRight = `calc(${minGutters} * 0.5)`;

    base[`.${options.layoutPrefix}container-fluid`].paddingLeft = minGutters;
    base[`.${options.layoutPrefix}container-fluid`].paddingRight = minGutters;

    base[
      `.${options.layoutPrefix}row`
    ].marginLeft = `calc(${minGutters} * 0.5 * -1)`;
    base[
      `.${options.layoutPrefix}row`
    ].marginRight = `calc(${minGutters} * 0.5 * -1)`;
  }

  let containerGutters = minGutters;
  const containers = breakpoints.reduce((acc, bp, idx) => {
    if (idx === 0) return acc;

    const media = `@media only screen and (min-width: ${bp.min})`;

    if (bp.gutters && bp.gutters.length > 0) containerGutters = bp.gutters;

    acc[media] = {
      [`.${options.layoutPrefix}container`]: {
        width: `calc(${bp.min} - ${containerGutters})`,
        maxWidth: "100%"
      }
    };
    return acc;
  }, {});

  const main = breakpoints.reduce((acc, bp, idx) => {
    if (idx === 0) {
      return getBreakpointStyles(bp, options);
    }

    const media = `@media only screen and (min-width: ${bp.min})`;

    acc[media] = getBreakpointStyles(bp, options);
    return acc;
  }, {});

  return [base, containers, main];
}
