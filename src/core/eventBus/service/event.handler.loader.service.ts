import { injectable, inject } from 'inversify';
import { ILogger } from '@core/logger/logger.interface';
import { EVENT_HANDLER_METADATA_KEY } from '../decorators/event.handler.decorator';
import { BaseEventHandler } from '../handlers/base.event.handler';
import container from '@core/di/inversify.config';
import TYPES from '@core/types';

@injectable()
export class EventHandlerLoaderService {
	constructor(@inject(TYPES.Logger) private readonly logger: ILogger) { }

	public loadEventHandlers(): void {
		this.logger.info('Loading event handlers...');

		let bindings: BaseEventHandler[] = [];

		try {
			if (container.isBound(TYPES.EventHandler)) {
				bindings = container.getAll<BaseEventHandler>(TYPES.EventHandler);
			}
		} catch (e) {
			this.logger.warn('No event handlers bound in container');
			return;
		}

		if (bindings.length === 0) {
			this.logger.warn('No event handlers found in container');
			return;
		}

		this.logger.info(`Found ${bindings.length} event handlers`);

		for (const handler of bindings) {
			const handlerType = handler.constructor;
			const isEventHandler = Reflect.getMetadata(EVENT_HANDLER_METADATA_KEY, handlerType);

			if (isEventHandler && handler instanceof BaseEventHandler) {
				try {
					this.logger.info(`Loaded event handler: ${handlerType.name}`);
				} catch (error) {
					this.logger.error(`Failed to load event handler ${handlerType.name}:`, error as Error);
				}
			} else {
				this.logger.info(`Skipping non-event handler: ${handlerType.name}`);
			}
		}

		this.logger.info('Event handlers loading completed');
	}

}
