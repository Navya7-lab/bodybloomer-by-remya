import React from 'react';

// Replace this with your actual image path once you provide it
const IMAGE_PATH = '/images/your-image.jpg';

const filterStyles = [
  { name: 'Original', filter: 'none' },
  { name: 'Bright & Warm', filter: 'brightness(1.1) contrast(1.1) saturate(1.2) sepia(0.1)' },
  { name: 'Soft & Elegant', filter: 'brightness(1.05) contrast(0.95) saturate(0.9)' },
  { name: 'Vibrant', filter: 'brightness(1.15) contrast(1.15) saturate(1.3)' },
  { name: 'Cozy Glow', filter: 'brightness(1.1) contrast(1.05) saturate(1.1) sepia(0.15)' },
  { name: 'Clean & Fresh', filter: 'brightness(1.2) contrast(1.1) saturate(1.05)' },
  { name: 'Premium Look', filter: 'brightness(1.08) contrast(1.2) saturate(1.15) drop-shadow(0 10px 30px rgba(0,0,0,0.3))' },
];

export default function ImagePreview() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Image Filter Preview</h1>
        <p className="text-center text-gray-600 mb-8">
          Choose your preferred style. Update IMAGE_PATH in the code with your actual image file.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterStyles.map((style, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 bg-gray-100">
                <h3 className="font-semibold text-lg">{style.name}</h3>
                <code className="text-xs text-gray-500 block mt-1 truncate">{style.filter}</code>
              </div>
              <div className="p-4">
                <img
                  src={IMAGE_PATH}
                  alt={`${style.name} version`}
                  className="w-full h-64 object-cover rounded-lg"
                  style={{ filter: style.filter }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Add+your+image+path';
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Selected Filter Code</h2>
          <p className="text-gray-600 mb-4">
            Once you choose a filter, copy this CSS to apply it to your website:
          </p>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            {`/* Add to your CSS */
.product-image {
  filter: brightness(1.1) contrast(1.1) saturate(1.2) sepia(0.1);
  transition: filter 0.3s ease;
}

.product-image:hover {
  filter: brightness(1.15) contrast(1.15) saturate(1.3);
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
