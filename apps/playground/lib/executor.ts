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
		createInstance: (outputReceiver: OutputReceiver) => LanguageInstace,
		options?: ExecutorOptions,
	) {
		this.language = language;
		this.instance = createInstance(this.outputHandler);
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
