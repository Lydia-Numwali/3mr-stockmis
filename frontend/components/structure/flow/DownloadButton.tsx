import React, { useState } from "react";
import {
  Panel,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from "@xyflow/react";
import { toPng, toSvg } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { toast } from "react-hot-toast";

function downloadImage(dataUrl: string, filename: string) {
  const a = document.createElement("a");

  a.setAttribute("download", filename);
  a.setAttribute("href", dataUrl);
  a.click();
}

function calculateImageDimensions(
  nodesBounds: any,
  minWidth = 800,
  minHeight = 600
) {
  const padding = 100;
  const maxWidth = 8000;
  const maxHeight = 6000;

  let requiredWidth = Math.max(
    minWidth,
    Math.ceil(nodesBounds.width + padding * 2)
  );
  let requiredHeight = Math.max(
    minHeight,
    Math.ceil(nodesBounds.height + padding * 2)
  );

  requiredWidth = Math.min(requiredWidth, maxWidth);
  requiredHeight = Math.min(requiredHeight, maxHeight);

  const aspectRatio = nodesBounds.width / nodesBounds.height;

  if (aspectRatio > 2) {
    requiredHeight = Math.min(requiredHeight, requiredWidth / 1.5);
  } else if (aspectRatio < 0.5) {
    requiredWidth = Math.min(requiredWidth, requiredHeight / 1.5);
  }

  return {
    width: requiredWidth,
    height: requiredHeight,
    padding,
  };
}

function DownloadButton() {
  const { getNodes } = useReactFlow();
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPng = async () => {
    try {
      setIsDownloading(true);
      toast.loading("Generating PNG image...", { id: "download-png" });

      const nodes = getNodes();
      if (nodes.length === 0) {
        toast.error("No organizational chart to export", {
          id: "download-png",
        });
        return;
      }

      const nodesBounds = getNodesBounds(nodes);
      const {
        width: imageWidth,
        height: imageHeight,
        padding,
      } = calculateImageDimensions(nodesBounds);

      console.log(
        `Exporting PNG: ${imageWidth}x${imageHeight}px (Content: ${nodesBounds.width}x${nodesBounds.height}px)`
      );

      const viewport = getViewportForBounds(
        nodesBounds,
        imageWidth,
        imageHeight,
        0.5,
        2,
        padding / 2
      );

      const viewportElement = document.querySelector(
        ".react-flow__viewport"
      ) as HTMLElement;
      if (!viewportElement) {
        toast.error("Chart viewport not found", { id: "download-png" });
        return;
      }

      const dataUrl = await toPng(viewportElement, {
        backgroundColor: "#f8fafc",
        width: imageWidth,
        height: imageHeight,
        quality: 0.95,
        pixelRatio: 2,
        style: {
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      });

      downloadImage(
        dataUrl,
        `organizational-chart-${new Date().toISOString().split("T")[0]}.png`
      );
      toast.success("PNG downloaded successfully!", { id: "download-png" });
    } catch (error) {
      console.error("PNG export error:", error);
      toast.error("Failed to export PNG", { id: "download-png" });
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadSvg = async () => {
    try {
      setIsDownloading(true);
      toast.loading("Generating SVG image...", { id: "download-svg" });

      const nodes = getNodes();
      if (nodes.length === 0) {
        toast.error("No organizational chart to export", {
          id: "download-svg",
        });
        return;
      }

      const nodesBounds = getNodesBounds(nodes);
      const {
        width: imageWidth,
        height: imageHeight,
        padding,
      } = calculateImageDimensions(nodesBounds);

      console.log(
        `Exporting SVG: ${imageWidth}x${imageHeight}px (Content: ${nodesBounds.width}x${nodesBounds.height}px)`
      );

      const viewport = getViewportForBounds(
        nodesBounds,
        imageWidth,
        imageHeight,
        0.5,
        2,
        padding / 2
      );

      const viewportElement = document.querySelector(
        ".react-flow__viewport"
      ) as HTMLElement;
      if (!viewportElement) {
        toast.error("Chart viewport not found", { id: "download-svg" });
        return;
      }

      const dataUrl = await toSvg(viewportElement, {
        backgroundColor: "#f8fafc",
        width: imageWidth,
        height: imageHeight,
        style: {
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      });

      downloadImage(
        dataUrl,
        `organizational-chart-${new Date().toISOString().split("T")[0]}.svg`
      );
      toast.success("SVG downloaded successfully!", { id: "download-svg" });
    } catch (error) {
      console.error("SVG export error:", error);
      toast.error("Failed to export SVG", { id: "download-svg" });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={downloadPng}
        disabled={isDownloading}
        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm disabled:opacity-50"
        size="sm"
      >
        {isDownloading ? (
          <Icon
            icon="solar:loading-linear"
            className="w-4 h-4 mr-2 animate-spin"
          />
        ) : (
          <Icon icon="solar:download-linear" className="w-4 h-4 mr-2" />
        )}
        PNG
      </Button>
      <Button
        onClick={downloadSvg}
        disabled={isDownloading}
        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm disabled:opacity-50"
        size="sm"
      >
        {isDownloading ? (
          <Icon
            icon="solar:loading-linear"
            className="w-4 h-4 mr-2 animate-spin"
          />
        ) : (
          <Icon icon="solar:download-linear" className="w-4 h-4 mr-2" />
        )}
        SVG
      </Button>
    </div>
  );
}

export default DownloadButton;
