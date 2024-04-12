import React, { useState } from 'react';
import { createAsset } from '@livepeer/react';

function Upload() {
    const [file, setFile] = useState(null);
    const [asset, setAsset] = useState(null);
    const [uploading, setUploading] = useState(false); // State to track uploading status

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const handleUpload = () => {
        if (file) {
            setUploading(true); // Start uploading
            createAsset({
                sources: [
                    {
                        name: file.name,
                        file: file,
                    },
                ],
            })
            .then((createdAsset) => {
                setAsset(createdAsset[0]);
                console.log('Asset created:', createdAsset[0]);
            })
            .catch((error) => {
                console.error('Error creating asset:', error);
            })
            .finally(() => {
                setUploading(false); // Stop uploading
            });
        } else {
            console.error('No file selected for upload.');
        }
    };

    return (
        <div className="max-w-xs mx-auto mt-8">
            <h2 className="text-lg font-semibold mb-4">Upload Video</h2>
            <div className="flex items-center justify-center border border-gray-300 rounded-md p-6">
                <label htmlFor="file-upload" className="cursor-pointer flex items-center">
                    <span className="mr-2">+</span> Upload Video
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </div>
            {asset && (
                <p className="mt-4 text-sm text-gray-700">
                    Asset created: {asset.playbackUrl}
                </p>
            )}
        </div>
    );
}

export default Upload;
