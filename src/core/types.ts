const CORE_TYPES = {
	Cache: Symbol.for('Cache'),
	Logger: Symbol.for('Logger'),
	Config: Symbol.for('Config'),
	Database: Symbol.for('Database'),
	Application: Symbol.for('Application'),
	ErrorHandler: Symbol.for('ErrorHandler'),
	CognitoTokenResolver: Symbol.for('CognitoTokenResolver'),
	HttpContextAccessor: Symbol.for('HttpContextAccessor'),
	HttpContextStorage: Symbol.for('HttpContextStorage'),
	EventHandler: Symbol.for('EventHandler'),
	EventHandlerLoaderService: Symbol.for('EventHandlerLoaderService')
};

const USER_TYPES = {
	UserModel: Symbol.for('UserModel'),
	UserService: Symbol.for('UserService'),
	UserRepository: Symbol.for('UserRepository'),
	UserController: Symbol.for('UserController'),
};

const COMPANY_TYPES = {
	CompanyModel: Symbol.for('CompanyModel'),
	CompanyService: Symbol.for('CompanyService'),
	CompanyRepository: Symbol.for('CompanyRepository'),
	CompanyController: Symbol.for('CompanyController'),
};

const PRODUCT_TYPES = {
	ProductModel: Symbol.for('ProductModel'),
	ProductService: Symbol.for('ProductService'),
	ProductRepository: Symbol.for('ProductRepository'),
	ProductController: Symbol.for('ProductController'),
};

const STOCK_TYPES = {
    StockModel: Symbol.for('StockModel'),
    StockRepository: Symbol.for('StockRepository'),
    StockService: Symbol.for('StockService'),
    StockController: Symbol.for('StockController'),
};

const ORDER_TYPES = {
	OrderModel: Symbol.for('OrderModel'),
	OrderRepository: Symbol.for('OrderRepository'),
	OrderService: Symbol.for('OrderService'),
	OrderController: Symbol.for('OrderController'),
  };

const TYPES = {
	...CORE_TYPES,
	...USER_TYPES,
	...COMPANY_TYPES,
	...PRODUCT_TYPES,
    ...STOCK_TYPES,
    ...ORDER_TYPES
};

export default TYPES;
