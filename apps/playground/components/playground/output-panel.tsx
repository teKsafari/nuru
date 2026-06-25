"use client";
import {
	Play,
	Send,
	Eye,
	Terminal,
	Maximize2,
	Minimize2,
	Layout,
	AlertCircle,
} from "lucide-react";
import { Button } from "@nuru/ui/components/button";
import { ScrollArea } from "@/components/playground/scroll-area";
import { usePlayground } from "./playground-context";
import { getRenderer } from "./renderers/registry";

interface OutputPanelProps {
	showToolbar?: boolean;
}

export function OutputPanel({ showToolbar = true }: OutputPanelProps) {
	const {
		module,
		panels: { maximizePanel, restorePanels, activeMaximizedPanel },
		state: { output },
		actions: { onRun, onSubmit, onShowSolution },
		labels,
	} = usePlayground();

	const isMaximized = activeMaximizedPanel === "renderer";

	const handleMaximizeToggle = () => {
		if (isMaximized) {
			restorePanels();
		} else {
			maximizePanel("renderer");
		}
	};

	const rendererId = module?.panels?.renderer?.type || "standard-terminal";
	const RendererComponent = getRenderer(rendererId);

	const renderContent = () => {
		if (rendererId === "standard-terminal") {
			return (
				<ScrollArea className="flex-1">
					<div className="p-5">
						{output ? (
							<pre className="text-foreground/90 font-mono text-sm leading-relaxed whitespace-pre-wrap">
								{output.split("\n").map((line, i) => {
									const isError =
										line.toLowerCase().includes("error:") ||
										line.toLowerCase().includes("hitilafu:");
									return (
										<span
											key={i}
											className={
												isError
													? "block text-destructive"
													: "block"
											}
										>
											{line}
										</span>
									);
								})}
							</pre>
						) : (
							<p className="text-muted-foreground font-mono text-[13px] tracking-tight uppercase italic">
								{labels.outputPlaceholder}
							</p>
						)}
					</div>
				</ScrollArea>
			);
		}

		if (!RendererComponent) {
			return (
				<div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2">
					<AlertCircle className="h-8 w-8 opacity-20" />
					<p className="font-mono text-xs tracking-widest uppercase opacity-50">
						Renderer "{rendererId}" not found
					</p>
				</div>
			);
		}

		return <RendererComponent />;
	};

	return (
		<div className="bg-background border-border/20 flex h-full flex-col overflow-hidden border-t">
			<div className="bg-muted/30 border-border/50 flex items-center justify-between border-b px-4 py-2">
				<div className="flex items-center gap-2.5">
					<div className="ml-1 flex items-center gap-1.5">
						{rendererId === "standard-terminal" ? (
							<Terminal className="text-muted-foreground h-3 w-3" />
						) : (
							<Layout className="text-muted-foreground h-3 w-3" />
						)}
						<span className="text-muted-foreground font-mono text-[10px] font-black tracking-widest uppercase">
							{rendererId === "standard-terminal"
								? labels.terminal
								: rendererId}
						</span>
					</div>
				</div>

				<div className="flex items-center gap-2">
					{showToolbar && (
						<>
							{onSubmit && (
								<Button
									onClick={onSubmit}
									size="sm"
									className="bg-primary hover:bg-primary/90 text-primary-foreground h-6 px-2 text-[10px] font-black tracking-widest uppercase shadow-sm transition-all active:scale-95"
								>
									<Send className="mr-1 h-2.5 w-2.5" />
									{labels.testing}
								</Button>
							)}
							<Button
								variant="secondary"
								size="sm"
								onClick={onRun}
								className="h-6 px-2 text-[10px] font-black tracking-widest uppercase transition-all active:scale-95"
							>
								<Play className="mr-1 h-2.5 w-2.5" />
								{labels.run}
							</Button>
							{onShowSolution && (
								<Button
									variant="secondary"
									size="sm"
									onClick={onShowSolution}
									className="h-6 px-2 text-[10px] font-black tracking-widest uppercase transition-all active:scale-95"
								>
									<Eye className="mr-1 h-2.5 w-2.5" />
									{labels.showSolution}
								</Button>
							)}
						</>
					)}
					<Button
						variant="ghost"
						size="icon"
						className="text-muted-foreground hover:text-foreground h-6 w-6 transition-colors"
						onClick={handleMaximizeToggle}
					>
						{isMaximized ? (
							<Minimize2 className="h-3.5 w-3.5" />
						) : (
							<Maximize2 className="h-3.5 w-3.5" />
						)}
					</Button>
				</div>
			</div>

			<div className="flex-1 overflow-hidden">{renderContent()}</div>
		</div>
	);
}
