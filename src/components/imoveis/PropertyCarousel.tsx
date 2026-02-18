import { useState, useRef, useEffect } from 'react';
import { ChevronRight, Clock, Ruler, Bed, Car, ShowerHead } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PropertyDetailModal } from './PropertyDetailModal';
interface PropertyCarouselProps {
  onNavigateToTab: (tab: string) => void;
}
export const PropertyCarousel = ({
  onNavigateToTab
}: PropertyCarouselProps) => {
  const navigate = useNavigate();
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const featuredProperties = [{
    id: 1,
    type: 'Casa',
    name: 'Casa Luxo com Piscina',
    subtitle: '15 fotos disponíveis',
    status: 'Lançamento',
    code: 'COD:1742 – Casa',
    image: '/uploads/f50b6900-0b8c-4f5d-93cb-f962ee0f2be0.png',
    address: 'Balneário Camboriú – SC',
    condominium: 'Residencial Premium',
    value: 'R$ 2.850.000',
    availability: 'Disponível no site',
    area: '420 m²',
    rooms: '4',
    parking: '3',
    bathrooms: '5',
    lastUpdate: '05/06/2025 às 10:30',
    lastContact: '05/06/2025',
    daysWithoutContact: 15,
    dataCriacao: '2025-06-05T10:00:00Z'
  }, {
    id: 2,
    type: 'Apartamento',
    name: 'Apartamento Vista Mar',
    subtitle: '20 fotos disponíveis',
    status: 'Promoção',
    code: 'COD:2384 – Apartamento',
    image: '/uploads/0a65a9d8-6587-49d4-8729-8a46c66b1a37.png',
    address: 'Copacabana, Rio de Janeiro – RJ',
    condominium: 'Edifício Ocean View',
    value: 'R$ 1.800.000',
    availability: 'Disponível interno',
    area: '180 m²',
    rooms: '3',
    parking: '2',
    bathrooms: '3',
    lastUpdate: '04/06/2025 às 14:30',
    lastContact: '20/05/2025',
    daysWithoutContact: 28,
    dataCriacao: '2025-06-04T14:00:00Z'
  }, {
    id: 3,
    type: 'Apartamento',
    name: 'Cobertura Panorâmica',
    subtitle: '18 fotos disponíveis',
    status: 'Novo',
    code: 'COD:3105 – Cobertura',
    image: '/uploads/63d533d3-9326-4fda-bd8a-8ef8e6cb3587.png',
    address: 'Ipanema – RJ',
    condominium: 'Residencial Ipanema',
    value: 'R$ 3.200.000',
    availability: 'Disponível no site',
    area: '250 m²',
    rooms: '4',
    parking: '2',
    bathrooms: '4',
    lastUpdate: '03/06/2025 às 16:00',
    lastContact: '03/06/2025',
    daysWithoutContact: 2,
    dataCriacao: '2025-06-03T16:00:00Z'
  }, {
    id: 4,
    type: 'Apartamento',
    name: 'Suíte Master Premium',
    subtitle: '12 fotos disponíveis',
    status: 'Disponível',
    code: 'COD:5543 – Apartamento',
    image: '/uploads/5ccdfdf4-1be1-4027-814b-9ceb1482c8e9.png',
    address: 'Barra da Tijuca – RJ',
    condominium: 'Condomínio Elegance',
    value: 'R$ 2.200.000',
    availability: 'Disponível no site',
    area: '220 m²',
    rooms: '3',
    parking: '2',
    bathrooms: '4',
    lastUpdate: '02/06/2025 às 12:00',
    lastContact: '10/04/2025',
    daysWithoutContact: 35,
    dataCriacao: '2025-06-02T12:00:00Z'
  }, {
    id: 5,
    type: 'Apartamento',
    name: 'Apartamento com Varanda',
    subtitle: '10 fotos disponíveis',
    status: 'Disponível',
    code: 'COD:6789 – Apartamento',
    image: '/uploads/83256e9e-7549-4811-88fd-006d4af79dfb.png',
    address: 'Centro – SP',
    condominium: 'Edifício Central',
    value: 'R$ 950.000',
    availability: 'Disponível interno',
    area: '95 m²',
    rooms: '2',
    parking: '1',
    bathrooms: '2',
    lastUpdate: '01/06/2025 às 09:00',
    lastContact: '15/05/2025',
    daysWithoutContact: 22,
    dataCriacao: '2025-06-01T09:00:00Z'
  }, {
    id: 6,
    type: 'Casa',
    name: 'Resort Residencial',
    subtitle: '25 fotos disponíveis',
    status: 'Lançamento',
    code: 'COD:7890 – Casa',
    image: '/uploads/52e907a5-c21f-49b6-a88f-532955fc5075.png',
    address: 'Campos do Jordão – SP',
    condominium: 'Resort Premium',
    value: 'R$ 4.500.000',
    availability: 'Disponível no site',
    area: '500 m²',
    rooms: '5',
    parking: '4',
    bathrooms: '6',
    lastUpdate: '30/05/2025 às 08:00',
    lastContact: '30/05/2025',
    daysWithoutContact: 6,
    dataCriacao: '2025-05-30T08:00:00Z'
  }];
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const scrollLeft = scrollRef.current.scrollLeft;
        const itemWidth = 300 + 16; // Card width + gap
        const maxScroll = (featuredProperties.length - 1) * itemWidth;
        if (scrollLeft >= maxScroll) {
          scrollRef.current.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
          setCurrentSlide(0);
        } else {
          const nextSlide = currentSlide + 1;
          scrollRef.current.scrollTo({
            left: nextSlide * itemWidth,
            behavior: 'smooth'
          });
          setCurrentSlide(nextSlide);
        }
      }
    }, 4000); // Auto-advance every 4 seconds

    return () => clearInterval(interval);
  }, [currentSlide, featuredProperties.length]);
  const handlePropertyClick = (property: any) => {
    navigate(`/property/${property.id}`);
  };
  const handleScroll = (e: any) => {
    const scrollLeft = e.target.scrollLeft;
    const itemWidth = 300 + 16; // width + gap
    const newSlide = Math.round(scrollLeft / itemWidth);
    setCurrentSlide(newSlide);
  };
  const getStatusColor = (daysWithoutContact: number) => {
    if (daysWithoutContact <= 25) return '#4CAF50';
    if (daysWithoutContact <= 30) return '#FFC107';
    return '#F44336';
  };
  const getClockIconColor = (daysWithoutContact: number) => {
    if (daysWithoutContact <= 25) return '#10B981'; // green-500
    if (daysWithoutContact <= 30) return '#F59E0B'; // amber-500
    return '#EF4444'; // red-500
  };
  return <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 px-[16px] my-[14px]">
      <h3 className="text-lg font-semibold text-[#333333] mb-4">Novidades </h3>
      
      <div className="w-full h-[280px] md:h-[320px]">
        {/* Carousel Container */}
        <div ref={scrollRef} className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide" style={{
        scrollSnapType: 'x mandatory'
      }} onScroll={handleScroll}>
          {featuredProperties.map(property => <div key={property.id} onClick={() => handlePropertyClick(property)} className="flex-shrink-0 bg-white rounded-2xl shadow-sm overflow-hidden active:scale-95 transition-transform cursor-pointer border border-gray-200" style={{
          width: '300px',
          height: 'auto',
          scrollSnapAlign: 'start'
        }}>
              {/* Property Image */}
              <div className="relative w-full overflow-hidden rounded-2xl h-[160px] md:h-[200px]">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute top-3 left-3 w-3 h-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: getStatusColor(property.daysWithoutContact) }}
                />
                <div
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${property.availability === 'Disponível no site' ? 'bg-green-200 text-green-800' : 'bg-orange-200 text-orange-800'}`}
                >
                  {property.availability}
                </div>
              </div>

              {/* Property Info */}
              <div className="p-4 space-y-2" style={{
            height: '120px'
          }}>
                {/* Code and Date */}
                <div className="flex items-center justify-between text-xs text-[#666666]">
                  <span className="font-medium">{property.code}</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" style={{
                  color: getClockIconColor(property.daysWithoutContact)
                }} />
                    <span>{property.lastContact}</span>
                  </div>
                </div>
                
                {/* Property Name */}
                <h3 className="text-sm font-semibold text-[#333333] leading-tight line-clamp-1">{property.name}</h3>
                
                {/* Address */}
                <p className="text-xs text-[#666666] truncate">{property.address}</p>
                
                {/* Price */}
                <div className="pt-1">
                  <p className="text-lg font-bold text-[hsl(var(--accent))]">{property.value}</p>
                </div>
                
                {/* Property features */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center space-x-1 text-[#666666]">
                    <Ruler className="w-3.5 h-3.5" />
                    <span>{property.area}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-[#666666]">
                    <Bed className="w-3.5 h-3.5" />
                    <span>{property.rooms}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-[#666666]">
                    <Car className="w-3.5 h-3.5" />
                    <span>{property.parking}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-[#666666]">
                    <ShowerHead className="w-3.5 h-3.5" />
                    <span>{property.bathrooms}</span>
                  </div>
                </div>
              </div>
            </div>)}
        </div>

        {/* Page Indicators */}
        <div className="flex justify-center gap-1 mt-2">
          {featuredProperties.map((_, index) => <div key={index} className={`rounded-full transition-all duration-300 ${index === currentSlide ? 'w-2 h-2 bg-[hsl(var(--accent))]' : 'w-1.5 h-1.5 bg-[#D8D8D8]'}`} />)}
        </div>
      </div>

      {/* Property Detail Modal */}
      {showPropertyModal && selectedProperty && <PropertyDetailModal property={selectedProperty} onClose={() => setShowPropertyModal(false)} />}
    </div>;
};