# React Flow Structure Viewer - Installation & Usage Guide

## 📦 Required Packages

To enable the full interactive React Flow features, install these packages:

```bash
# New @xyflow packages (recommended)
npm install @xyflow/react @xyflow/node-resizer elkjs html2canvas
```

Or with yarn:

```bash
yarn add @xyflow/react @xyflow/node-resizer elkjs html2canvas
```

**Note**: `@xyflow/react` is the new package name for React Flow. The old `reactflow` package is being phased out.

## 📁 File Structure

```
components/
├── structure/
│   ├── flow/
│   │   ├── StructureFlowViewer.tsx          # Simplified version (works now)
│   │   ├── FullStructureFlowViewer.tsx      # Full version (needs packages)
│   │   ├── nodes/
│   │   │   └── StructureNode.tsx            # Custom node component
│   │   └── edges/
│   │       └── CustomEdge.tsx               # Custom edge component
│   └── StructureViewContainer.tsx           # Main integration component
├── services/
│   └── structure-flow-data.service.ts       # Data transformation service
└── hooks/
    └── useStructureFlow.ts                  # React hook for flow data
```

## 🚀 Usage Examples

### Basic Integration (Works Now)

```tsx
import StructureFlowViewer from "@/components/structure/flow/StructureFlowViewer";
import { useStructureFlow } from "@/hooks/useStructureFlow";

function MyStructurePage() {
  const { structures, positions, isLoading } = useStructureFlow(institutionId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="h-96">
      <StructureFlowViewer structures={structures} positions={positions} />
    </div>
  );
}
```

### Enhanced Integration with Toggle

```tsx
import StructureViewContainer from "@/components/structure/StructureViewContainer";

function EnhancedStructurePage() {
  return <StructureViewContainer />;
}
```

## 🎨 Features

### Current Features (Working Now)

- ✅ Hierarchical tree display with visual connections
- ✅ Interactive node selection and highlighting
- ✅ Position management within structures
- ✅ Search functionality
- ✅ Statistics and insights
- ✅ Responsive design with Tailwind CSS
- ✅ Clean, modern UI with rounded corners and shadows

### Enhanced Features (After Installing Packages)

- 🔄 Interactive drag-and-drop nodes
- 🔄 Automatic ELK.js tree layout
- 🔄 Smooth edge animations
- 🔄 Zoom and pan controls
- 🔄 Mini-map navigation
- 🔄 PNG/SVG export functionality
- 🔄 Floating edge connections
- 🔄 Resizable nodes

## 🛠️ Customization

### Node Styling

Edit `components/structure/flow/nodes/StructureNode.tsx`:

- Modify colors, gradients, and borders
- Add/remove position display logic
- Customize badge appearance

### Edge Styling

Edit `components/structure/flow/edges/CustomEdge.tsx`:

- Change connection line styles
- Modify label positioning
- Update edge animations

### Layout Configuration

In `FullStructureFlowViewer.tsx`:

```typescript
const elkOptions = {
  "elk.algorithm": "layered", // or 'force', 'stress'
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "80",
  "elk.direction": "DOWN", // or 'UP', 'LEFT', 'RIGHT'
};
```

## 🔧 Integration with Existing System

### Data Service Integration

The `StructureFlowDataService` integrates with your existing:

- `StructureService` for fetching structure hierarchies
- Position API endpoints for role management
- Institution context for multi-tenant support

### Permission Integration

Uses your existing permission system:

```typescript
const permissions = [
  PERMISSIONS.STRUCTURE_READ,
  // ... other permissions
];
```

## 📊 Data Format

### Structure Interface

```typescript
interface Structure {
  id: string;
  name: string;
  description: string;
  level: number;
  parentId: string | null;
  title: {
    id: string;
    title: string;
    level: number;
  };
  children: Structure[];
}
```

### Position Interface

```typescript
interface Position {
  id: string;
  name: string;
  description: string;
  structureId: string;
}
```

## 🔄 Migration Path

### Package Migration (Important!)

React Flow has been rebranded to **xyflow**. Use the new packages:

```typescript
// ❌ Old imports (deprecated)
import ReactFlow from "reactflow";
import { NodeResizer } from "@reactflow/node-resizer";

// ✅ New imports (recommended)
import { ReactFlow } from "@xyflow/react";
import { NodeResizer } from "@xyflow/node-resizer";
```

### Implementation Steps

1. **Phase 1 (Current)**: Use `StructureFlowViewer` for basic tree visualization
2. **Phase 2**: Install new @xyflow packages
3. **Phase 3**: Switch to `FullStructureFlowViewer` for full interactivity
4. **Phase 4**: Customize layouts and add advanced features

## 🎯 Benefits

- **Visual Clarity**: Easy-to-understand organizational hierarchy
- **Interactive Management**: Click-to-edit functionality
- **Modern UI**: Clean design matching your existing Tailwind theme
- **Performance**: Optimized for large organizational structures
- **Extensible**: Modular components for easy customization
- **Mobile Friendly**: Responsive design for all devices

## 📝 API Integration

### Existing Endpoints Used

- `GET /structures/institution/{id}/tree` - Hierarchical structures
- `GET /positions?structureId={id}` - Positions for structure
- `GET /positions?institutionId={id}` - All positions for institution

### Data Transformation

The service automatically handles:

- Tree structure building from flat arrays
- Position aggregation by structure
- Search and filtering operations
- Statistics calculation

This implementation provides a smooth upgrade path from your current text-based tree to a fully interactive organizational chart while maintaining compatibility with your existing data structures and APIs.
