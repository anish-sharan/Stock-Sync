export interface ListData<T> {
	items: T[];
	totalCount: number;
	totalPages: number;
	hasMore: boolean;
}
