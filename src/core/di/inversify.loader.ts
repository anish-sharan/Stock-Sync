import { Container, ContainerModule } from 'inversify';

export class InversifyLoader {
	private container: Container;

	constructor(container: Container) {
		this.container = container;
	}

	public loadModules(modules: ContainerModule[]): Container {
		console.time(`Loaded ${modules.length} modules`);
		this.container.load(...modules);
		console.timeEnd(`Loaded ${modules.length} modules`);
		return this.container;
	}
}
