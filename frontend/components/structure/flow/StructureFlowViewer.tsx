"use client";
import React, { useCallback, useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import StructureNode from "./nodes/StructureNode";
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
interface Position {
  id: string;
  name: string;
  description: string;
  structureId: string;
}

interface StructureFlowViewerProps {
  structures: Structure[];
  positions: Position[];
  className?: string;
}

const StructureFlowViewer: React.FC<StructureFlowViewerProps> = ({
  structures,
  positions,
  className = "",
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const renderStructureNodes = useCallback(
    (structureList: Structure[], level = 0) => {
      return structureList.map((structure) => {
        const structurePositions = positions.filter(
          (p) => p.structureId === structure.id
        );

        return (
          <div key={structure.id} className="mb-6">
            <div
              className={`inline-block cursor-pointer transform transition-transform duration-200 hover:scale-105 ${
                level > 0 ? `ml-[${level * 2}rem]` : ""
              }`}
              onClick={() =>
                setSelectedNode(
                  selectedNode === structure.id ? null : structure.id
                )
              }
            >
              <StructureNode
                data={{
                  sourceId: structure.id,
                  targetId: structure.id,
                  name: structure.name,
                  description: structure.description,
                  level: structure.level,
                  title: structure.title.title,
                  positions: structurePositions.map((p) => ({
                    id: p.id,
                    name: p.name,
                    description: p.description,
                  })),
                  childrenCount: structure.children.length,
                }}
                selected={selectedNode === structure.id}
              />
            </div>

            {structure.children.length > 0 && (
              <div className="relative ml-8 mt-4">
                <div className="absolute -left-4 top-0 bottom-0 w-px bg-gray-300"></div>

                {structure.children.map((child, index) => (
                  <div key={child.id} className="relative">
                    <div className="absolute -left-4 top-8 w-4 h-px bg-gray-300"></div>

                    {renderStructureNodes([child], level + 1)}

                    {index < structure.children.length - 1 && (
                      <div className="absolute -left-4 top-16 bottom-0 w-px bg-gray-300"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      });
    },
    [positions, selectedNode]
  );

  const downloadImage = useCallback(async (format: "png" | "svg") => {
    try {
      toast.success(
        `Export as ${format.toUpperCase()} (Install html2canvas for full functionality)`
      );
    } catch (error) {
      toast.error(`Failed to export as ${format.toUpperCase()}`);
    }
  }, []);

  return (
    <div className={`w-full h-full relative bg-gray-50 rounded-lg border border-gray-200 ${className}`}>
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <Button
          onClick={() => downloadImage("png")}
          className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
          size="sm"
        >
          <Icon icon="solar:download-linear" className="w-4 h-4 mr-2" />
          PNG
        </Button>
        <Button
          onClick={() => downloadImage("svg")}
          className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
          size="sm"
        >
          <Icon icon="solar:download-linear" className="w-4 h-4 mr-2" />
          SVG
        </Button>
      </div>

      <div className="p-8 overflow-auto h-full">
        {structures.length > 0 ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Organization Structure
              </h2>
              <p className="text-gray-600">
                Click on any structure to highlight it. This is a simplified
                view - install React Flow for full interactive features.
              </p>
            </div>

            <div className="flex flex-col items-start">
              {renderStructureNodes(structures.filter((s) => !s.parentId))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Icon
                icon="solar:buildings-linear"
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Structures Available
              </h3>
              <p className="text-gray-500">
                Create some organizational structures to see them here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StructureFlowViewer;
