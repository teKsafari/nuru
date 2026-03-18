import { StreamLanguage } from "@codemirror/language";
import { simpleMode } from "@codemirror/legacy-modes/mode/simple-mode";

export const nuruLanguage = StreamLanguage.define(
  simpleMode({
    start: [
      // Strings
      { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string" },
      { regex: /'(?:[^\\]|\\.)*?(?:'|$)/, token: "string" },
      
      // Keywords
      { 
        regex: /\b(?:kama|sivyo|kwa|wakati|rudisha|andika|kweli|si_kweli|tupu|fanya|ikiwa)\b/, 
        token: "keyword" 
      },
      
      // Built-in functions/types (optional, add more if Nuru has them)
      { 
        regex: /\b(?:jaza|sukuma|aina_ya|urefu)\b/, 
        token: "builtin" 
      },

      // Comments
      { regex: /\/\/.*/, token: "comment" },
      { regex: /\/\*/, token: "comment", next: "comment" },
      
      // Numbers
      { regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i, token: "number" },
      
      // Operators and punctuation
      { regex: /[-+\/*=<>!]+/, token: "operator" },
      { regex: /[{}()[\].,;:]/, token: "punctuation" },
      
      // Variables
      { regex: /[a-zA-Z_]\w*/, token: "variable" }
    ],
    comment: [
      { regex: /.*?\*\//, token: "comment", next: "start" },
      { regex: /.*/, token: "comment" }
    ],
    meta: {
      dontIndentStates: ["comment"],
      lineComment: "//"
    }
  })
);
