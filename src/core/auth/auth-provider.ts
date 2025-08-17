/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import { injectable, inject } from 'inversify';
import { ConfigService } from '../config/config';
import { DatabaseService } from '../database/database.service';
import { ILogger } from '../logger/logger.interface';
import TYPES from '../types';
import AuthPrincipal from './principal/auth.principal';
import GuestPrincipal from './principal/guest.principal';
import { interfaces } from 'inversify-express-utils';
import User from '@features/user/entities/user.entity';

@injectable()
export default class AuthProvider implements interfaces.AuthProvider {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.Config) private config: ConfigService,
        @inject(TYPES.Database) private database: DatabaseService
    ) { }

    async getUser(
        req: express.Request,
        _res: express.Response,
        _next: express.NextFunction
    ): Promise<interfaces.Principal> {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new GuestPrincipal();
        }

        const externalId = authHeader.replace('Bearer ', '').trim();
        if (!externalId) {
            return new GuestPrincipal();
        }

        try {
            // Look up the user in DB
            const user = await this.database
                .getDataSource()
                .getRepository(User)
                .findOne({
                    where: { id: externalId },
                });

            if (!user) {
                this.logger.debug('No active user found for externalId', { externalId });
                return new GuestPrincipal();
            }

            // Return authenticated principal
            return new AuthPrincipal(user);
        } catch (error: any) {
            this.logger.error('AuthProvider.getUser failed');
            return new GuestPrincipal();
        }
    }
}
