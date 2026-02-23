import { OutputReceiver } from "@/types";

export interface Interpreter {
	execute: (code: string) => void;
}

export class Executor<LanguageInstace extends Interpreter> {
	language: string;
	instance: LanguageInstace;
	outputHandler: OutputReceiver | null = null;

	private outputRegistrar: (bridge: OutputReceiver) => void;

	constructor(
		language: string,
		instance: LanguageInstace,
		outputRegistrar: typeof this.outputRegistrar,
	) {
		this.language = language;
		this.instance = instance;
		this.outputRegistrar = outputRegistrar;
	}

	run(code: string) {
		this.instance.execute(code);
	}
	async submit(code: string) {
		try {
			this.instance.execute(code);
			return "✓ Submitted!";
		} catch (e) {
			return `X Kosa: ${e}`;
		}
	}
	onOutput(outputBridge: OutputReceiver) {
		this.outputHandler = outputBridge;
		this.outputRegistrar(outputBridge);
	}

	onBeforeRun(){
		// TODO: define onBeforeRun
	}

	getSolution(){
		// TODO: define getSolution 
		return "some solution"
	}
}
