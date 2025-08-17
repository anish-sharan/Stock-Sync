// import { ConfigService } from '@core/config/config';
// import { AuthenticationError } from '@core/data/error/app.error';
// import TYPES from '@core/types';
// import { CognitoJwtVerifier } from 'aws-jwt-verify';
// import { inject, injectable } from 'inversify';

// @injectable()
// export class TokenResolver {
// 	private readonly tokenVerifier;

// 	constructor(@inject(TYPES.Config) private readonly config: ConfigService) {
// 		this.tokenVerifier = CognitoJwtVerifier.create({
// 			tokenUse: 'access',
// 			userPoolId: this.config.getAWSConfig().userPoolUserId,
// 			clientId: this.config.getAWSConfig().userPoolClientId
// 		});
// 	}

// 	async getExternalId(token: string): Promise<string> {
// 		if (!token) {
// 			throw new AuthenticationError('Access token is missing');
// 		}

// 		try {
// 			const payload = await this.tokenVerifier.verify(token);

// 			if (!payload?.sub) {
// 				throw new Error('Invalid token');
// 			}

// 			return payload.sub;
// 		} catch (error: any) {
// 			const errMsg = error.message || 'Invalid Token';
// 			throw new AuthenticationError(errMsg);
// 		}
// 	}
// }
