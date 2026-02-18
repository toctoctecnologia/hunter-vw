import { Thermometer } from 'lucide-react';

interface LeadIntensityButtonsProps {
  leadId: number;
  className?: string;
}

export const LeadIntensityButtons = ({ leadId, className = "" }: LeadIntensityButtonsProps) => {
  // Simular días desde último contato baseado no ID
  const daysSinceContact = leadId * 10; // Exemplo: lead 1 = 10 días, lead 2 = 20 días, etc.
  
  const getIntensityLevel = () => {
    if (daysSinceContact <= 25) return 'green'; // até 25 días
    if (daysSinceContact <= 30) return 'yellow'; // de 26 até 30 días  
    return 'red'; // acima de 31 días
  };

  const intensityLevel = getIntensityLevel();
  
  const getButtonConfig = () => {
    switch (intensityLevel) {
      case 'green':
        return { color: 'hsl(200, 80%, 60%)', label: 'Frio' }; // Blue
      case 'yellow':
        return { color: 'hsl(45, 100%, 51%)', label: 'Morno' }; // Yellow
      case 'red':
        return { color: 'hsl(4, 90%, 58%)', label: 'Quente' }; // Red
      default:
        return { color: 'hsl(210, 10%, 75%)', label: 'Muito Frio' }; // Gray
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className={`${className}`}>
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center relative"
        style={{ 
          backgroundColor: buttonConfig.color,
          border: '2px solid hsl(25, 100%, 50%)', // Orange border
        }}
      >
        <Thermometer 
          size={16} 
          className="text-white"
        />
      </div>
    </div>
  );
};