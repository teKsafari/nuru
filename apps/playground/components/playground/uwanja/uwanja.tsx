"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	BookOpen,
	CircuitBoard,
	Download,
	Eraser,
	Link2,
	MessageCircle,
	Play,
	Share2,
	Square,
	SquareTerminal,
	Turtle,
} from "lucide-react";
import { Button } from "@nuru/ui/components/button";
import { CodeEditor } from "@nuru/ui/components/code-editor";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@nuru/ui/components/dropdown-menu";
import { nuru } from "@nuru/ui/lib/nuru-syntax";
import { cn } from "@nuru/ui/lib/utils";
import { useMobileLayout } from "@/hooks/use-mobile";
import { decodeShareHash, encodeShareHash, whatsappHref, type UwanjaMode } from "@/lib/share";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/playground/resizable";
import { useProgram } from "@/components/runtime/use-program";
import { OutputTabs, type OutputLabels, type OutputTab } from "@/components/runtime/output-tabs";
import { primeAudio } from "@/components/runtime/ubao-board";
import { downloadText, Flash, fill, useEditorTheme, useFlash, useModEnter, LayoutPending } from "../shared";
import { MIFANO, WELCOME, type Mfano } from "./examples";

export interface UwanjaLabels extends OutputLabels {
	title: string;
	subtitle: string;
	run: string;
	stop: string;
	clear: string;
	examples: string;
	share: string;
	download: string;
	code: string;
	output: string;
	shortcut: string;
	copyLink: string;
	linkCopied: string;
	copyFailed: string;
	whatsapp: string;
	shareText: string;
	downloaded: string;
	loadedShared: string;
}

const STORAGE_KEY = "nuru-uwanja-code";
const TABS: OutputTab[] = ["terminal", "kobe", "ubao"];
const MODE_ICON = { terminal: SquareTerminal, kobe: Turtle, ubao: CircuitBoard } as const;

/** Which view a program wants, judged from its source. */
export function modeOf(code: string): UwanjaMode {
	if (/tumia\s+kobe\b/.test(code)) return "kobe";
	if (/tumia\s+ubao\b/.test(code)) return "ubao";
	return "terminal";
}

export function Uwanja({ labels, lang }: { labels: UwanjaLabels; lang: "sw" | "en" }) {
	const program = useProgram();
	const layout = useMobileLayout();
	const isMobile = !!layout;
	const editorTheme = useEditorTheme();
	const { msg, flash } = useFlash();

	const [code, setCode] = useState<string>("");
	const [loaded, setLoaded] = useState(false);
	const [tab, setTab] = useState<OutputTab>("terminal");
	const codeRef = useRef(code);
	codeRef.current = code;

	// Code comes from the share link, else the last session, else the welcome program.
	useEffect(() => {
		const shared = decodeShareHash(window.location.hash);
		let initial = WELCOME;
		let mode: UwanjaMode | undefined;
		if (shared) {
			initial = shared.code;
			mode = shared.mode;
			flash(labels.loadedShared);
		} else {
			try {
				const saved = localStorage.getItem(STORAGE_KEY);
				if (saved !== null && saved.trim() !== "") initial = saved;
			} catch {}
		}
		setCode(initial);
		setTab(mode ?? modeOf(initial));
		setLoaded(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// A share link opened while Uwanja is already open.
	useEffect(() => {
		const onHash = () => {
			const shared = decodeShareHash(window.location.hash);
			if (!shared) return;
			setCode(shared.code);
			setTab(shared.mode ?? modeOf(shared.code));
			flash(labels.loadedShared);
		};
		window.addEventListener("hashchange", onHash);
		return () => window.removeEventListener("hashchange", onHash);
	}, [flash, labels.loadedShared]);

	// Once the learner edits, the URL no longer describes the code: drop the hash
	// so a reload keeps their edits instead of the original shared program.
	const onCodeChange = useCallback((next: string) => {
		setCode(next);
		if (window.location.hash.includes("k=")) history.replaceState(null, "", window.location.pathname);
	}, []);

	useEffect(() => {
		if (!loaded) return;
		const id = setTimeout(() => {
			try {
				localStorage.setItem(STORAGE_KEY, code);
			} catch {}
		}, 300);
		return () => clearTimeout(id);
	}, [code, loaded]);

	// Follow the program: drawing goes to Kobe, LEDs to Ubao, jaza() to the terminal.
	useEffect(() => {
		if (program.channels.kobe) setTab("kobe");
	}, [program.channels.kobe]);
	useEffect(() => {
		if (program.channels.ubao && !program.channels.kobe) setTab("ubao");
	}, [program.channels.ubao, program.channels.kobe]);
	useEffect(() => {
		if (program.phase === "input") setTab("terminal");
	}, [program.phase]);

	const running = program.phase !== "idle";

	const run = useCallback(() => {
		primeAudio();
		const src = codeRef.current;
		const mode = modeOf(src);
		setTab(mode);
		void program.run(src);
	}, [program]);

	useModEnter(run);

	const loadExample = (m: Mfano) => {
		program.stop();
		program.clear();
		setCode(m.code);
		setTab(m.mode);
		history.replaceState(null, "", window.location.pathname);
	};

	const shareUrl = () => {
		const hash = encodeShareHash(code, modeOf(code) === "terminal" ? undefined : modeOf(code));
		history.replaceState(null, "", window.location.pathname + hash);
		return `${window.location.origin}/${lang}/uwanja${hash}`;
	};

	const copyLink = async () => {
		const url = shareUrl();
		try {
			await navigator.clipboard.writeText(url);
			flash(labels.linkCopied);
		} catch {
			flash(labels.copyFailed, "err");
		}
	};

	const download = () => {
		const name = "programu.nr";
		downloadText(name, code);
		flash(fill(labels.downloaded, { name }));
	};

	const extensions = useMemo(() => [nuru], []);

	const runButton = running ? (
		<Button variant="destructive" onClick={program.stop} className={cn(isMobile && "h-12 flex-1 text-base")} data-testid="stop">
			<Square className="fill-current" />
			{labels.stop}
		</Button>
	) : (
		<Button
			onClick={run}
			disabled={program.runtimeState === "loading" && !loaded}
			className={cn(isMobile && "h-12 flex-1 text-base")}
			data-testid="run"
			title={labels.shortcut}
		>
			<Play className="fill-current" />
			{labels.run}
		</Button>
	);

	const examplesMenu = (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className={cn(isMobile && "h-12 px-3")} data-testid="examples">
					<BookOpen />
					<span className={cn(isMobile && "sr-only")}>{labels.examples}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align={isMobile ? "center" : "start"}
				sideOffset={8}
				className="w-[min(22rem,calc(100vw-2rem))] rounded-lg border-2 border-mstari p-1.5 shadow-kivuli"
			>
				<DropdownMenuLabel className="lebo text-muted-foreground">{labels.examples}</DropdownMenuLabel>
				{MIFANO.map((m) => {
					const Icon = MODE_ICON[m.mode];
					return (
						<DropdownMenuItem
							key={m.id}
							onSelect={() => loadExample(m)}
							className="items-start gap-3 rounded-md px-2 py-2 focus:bg-jua focus:text-wino"
							data-example={m.id}
						>
							<span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border-2 border-mstari bg-card">
								<Icon className="size-4" />
							</span>
							<span className="flex min-w-0 flex-col">
								<span className="font-semibold">{m.title}</span>
								<span className="text-xs opacity-75">{m.desc[lang]}</span>
							</span>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);

	const shareMenu = (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className={cn(isMobile && "h-12 px-3")} data-testid="share">
					<Share2 />
					<span className={cn(isMobile && "sr-only")}>{labels.share}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" sideOffset={8} className="w-60 rounded-lg border-2 border-mstari p-1.5 shadow-kivuli">
				<DropdownMenuItem onSelect={copyLink} className="gap-3 px-2 py-2.5 focus:bg-jua focus:text-wino" data-testid="copy-link">
					<Link2 />
					{labels.copyLink}
				</DropdownMenuItem>
				<DropdownMenuSeparator className="bg-mstari/20" />
				<DropdownMenuItem
					onSelect={() => {
						window.open(whatsappHref(labels.shareText, shareUrl()), "_blank", "noopener");
					}}
					className="gap-3 px-2 py-2.5 focus:bg-jua focus:text-wino"
				>
					<MessageCircle />
					{labels.whatsapp}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);

	const clearButton = (
		<Button variant="outline" onClick={program.clear} disabled={running} className={cn(isMobile && "h-12 px-3")} title={labels.clear}>
			<Eraser />
			<span className={cn(isMobile && "sr-only")}>{labels.clear}</span>
		</Button>
	);

	const downloadButton = (
		<Button variant="outline" onClick={download} className={cn(isMobile && "h-12 px-3")} title={labels.download}>
			<Download />
			<span className={cn(isMobile && "sr-only")}>{labels.download}</span>
		</Button>
	);

	const editor = (
		<div className="flex h-full min-h-0 flex-col bg-[var(--editor-bg)]">
			<div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b-2 border-mstari bg-karatasi-2 px-4">
				<span className="lebo inline-flex items-center gap-2">
					<span className="inline-block size-2.5 rounded-full border-2 border-mstari bg-jua" />
					programu.nr
				</span>
				<span className="lebo hidden text-muted-foreground md:inline">{labels.shortcut}</span>
			</div>
			<div className="min-h-0 flex-1" data-testid="editor">
				{loaded && <CodeEditor code={code} onChange={onCodeChange} theme={editorTheme} extensions={extensions} />}
			</div>
		</div>
	);

	const output = <OutputTabs program={program} tabs={TABS} active={tab} onChange={setTab} labels={labels} />;

	if (layout === undefined) return <LayoutPending />;

	if (isMobile) {
		return (
			<div className="flex h-full min-h-0 flex-col bg-karatasi">
				<div className="min-h-0 flex-1">
					<ResizablePanelGroup direction="vertical" autoSaveId="nuru-uwanja-mobile">
						<ResizablePanel defaultSize={52} minSize={20}>
							{editor}
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={48} minSize={20}>
							{output}
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
				<div className="flex shrink-0 items-center gap-2 border-t-2 border-mstari bg-card px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
					{runButton}
					{examplesMenu}
					{shareMenu}
					{downloadButton}
				</div>
				<Flash msg={msg} />
			</div>
		);
	}

	return (
		<div className="flex h-full min-h-0 flex-col bg-karatasi">
			<div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 pt-3 pb-3 lg:px-6">
				<div className="flex min-w-0 items-baseline gap-3">
					<h1 className="font-display text-2xl leading-none font-extrabold">{labels.title}</h1>
					<span className="lebo hidden text-muted-foreground lg:inline">{labels.subtitle}</span>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					{runButton}
					{clearButton}
					{examplesMenu}
					{shareMenu}
					{downloadButton}
				</div>
			</div>
			<div className="min-h-0 flex-1 px-4 pb-4 lg:px-6 lg:pb-6">
				<div className="kadi h-full overflow-hidden">
					<ResizablePanelGroup direction="horizontal" autoSaveId="nuru-uwanja">
						<ResizablePanel defaultSize={52} minSize={28}>
							{editor}
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={48} minSize={28}>
							{output}
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>
			<Flash msg={msg} />
		</div>
	);
}
