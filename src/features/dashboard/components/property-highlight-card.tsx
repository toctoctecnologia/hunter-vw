import { MapPin, Maximize, Bed, Crown, Bath, Car, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { formatValue, propertyStatusToLabel } from '@/shared/lib/utils';
import { PropertyDetail } from '@/shared/types';

import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

interface PropertyHighlightCardProps {
  property: PropertyDetail;
  selectionMode?: boolean;
  onSelect?: (property: PropertyDetail) => void;
}

export function PropertyHighlightCard({ property, selectionMode = false, onSelect }: PropertyHighlightCardProps) {
  const navigation = useRouter();

  const handleClick = () => {
    if (selectionMode && onSelect) {
      onSelect(property);
    } else {
      navigation.push(`/dashboard/properties/${property.uuid}/detail`);
    }
  };

  return (
    <Card
      className="w-80 flex-shrink-0 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow p-0"
      onClick={handleClick}
    >
      <CardContent className="p-0 space-y-0">
        <div className="relative h-48 w-full">
          {property.principalPictureUrl ? (
            <Image src={property.principalPictureUrl} alt={property.name} fill className="object-cover rounded-lg" />
          ) : (
            <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
              <Building className="w-12 h-12 text-muted-foreground" />
            </div>
          )}

          {property.status && (
            <Badge className="absolute left-3 top-3 bg-blue-500 hover:bg-blue-600 text-white text-xs">
              {propertyStatusToLabel(property.status)}
            </Badge>
          )}
        </div>

        <div className="p-4">
          {(property?.info?.propertyType || property?.info?.propertyPurpose) && (
            <>
              <div className="mb-4 flex items-center gap-4">
                {property.info.propertyType && (
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {property.info.propertyType}
                  </Badge>
                )}
                {property.info.propertyPurpose && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 text-xs font-semibold">
                    {property.info.propertyPurpose}
                  </Badge>
                )}
              </div>
            </>
          )}

          <h3 className="mb-1 text-lg font-bold line-clamp-1">
            {property.code} - {property.name}
          </h3>

          <div className="mb-4 flex items-center text-muted-foreground">
            <MapPin className="size-3.5 mr-1" />
            <span className="text-sm">
              {property.location.street} - {property.location.city}, {property.location.state}
            </span>
          </div>

          <p className="mb-4 text-2xl font-bold text-primary">
            {formatValue(property.price)}
            {property.info.propertyPurpose === 'LOCACAO' && (
              <span className="text-sm font-normal text-muted-foreground">/mês</span>
            )}
          </p>

          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center">
              <Maximize className="size-4 mr-1" />
              <span className="text-sm">{property.featureSummary.area}m²</span>
            </div>

            {property.featureSummary.rooms > 0 && (
              <div className="flex items-center">
                <Bed className="size-4 mr-1" />
                <span className="text-sm">
                  {property.featureSummary.rooms} {property.featureSummary.rooms === 1 ? 'quarto' : 'quartos'}
                </span>
              </div>
            )}

            {property.featureSummary.suites > 0 && (
              <div className="flex items-center">
                <Crown className="size-4 mr-1" />
                <span className="text-sm">
                  {property.featureSummary.suites} {property.featureSummary.suites === 1 ? 'suíte' : 'suítes'}
                </span>
              </div>
            )}

            <div className="flex items-center">
              <Bath className="size-4 mr-1" />
              <span className="text-sm">
                {property.featureSummary.bathrooms} {property.featureSummary.bathrooms === 1 ? 'banheiro' : 'banheiros'}
              </span>
            </div>

            {property.featureSummary.garageSpots > 0 && (
              <div className="flex items-center">
                <Car className="size-4 mr-1" />
                <span className="text-sm">
                  {property.featureSummary.garageSpots} {property.featureSummary.garageSpots === 1 ? 'vaga' : 'vagas'}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
