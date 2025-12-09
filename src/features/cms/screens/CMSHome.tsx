import React, { useState } from 'react';
import { useGetBanners, useGetCategoriesLanding, useGetHomeConfig, useUpdateHomeConfig, useCreateBanner } from '../hooks/useCms';
import { BannerCard } from '../components/BannerCard';
import { CategoryLandingCard } from '../components/CategoryLandingCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { Plus, Save, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui/Modal';

const CMSHome = () => {
    const [search, setSearch] = useState('');
    const { addToast } = useToast();

    // Queries
    const { data: homeConfig, isLoading: isHomeLoading } = useGetHomeConfig();
    const { data: banners, isLoading: isBannersLoading } = useGetBanners(search);
    const { data: categories, isLoading: isCatsLoading } = useGetCategoriesLanding(search);

    // Mutations
    const { mutate: updateHome, isPending: isUpdatingHome } = useUpdateHomeConfig();
    const { mutate: createBanner, isPending: isCreatingBanner } = useCreateBanner();

    // Local State for new Banner
    const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
    const [newBannerTitle, setNewBannerTitle] = useState('');

    const handleSaveHome = () => {
        if (!homeConfig) return;
        updateHome(homeConfig, {
            onSuccess: () => addToast({ title: "Settings Saved", description: "", type: "success" })
        });
    };

    const handleCreateBanner = () => {
        if (!newBannerTitle) return;
        createBanner({ title: newBannerTitle }, {
            onSuccess: () => {
                addToast({ title: "Banner Created", description: "", type: "success" });
                setIsBannerModalOpen(false);
                setNewBannerTitle('');
            }
        });
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">CMS Management</h1>
                <p className="text-muted-foreground">Manage homepage layout, banners, and landing pages.</p>
            </div>

            <Tabs defaultValue="home" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="home">Home Config</TabsTrigger>
                    <TabsTrigger value="banners">Banners</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* Home Config Tab */}
                <TabsContent value="home" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Homepage Sections</h2>
                        <Button onClick={handleSaveHome} isLoading={isUpdatingHome}>
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                    </div>

                    {isHomeLoading ? <Skeleton className="h-64 w-full" /> : (
                        <div className="grid gap-4">
                            {homeConfig?.sections.sort((a, b) => a.order - b.order).map((section) => (
                                <Card key={section.id} className="cursor-move hover:border-primary/50 transition-colors">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <GripVertical className="text-muted-foreground cursor-grab" />
                                            <div>
                                                <h4 className="font-semibold">{section.title}</h4>
                                                <p className="text-xs text-muted-foreground uppercase">{section.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-muted-foreground">{section.isEnabled ? 'Enabled' : 'Disabled'}</span>
                                            <Toggle checked={section.isEnabled} onCheckedChange={() => { }} />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Banners Tab */}
                <TabsContent value="banners" className="space-y-6">
                    <div className="flex justify-between gap-4">
                        <SearchInput placeholder="Search banners..." onSearch={setSearch} className="w-full md:w-[300px]" />
                        <Button onClick={() => setIsBannerModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Banner
                        </Button>
                    </div>
                    {isBannersLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {banners?.map(b => <BannerCard key={b.id} banner={b} />)}
                        </div>
                    )}
                </TabsContent>

                {/* Categories Tab */}
                <TabsContent value="categories" className="space-y-6">
                    <div className="flex justify-between gap-4">
                        <SearchInput placeholder="Search categories..." onSearch={setSearch} className="w-full md:w-[300px]" />
                    </div>
                    {isCatsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories?.map(c => (
                                <CategoryLandingCard
                                    key={c.id}
                                    category={c}
                                    onClick={(id) => addToast({ title: "Config Opened", description: `Editing ${id}`, type: "success" })}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>SEO Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Meta Title</label>
                                <Input defaultValue={homeConfig?.seoTitle} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Meta Description</label>
                                <Input defaultValue={homeConfig?.seoDescription} />
                            </div>
                            <div className="pt-4">
                                <Button onClick={handleSaveHome} isLoading={isUpdatingHome}>Update SEO</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Create Banner Modal */}
            <Modal open={isBannerModalOpen} onOpenChange={setIsBannerModalOpen}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Create New Banner</ModalTitle>
                    </ModalHeader>
                    <div className="py-4">
                        <label className="text-sm font-medium mb-2 block">Banner Title</label>
                        <Input
                            value={newBannerTitle}
                            onChange={(e) => setNewBannerTitle(e.target.value)}
                            placeholder="e.g., Winter Clearance"
                        />
                    </div>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setIsBannerModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateBanner} isLoading={isCreatingBanner} disabled={!newBannerTitle}>Create</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default CMSHome;
