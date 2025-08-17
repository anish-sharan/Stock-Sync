import { injectable } from 'inversify';
import { IEvent, IEventHandler } from '../contracts/event.contract';
import { ILogger } from '@core/logger/logger.interface';
import TYPES from '@core/types';
import { inject } from 'inversify';

@injectable()
export abstract class BaseEventHandler<T = any> implements IEventHandler<T> {
	protected abstract readonly eventType: string;

	constructor(@inject(TYPES.Logger) protected readonly logger: ILogger) {}

	public abstract handle(event: IEvent<T>): Promise<void>;

	protected logEvent(event: IEvent<T>, action: string): void {
		this.logger.info(`Event ${action}`, {
			eventType: event.type,
			correlationId: event.metadata.correlationId,
			userId: event.metadata.userId,
			timestamp: event.metadata.timestamp,
			source: event.metadata.source
		});
	}

	protected logError(event: IEvent<T>, error: Error): void {
		this.logger.error(
			`Error handling event ${event.type}`,
			{
				name: error.name,
				message: error.message,
				stack: error.stack
			},
			{
				correlationId: event.metadata.correlationId,
				userId: event.metadata.userId
			}
		);
	}
}
