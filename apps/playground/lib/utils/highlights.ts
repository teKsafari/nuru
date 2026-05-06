import { Decoration, DecorationSet, EditorView } from "@codemirror/view";
import { StateField, Extension } from "@codemirror/state";

export interface Highlight {
	from: number;
	to: number;
	className: string;
}

/**
 * Parses code for the +++highlight+++ syntax.
 * Returns the cleaned code and the computed highlight ranges.
 */
export function parseHighlights(code: string): { cleanedCode: string; highlights: Highlight[] } {
	const highlights: Highlight[] = [];
	let cleanedCode = "";
	let lastIndex = 0;
	// Match +++content+++
	const regex = /\+\+\+([\s\S]*?)\+\+\+/g;
	let match;

	while ((match = regex.exec(code)) !== null) {
		cleanedCode += code.substring(lastIndex, match.index);
		const start = cleanedCode.length;
		cleanedCode += match[1];
		const end = cleanedCode.length;
		
		if (start < end) {
			highlights.push({
				from: start,
				to: end,
				className: "bg-green-500/20 text-green-700 dark:text-green-300 rounded-[2px] font-bold px-0.5",
			});
		}
		lastIndex = regex.lastIndex;
	}
	cleanedCode += code.substring(lastIndex);
	return { cleanedCode, highlights };
}

/**
 * Creates a CodeMirror extension to display the highlights.
 */
export function getHighlightExtension(highlights: Highlight[]): Extension {
	return StateField.define<DecorationSet>({
		create() {
			return Decoration.set(
				highlights.map(({ from, to, className }) =>
					Decoration.mark({ class: className }).range(from, to)
				)
			);
		},
		update(decorations, tr) {
			return decorations.map(tr.changes);
		},
		provide: (f) => EditorView.decorations.from(f),
	});
}
