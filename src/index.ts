import 'reflect-metadata';
import { Application } from './app';
import container from './core/di/inversify.config';
import { InversifyLoader } from './core/di/inversify.loader';
import coreModules from './core/core.module';
import apiModules from './core/di/api-modules';

async function bootstrap() {
    const loader = new InversifyLoader(container);

    console.time('Total Module Load Time');
    loader.loadModules([coreModules, ...apiModules]);
    console.timeEnd('Total Module Load Time');

    console.time('Application bind');
    container.bind<Application>(Application).toSelf();
    const app = container.get<Application>(Application);
    console.timeEnd('Application bind');

    console.time('Application initialize');
    await app.initialize();
    console.timeEnd('Application initialize');

    console.time('Application start');
    await app.start();
    console.timeEnd('Application start');
}

bootstrap().catch(err => {
    console.error('Failed to start application:', err);
    process.exit(1);
});
