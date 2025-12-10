import React, { useState, useRef } from 'react';
import { Upload, X, FileImage, CheckCircle, Loader2 } from 'lucide-react';

interface BannerUploadProps {
    onComplete: (data: any) => void;
    onCancel: () => void;
}

const BannerUpload: React.FC<BannerUploadProps> = ({ onComplete, onCancel }) => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setProgress(0);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setProgress(0);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);

        // Simulate Presigned URL Upload Flow
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);

        // Wait for "upload"
        await new Promise(r => setTimeout(r, 3500));

        setIsUploading(false);
        onComplete({ bannerUrl: `https://cdn.example.com/${file.name}` });
    };

    return (
        <div className="h-full flex flex-col">
            <h3 className="text-lg font-medium mb-4">Upload Store Banner</h3>
            <p className="text-sm text-gray-500 mb-6">
                Upload a high-quality banner image for your store homepage. Recommended size: 1920x600px.
            </p>

            <div
                className={`flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-8 transition-colors ${file ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-primary hover:bg-gray-50'}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                {!file ? (
                    <div className="text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-2">Drag and drop your image here</p>
                        <p className="text-xs text-gray-500 mb-4">PNG, JPG up to 5MB</p>
                        <button
                            onClick={() => inputRef.current?.click()}
                            className="px-4 py-2 bg-white border rounded text-sm font-medium hover:bg-gray-50"
                        >
                            Select File
                        </button>
                    </div>
                ) : (
                    <div className="w-full max-w-sm">
                        <div className="flex items-center gap-3 mb-4 bg-white p-3 rounded shadow-sm">
                            <FileImage className="h-8 w-8 text-blue-500" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            {!isUploading && progress < 100 && (
                                <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500">
                                    <X size={16} />
                                </button>
                            )}
                            {progress === 100 && <CheckCircle className="text-green-500 h-5 w-5" />}
                        </div>

                        {(isUploading || progress > 0) && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                        )}
                        {isUploading && <p className="text-xs text-center text-gray-500">Uploading...</p>}
                        {progress === 100 && <p className="text-xs text-center text-green-600 font-medium">Upload Complete</p>}
                    </div>
                )}
                <input
                    type="file"
                    ref={inputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            <div className="pt-4 flex justify-between items-center border-t mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Back
                </button>
                <button
                    onClick={handleUpload}
                    disabled={!file || isUploading || progress === 100}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 disabled:opacity-50 inline-flex items-center"
                >
                    {isUploading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                    {progress === 100 ? 'Finish Setup' : 'Upload & Finish'}
                </button>
            </div>
        </div>
    );
};

export default BannerUpload;
