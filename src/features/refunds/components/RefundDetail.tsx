import React, { useState } from 'react';
import { RefundRequest } from '../types/refund';
import { formatCurrency } from '@/utils/format';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from '@/components/ui/Modal';
import { ChevronLeft, CheckCircle, XCircle, DollarSign, AlertCircle } from 'lucide-react';
import { useApproveRefund, useRejectRefund, useCompleteRefund } from '../hooks/useRefunds';
import { useToast } from '@/hooks/useToast';

interface RefundDetailProps {
    refund: RefundRequest;
    onBack: () => void;
}

export const RefundDetail = ({ refund, onBack }: RefundDetailProps) => {
    const { addToast } = useToast();
    const { mutate: approve, isPending: isApproving } = useApproveRefund();
    const { mutate: reject, isPending: isRejecting } = useRejectRefund();
    const { mutate: complete, isPending: isCompleting } = useCompleteRefund();

    const [rejectOpen, setRejectOpen] = useState(false);
    const [reason, setReason] = useState('');

    const handleApprove = () => {
        approve(refund.id, {
            onSuccess: () => {
                addToast({ title: "Refund Approved", description: "Waiting for completion payment.", type: "success" });
                onBack(); // Alternatively, refetch
            }
        });
    };

    const handleComplete = () => {
        complete(refund.id, {
            onSuccess: () => {
                addToast({ title: "Refund Completed", description: "Payment has been processed.", type: "success" });
                onBack();
            }
        });
    };

    const handleReject = () => {
        reject({ id: refund.id, reason }, {
            onSuccess: () => {
                addToast({ title: "Refund Rejected", description: "Customer notified.", type: "destructive" });
                setRejectOpen(false);
                onBack();
            }
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Refund #{refund.id}</h2>
                    <p className="text-sm text-muted-foreground">Order ID: {refund.orderId}</p>
                </div>
                <div className="ml-auto">
                    <Badge className="text-base px-3 py-1 capitalize" variant={
                        refund.status === 'completed' ? 'success' :
                            refund.status === 'approved' ? 'default' :
                                refund.status === 'rejected' ? 'destructive' : 'warning'
                    }>
                        {refund.status}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">

                    {/* Reason & Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle size={18} /> Request Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-sm mb-1">Reason</h4>
                                <p className="text-sm">{refund.reason}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm mb-1">Description</h4>
                                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                    "{refund.description}"
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm mb-2">Evidence</h4>
                                <div className="flex flex-wrap gap-2 bg-secondary/50 p-2 rounded-lg">
                                    {refund.images.map((img, i) => (
                                        <img key={i} src={img} alt={`Evidence ${i + 1}`} className="h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-md border flex-shrink-0" />
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Items to Refund</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {refund.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                    <div className="flex items-center gap-4">
                                        <img src={item.productImage} alt={item.productName} className="h-12 w-12 object-cover rounded" />
                                        <div>
                                            <p className="font-medium">{item.productName}</p>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="font-bold">{formatCurrency(item.amount)}</div>
                                </div>
                            ))}
                            <div className="flex justify-between pt-4 text-lg font-bold">
                                <span>Total Refund Amount</span>
                                <span>{formatCurrency(refund.amount)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Actions */}
                    {refund.status === 'pending' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-3">
                                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleApprove} isLoading={isApproving}>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Approve Refund
                                </Button>
                                <Button variant="destructive" className="w-full" onClick={() => setRejectOpen(true)}>
                                    <XCircle className="mr-2 h-4 w-4" /> Reject Request
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {refund.status === 'approved' && (
                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader>
                                <CardTitle>Payout Required</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    This refund has been approved. Please process the payment to complete.
                                </p>
                                <Button className="w-full" onClick={handleComplete} isLoading={isCompleting}>
                                    <DollarSign className="mr-2 h-4 w-4" /> Mark as Paid
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                                    <span className="font-bold text-xs">{refund.customerName.charAt(0)}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{refund.customerName}</p>
                                    <p className="text-xs text-muted-foreground">{refund.customerEmail}</p>
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-4">
                                Requested: {new Date(refund.requestedAt).toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Reject Modal */}
            <Modal open={rejectOpen} onOpenChange={setRejectOpen}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Reject Refund Request</ModalTitle>
                        <ModalDescription>Please provide a reason for the customer.</ModalDescription>
                    </ModalHeader>
                    <div className="py-2">
                        <Input
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Rejection reason..."
                        />
                    </div>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleReject} isLoading={isRejecting} disabled={!reason.trim()}>
                            Confirm Rejection
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};
