"use client";

import CodeMirror from "@uiw/react-codemirror";
import { go } from "@codemirror/lang-go";
import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";
import type { CreateThemeOptions } from "@uiw/codemirror-themes";
import { githubDark } from "@fsegurai/codemirror-theme-github-dark";
import { githubLight } from "@fsegurai/codemirror-theme-github-light";

interface CodeEditorProps {
	code: string;
	onChange: (code: string) => void;
	theme?: "dark" | "light" | CreateThemeOptions;
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
		{ tag: tags.keyword, color: "#c084fc" },
		{ tag: tags.string, color: "#fbbf24" },
		{ tag: tags.function(tags.variableName), color: "#22d3ee" },
		{ tag: tags.comment, color: "#64748b", fontStyle: "italic" },
		{ tag: tags.variableName, color: "#e2e8f0" },
		{ tag: tags.typeName, color: "#34d399" },
		{ tag: tags.number, color: "#fb923c" },
		{ tag: tags.operator, color: "#94a3b8" },
		{ tag: tags.bracket, color: "#94a3b8" },
		{ tag: tags.propertyName, color: "#60a5fa" },
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
		{ tag: tags.keyword, color: "#7e22ce" },
		{ tag: tags.string, color: "#d97706" },
		{ tag: tags.function(tags.variableName), color: "#0891b2" },
		{ tag: tags.comment, color: "#64748b", fontStyle: "italic" },
		{ tag: tags.variableName, color: "#0f172a" },
		{ tag: tags.typeName, color: "#059669" },
		{ tag: tags.number, color: "#ea580c" },
		{ tag: tags.operator, color: "#475569" },
		{ tag: tags.bracket, color: "#475569" },
		{ tag: tags.propertyName, color: "#2563eb" },
	],
});

function getTheme(theme: "dark" | "light" | CreateThemeOptions) {
	if (theme === "dark") {
		return defaultDarkTheme;
	} else if (theme == "light") {
		return githubLight;
	}
	return createTheme(theme);
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
	theme = "light",
}: CodeEditorProps) {
	// console.log({theme})

	return (
		<div className="h-full overflow-hidden">
			<CodeMirror
				value={code}
				height="100%"
				theme={getTheme(theme)}
				extensions={[go(), editorBaseTheme]}
				onChange={(value) => onChange(value)}
				basicSetup={{
					lineNumbers: true,
					highlightActiveLineGutter: true,
					highlightActiveLine: true,
					foldGutter: false,
					dropCursor: true,
					allowMultipleSelections: true,
					indentOnInput: true,
					bracketMatching: true,
					closeBrackets: true,
					autocompletion: true,
					rectangularSelection: true,
					crosshairCursor: false,
					highlightSelectionMatches: true,
					searchKeymap: true,
				}}
				className="h-full [&_.cm-editor]:h-full"
			/>
		</div>
	);
}
