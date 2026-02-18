
import { useState } from 'react';

interface PropertyTabsProps {
  unitFeatures: string[];
  developmentFeatures: string[];
}

export const PropertyTabs = ({ unitFeatures, developmentFeatures }: PropertyTabsProps) => {
  const [activeTab, setActiveTab] = useState('unit');

  return (
    <div className="px-4 mb-6">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab('unit')}
          className={`flex-1 py-3 text-center font-medium transition-all duration-200 ${
            activeTab === 'unit'
              ? 'text-black border-b-2 border-[hsl(var(--accent))]'
              : 'text-gray-500'
          }`}
        >
          Unidade
        </button>
        <button
          onClick={() => setActiveTab('development')}
          className={`flex-1 py-3 text-center font-medium transition-all duration-200 ${
            activeTab === 'development'
              ? 'text-black border-b-2 border-[hsl(var(--accent))]'
              : 'text-gray-500'
          }`}
        >
          Empreendimento
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white">
        {activeTab === 'unit' ? (
          <ul className="space-y-2">
            {unitFeatures.map((feature, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-black text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-2">
            {developmentFeatures.map((feature, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-black text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
