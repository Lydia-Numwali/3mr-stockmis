"use client";

import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "@xyflow/react";
import ELK from "elkjs/lib/elk.bundled.js";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import "@xyflow/react/dist/style.css";
import StructureNode from "./nodes/StructureNode";
import CustomEdge from "./edges/CustomEdge";
import DownloadButton from "./DownloadButton";

interface Structure {
  id: string;
  name: string;
  description: string;
  level: number;
  parentId: string | null;
  titleId: string;
  representativeId: string;
  institutionId: string;
  title: {
    id: string;
    title: string;
    level: number;
  };
  children: Structure[];
}

interface EmployeePosition {
  id: string;
  name: string;
  description: string;
  structureId: string;
}

interface StructureFlowViewerProps {
  structures: Structure[];
  positions: EmployeePosition[];
  className?: string;
}

const elk = new ELK();

const elkOptions = {
  "elk.algorithm": "mrtree",
  "elk.spacing.nodeNode": "300",
  "elk.spacing.nodeNodeBetweenLayers": "200",
};

const getLayoutedElements = (
  nodes: any[],
  edges: any[],
  options: Record<string, any> = {}
) => {
  const isHorizontal = options["elk.direction"] === "RIGHT";
  const graph = {
    id: "root",
    layoutOptions: { ...elkOptions, ...options },
    children: nodes.map((node) => ({
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      width: 250,
      height: 120,
    })),
    edges: edges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes:
        layoutedGraph.children?.map((node) => ({
          ...node,
          position: { x: node.x || 0, y: node.y || 0 },
        })) || [],
      edges: layoutedGraph.edges || [],
    }))
    .catch((error) => {
      console.error("Layout error:", error);
      return { nodes, edges };
    });
};

const StructureFlowViewer: React.FC<StructureFlowViewerProps> = ({
  structures,
  positions,
  className = "",
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [activeDirection, setActiveDirection] = useState<"DOWN" | "RIGHT">(
    "DOWN"
  );

  const { fitView } = useReactFlow();

  const convertToFlowData = useCallback(
    (structureData: Structure[], positionData: EmployeePosition[]) => {
      const flowNodes: any[] = [];
      const flowEdges: any[] = [];
      const visited = new Set<string>();

      const processStructure = (structure: Structure, parentId?: string) => {
        if (visited.has(structure.id)) return;
        visited.add(structure.id);

        const structurePositions = positionData.filter(
          (p) => p.structureId === structure.id
        );

        flowNodes.push({
          id: structure.id,
          type: "structureNode",
          data: {
            sourceId: structure.id,
            targetId: structure.id,
            name: structure.name,
            description: structure.description,
            level: structure.level,
            title: structure.title.title,
            positions: structurePositions,
            childrenCount: structure.children.length,
          },
          position: { x: 0, y: 0 },
        });

        if (
          parentId &&
          parentId !== "null" &&
          parentId !== null &&
          parentId.trim() !== ""
        ) {
          flowEdges.push({
            id: `edge-${parentId}-${structure.id}`,
            source: parentId,
            target: structure.id,
            type: "customEdge",
            data: {
              level: structure.level,
              strokeColor:
                structure.level <= 1
                  ? "oklch(0.205 0 0)"
                  : structure.level <= 2
                  ? "#10b981"
                  : "#64748b",
              label:
                structure.level <= 2 ? `Level ${structure.level}` : undefined,
              edgeStyle:
                structure.level <= 1
                  ? "solid"
                  : structure.level <= 2
                  ? "solid"
                  : "dashed",
            },
            sourceHandle: `source-${parentId}`,
            targetHandle: `target-${structure.id}`,
          });
        }

        structure.children.forEach((child) =>
          processStructure(child, structure.id)
        );
      };

      structureData.forEach((structure) => {
        if (!structure.parentId || structure.parentId === "null") {
          processStructure(structure);
        }
      });

      return { nodes: flowNodes, edges: flowEdges };
    },
    []
  );

  const onLayout = useCallback(
    ({
      direction,
      useInitialNodes = false,
    }: {
      direction: "DOWN" | "RIGHT";
      useInitialNodes?: boolean;
    }) => {
      const opts = { "elk.direction": direction, ...elkOptions };
      const { nodes: rawNodes, edges: rawEdges } = convertToFlowData(
        structures,
        positions
      );

      setActiveDirection(direction);

      getLayoutedElements(rawNodes, rawEdges, opts).then(
        ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);
          window.requestAnimationFrame(() => fitView());
        }
      );
    },
    [structures, positions, convertToFlowData, setNodes, setEdges, fitView]
  );

  useLayoutEffect(() => {
    onLayout({ direction: "DOWN", useInitialNodes: true });
  }, [onLayout]);

  return (
    <div
      className={`w-full h-full relative  bg-gray-50 border border-gray-200 ${className}`}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        nodeTypes={{ structureNode: StructureNode }}
        edgeTypes={{ customEdge: CustomEdge }}
      >
        <Background gap={16} size={1} />
        <Controls showInteractive={false} />

        {/* Status Panel - Bottom Left */}

        <Panel position="top-right">
          <div className="flex flex-wrap gap-3">
            {/* Layout Controls */}
            <div className="flex gap-2">
  <Button
    onClick={() => onLayout({ direction: "DOWN" })}
    className={`border shadow-sm ${
      activeDirection === "DOWN"
        ? "bg-secondary-blue text-white border-primary"
        : "bg-white hover:bg-gray-50 text-black border-gray-300"
    }`}
    size="sm"
  >
    <Icon icon="solar:arrow-down-linear" className="w-4 h-4 mr-2" />
    Vertical
  </Button>
  <Button
    onClick={() => onLayout({ direction: "RIGHT" })}
    className={`border shadow-sm ${
      activeDirection === "RIGHT"
        ? "bg-secondary-blue text-white border-primary"
        : "bg-white hover:bg-gray-50 text-black border-gray-300"
    }`}
    size="sm"
  >
    <Icon icon="solar:arrow-right-linear" className="w-4 h-4 mr-2" />
    Horizontal
  </Button>
</div>

            {/* Download Controls */}
            <DownloadButton />
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

const StructureFlowViewerWithProvider: React.FC<StructureFlowViewerProps> = (
  props
) => (
  <ReactFlowProvider>
    <StructureFlowViewer {...props} />
  </ReactFlowProvider>
);

export default StructureFlowViewerWithProvider;
