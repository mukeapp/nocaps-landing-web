"use client";

import React from "react";

// Minimal react-native-svg → DOM svg mapping for the components used in core/
// (Svg, Circle in ScoreRing and SemiCircleProgress).

const Svg = React.forwardRef<SVGSVGElement, any>(
  ({ width, height, viewBox, children, style, ...rest }, ref) => (
    <svg ref={ref} width={width} height={height} viewBox={viewBox} style={style} {...rest}>
      {children}
    </svg>
  )
);
Svg.displayName = "Svg";

export const Circle = React.forwardRef<SVGCircleElement, any>((props, ref) => {
  const { strokeDasharray, strokeDashoffset, strokeLinecap, strokeWidth, ...rest } = props;
  return (
    <circle
      ref={ref}
      strokeDasharray={strokeDasharray}
      strokeDashoffset={strokeDashoffset}
      strokeLinecap={strokeLinecap}
      strokeWidth={strokeWidth}
      {...rest}
    />
  );
});
Circle.displayName = "Circle";

export const Path = React.forwardRef<SVGPathElement, any>((props, ref) => (
  <path ref={ref} {...props} />
));
Path.displayName = "Path";

export const G = (props: any) => <g {...props} />;
export const Rect = (props: any) => <rect {...props} />;
export const Line = (props: any) => <line {...props} />;
export const Text = (props: any) => <text {...props} />;

export default Svg;
