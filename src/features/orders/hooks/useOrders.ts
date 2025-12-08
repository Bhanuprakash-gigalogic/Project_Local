import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Order, OrderFilter, OrderStatus } from '../types/order';

// Mock Mock Data
const generateMockOrders = (count: number): Order[] => {
    const statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    return Array.from({ length: count }).map((_, i) => {
        const status = statuses[i % statuses.length];
        const date = new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString();

        return {
            id: `ORD-${(1000 + i).toString()}`,
            customerId: `cust-${i}`,
            customerName: `Customer ${i + 1}`,
            customerEmail: `customer${i}@example.com`,
            totalAmount: 49.99 + (i * 20),
            status: status,
            createdAt: date,
            items: [
                {
                    id: `item-${i}-1`,
                    productId: `prod-${i}`,
                    productName: `Premium Product ${i + 1}`,
                    productImage: `https://placehold.co/100?text=Prod+${i + 1}`,
                    quantity: 1 + (i % 3),
                    price: 49.99
                }
            ],
            timeline: [
                { status: 'pending', date: date, note: 'Order placed' },
                ...(status !== 'pending' ? [{ status: 'processing' as const, date: new Date(new Date(date).getTime() + 86400000).toISOString() }] : []),
                ...(status === 'shipped' || status === 'delivered' ? [{ status: 'shipped' as const, date: new Date(new Date(date).getTime() + 172800000).toISOString() }] : []),
                ...(status === 'delivered' ? [{ status: 'delivered' as const, date: new Date(new Date(date).getTime() + 300000000).toISOString() }] : [])
            ],
            shippingAddress: {
                street: `${i + 1} Example Blvd`,
                city: 'New York',
                state: 'NY',
                zip: '10001',
                country: 'USA'
            },
            paymentMethod: i % 2 === 0 ? 'Credit Card' : 'PayPal',
            transactionId: `txn_${Math.random().toString(36).substring(7)}`,
        };
    });
};

const MOCK_ORDERS = generateMockOrders(50);

export const useGetOrders = (filter: OrderFilter) => {
    return useQuery({
        queryKey: ['orders', filter],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 800));

            let filtered = MOCK_ORDERS;

            if (filter.status && filter.status !== 'all') {
                filtered = filtered.filter(o => o.status === filter.status);
            }

            if (filter.search) {
                const q = filter.search.toLowerCase();
                filtered = filtered.filter(o =>
                    o.id.toLowerCase().includes(q) ||
                    o.customerName.toLowerCase().includes(q) ||
                    o.customerEmail.toLowerCase().includes(q)
                );
            }

            const page = filter.page || 1;
            const limit = filter.limit || 10;
            const start = (page - 1) * limit;

            return {
                data: filtered.slice(start, start + limit),
                meta: {
                    total: filtered.length,
                    page,
                    limit,
                    totalPages: Math.ceil(filtered.length / limit)
                }
            };
        }
    });
};

export const useGetOrderById = (id: string | null) => {
    return useQuery({
        queryKey: ['order', id],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 600));
            return MOCK_ORDERS.find(o => o.id === id) || null;
        },
        enabled: !!id
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
            await new Promise(resolve => setTimeout(resolve, 800));
            const idx = MOCK_ORDERS.findIndex(o => o.id === id);
            if (idx > -1) {
                MOCK_ORDERS[idx].status = status;
                MOCK_ORDERS[idx].timeline.push({
                    status,
                    date: new Date().toISOString(),
                    note: `Status updated to ${status}`
                });
            }
            return { id, status };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['order'] });
        }
    });
};
