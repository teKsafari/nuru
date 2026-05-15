// exports lang definitions for monarch, monacho's (the editor) tokenizer.
// read more at https://microsoft.github.io/monaco-editor/monarch.html
// Adapted from: extensions/vscode/nuru/syntaxes/nuru.tmLanguage.json

export const languageSyntaxDef = {
	// Set defaultToken to invalid to see what you do not tokenize yet
	defaultToken: "invalid",

	keywords: [
		"kama",
		"au",
		"sivyo",
		"wakati",
		"rudisha",
		"vunja",
		"endelea",
		"tupu",
		"ktk",
		"kwa",
		"badili",
		"ikiwa",
		"kawaida",
		"tumia",
	],

	typeKeywords: ["fanya"],

	functionKeywords: [
		"unda",
		"andika",
		"idadi",
		"jumla",
		"yamwisho",
		"sukuma",
		"jaza",
		"aina",
		"fungua",
		"namba",
	],

	constants: ["kweli", "sikweli"],

	supportFunctions: ["os", "muda"],

	operators: [
		"+",
		"-",
		"*",
		"/",
		"%",
		"^",
		"=",
		"<",
		">",
		"!",
		"==",
		"<=",
		">=",
		"!=",
		"&&",
		"||",
		":",
		".",
	],

	// Common regular expressions
	symbols: /[=<>!+\-*\/%^&|~.:]+/,

	// Escape sequences
	escapes:
		/\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

	// The main tokenizer for our language
	tokenizer: {
		root: [
			// Variable declarations - match keywords that introduce variables
			[
				/\b(?:fanya|idadi|jumla)\b/,
				{ token: "keyword", next: "@variableDeclaration" },
			],

			// Function declarations - match 'unda' followed by function name
			[/\bunda\b/, { token: "keyword.function", next: "@functionDeclaration" }],

			// Identifiers and keywords
			[
				/[a-zA-Z_][a-zA-Z0-9_]*/,
				{
					cases: {
						"@functionKeywords": "keyword.function",
						"@typeKeywords": "keyword.type",
						"@keywords": "keyword.control",
						"@constants": "constant",
						"@supportFunctions": "support.function",
						"@default": "variable",
					},
				},
			],

			// Function calls
			[/\b([_A-Za-z][_A-Za-z0-9]*)\s*(?=\()/, "entity.name.function"],

			// Whitespace
			{ include: "@whitespace" },

			// Numbers
			[/\b\d+(\.\d+)?\b/, "number"],

			// Delimiters and operators
			[/[{}()\[\]]/, "@brackets"],
			[/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],

			// Punctuation
			[/[,;]/, "delimiter"],

			// Strings
			[/"([^"\\]|\\.)*$/, "string.invalid"], // non-terminated string
			[
				/"/,
				{ token: "string.quote", bracket: "@open", next: "@string_double" },
			],
			[/'([^'\\]|\\.)*$/, "string.invalid"], // non-terminated string
			[
				/'/,
				{ token: "string.quote", bracket: "@open", next: "@string_single" },
			],
		],

        // ----
		// New state to handle variable declarations
		variableDeclaration: [
			[/\s+/, "white"], // skip whitespace
			[/[a-zA-Z_][a-zA-Z0-9_]*/, { token: "variable.name", next: "@pop" }],
			[/[=;]/, { token: "@rematch", next: "@pop" }], // handle edge cases
		],

		// New state to handle function declarations
		functionDeclaration: [
			[/\s+/, "white"], // skip whitespace
			[
				/[a-zA-Z_][a-zA-Z0-9_]*/,
				{ token: "entity.name.function", next: "@pop" },
			],
			[/[({]/, { token: "@rematch", next: "@pop" }], // handle edge cases
		],
        // ----

		whitespace: [
			[/[ \t\r\n]+/, "white"],
			[/\/\*/, "comment", "@comment"],
			[/\/\/.*$/, "comment"],
		],

		comment: [
			[/[^\/*]+/, "comment"],
			[/\/\*/, "comment", "@push"], // nested comment
			[/\*\//, "comment", "@pop"],
			[/[\/*]/, "comment"],
		],

		string_double: [
			[/[^\\"]+/, "string"],
			[/@escapes/, "string.escape"],
			[/\\./, "string.escape.invalid"],
			[/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
		],

		string_single: [
			[/[^\\']+/, "string"],
			[/@escapes/, "string.escape"],
			[/\\./, "string.escape.invalid"],
			[/'/, { token: "string.quote", bracket: "@close", next: "@pop" }],
		],
	},
};

// export const languageSyntaxDef = {

// 	patterns: [
// 		{
// 			include: "#linecomments",
// 		},
// 		{
// 			include: "#blockcomments",
// 		},
// 		{
// 			include: "#operators",
// 		},
// 		{
// 			include: "#punctuation",
// 		},
// 		{
// 			include: "#numbers",
// 		},
// 		{
// 			include: "#constant",
// 		},
// 		{
// 			include: "#keywords",
// 		},
// 		{
// 			include: "#strings",
// 		},
// 		{
// 			include: "#identifiers",
// 		},
// 	],
// 	repository: {
// 		linecomments: {
// 			name: "comment.line.double-slash.nuru",
// 			match: "(//).*$\n?",
// 			captures: {
// 				"1": {
// 					name: "punctuation.definition.comment.nuru",
// 				},
// 			},
// 		},
// 		blockcomments: {
// 			name: "comment.block.nuru",
// 			begin: "/\\*",
// 			end: "\\*/",
// 			captures: {
// 				"0": {
// 					name: "punctuation.definition.comment.nuru",
// 				},
// 			},
// 		},
// 		numbers: {
// 			name: "constant.numeric.nuru",
// 			match: "\\b[0-9]+(\\.[0-9]+)?\\b",
// 		},
// 		constant: {
// 			name: "constant.language.nuru",
// 			match: "\\b(kweli|sikweli)\\b",
// 		},
// 		operators: {
// 			patterns: [
// 				{
// 					name: "keyword.operator.arithmetic.nuru",
// 					match: "\\b(\\+|\\-|%|\\*|\\/|\\^)\\b",
// 				},
// 				{
// 					name: "keyword.operator.logical.nuru",
// 					match: "\\b(==|<=|>=|<|>|&&|\\|\\|)\\b",
// 				},
// 				{
// 					name: "keyword.operator.assignment.nuru",
// 					match: "\\b(=|:)\\b",
// 				},
// 				{
// 					name: "punctuation.accessor.nuru",
// 					match: "\\.",
// 				},
// 			],
// 		},
// 		punctuation: {
// 			patterns: [
// 				{
// 					name: "punctuation.separator",
// 					match: ",",
// 				},
// 				{
// 					include: "#groups",
// 				},
// 			],
// 		},
// 		keywords: {
// 			patterns: [
// 				{
// 					name: "storage.type.function.nuru",
// 					match:
// 						"\\b(unda|andika|idadi|jumla|yamwisho|sukuma|jaza|aina|fungua)\\b",
// 				},
// 				{
// 					name: "storage.type.nuru",
// 					match: "\\bfanya\\b",
// 				},
// 				{
// 					name: "keyword.control.nuru",
// 					match:
// 						"\\b(kama|au|sivyo|wakati|rudisha|vunja|endelea|tupu|ktk|kwa|badili|ikiwa|kawaida|tumia)\\b",
// 				},
// 				{
// 					name: "support.function.nuru",
// 					match: "\\b(os|muda)\\b",
// 				},
// 			],
// 		},
// 		identifiers: {
// 			patterns: [
// 				{
// 					name: "meta.functioncall.nuru",
// 					match: "\\b([_A-Za-z][_A-Za-z0-9]*)\\b(?=\\()",
// 					captures: {
// 						"1": {
// 							name: "entity.name.function.nuru",
// 						},
// 					},
// 				},
// 			],
// 		},
// 		strings: {
// 			patterns: [
// 				{
// 					name: "string.quoted.double.nuru",
// 					begin: '"',
// 					end: '"',
// 					patterns: [
// 						{
// 							name: "constant.character.escape.nuru",
// 							match: "\\\\.",
// 						},
// 					],
// 				},
// 				{
// 					name: "string.quoted.single.nuru",
// 					begin: "\\'",
// 					end: "\\'",
// 					patterns: [
// 						{
// 							name: "constant.character.escape.nuru",
// 							match: "\\\\.",
// 						},
// 					],
// 				},
// 			],
// 		},
// 	},
// };

// defines editor behaviour
export const configuration = {
	comments: {
		// symbol used for single line comment. Remove this entry if your language does not support line comments
		lineComment: "//",
		// symbols used for start and end a block comment. Remove this entry if your language does not support block comments
		blockComment: ["/*", "*/"],
	},
	// symbols used as brackets
	brackets: [
		["{", "}"],
		["[", "]"],
		["(", ")"],
	],
};
