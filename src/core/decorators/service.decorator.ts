import { decorate, injectable } from 'inversify';
import container from '@core/di/inversify.config';
import 'reflect-metadata';

export const serviceRegistry: Map<string, any> = new Map();

export function Service(identifier: symbol) {
	return function (target: any): any {
		decorate(injectable(), target);

		if (!container.isBound(identifier)) {
			container.bind(identifier).to(target).inSingletonScope();
		}

		serviceRegistry.set(identifier.toString(), target);

		return target;
	};
}
