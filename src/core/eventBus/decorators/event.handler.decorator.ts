import 'reflect-metadata';

export const EVENT_HANDLER_METADATA_KEY = 'event:handler';

export function EventHandler() {
	return function (target: any) {
		Reflect.defineMetadata(EVENT_HANDLER_METADATA_KEY, true, target);
	};
}
