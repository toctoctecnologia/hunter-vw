import { Building, Search, Upload, Video, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Condominium {
  id: number;
  name: string;
  address: string;
  constructionCompany: string;
  leisure: string;
  totalUnits: number;
  deliveryYear: number;
}

interface CondominiumSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  condominiumSearch: string;
  onSearchChange: (value: string) => void;
  filteredCondominiums: Condominium[];
  onSelectCondominium: (id: string) => void;
  condominiumFiles: File[];
  onCondominiumFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveCondominiumFile: (index: number) => void;
}

export const CondominiumSearchModal = ({
  open,
  onOpenChange,
  condominiumSearch,
  onSearchChange,
  filteredCondominiums,
  onSelectCondominium,
  condominiumFiles,
  onCondominiumFileUpload,
  onRemoveCondominiumFile
}: CondominiumSearchModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="bg-white border border-gray-200 rounded-3xl shadow-xl max-w-sm mx-auto p-6" aria-describedby={undefined}>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-black flex items-center gap-2">
          <Building className="w-5 h-5" />
          Buscar Condomínio
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">Pesquisar Condomínios</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={condominiumSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white pl-10"
              placeholder="Digite o nome ou endereço..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-black">Condomínios Encontrados</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {filteredCondominiums.map((condo) => (
              <button
                key={condo.id}
                onClick={() => onSelectCondominium(condo.id.toString())}
                className="w-full p-3 text-left border border-orange-200 rounded-2xl hover:bg-orange-50 transition-colors"
              >
                <div className="font-medium text-gray-900">{condo.name}</div>
                <div className="text-sm text-gray-500">{condo.address}</div>
                <div className="text-xs text-black">{condo.constructionCompany}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <Label className="text-sm font-medium text-black mb-3 block">Cadastrar Novo Condomínio</Label>

          <div className="space-y-4">
            <Input placeholder="Nome do condomínio" className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white" />
            <Input placeholder="Endereço do condomínio" className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white" />
            <Input placeholder="Construtora" className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white" />
            <Input placeholder="Tempo de mercado da construtora" className="h-12 rounded-2xl border-orange-200 focus:border-orange-500 bg-white" />
            <Textarea placeholder="Características do lazer (Piscina, Academia, etc.)" className="min-h-[80px] rounded-2xl border-orange-200 focus:border-orange-500 resize-none bg-white" />

            <div className="space-y-3">
              <Label className="text-sm font-medium text-black">Fotos e Vídeos do Condomínio</Label>
              <label className="cursor-pointer">
                <Input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={onCondominiumFileUpload}
                  className="hidden"
                />
                <Button type="button" className="w-full bg-[hsl(var(--accent))] text-white rounded-lg px-4 py-2 hover:bg-[hsl(var(--accent))]/90 h-12">
                  <Upload className="w-4 h-4 mr-2" />
                  Adicionar Fotos/Vídeos
                </Button>
              </label>

              {condominiumFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {condominiumFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border overflow-hidden">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Condomínio ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Video className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveCondominiumFile(index)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

              <Button
                type="button"
                className="w-full bg-[hsl(var(--accent))] text-white rounded-lg px-4 py-2 hover:bg-[hsl(var(--accent))]/90 h-12"
                onClick={() => onOpenChange(false)}
              >
                Cadastrar Condomínio
              </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

