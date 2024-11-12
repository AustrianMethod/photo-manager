import React, { useState } from 'react';

export function PhotoManager() {

  type ImagePreview = {
    id: string;
    url: string;
  };
    
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
        
      fileReader.addEventListener('load', (evt) => {
      resolve((evt.target as FileReader).result as string);
      });
          
      fileReader.addEventListener('error', (evt) => {
        reject(new Error((evt.target as FileReader).error?.toString()));
      });
          
      fileReader.readAsDataURL(file);
      });
  };

  const [images, setImages] = useState<ImagePreview[]>([]);

  const handleSelect = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const files =  Array.from(evt.target.files || []);
    const urls: ImagePreview[] = await Promise.all(
      files.map( async(file) => ({
        id: URL.createObjectURL(file),  
        url: await fileToDataUrl(file), 
      }))
    );

    setImages((prevUrls) => [...prevUrls, ...urls]);
  };
    
  const handleRemove = (id: string) => {
    setImages((prevUrls) => prevUrls.filter((image) => image.id !== id));
  };  
   
  return (
    <div className="photo-manager">
      <label className="file-select-label">
        <span className="file-upload">Click to select</span>
        <input
          type="file"
          accept="image/*"
          multiple
            onChange={handleSelect}
            style={{ display: 'none' }}
        />
      </label>
      <div className="preview-container">
        {images.map((image) => (
          <div key={image.id} className="preview">
            <img src={image.url} alt="Preview" className="preview-image" />
            <button onClick={() => handleRemove(image.id)} className="remove-button">
            &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}