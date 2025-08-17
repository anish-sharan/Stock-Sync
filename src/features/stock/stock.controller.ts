// src/features/stocks/stock.controller.ts
import TYPES from '@core/types';
import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet, httpPost, httpPut, requestBody, requestParam } from 'inversify-express-utils';
import { IStock, IStockService } from './stock.interfaces';
import { AppResponse } from '@core/data/response/app.response';
import { ValidateMiddleware } from '@core/middleware/validate.middleware';
import { createStockDto } from './data/request/createStock.dto';

@controller('/api/stocks')
export class StockController extends BaseHttpController {
    constructor(
        @inject(TYPES.StockService) private stockService: IStockService
    ) {
        super();
    }

    @httpPost('/', ValidateMiddleware(createStockDto))
    async createStock(@requestBody() body: Partial<IStock>) {
        const stock = await this.stockService.create(body);
        return this.ok(AppResponse.success(stock));
    }

    @httpGet('/')
    async getAllStocks() {
        const stocks = await this.stockService.getAll();
        return this.ok(AppResponse.success(stocks));
    }

    @httpGet('/:id')
    async getStockById(@requestParam('id') id: string) {
        const stock = await this.stockService.getByIdOrFail(id);
        return this.ok(AppResponse.success(stock));
    }

    @httpPut('/:id')
    async updateStock(@requestParam('id') id: string, @requestBody() body: any) {
        const stock = await this.stockService.update(id, body);
        return this.ok(AppResponse.success(stock));
    }
}
