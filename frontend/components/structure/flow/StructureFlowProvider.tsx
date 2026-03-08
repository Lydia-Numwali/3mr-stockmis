"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";
interface StructureFlowContextType {
  
  nodeTypes: Record<string, React.ComponentType<any>>;
  edgeTypes: Record<string, React.ComponentType<any>>;
  defaultEdgeOptions: {
    type: string;
    animated: boolean;
    style: React.CSSProperties;
  };
  layoutOptions: {
    algorithm: string;
    direction: "DOWN" | "UP" | "LEFT" | "RIGHT";
    nodeSpacing: number;
    layerSpacing: number;
  };

  
  onNodeClick?: (event: React.MouseEvent, node: any) => void;
  onEdgeClick?: (event: React.MouseEvent, edge: any) => void;
  onLayoutChange?: (direction: "DOWN" | "UP" | "LEFT" | "RIGHT") => void;
}

const StructureFlowContext = createContext<StructureFlowContextType | null>(
  null
);

interface StructureFlowProviderProps {
  children: React.ReactNode;
  onNodeClick?: (event: React.MouseEvent, node: any) => void;
  onEdgeClick?: (event: React.MouseEvent, edge: any) => void;
  onLayoutChange?: (direction: "DOWN" | "UP" | "LEFT" | "RIGHT") => void;
}

export const StructureFlowProvider: React.FC<StructureFlowProviderProps> = ({
  children,
  onNodeClick,
  onEdgeClick,
  onLayoutChange,
}) => {
  const nodeTypes = useMemo(
    () => ({
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
  
    }),
    []
  );

  const defaultEdgeOptions = useMemo(
    () => ({
      type: "smoothstep",
      animated: true,
      style: {
        strokeWidth: 2,
        stroke: "#64748b",
      },
    }),
    []
  );

  const layoutOptions = useMemo(
    () => ({
      algorithm: "layered", 
      direction: "DOWN" as const,
      nodeSpacing: 80,
      layerSpacing: 100,
    }),
    []
  );

  
  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: any) => {
      event.stopPropagation();
      onNodeClick?.(event, node);
    },
    [onNodeClick]
  );

  const handleEdgeClick = useCallback(
    (event: React.MouseEvent, edge: any) => {
      event.stopPropagation();
      onEdgeClick?.(event, edge);
    },
    [onEdgeClick]
  );

  const handleLayoutChange = useCallback(
    (direction: "DOWN" | "UP" | "LEFT" | "RIGHT") => {
      onLayoutChange?.(direction);
    },
    [onLayoutChange]
  );

  
  const contextValue = useMemo(
    () => ({
      nodeTypes,
      edgeTypes,
      defaultEdgeOptions,
      layoutOptions,
      onNodeClick: handleNodeClick,
      onEdgeClick: handleEdgeClick,
      onLayoutChange: handleLayoutChange,
    }),
    [
      nodeTypes,
      edgeTypes,
      defaultEdgeOptions,
      layoutOptions,
      handleNodeClick,
      handleEdgeClick,
      handleLayoutChange,
    ]
  );

  return (
    <StructureFlowContext.Provider value={contextValue}>
      {children}
    </StructureFlowContext.Provider>
  );
};


export const useStructureFlowContext = () => {
  const context = useContext(StructureFlowContext);
  if (!context) {
    throw new Error(
      "useStructureFlowContext must be used within a StructureFlowProvider"
    );
  }
  return context;
};


export const useStructureLayout = () => {
  const { layoutOptions, onLayoutChange } = useStructureFlowContext();

  const getLayoutedElements = useCallback(
    async (nodes: any[], edges: any[]) => {
      
      
      const layoutedNodes = nodes.map((node, index) => ({
        ...node,
        position: {
          x: (index % 3) * 200,
          y: Math.floor(index / 3) * 150,
        },
      }));

      return {
        nodes: layoutedNodes,
        edges,
      };
    },
    []
  );

  const changeLayout = useCallback(
    (direction: "DOWN" | "UP" | "LEFT" | "RIGHT") => {
      onLayoutChange?.(direction);
    },
    [onLayoutChange]
  );

  return {
    layoutOptions,
    getLayoutedElements,
    changeLayout,
  };
};

export default StructureFlowProvider;
