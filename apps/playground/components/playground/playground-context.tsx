"use client";

import { createContext, useContext, ReactNode } from "react";
import { PlaygroundProps } from "@/types/playground";

export type PlaygroundContextValue = PlaygroundProps & {
	isCurrentStepCompleted: boolean;
	isLastStep: boolean;
	handleNextAction: () => void;
	nextActionLabel: string;
	panels: {
		maximizePanel: (panelId: string) => void;
		restorePanels: () => void;
		togglePanel: (panelId: string) => void;
		activeMaximizedPanel: string | null;
	};
};

const PlaygroundContext = createContext<PlaygroundContextValue | undefined>(
	undefined,
);

export function PlaygroundProvider({
	children,
	value,
}: {
	children: ReactNode;
	value: PlaygroundContextValue;
}) {
	return (
		<PlaygroundContext.Provider value={value}>
			{children}
		</PlaygroundContext.Provider>
	);
}

export function usePlayground() {
	const context = useContext(PlaygroundContext);
	if (!context) {
		throw new Error(
			"usePlayground must be used within a PlaygroundProvider",
		);
	}
	return context;
}
