import { EventEmitter2 } from 'eventemitter2';

export interface IEventMetadata {
	timestamp: Date;
	source: string;
	correlationId?: string;
	userId?: string;
}

export interface IEvent<T = any> {
	type: string;
	data: T;
	metadata: IEventMetadata;
}

export interface IEventHandler<T = any> {
	handle(event: IEvent<T>): Promise<void>;
}

export interface IEventBus {
	publish<T>(event: IEvent<T>): Promise<void>;
	subscribe<T>(eventType: string, handler: IEventHandler<T>): void;
	unsubscribe(eventType: string, handler: IEventHandler): void;
}

type ListenerFn<T = any> = (event: IEvent<T>) => Promise<void>;

export class EventBus implements IEventBus {
	private static instance: EventBus;
	private emitter: EventEmitter2;
	private handlerMap: Map<IEventHandler, ListenerFn>;

	private constructor() {
		this.emitter = new EventEmitter2({
			wildcard: true,
			delimiter: '.',
			maxListeners: 20,
			verboseMemoryLeak: true
		});
		this.handlerMap = new Map();
	}

	public static getInstance(): EventBus {
		if (!EventBus.instance) {
			EventBus.instance = new EventBus();
		}
		return EventBus.instance;
	}

	public async publish<T>(event: IEvent<T>): Promise<void> {
		await this.emitter.emitAsync(event.type, event);
	}

	public subscribe<T>(eventType: string, handler: IEventHandler<T>): void {
		const wrappedListener = async (event: IEvent<T>) => {
			try {
				await handler.handle(event);
			} catch (error) {
				console.error(`Error handling event ${eventType}:`, error);
			}
		};

		this.handlerMap.set(handler, wrappedListener);
		this.emitter.on(eventType, wrappedListener);
	}

	public unsubscribe(eventType: string, handler: IEventHandler): void {
		const wrappedListener = this.handlerMap.get(handler);
		if (wrappedListener) {
			this.emitter.off(eventType, wrappedListener);
			this.handlerMap.delete(handler);
		}
	}
}
