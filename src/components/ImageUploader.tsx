import React, { useState } from 'react';

interface ImageUploaderProps {
  images: string[];
  setImages: (images: string[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, setImages }) => {
  const [imageUrls, setImageUrls] = useState<string[]>(images);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImageUrls = files.map(file => URL.createObjectURL(file));
    setImageUrls([...imageUrls, ...newImageUrls]);
    setImages([...images, ...newImageUrls]);
  };

  const handleRemoveImage = (url: string) => {
    const updatedImages = imageUrls.filter(imageUrl => imageUrl !== url);
    setImageUrls(updatedImages);
    setImages(updatedImages);
  };

  return (
    <div>
      <input type="file" multiple onChange={handleImageUpload} />
      <div className="mt-4 flex flex-wrap gap-4">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative">
            <img src={url} alt={`Uploaded ${index}`} className="h-20 w-20 object-cover rounded" />
            <button
              onClick={() => handleRemoveImage(url)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            >
              &times;
            </button>
            <a href={url} target="_blank" rel="noopener noreferrer" className="block mt-2 text-blue-500">
              View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;