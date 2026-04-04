import { OutputReceiver } from "@/types";

export interface Interpreter {
	execute: (code: string) => unknown;
}

export interface ExecutorOptions {
	onBeforeRun?: () => void;
	getSolution?: () => string;
}

export class Executor<LanguageInstace extends Interpreter> {
	language: string;
	instance: LanguageInstace;
	private outputBridge: OutputReceiver | null = null;

	private options?: ExecutorOptions;

	constructor(
		language: string,
		createInstance: (
			outputReceiver: OutputReceiver,
			props?: any,
		) => LanguageInstace,
		options?: ExecutorOptions,
	) {
		this.language = language;
		if (process.env.NODE_ENV == "development") {
			// TODO: hoist this up. this logic should occur up in the consumer and passed down as an argument.
			this.instance = createInstance(this.outputHandler, {
				wasmURL:
					process.env.NEXT_PUBLIC_WASM_DEV_URL ||
					"http://localhost:7070/main.wasm",
			});
		} else {
			this.instance = createInstance(this.outputHandler);
		}
		this.options = options;
	}

	outputHandler = (text: string, isError: boolean) => {
		if (this.outputBridge) {
			this.outputBridge(text, isError);
		} else {
			console.error(
				`Output received but output handler not regsitered.\noutput:${text}\n call onOuput method`,
			);
		}
	};

	setInstance = (instance: LanguageInstace) => {
		this.instance = instance;
	};

	async run(code: string) {
		await this.instance.execute(code);
	}

	async submit(code: string) {
		try {
			await this.instance.execute(code);
			return "✓ Submitted!";
		} catch (e) {
			return `X Kosa: ${e}`;
		}
	}

	onOutput(outputBridge: OutputReceiver) {
		this.outputBridge = outputBridge;
	}

	onBeforeRun() {
		if (this.options?.onBeforeRun) {
			this.options.onBeforeRun();
		}
	}

	getSolution() {
		if (this.options?.getSolution) {
			return this.options.getSolution();
		}
		return "some solution";
	}
}
