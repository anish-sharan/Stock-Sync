import { AsyncLocalStorage } from 'async_hooks';

class RequestContext {
	private static storage = new AsyncLocalStorage<Map<string, any>>();

	static run(fn: () => Promise<void>) {
		const store = new Map<string, any>();
		this.storage.run(store, fn);
	}

	static set(key: string, value: any) {
		const store = this.storage.getStore();
		if (store) {
			store.set(key, value);
		}
	}

	static get<T>(key: string): T | undefined {
		const store = this.storage.getStore();
		return store ? store.get(key) : undefined;
	}

	static setUserData(data: Record<string, any>) {
		for (const [key, value] of Object.entries(data)) {
			this.set(key, value);
		}
	}

	static getUserData(): Record<string, any> {
		const store = this.storage.getStore();
		return store ? Object.fromEntries(store.entries()) : {};
	}

	static debugPrint() {
		const store = this.storage.getStore();
		console.log('RequestContext Data:', store ? Object.fromEntries(store.entries()) : 'No context available');
	}
}

export { RequestContext };
