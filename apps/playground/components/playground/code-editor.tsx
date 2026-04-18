"use client";

import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import * as lezerHighlight from "@lezer/highlight";
const { tags: t } = lezerHighlight;
import { createTheme } from "@uiw/codemirror-themes";
import type { CreateThemeOptions } from "@uiw/codemirror-themes";
import { useTheme } from "@wrksz/themes/client";

interface CodeEditorProps {
	code: string;
	onChange?: (code: string) => void;
	theme?: "dark" | "light" | CreateThemeOptions;
	readOnly?: boolean;
	extensions?: Extension[];
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
		background: "transparent",
		foreground: "#e2e8f0",
		caret: "#22d3ee",
		selection: "#334155",
		selectionMatch: "#334155",
		lineHighlight: "hsl(var(--accent))",
		// gutterBackground: "hsl(var(--secondary)/10)",
		gutterForeground: "hsl(var(--muted-foreground)/80)",
		gutterBorder: "hsl(var(--border))",
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

export function CodeEditor({
	code,
	onChange,
	theme: themeProp,
	readOnly = false,
	extensions = [],
}: CodeEditorProps) {
	const { theme: currentTheme, forcedTheme } = useTheme();
	const theme = (themeProp || forcedTheme || currentTheme) as "light" | "dark" || "dark";

	return (
		<div className="h-full overflow-hidden">
			<CodeMirror
				value={code}
				height="100%"
				theme={getTheme(theme)}
				extensions={[...extensions, editorBaseTheme, EditorView.lineWrapping]}
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
