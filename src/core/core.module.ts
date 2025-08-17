import { ContainerModule } from 'inversify';
// import { TokenResolver } from './auth/token-resolver';
import { ConfigService } from './config/config';
import { DatabaseService } from './database/database.service';
import { ErrorHandlerMiddleware } from './error/errorHandling.middleware';
import { Logger } from './logger/winston.logger';
import TYPES from './types';
import { HttpContextMiddleware } from './context/http-context.middleware';
import { IHttpContextAccessor } from './context/http-context';
import { HttpContextAccessor } from './context/http-context-accessor';
import { AsyncLocalStorage } from 'async_hooks';
import { interfaces } from 'inversify-express-utils';
import { EventHandlerLoaderService } from './eventBus/service/event.handler.loader.service';

const coreModule = new ContainerModule(bind => {
	bind(TYPES.Logger).to(Logger).inSingletonScope();
	bind(TYPES.Config).to(ConfigService).inSingletonScope();
	bind(TYPES.Database).to(DatabaseService).inSingletonScope();
	bind(TYPES.ErrorHandler).to(ErrorHandlerMiddleware).inSingletonScope();
	// bind(TYPES.CognitoTokenResolver).to(TokenResolver).inSingletonScope();
	bind<HttpContextMiddleware>(HttpContextMiddleware).toSelf();
	bind<IHttpContextAccessor>(TYPES.HttpContextAccessor).to(HttpContextAccessor);
	bind<AsyncLocalStorage<interfaces.HttpContext>>(TYPES.HttpContextStorage).toConstantValue(
		new AsyncLocalStorage<interfaces.HttpContext>()
	);
	bind<EventHandlerLoaderService>(TYPES.EventHandlerLoaderService).to(EventHandlerLoaderService);
});

export default coreModule;
