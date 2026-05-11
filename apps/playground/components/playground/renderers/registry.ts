import React from "react";
import { CanvasRenderer } from "./canvas-renderer";

export interface RendererProps {
    // Add props that renderers might need (e.g., events, theme)
}

export const RendererRegistry: Record<string, React.FC<RendererProps>> = {
    "canvas-2d": CanvasRenderer,
    "canvas-3d": CanvasRenderer,
};

export function getRenderer(id: string): React.FC<RendererProps> | null {
    return RendererRegistry[id] || null;
}
