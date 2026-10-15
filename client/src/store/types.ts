
export interface Product { id: number; name: string }
export interface Category { id: number; name: string; products: Product[] }

export interface CartItem {
  productId: number;
  productName: string;
  categoryId: number;
  categoryName: string;
  quantity: number;
}

export interface Customer { fullName: string; address: string; email: string }
export interface OrderRequest { customer: Customer; items: CartItem[] }
