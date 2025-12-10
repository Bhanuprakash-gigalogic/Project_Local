import React, { useState } from 'react';
import { Order, OrderStatus } from '../types/order';
import { formatCurrency } from '@/utils/format';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ChevronLeft, Truck, Package, RotateCcw, CreditCard, Calendar } from 'lucide-react';
import { useUpdateOrderStatus } from '../hooks/useOrders';
import { useToast } from '@/hooks/useToast';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from '@/components/ui/Modal';

interface OrderDetailProps {
    order: Order;
    onBack: () => void;
}

export const OrderDetail = ({ order, onBack }: OrderDetailProps) => {
    const { mutate: updateStatus, isPending } = useUpdateOrderStatus();
    const { addToast } = useToast();

    // Status Change
    const [statusConfirm, setStatusConfirm] = useState<OrderStatus | null>(null);

    const handleStatusUpdate = () => {
        if (!statusConfirm) return;
        updateStatus({ id: order.id, status: statusConfirm }, {
            onSuccess: () => {
                addToast({ title: "Order Updated", description: `Status changed to ${statusConfirm}`, type: "success" });
                setStatusConfirm(null);
            }
        });
    };

    const StatusLine = ({ status, active }: { status: string, active: boolean }) => (
        <div className={`flex flex-col items-center flex-1 ${active ? 'text-primary' : 'text-muted-foreground opacity-50'}`}>
            <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center mb-2 bg-background ${active ? 'border-primary' : 'border-muted'}`}>
                <div className={`h-3 w-3 rounded-full ${active ? 'bg-primary' : 'bg-transparent'}`} />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider">{status}</span>
        </div>
    );

    const currentStep =
        order.status === 'pending' ? 0 :
            order.status === 'processing' ? 1 :
                order.status === 'shipped' ? 2 :
                    order.status === 'delivered' ? 3 : -1;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{order.id}</h2>
                        <p className="text-sm text-muted-foreground">
                            Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <>
                            {order.status !== 'shipped' && (
                                <Button variant="outline" onClick={() => setStatusConfirm('cancelled')}>Cancel Order</Button>
                            )}
                            {order.status === 'pending' && (
                                <Button onClick={() => setStatusConfirm('processing')}>Mark Processing</Button>
                            )}
                            {order.status === 'processing' && (
                                <Button onClick={() => setStatusConfirm('shipped')}>Mark Shipped</Button>
                            )}
                            {order.status === 'shipped' && (
                                <Button onClick={() => setStatusConfirm('delivered')}>Mark Delivered</Button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Status Timeline (Hidden if cancelled) */}
            {order.status !== 'cancelled' && (
                <div className="flex items-center justify-between px-4 py-8 bg-card border rounded-lg max-w-3xl mx-auto">
                    <StatusLine status="Placed" active={currentStep >= 0} />
                    <div className={`flex-1 h-0.5 ${currentStep >= 1 ? 'bg-primary' : 'bg-muted'}`} />
                    <StatusLine status="Processing" active={currentStep >= 1} />
                    <div className={`flex-1 h-0.5 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                    <StatusLine status="Shipped" active={currentStep >= 2} />
                    <div className={`flex-1 h-0.5 ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'}`} />
                    <StatusLine status="Delivered" active={currentStep >= 3} />
                </div>
            )}

            {order.status === 'cancelled' && (
                <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-center font-medium">
                    This order has been cancelled.
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Items</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 py-2 border-b last:border-0">
                                    <img src={item.productImage} alt={item.productName} className="h-16 w-16 object-cover rounded bg-secondary" />
                                    <div className="flex-1">
                                        <p className="font-medium">{item.productName}</p>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right font-medium">
                                        {formatCurrency(item.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-between pt-4 font-bold text-lg">
                                <span>Total</span>
                                <span>{formatCurrency(order.totalAmount)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Customer & Shipping */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="font-medium">{order.customerName}</p>
                                <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                            </div>
                            <div className="pt-2 border-t">
                                <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
                                    <Truck size={14} /> Shipping Address
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    {order.shippingAddress.street}<br />
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                                    {order.shippingAddress.country}
                                </p>
                            </div>
                            <div className="pt-2 border-t">
                                <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
                                    <CreditCard size={14} /> Payment
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Method: {order.paymentMethod}<br />
                                    Transaction: {order.transactionId || 'N/A'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Status Change Modal */}
            <Modal open={!!statusConfirm} onOpenChange={(open) => !open && setStatusConfirm(null)}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Update Order Status</ModalTitle>
                        <ModalDescription>
                            Are you sure you want to change the status to <strong>{statusConfirm}</strong>?
                            {statusConfirm === 'shipped' && " This will notify the customer."}
                        </ModalDescription>
                    </ModalHeader>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setStatusConfirm(null)}>Cancel</Button>
                        <Button onClick={handleStatusUpdate} isLoading={isPending}>Confirm</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};
