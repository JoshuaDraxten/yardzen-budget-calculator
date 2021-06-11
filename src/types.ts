export interface BudgetItem {
  type: string;
  name: string;
  lowPrice: number;
  highPrice: number;
}

export interface PriceRange {
  lowPrice: number;
  highPrice: number;
}
