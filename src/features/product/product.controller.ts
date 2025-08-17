import TYPES from '@core/types';
import { inject } from 'inversify';
import {
	BaseHttpController,
	controller,
	httpGet,
	httpPost,
	requestBody,
	requestParam,
} from 'inversify-express-utils';
import { AppResponse } from '@core/data/response/app.response';
import { ValidateMiddleware } from '@core/middleware/validate.middleware';
import { IProductService } from './product.interface';
import { createProductDto, ICreateProduct } from './data/request/createProduct.dto';

@controller('/api/products')
export class ProductController extends BaseHttpController {
	constructor(
		@inject(TYPES.ProductService) private productService: IProductService
	) {
		super();
	}

	@httpPost('/', ValidateMiddleware(createProductDto))
	async createProduct(@requestBody() body: ICreateProduct) {
		const product = await this.productService.create(body);
		return this.ok(AppResponse.success(product));
	}

	@httpGet('/')
	async getAllProducts() {
		const products = await this.productService.getAll();
		return this.ok(AppResponse.success(products));
	}

	@httpGet('/:id')
	async getProductById(@requestParam('id') id: string) {
		const product = await this.productService.getByIdOrFail(id);
		return this.ok(AppResponse.success(product));
	}
}
