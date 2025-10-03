export interface Product {
  id: number;
  name: string;
  price: number; // Price per kg
}

export interface OrderItem {
  productId: number;
  name: string;
  quantity: number; // in kg
  price: number;
}

export type OrderStatus = 'Confirmed' | 'Preparing' | 'Ready' | 'Delivered';
export type PaymentMethod = 'Cash' | 'InstaPay';

export interface Order {
  id: string; // Auto-generated invoice number
  customerName: string;
  customerPhone: string;
  alternatePhone?: string;
  customerAddress: string;
  landmark?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  date: string; // ISO string
  paymentMethod: PaymentMethod;
}