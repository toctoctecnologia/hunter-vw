import { Camera, Upload, Video, X, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface ImageUploadSectionProps {
  uploadedFiles: File[];
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

export const ImageUploadSection = ({
  uploadedFiles,
  onFileUpload,
  onRemoveFile
}: ImageUploadSectionProps) => {
  const [imageCaptions, setImageCaptions] = useState<string[]>(
    new Array(uploadedFiles.length).fill('Digite uma legenda')
  );

  const updateCaption = (index: number, caption: string) => {
    const newCaptions = [...imageCaptions];
    newCaptions[index] = caption;
    setImageCaptions(newCaptions);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      {uploadedFiles.length > 0 ? (
        <>
          {/* Header with photo count */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-gray-600" />
              Fotos galeria ({uploadedFiles.length})
            </h2>
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <Input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={onFileUpload}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  className="bg-green-500 text-white border-green-500 hover:bg-green-600 rounded-xl px-4 py-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar foto(s)
                </Button>
              </label>
              <Button 
                variant="outline" 
                className="bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200 rounded-xl px-3 py-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button className="bg-green-500 text-white hover:bg-green-600 rounded-xl px-4 py-2">
                <Upload className="w-4 h-4 mr-2" />
                Salvar alterações
              </Button>
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-4 gap-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Delete button */}
                <button
                  onClick={() => onRemoveFile(index)}
                  className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50"
                >
                  <Trash2 className="w-3 h-3 text-gray-600" />
                </button>

                {/* Caption input */}
                <input
                  type="text"
                  value={imageCaptions[index] || 'Digite uma legenda'}
                  onChange={(e) => updateCaption(index, e.target.value)}
                  className="w-full mt-2 text-sm text-gray-600 bg-transparent border-none outline-none focus:text-gray-900"
                  placeholder="Digite uma legenda"
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Header for empty state */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-orange-500" />
              Fotos e Vídeos
            </h2>
            <label className="cursor-pointer">
              <Input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={onFileUpload}
                className="hidden"
              />
              <Button className="bg-orange-500 text-white rounded-xl px-4 py-2 hover:bg-orange-600 transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </label>
          </div>

          {/* Empty state */}
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50">
            <Camera className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <p className="text-gray-900 font-medium mb-2">Nenhuma foto adicionada</p>
            <p className="text-sm text-gray-600">Adicione fotos e vídeos do imóvel</p>
          </div>
        </>
      )}
    </div>
  );
};

