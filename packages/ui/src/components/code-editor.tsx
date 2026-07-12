"use client";

import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import * as lezerHighlight from "@lezer/highlight";
const { tags: t } = lezerHighlight;
import { createTheme } from "@uiw/codemirror-themes";
import type { CreateThemeOptions } from "@uiw/codemirror-themes";
import { cn, Highlight, getHighlightExtension } from "#lib/utils";

interface CodeEditorProps {
	code: string;
	onChange?: (code: string) => void;
	theme?: "dark" | "light" | CreateThemeOptions;
	readOnly?: boolean;
	extensions?: Extension[];
	highlights?: Highlight[];
	className?: string;
}

// Custom dark theme matching our design
const defaultDarkTheme = createTheme({
	theme: "dark",
	settings: {
		background: "transparent",
		foreground: "#e2e8f0",
		caret: "#22d3ee",
		selection: "#334155",
		selectionMatch: "#334155",
		lineHighlight: "#1e293b",
		gutterBackground: "transparent",
		gutterForeground: "#475569",
		gutterBorder: "transparent",
	},
	styles: [
		{ tag: t.keyword, color: "#c084fc" },
		{ tag: t.string, color: "#fbbf24" },
		{ tag: t.function(t.variableName), color: "#22d3ee" },
		{ tag: t.standard(t.variableName), color: "#22d3ee" },
		{ tag: t.definition(t.variableName), color: "#22d3ee" },
		{ tag: t.comment, color: "#64748b", fontStyle: "italic" },
		{ tag: t.variableName, color: "#9cdcfe" },
		{ tag: t.typeName, color: "#34d399" },
		{ tag: t.number, color: "#fb923c" },
		{ tag: t.operator, color: "#94a3b8" },
		{ tag: t.punctuation, color: "#94a3b8" },
		{ tag: t.bracket, color: "#94a3b8" },
		{ tag: t.propertyName, color: "#60a5fa" },
	],
});

// Custom light theme
const defaultLightTheme = createTheme({
	theme: "light",
	settings: {
		background: "#ffffff",
		foreground: "#0f172a",
		caret: "#2563eb",
		selection: "#dbeafe",
		selectionMatch: "#dbeafe",
		lineHighlight: "#f8fafc",
		gutterBackground: "#ffffff",
		gutterForeground: "#94a3b8",
		gutterBorder: "transparent",
	},
	styles: [
		{ tag: t.keyword, color: "#7e22ce" },
		{ tag: t.string, color: "#d97706" },
		{ tag: t.function(t.variableName), color: "#0891b2" },
		{ tag: t.standard(t.variableName), color: "#0891b2" },
		{ tag: t.definition(t.variableName), color: "#0891b2" },
		{ tag: t.comment, color: "#64748b", fontStyle: "italic" },
		{ tag: t.variableName, color: "#2563eb" },
		{ tag: t.typeName, color: "#059669" },
		{ tag: t.number, color: "#ea580c" },
		{ tag: t.operator, color: "#475569" },
		{ tag: t.punctuation, color: "#475569" },
		{ tag: t.bracket, color: "#475569" },
		{ tag: t.propertyName, color: "#2563eb" },
	],
});

function getTheme(theme: "dark" | "light" | "system" | CreateThemeOptions | string | undefined) {
	if (theme === "light") {
		return defaultLightTheme;
	} else if (typeof theme === "object" && theme !== null) {
		return createTheme(theme as CreateThemeOptions);
	}
	return defaultDarkTheme;
}

// Editor base styling
const editorBaseTheme = EditorView.baseTheme({
	"&": {
		height: "100%",
		fontSize: "14px",
	},

	// ".cm-lineNumbers .cm-gutterElement": {
	// 	padding: "0 8px 0 10px",
	// },
	".cm-content": {
		// padding: "0 16px 0 0",
	},

	// "&.cm-focused": {
	// 	outline: "none",
	// },
});

export function CodeEditor({ code, onChange, theme, readOnly = false, extensions = [], highlights = [], className }: CodeEditorProps) {
	// console.log({themeProp})

	// const { theme: currentTheme } = useTheme();
	// const theme = (themeProp || currentTheme) as "light" | "dark" || "dark";

	const allExtensions = [...extensions, editorBaseTheme, EditorView.lineWrapping];
	if (highlights && highlights.length > 0) {
		allExtensions.push(getHighlightExtension(highlights));
	}

	return (
		<div className={cn(className, "h-full overflow-hidden")}>
			<CodeMirror
				value={code}
				height="100%"
				theme={getTheme(theme)}
				extensions={allExtensions}
				onChange={(value) => onChange?.(value)}
				editable={!readOnly}
				readOnly={readOnly}
				basicSetup={{
					lineNumbers: !readOnly,
					highlightActiveLineGutter: !readOnly,
					highlightActiveLine: !readOnly,
					foldGutter: false,
					dropCursor: !readOnly,
					allowMultipleSelections: true,
					indentOnInput: true,
					bracketMatching: true,
					closeBrackets: true,
					autocompletion: !readOnly,
					rectangularSelection: !readOnly,
					crosshairCursor: false,
					highlightSelectionMatches: true,
					searchKeymap: true,
				}}
				className="h-full [&_.cm-editor]:h-full"
			/>
		</div>
	);
}
