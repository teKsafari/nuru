import type { KobeEvent, NuruEvent, UbaoEvent } from "@nuru/wasm/runtime";

export type BusListener<E> = {
	/** A new run started: clear the drawing / board. */
	reset: () => void;
	/** Events from the running program, in order. */
	events: (events: E[]) => void;
};

/**
 * Carries kobe and ubao events from the runtime to the renderers without going
 * through React state. A renderer that mounts late replays `history`.
 */
export class EventBus<E> {
	history: E[] = [];
	private listeners = new Set<BusListener<E>>();

	subscribe(l: BusListener<E>) {
		this.listeners.add(l);
		return () => {
			this.listeners.delete(l);
		};
	}

	reset() {
		this.history = [];
		for (const l of this.listeners) l.reset();
	}

	push(events: E[]) {
		if (events.length === 0) return;
		for (const e of events) this.history.push(e);
		for (const l of this.listeners) l.events(events);
	}
}

export type KobeBus = EventBus<KobeEvent>;
export type UbaoBus = EventBus<UbaoEvent>;
export type { KobeEvent, UbaoEvent, NuruEvent };
