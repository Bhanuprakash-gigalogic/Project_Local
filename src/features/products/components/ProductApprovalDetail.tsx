import React, { useState } from 'react';
import { Product } from '../types/product';
import { formatCurrency } from '@/utils/format';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { ChevronLeft, CheckCircle, XCircle, Store, Tag } from 'lucide-react';
import { useApproveProduct, useRejectProduct } from '../hooks/useProductApprovals';
import { useToast } from '@/hooks/useToast';

interface ProductApprovalDetailProps {
    product: Product;
    onBack: () => void;
}

export const ProductApprovalDetail = ({ product, onBack }: ProductApprovalDetailProps) => {
    const { mutate: approve, isPending: isApproving } = useApproveProduct();
    const { mutate: reject, isPending: isRejecting } = useRejectProduct();
    const { addToast } = useToast();

    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const handleApprove = () => {
        approve(product.id, {
            onSuccess: () => {
                addToast({ title: "Product Approved", description: "This product is now live.", type: "success" });
                setIsApproveOpen(false);
                onBack();
            }
        });
    };

    const handleReject = () => {
        reject({ id: product.id, reason: rejectReason }, {
            onSuccess: () => {
                addToast({ title: "Product Rejected", description: "Seller has been notified.", type: "destructive" });
                setIsRejectOpen(false);
                onBack();
            }
        });
    };

    const statusVariant =
        product.status === 'active' ? 'success' :
            product.status === 'rejected' ? 'destructive' : 'warning';

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

            {/* Navigation / Header */}
            <div className="flex items-start gap-2 sm:gap-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="flex-shrink-0">
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight truncate" title={product.title}>
                        {product.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-muted-foreground">
                        <span className="truncate max-w-[100px] sm:max-w-none">SKU: {product.variants[0]?.sku || 'N/A'}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="capitalize truncate">{product.category}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="truncate">{product.brand}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                    <Badge variant={statusVariant} className="uppercase mb-1 text-xs">{product.status}</Badge>
                    <div className="text-sm font-semibold whitespace-nowrap">{formatCurrency(product.price)}</div>
                </div>
            </div>

            {/* Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Images, Description, Specs) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Images */}
                    <Card>
                        <CardContent className="p-4 grid grid-cols-4 gap-4">
                            {product.images.map((img) => (
                                <div key={img.id} className={`rounded-md overflow-hidden bg-secondary border aspect-square ${img.isPrimary ? 'col-span-2 row-span-2' : ''}`}>
                                    <img src={img.url} alt="Product view" className="h-full w-full object-cover" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {product.description}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Variants Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Variants & Inventory</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Variant Name</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Stock</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {product.variants.map((v) => (
                                        <TableRow key={v.id}>
                                            <TableCell className="font-mono text-xs">{v.sku}</TableCell>
                                            <TableCell>{v.name}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(v.price)}</TableCell>
                                            <TableCell className="text-right">{v.stock}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (Seller, Actions) */}
                <div className="space-y-6">

                    {/* Seller Info */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-md flex items-center gap-2">
                                <Store size={18} /> Seller Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="font-medium">{product.seller.businessName}</p>
                                <p className="text-sm text-muted-foreground">{product.seller.contactEmail}</p>
                            </div>
                            <div className="text-xs text-muted-foreground pt-2 border-t">
                                Submitted on {new Date(product.submittedAt).toLocaleDateString()}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Specifications */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-md flex items-center gap-2">
                                <Tag size={18} /> Specifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {Object.entries(product.specs).map(([key, val]) => (
                                <div key={key} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{key}</span>
                                    <span className="font-medium">{val}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Action Box */}
                    {product.status === 'pending' && (
                        <Card className="border-primary/20 bg-primary/5 sticky top-20">
                            <CardContent className="p-6 space-y-3">
                                <h3 className="font-semibold text-center mb-4">Moderation Action</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant="outline"
                                        className="w-full border-destructive text-destructive hover:bg-destructive hover:text-white"
                                        onClick={() => setIsRejectOpen(true)}
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject
                                    </Button>
                                    <Button
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        onClick={() => setIsApproveOpen(true)}
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Approve
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {product.status === 'rejected' && (
                        <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                            <strong>Rejected Reason:</strong> {product.rejectionReason}
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modals */}
            <Modal open={isApproveOpen} onOpenChange={setIsApproveOpen}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Approve Product?</ModalTitle>
                        <ModalDescription>
                            This product will become immediately available for purchase in the marketplace.
                        </ModalDescription>
                    </ModalHeader>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setIsApproveOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleApprove}
                            isLoading={isApproving}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Confirm Approval
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Reject Product</ModalTitle>
                        <ModalDescription>
                            Please provide a reason for rejection to help the seller correct the issue.
                        </ModalDescription>
                    </ModalHeader>
                    <div className="py-2">
                        <Input
                            placeholder="Rejection reason..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                    </div>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            isLoading={isRejecting}
                            disabled={!rejectReason.trim()}
                        >
                            Reject Product
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};
