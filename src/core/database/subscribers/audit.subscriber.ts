import { injectable } from 'inversify';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { BaseEntity } from '../../data/entity/baseEntity.model';
import { AsyncLocalStorage } from 'async_hooks';
import { interfaces } from 'inversify-express-utils';
import TYPES from '../../types';
import container from '../../di/inversify.config';
import { IUser } from '@features/user/user.interfaces';
import { ILogger } from '@core/logger/logger.interface';

@injectable()
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface<BaseEntity> {
	listenTo() {
		return BaseEntity;
	}

	beforeInsert(event: InsertEvent<BaseEntity>) {
		const logger = container.get<ILogger>(TYPES.Logger);
		const userId = this.getUserId();

		try {
			if (event.entity && userId) {
				event.entity.createdBy = userId;
				event.entity.updatedBy = userId;
				event.entity.createdDate = new Date();
				event.entity.updatedDate = new Date();

				logger.debug('Audit fields set for insert', {
					entityId: event.entity.id,
					userId: userId,
					entityType: event.entity.constructor.name
				});
			} else if (event.entity) {
				logger.warn('Entity inserted without user context', {
					entityId: event.entity.id,
					entityType: event.entity.constructor.name
				});
			}
		} catch (error: any) {
			logger.error('Error setting audit fields for insert', error, {
				entityId: event.entity?.id,
				entityType: event.entity?.constructor.name
			});
		}
	}

	beforeUpdate(event: UpdateEvent<BaseEntity>) {
		const logger = container.get<ILogger>(TYPES.Logger);
		const userId = this.getUserId();

		try {
			if (event.entity && userId) {
				event.entity.updatedBy = userId;
				event.entity.updatedDate = new Date();

				logger.debug('Audit fields set for update', {
					entityId: event.entity.id,
					userId: userId,
					entityType: event.entity.constructor.name
				});
			} else if (event.entity) {
				logger.warn('Entity updated without user context', {
					entityId: event.entity.id,
					entityType: event.entity.constructor.name
				});
			}
		} catch (error: any) {
			logger.error('Error setting audit fields for update', error, {
				entityId: event.entity?.id,
				entityType: event.entity?.constructor.name
			});
		}
	}

	private getUserId() {
		const httpContextStorage = container.get<AsyncLocalStorage<interfaces.HttpContext>>(TYPES.HttpContextStorage);
		const httpContext = httpContextStorage.getStore()?.user?.details as IUser;
		return httpContext?.id;
	}
}
