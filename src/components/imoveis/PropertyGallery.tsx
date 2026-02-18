
import { useState } from 'react';
import { debugLog } from '@/utils/debug';
import { Share } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  onDownload?: (selectedCount: number) => void;
}

export const PropertyGallery = ({ images, onDownload }: PropertyGalleryProps) => {
  const [activeFilter, setActiveFilter] = useState('photos');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [showShareButton, setShowShareButton] = useState(false);

  const filters = [
    { id: 'photos', label: 'FOTOS DO IMÓVEL' },
    { id: 'leisure', label: 'FOTOS DO LAZER' },
    { id: 'videos', label: 'VÍDEOS' },
    { id: 'workVideos', label: 'VÍDEOS DA OBRA' }
  ];

  const toggleItemSelection = (index: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
    setShowShareButton(newSelected.size > 0);
  };

  const selectAll = () => {
    if (selectedItems.size === images.length) {
      setSelectedItems(new Set());
      setShowShareButton(false);
    } else {
      setSelectedItems(new Set(images.map((_, index) => index)));
      setShowShareButton(true);
    }
  };

  const handleShare = () => {
    debugLog('Sharing selected images:', selectedItems.size);
    
    // Log the download action
    if (onDownload) {
      onDownload(selectedItems.size);
    }
    
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-80 text-white px-4 py-3 rounded-lg flex items-center space-x-2 z-50';
    toast.innerHTML = `
      <span>📱</span>
      <span>Enviando via WhatsApp...</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 1500);
  };

  const renderGalleryGrid = (showPlayIcon = false) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 md:mx-auto">
      {images.map((image, index) => (
        <div key={index} className="relative">
          <button
            onClick={() => toggleItemSelection(index)}
            className="relative w-full aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <img 
              src={image} 
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Play icon for videos */}
            {showPlayIcon && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg ml-0.5">▶</span>
                </div>
              </div>
            )}
            
            {/* Selection overlay */}
            {selectedItems.has(index) && (
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            )}
            
            {/* Selection indicator */}
            <div className="absolute top-2 right-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                selectedItems.has(index)
                  ? 'bg-[hsl(var(--accent))]'
                  : 'bg-white border-2 border-gray-300'
              }`}>
                {selectedItems.has(index) && (
                  <span className="text-white text-xs">✓</span>
                )}
              </div>
            </div>
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="px-4 md:px-4 md:mx-auto mb-6">
      <h3 className="text-black font-semibold text-lg mb-1">Galeria Interativa</h3>
      
      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-3 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-200 text-sm ${
              activeFilter === filter.id
                ? 'bg-[hsl(var(--accent))] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Gallery Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h4 className="text-black font-semibold text-lg">Galeria</h4>
          <p className="text-gray-500 text-sm">Veja as fotos do imóvel</p>
        </div>
        {selectedItems.size > 0 && (
          <div className="border border-[hsl(var(--accent))] rounded px-2 py-1">
            <span className="text-[hsl(var(--accent))] font-semibold text-xs">
              {selectedItems.size} selecionada{selectedItems.size > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Select All Checkbox */}
      <div className="flex items-center mb-4">
        <button
          onClick={selectAll}
          className="flex items-center space-x-2 min-h-[44px]"
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
            selectedItems.size === images.length 
              ? 'bg-[hsl(var(--accent))] border-[hsl(var(--accent))]' 
              : 'border-gray-300'
          }`}>
            {selectedItems.size === images.length && (
              <span className="text-white text-xs">✓</span>
            )}
          </div>
          <span className="text-gray-600 text-sm">Selecionar todas</span>
        </button>
      </div>

      {/* Gallery Grid */}
      {activeFilter === 'photos' && renderGalleryGrid()}
      {activeFilter === 'leisure' && renderGalleryGrid()}
      {activeFilter === 'videos' && renderGalleryGrid(true)}
      {activeFilter === 'workVideos' && renderGalleryGrid(true)}

      {/* Share Button - Only visible when items are selected */}
      {showShareButton && (
        <div className="mt-4">
          <button 
            onClick={handleShare}
            className="w-full bg-[hsl(var(--accent))] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#e65500] transition-all duration-200 active:scale-95 shadow-sm flex items-center justify-center space-x-2"
          >
            <Share className="w-5 h-5" />
            <span>Enviar via WhatsApp</span>
          </button>
        </div>
      )}

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all duration-200"
            >
              ✕
            </button>
            <img 
              src={selectedImage}
              alt="Full screen view"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
