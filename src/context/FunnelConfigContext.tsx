import React, { createContext, useContext, useState, ReactNode } from 'react';
import { updateFunnelConfig } from '@/services/funnelConfig';
import { PIPELINE_STAGES } from '@/constants/pipeline';
import { STAGE_SLUG_TO_LABEL } from '@/data/stageMapping';

interface FunnelConfigContextProps {
  stages: string[];
  addStage: () => void;
  renameStage: (index: number, name: string) => void;
  removeStage: (index: number) => void;
  moveStage: (from: number, to: number) => void;
}

const initialConfig = {
  stages: PIPELINE_STAGES.map((stage) => STAGE_SLUG_TO_LABEL[stage])
};

const FunnelConfigContext = createContext<FunnelConfigContextProps | undefined>(undefined);

export const FunnelConfigProvider = ({ children }: { children: ReactNode }) => {
  const [stages, setStages] = useState(initialConfig.stages);

  const persist = (newStages: string[]) => {
    setStages(newStages);
    updateFunnelConfig({ stages: newStages });
  };

  const addStage = () => persist([...stages, `Etapa ${stages.length + 1}`]);

  const renameStage = (index: number, name: string) => {
    const updated = [...stages];
    updated[index] = name;
    persist(updated);
  };

  const removeStage = (index: number) => {
    const updated = stages.filter((_, i) => i !== index);
    persist(updated);
  };

  const moveStage = (from: number, to: number) => {
    const updated = [...stages];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    persist(updated);
  };

  return (
    <FunnelConfigContext.Provider value={{ stages, addStage, renameStage, removeStage, moveStage }}>
      {children}
    </FunnelConfigContext.Provider>
  );
};

export const useFunnelConfig = () => {
  const context = useContext(FunnelConfigContext);
  if (!context) throw new Error('useFunnelConfig must be used within FunnelConfigProvider');
  return context;
};
