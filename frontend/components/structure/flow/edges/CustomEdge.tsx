import React from "react";
import {
  EdgeProps,
  getSmoothStepPath,
  EdgeLabelRenderer,
  BaseEdge,
} from "@xyflow/react";

interface CustomEdgeData {
  label?: string;
  isHighlighted?: boolean;
  level?: number;
  animated?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
  edgeStyle?: "solid" | "dashed" | "dotted";
  gradient?: boolean;
  glowEffect?: boolean;
}

const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
}) => {
  const customData = data as CustomEdgeData;
  const {
    label,
    isHighlighted = false,
    level = 1,
    animated = false,
    strokeColor,
    strokeWidth,
    edgeStyle = "solid",
    gradient = false,
    glowEffect = false,
  } = customData || {};

  // Calculate the smooth step path
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 20,
  });

  // Dynamic styling based on level and state
  const getEdgeStyles = () => {
    const baseWidth = strokeWidth || (level <= 1 ? 3 : level <= 2 ? 2.5 : 2);
    const baseColor = strokeColor || "#64748b"; // slate-500

    if (selected) {
      return {
        stroke: "oklch(0.205 0 0)", // primary color
        strokeWidth: baseWidth + 1,
        strokeDasharray: "5,5",
      };
    }

    if (isHighlighted) {
      return {
        stroke: "#10b981", // emerald-500
        strokeWidth: baseWidth + 0.5,
        filter: "drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))",
      };
    }

    return {
      stroke: baseColor,
      strokeWidth: baseWidth,
      opacity: 0.8,
    };
  };

  const edgeStyles = getEdgeStyles();

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...(style || {}),
          ...edgeStyles,
          transition: "all 0.2s ease-in-out",
        }}
        className={`
          ${animated ? "animate-pulse" : ""}
          ${selected ? "drop-shadow-lg" : ""}
        `}
      />

      {/* Edge Label */}
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 10,
              pointerEvents: "all",
            }}
            className={`
              bg-white px-2 py-1 rounded-xl border text-xs font-medium shadow-sm
              ${
                selected
                  ? "border-gray-700 text-gray-700 bg-gray-50"
                  : isHighlighted
                  ? "border-emerald-500 text-emerald-700 bg-emerald-50"
                  : "border-gray-300 text-gray-600"
              }
              transition-all duration-200 hover:shadow-md
            `}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default CustomEdge;
