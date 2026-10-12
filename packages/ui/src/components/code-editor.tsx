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

// Kanga editor themes. Keywords carry the weight (they are the Swahili the
// learner is learning), strings are green like growing things, numbers blue.
const defaultDarkTheme = createTheme({
	theme: "dark",
	settings: {
		background: "var(--editor-bg)",
		foreground: "#fff3d6",
		caret: "#ffc93c",
		selection: "#ffc93c33",
		selectionMatch: "#ffc93c22",
		lineHighlight: "#ffffff08",
		gutterBackground: "var(--editor-bg)",
		gutterForeground: "#6f6355",
		gutterBorder: "transparent",
		gutterActiveForeground: "#ffc93c",
	},
	styles: [
		{ tag: t.keyword, color: "#ffc93c", fontWeight: "700" },
		{ tag: t.atom, color: "#ff9a3c", fontWeight: "600" },
		{ tag: t.string, color: "#3ccf86" },
		{ tag: [t.function(t.variableName), t.definition(t.variableName)], color: "#b39cff" },
		{ tag: t.standard(t.variableName), color: "#ff6f63", fontWeight: "600" },
		{ tag: t.special(t.variableName), color: "#6e9bff", fontWeight: "600" },
		{ tag: t.comment, color: "#8a7d6b", fontStyle: "italic" },
		{ tag: t.variableName, color: "#fff3d6" },
		{ tag: t.number, color: "#6e9bff" },
		{ tag: [t.operator, t.punctuation, t.bracket], color: "#b8ab95" },
		{ tag: t.propertyName, color: "#ffad5c" },
	],
});

const defaultLightTheme = createTheme({
	theme: "light",
	settings: {
		background: "var(--editor-bg)",
		foreground: "#15120f",
		caret: "#15120f",
		selection: "#ffc93c66",
		selectionMatch: "#ffc93c44",
		lineHighlight: "#ffc93c1f",
		gutterBackground: "var(--editor-bg)",
		gutterForeground: "#b3a58e",
		gutterBorder: "transparent",
		gutterActiveForeground: "#15120f",
	},
	styles: [
		{ tag: t.keyword, color: "#c8553d", fontWeight: "700" },
		{ tag: t.atom, color: "#b4530a", fontWeight: "600" },
		{ tag: t.string, color: "#18804d" },
		{ tag: [t.function(t.variableName), t.definition(t.variableName)], color: "#6a43d9" },
		{ tag: t.standard(t.variableName), color: "#d0342a", fontWeight: "600" },
		{ tag: t.special(t.variableName), color: "#245fd6", fontWeight: "600" },
		{ tag: t.comment, color: "#8f8270", fontStyle: "italic" },
		{ tag: t.variableName, color: "#15120f" },
		{ tag: t.number, color: "#245fd6" },
		{ tag: [t.operator, t.punctuation, t.bracket], color: "#6b6257" },
		{ tag: t.propertyName, color: "#b4530a" },
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
		fontSize: "15px",
	},
	".cm-scroller": {
		fontFamily: "var(--font-mono)",
		lineHeight: "1.65",
	},
	".cm-gutters": {
		paddingLeft: "6px",
	},
	".cm-tooltip.cm-tooltip-autocomplete": {
		border: "2px solid var(--mstari)",
		borderRadius: "10px",
		boxShadow: "4px 4px 0 0 var(--kivuli)",
		overflow: "hidden",
		background: "var(--card)",
		color: "var(--foreground)",
	},
	".cm-tooltip-autocomplete > ul > li[aria-selected]": {
		background: "var(--jua)",
		color: "#15120f",
	},
	".cm-completionDetail": {
		fontStyle: "normal",
		opacity: "0.7",
		marginLeft: "0.75em",
	},
	".cm-tooltip.cm-completionInfo": {
		border: "2px solid var(--mstari)",
		borderRadius: "10px",
		background: "var(--card)",
		color: "var(--foreground)",
		fontFamily: "var(--font-mono)",
		whiteSpace: "pre",
		padding: "8px 10px",
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
