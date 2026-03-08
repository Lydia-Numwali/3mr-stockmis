import React from "react";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Handle, Position } from "@xyflow/react";
interface StructureNodeData {
  sourceId: string;
  targetId: string;
  name: string;
  description: string;
  level: number;
  title: string;
  positions: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  childrenCount: number;
}

interface StructureNodeProps {
  data: StructureNodeData;
  selected?: boolean;
}

const StructureNode: React.FC<StructureNodeProps> = ({ data, selected }) => {
  return (
    <div
      className={`
      bg-white rounded-xl shadow-lg border-2 transition-all duration-200 min-w-[280px] max-w-[350px] relative
      ${
        selected
          ? "border-primary shadow-xl"
          : "border-gray-200 hover:border-gray-300"
      }
    `}
    >
      <Handle
        type="target"
        position={Position.Top}
        id={`target-${data.targetId}`}
        className="w-3 h-3 border-2 border-white"
        style={{ backgroundColor: "oklch(0.205 0 0)" }}
      />

      <div
        className="text-white p-4 rounded-t-xl bg-secondary-blue"
        
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon icon="solar:buildings-bold" className="w-5 h-5" />
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30"
            >
              Level {data.level}
            </Badge>
          </div>
          {data.childrenCount > 0 && (
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30"
            >
              {data.childrenCount} sub-units
            </Badge>
          )}
        </div>
        <h3 className="font-bold text-lg mt-2 leading-tight">{data.name}</h3>
        <p className="text-white/80 text-sm font-medium">{data.title}</p>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {data.description}
          </p>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center">
              <Icon
                icon="solar:users-group-rounded-linear"
                className="w-4 h-4 mr-1"
              />
              Positions
            </h4>
            <Badge variant="outline" className="text-xs">
              {data.positions.length}
            </Badge>
          </div>

          {data.positions.length > 0 ? (
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {data.positions.map((position) => (
                <div
                  key={position.id}
                  className="bg-gray-50 rounded-lg p-2 border border-gray-100"
                >
                  <p className="text-sm font-medium text-gray-800">
                    {position.name}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {position.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-3">
              <Icon
                icon="solar:user-plus-linear"
                className="w-8 h-8 text-gray-300 mx-auto mb-1"
              />
              <p className="text-xs text-gray-400">No positions defined</p>
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id={`source-${data.sourceId}`}
        className="w-3 h-3 border-2 border-white"
        style={{ backgroundColor: "oklch(0.205 0 0)" }}
      />
    </div>
  );
};

export default StructureNode;
