// eslint-config-next 16 ships flat configs, so no FlatCompat shim is needed.
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
	...nextVitals,
	...nextTs,
	{
		// React Compiler rules from eslint-plugin-react-hooks 7. This app does not use
		// the compiler; the flagged patterns (mount flags, refs read in render for
		// imperative canvas/worker handles) are intentional, so they stay warnings.
		rules: {
			"react-hooks/set-state-in-effect": "warn",
			"react-hooks/refs": "warn",
			"react-hooks/purity": "warn",
			"react-hooks/immutability": "warn",
		},
	},
	{
		ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "scripts/**", "public/**"],
	},
];

export default eslintConfig;
