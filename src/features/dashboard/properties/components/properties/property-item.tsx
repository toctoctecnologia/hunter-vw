import {
  MapPin,
  Maximize,
  Bed,
  Bath,
  Car,
  Edit,
  Key,
  Building,
  Hash,
  Crown,
  FileText,
  User,
  ChevronDown,
  FileImage,
  Clock,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { PropertyDetail } from '@/shared/types';

import { formatLongDateHour, formatValue } from '@/shared/lib/utils';

import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

interface PropertyCardProps {
  property: PropertyDetail;
  manage?: boolean;
}

export function PropertyItem({ property, manage = false }: PropertyCardProps) {
  const navigation = useRouter();
  const { user } = useAuth();

  const getStatusBadges = () => {
    const badges = [];

    if (property.info.isHighlighted) {
      badges.push({ text: 'Destaque', color: 'bg-yellow-500 hover:bg-yellow-600' });
    }

    if (property.info.isAvailable) {
      badges.push({ text: 'Disponível', color: 'bg-green-500 hover:bg-green-600' });
    }

    if (property.info.isAvailableForRent) {
      badges.push({ text: 'Aluguel', color: 'bg-blue-500 hover:bg-blue-600' });
    }

    return badges;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-[366px_1fr] gap-4 p-4 flex-1">
          <div className="relative w-full lg:w-64 h-48 col-span-1">
            {property.principalPictureUrl ? (
              <Image src={property.principalPictureUrl} alt={property.name} fill className="object-cover rounded-lg" />
            ) : (
              <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                <Building className="w-12 h-12 text-muted-foreground" />
              </div>
            )}

            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {getStatusBadges().map((badge, index) => (
                <Badge key={index} className={`${badge.color} text-white text-xs`}>
                  {badge.text}
                </Badge>
              ))}
              {property.status === 'EM_NEGOCIACAO' && (
                <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs">Em Proposta</Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between flex-1 min-h-0">
            <div className="flex-grow">
              <div className="flex flex-wrap mb-1 justify-between">
                <p className="text-sm text-muted-foreground">
                  {property.code} - {property.info.propertyType} — {property.info.propertyPurpose}
                </p>

                {property.info.lastContact && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">
                      Último contato: {formatLongDateHour(property.info.lastContact)}
                    </span>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-semibold mb-1">{property.name}</h3>

              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">
                  {property.location.street}, {property.location.number} - {property.location.city}/{property.location.state}
                </span>
              </div>

              {(property.location.unit || property.location.floor) && (
                <div className="flex items-center gap-4 text-muted-foreground mb-2">
                  {property.location.unit && (
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      <span className="text-sm">Unidade: {property.location.unit}</span>
                    </div>
                  )}
                  {property.location.floor && (
                    <div className="flex items-center gap-1">
                      <Hash className="w-4 h-4" />
                      <span className="text-sm">Andar: {property.location.floor}</span>
                    </div>
                  )}
                </div>
              )}

              <p className="text-2xl font-bold text-primary mb-3">{formatValue(property.price)}</p>

              <div className="flex items-center gap-6 text-muted-foreground mb-3 flex-wrap">
                <div className="flex items-center gap-1">
                  <Maximize className="w-4 h-4" />
                  <span className="text-sm">{property.featureSummary.area} m²</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  <span className="text-sm">{property.featureSummary.rooms}</span>
                </div>
                {property.featureSummary.suites > 0 && (
                  <div className="flex items-center gap-1">
                    <Crown className="w-4 h-4" />
                    <span className="text-sm">{property.featureSummary.suites}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  <span className="text-sm">{property.featureSummary.bathrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Car className="w-4 h-4" />
                  <span className="text-sm">{property.featureSummary.garageSpots}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>IPTU: {formatValue(property.iptuValue)}</span>
                </div>
                {property.featureSummary.condominium && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Building className="w-4 h-4" />
                    <span>Condomínio: {property.featureSummary.condominium.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-3 text-sm text-muted-foreground">
                {property.catchers && property.catchers.length > 0 && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>Captador: {property.catchers[0].name}</span>
                  </div>
                )}
                {property.info.access && (
                  <div className="flex items-center gap-1">
                    <Key className="w-4 h-4" />
                    <span>Acesso: {property.info.access}</span>
                  </div>
                )}
              </div>
            </div>

            {manage ? (
              <div className="flex items-center gap-4 flex-wrap">
                <Button className="flex-1" onClick={() => navigation.push(`/dashboard/properties/${property.uuid}/update`)}>
                  Editar Ficha
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button className="w-full sm:w-auto bg-transparent" variant="outline">
                      Mais Ações
                      <ChevronDown className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel className="font-bold">Situação</DropdownMenuLabel>
                    <DropdownMenuItem>Em captação</DropdownMenuItem>
                    <DropdownMenuItem>Em preparação</DropdownMenuItem>
                    <DropdownMenuItem>Publicado</DropdownMenuItem>
                    <DropdownMenuItem>Em negociação</DropdownMenuItem>
                    <DropdownMenuItem>Vendido</DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-zinc-700" />
                    <DropdownMenuLabel className="font-bold">Disponibilidade</DropdownMenuLabel>
                    <DropdownMenuItem>Disponível no site</DropdownMenuItem>
                    <DropdownMenuItem>Disponível interno</DropdownMenuItem>
                    <DropdownMenuItem>Reservado</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-4 flex-wrap">
                {hasFeature(user?.userInfo.profile.permissions, '2502') && (
                  <Button className="flex-1" onClick={() => navigation.push(`/dashboard/properties/${property.uuid}/detail`)}>
                    Ver Mais Detalhes
                  </Button>
                )}

                {(hasFeature(user?.userInfo.profile.permissions, '2506') ||
                  hasFeature(user?.userInfo.profile.permissions, '2507')) && (
                  <Button
                    className="w-full sm:w-auto bg-transparent"
                    variant="outline"
                    onClick={() => navigation.push(`/dashboard/properties/${property.uuid}/update`)}
                  >
                    <Edit className="size-4" />
                    Atualizar
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
