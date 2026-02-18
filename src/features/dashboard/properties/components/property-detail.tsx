import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Bath,
  Bed,
  Calendar,
  Car,
  Crown,
  DollarSign,
  Eye,
  EyeOff,
  Home,
  Key,
  MapPin,
  Maximize,
  MessageCircle,
  Star,
} from 'lucide-react';

import { PropertyDetail as PropertyDetailType } from '@/shared/types';
import { formatDate, formatValue } from '@/shared/lib/utils';

import { getCatchers } from '@/features/dashboard/properties/api/property-catcher-assignment';
import { getOwners } from '@/features/dashboard/properties/api/property-owner-assignment';

import { propertyMediaArrayToMediaItems } from '@/features/dashboard/properties/components/property-gallery/utils';
import { getPropertyMedias } from '@/features/dashboard/properties/api/properties';
import { PropertyGallery } from '@/features/dashboard/properties/components/property-gallery';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ErrorCard } from '@/shared/components/error-card';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { Badge } from '@/shared/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { TypographyH2, TypographyMuted } from '@/shared/components/ui/typography';

interface PropertyDetailProps {
  uuid: string;
  property: PropertyDetailType;
}

export function PropertyDetail({ uuid, property }: PropertyDetailProps) {
  const [showOwnerData, setShowOwnerData] = useState(false);

  const {
    data: propertyMedias,
    isLoading: isLoadingMedias,
    isError: isErrorMedias,
    error: errorMedias,
  } = useQuery({
    queryKey: ['property-medias', uuid],
    queryFn: () => getPropertyMedias(uuid),
    enabled: !!uuid,
  });

  const { data: owners = [] } = useQuery({
    queryKey: ['property-owners', uuid],
    queryFn: () => getOwners(uuid),
  });

  const { data: catchers = [] } = useQuery({
    queryKey: ['property-catchers', uuid],
    queryFn: () => getCatchers(uuid),
  });

  const medias = propertyMediaArrayToMediaItems(propertyMedias || []);

  const handleShareWhatsApp = () => {
    let message = `🏠 *${property.name}*\n\n`;

    message += `📍 *Localização:*\n`;
    message += `${property.location.street}, ${property.location.number}\n`;
    message += `${property.location.city} - ${property.location.state}\n`;
    message += `CEP: ${property.location.zipCode}\n\n`;

    message += `💰 *Valor:* ${formatValue(property.price)}`;
    if (property.info.propertyPurpose === 'LOCACAO') {
      message += '/mês';
    }
    message += '\n\n';

    message += `📐 *Dimensões:*\n`;
    if (property.dimension.internalArea > 0) {
      message += `• Área Interna: ${property.dimension.internalArea}m²\n`;
    }
    if (property.dimension.externalArea > 0) {
      message += `• Área Externa: ${property.dimension.externalArea}m²\n`;
    }
    if (property.dimension.lotArea > 0) {
      message += `• Área do Lote: ${property.dimension.lotArea}m²\n`;
    }
    message += '\n';

    message += `🔑 *Características:*\n`;
    if (property.featureSummary.rooms > 0) {
      message += `• ${property.featureSummary.rooms} ${property.featureSummary.rooms === 1 ? 'Quarto' : 'Quartos'}\n`;
    }
    if (property.featureSummary.suites > 0) {
      message += `• ${property.featureSummary.suites} ${property.featureSummary.suites === 1 ? 'Suíte' : 'Suítes'}\n`;
    }
    message += `• ${property.featureSummary.bathrooms} ${
      property.featureSummary.bathrooms === 1 ? 'Banheiro' : 'Banheiros'
    }\n`;
    if (property.featureSummary.garageSpots > 0) {
      message += `• ${property.featureSummary.garageSpots} ${
        property.featureSummary.garageSpots === 1 ? 'Vaga' : 'Vagas'
      }\n`;
    }

    if (property.description) {
      message += `\n📝 *Descrição:*\n${property.description.substring(0, 200)}${
        property.description.length > 200 ? '...' : ''
      }\n`;
    }

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6 pb-24">
      {isLoadingMedias ? (
        <Loading />
      ) : isErrorMedias ? (
        <ErrorCard error={errorMedias} title="Erro ao carregar mídias do imóvel" />
      ) : (
        <PropertyGallery media={medias} editMode={false} />
      )}

      {/* Localização */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Localização
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">{property.name}</h2>

          <div className="space-y-1 text-sm">
            <p>
              {property.location.street}, {property.location.number}
            </p>
            <p>CEP: {property.location.zipCode}</p>
            <p>
              {property.location.city} - {property.location.state}
            </p>
            {property.location.secondaryDistrict && <p>Segundo Bairro: {property.location.secondaryDistrict.name}</p>}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
            <Calendar className="w-4 h-4" />
            <span>Última atualização: {formatDate(property.info.lastContact)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Valores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Valores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Valor do Imóvel:</span>
            <div className="text-right">
              <span className="text-lg font-bold text-primary">{formatValue(property.price)}</span>
              {property.info.propertyPurpose === 'LOCACAO' && (
                <span className="text-sm font-normal text-muted-foreground">/mês</span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">IPTU:</span>
            <span className="text-base font-semibold">{formatValue(property.iptuValue)}</span>
          </div>

          {property.featureSummary.condominium && (
            <div className="flex justify-between items-center">
              <span className="text-sm">Condomínio:</span>
              <span className="text-base font-semibold">{property.featureSummary.condominium.name}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dimensões */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Maximize className="w-5 h-5" />
            Dimensões
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Área Interna:</span>
            <span className="text-base font-semibold">{property.dimension.internalArea}m²</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Área Externa:</span>
            <span className="text-base font-semibold">{property.dimension.externalArea}m²</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Área do Lote:</span>
            <span className="text-base font-semibold">{property.dimension.lotArea}m²</span>
          </div>

          {property.featureSummary.keyLocation && (
            <div className="flex items-center gap-2 pt-3 border-t">
              <Key className="w-4 h-4" />
              <span className="text-sm">Local das Chaves: {property.featureSummary.keyLocation}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dados Principais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Dados Principais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {property.featureSummary.rooms > 0 && (
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5" />
                <span className="text-sm">
                  {property.featureSummary.rooms} {property.featureSummary.rooms === 1 ? 'Quarto' : 'Quartos'}
                </span>
              </div>
            )}

            {property.featureSummary.suites > 0 && (
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                <span className="text-sm">
                  {property.featureSummary.suites} {property.featureSummary.suites === 1 ? 'Suíte' : 'Suítes'}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Bath className="w-5 h-5" />
              <span className="text-sm">
                {property.featureSummary.bathrooms} {property.featureSummary.bathrooms === 1 ? 'Banheiro' : 'Banheiros'}
              </span>
            </div>

            {property.featureSummary.garageSpots > 0 && (
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                <span className="text-sm">
                  {property.featureSummary.garageSpots} {property.featureSummary.garageSpots === 1 ? 'Vaga' : 'Vagas'}
                </span>
              </div>
            )}
          </div>

          {property.featureSummary.features && property.featureSummary.features.length > 0 && (
            <div className="space-y-2 pt-3 border-t">
              <p className="text-sm font-semibold">Características do Imóvel:</p>
              <div className="flex flex-wrap gap-2">
                {property.featureSummary.features.map((feature) => (
                  <Badge key={feature.uuid} variant="secondary">
                    {feature.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Status de Mobília */}
          {property.featureSummary.furnishedStatus && (
            <div className="pt-3 border-t">
              <Badge variant="outline">{property.featureSummary.furnishedStatus}</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Descrição do Imóvel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Descrição do Imóvel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{property.description || 'Sem descrição'}</p>
        </CardContent>
      </Card>

      {/* Responsável pelo Imóvel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Responsável pelo Imóvel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => setShowOwnerData(!showOwnerData)}
            variant="secondary"
            className="w-full justify-between"
          >
            <span>{showOwnerData ? 'Ocultar Dados' : 'Ver Dados'}</span>
            {showOwnerData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>

          {showOwnerData && (
            <div className="space-y-4 pt-2">
              {catchers.filter((c) => c.isMain).length > 0 && (
                <>
                  <TypographyMuted>Captador Principal</TypographyMuted>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Porcentagem</TableHead>
                        <TableHead>Indicado por</TableHead>
                        <TableHead>Principal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {catchers
                        .filter((c) => c.isMain)
                        .map((catcher) => (
                          <TableRow key={catcher.uuid}>
                            <TableCell className="font-medium">{catcher.catcherName}</TableCell>
                            <TableCell>{catcher.catcherEmail}</TableCell>
                            <TableCell>{catcher.percentage}%</TableCell>
                            <TableCell>{catcher.referredBy || '-'}</TableCell>
                            <TableCell>
                              <Badge className="gap-1 bg-green-600 text-white">
                                <Star className="h-3 w-3" />
                                Principal
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </>
              )}

              {owners.length > 0 && (
                <>
                  <TypographyMuted>Dados do(s) Proprietário(s)</TypographyMuted>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>CPF/CNPJ</TableHead>
                        <TableHead>Porcentagem</TableHead>
                        <TableHead>Telefone</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {owners.map((owner) => (
                        <TableRow key={owner.uuid}>
                          <TableCell>{owner.name || '-'}</TableCell>
                          <TableCell>{owner.cpfCnpj || '-'}</TableCell>
                          <TableCell>{owner.percentage}%</TableCell>
                          <TableCell>{owner.phone || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <Button className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white" size="lg" onClick={handleShareWhatsApp}>
            <MessageCircle className="w-5 h-5 mr-2" />
            Enviar via WhatsApp
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
