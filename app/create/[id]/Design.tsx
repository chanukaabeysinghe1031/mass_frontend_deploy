import React, { useState } from 'react';

interface Dimensions {
    width: number;
    height: number;
    linkDimensions: boolean;
}

interface DesignProps {
    mode: string;
    selectedModel: string;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUpload: () => void;
    imageUrl: string;
    uploadedImageUrl: string;
    onShowModal: () => void;
    selectedImage: any;
    dimensions: Dimensions;
    handleWidthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    toggleLinkDimensions: () => void;
}

const ImageInformation: React.FC = () => {
    return (
        <div className="mt-4">
            <p className="text-gray-700">Image Information Component</p>
            {/* Add relevant image information here */}
        </div>
    );
};

const UploadImageSection: React.FC<{
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUpload: () => void;
    uploadedImageUrl: string;
}> = ({ onFileChange, onUpload, uploadedImageUrl }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');

    const handleUpload = async () => {
        setIsUploading(true);
        setUploadMessage('');
        await onUpload();
        setIsUploading(false);
        setUploadMessage('Image uploaded successfully.');
        console.log('Uploaded image URL:', uploadedImageUrl);
    };

    return (
        <>
            <div className="text-gray-700 font-bold mb-4">Upload Image</div>
            <input type="file" onChange={onFileChange} className="mb-2" />
            <button
                onClick={handleUpload}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                disabled={isUploading}
            >
                {isUploading ? 'Uploading...' : 'Upload Image'}
            </button>
            {uploadMessage && <p className="mt-2 text-sm text-green-600">{uploadMessage}</p>}
            {/*{uploadedImageUrl && <p className="mt-2 text-sm">Image URL: {uploadedImageUrl}</p>}*/}
        </>
    );
};

const Design: React.FC<DesignProps> = ({
                                           mode,
                                           selectedModel,
                                           onFileChange,
                                           onUpload,
                                           imageUrl,
                                           uploadedImageUrl,
                                           onShowModal,
                                           selectedImage,
                                           dimensions,
                                           handleWidthChange,
                                           handleHeightChange,
                                           toggleLinkDimensions,
                                       }) => {
    const downloadImage = (imageUrl: string) => {
        console.log('Downloading image:', imageUrl);
        fetch(imageUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'image.png'; // You can customize the filename here
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => console.error('Error downloading image:', error));
    };

    return (
        <>
            <div className="text-gray-700 font-bold mb-4">Image Information</div>
            <ImageInformation />
            {mode === 'Text and Image to Image' && (
                <>
                    <UploadImageSection
                        onFileChange={onFileChange}
                        onUpload={onUpload}
                        uploadedImageUrl={uploadedImageUrl}
                    />
                    <div className="mt-4">
                        <button
                            onClick={onShowModal}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                        >
                            Select Reference Image
                        </button>
                        <div className="mt-2">
                            {selectedImage && (
                                <div>
                                    <img src={selectedImage.url} alt={selectedImage.title} className="w-full rounded" />
                                    <button
                                        onClick={() => downloadImage(selectedImage.url)}
                                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Download
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
            {mode === 'Edit (Inpaint/Outpaint)' && (
                <UploadImageSection
                    onFileChange={onFileChange}
                    onUpload={onUpload}
                    uploadedImageUrl={uploadedImageUrl}
                />
            )}
            {mode === 'Text to Image' && (
                <>
                    <ImageInformation />
                </>
            )}
            <div className="text-gray-700 font-bold mb-4 mt-5">Download</div>
            <div className="mt-4 flex items-center">
                <label className="text-gray-700">w</label>
                <input
                    type="number"
                    value={dimensions.width}
                    onChange={handleWidthChange}
                    className="w-16 mx-2 p-2 border rounded"
                />
                <span>🔗</span>
                <input
                    type="checkbox"
                    checked={dimensions.linkDimensions}
                    onChange={toggleLinkDimensions}
                    className="mx-2"
                />
                <label className="text-gray-700">h</label>
                <input
                    type="number"
                    value={dimensions.height}
                    onChange={handleHeightChange}
                    className="w-16 ml-2 p-2 border rounded"
                />
            </div>
            <div className="mt-4">
                <button
                    onClick={() => downloadImage(imageUrl)}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                    Download Image
                </button>
            </div>
        </>
    );
};

export default Design;
