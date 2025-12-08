export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
}

export interface OrderTimeline {
    status: OrderStatus;
    date: string;
    note?: string;
}

export interface Order {
    id: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;

    items: OrderItem[];
    timeline: OrderTimeline[];

    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };

    paymentMethod: string; // e.g., "Credit Card", "PayPal"
    transactionId?: string;
}

export interface OrderFilter {
    status?: OrderStatus | 'all';
    search?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedOrders {
    data: Order[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
