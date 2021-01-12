import React, { Fragment, useState, useCallback } from "react";

const HOV_SIZE = 50;
export const Point = ({ x, y, value, t, color, width }) => {
  const [showPoint, setShowPoint] = useState(false);
  const onShow = useCallback(() => setShowPoint(true), [setShowPoint]);
  const onHide = useCallback(() => setShowPoint(false), [setShowPoint]);
  return (
    <g onMouseEnter={onShow} onMouseLeave={onHide}>
      {showPoint && (
        <Fragment>
          <text x={x + 10} y={y - 10} fill={color}>
            {value}
          </text>
          <circle cx={x} cy={y} r={5} fill={color} />
        </Fragment>
      )}
      <rect
        x={x - width / 2}
        y={y - HOV_SIZE / 2}
        width={width}
        height={HOV_SIZE}
        fill="transparent"
        // If you're debugging the hover region, uncomment the following
        // fill="rgba(0,0,0,0.5)"
      ></rect>
    </g>
  );
};

export const HighlightValueLabels = ({
  visibleTransformedPointsOnCurves = [],
  curveColors = [],
}) => {
  return (
    <g>
      {visibleTransformedPointsOnCurves.flatMap((points, curveIndex) =>
        points.map((p, i) => (
          <Point
            key={`${curveIndex},${i}`}
            color={curveColors[curveIndex]}
            width={
              i === 0 || i === points.length - 1
                ? HOV_SIZE
                : (points[i + 1].x - points[i - 1].x) / 2
            }
            {...p}
          />
        ))
      )}
    </g>
  );
};

export default HighlightValueLabels;
