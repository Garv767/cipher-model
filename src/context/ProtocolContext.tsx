import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Trigger = {
  id: string;
  trigger: string;
  signature: string;
  entropy: number;
};

export type IncidentReport = {
  endpoint: string;
  matchScore: string;
  timestamp: string;
  isPositive: boolean;
};

interface ProtocolState {
  triggers: Trigger[];
  setTriggers: (triggers: Trigger[]) => void;
  isWatermarked: boolean;
  setIsWatermarked: (val: boolean) => void;
  activeModel: string | null;
  setActiveModel: (model: string | null) => void;
  incidentReport: IncidentReport | null;
  setIncidentReport: (report: IncidentReport | null) => void;
  activeEndpoint: string;
  setActiveEndpoint: (endpoint: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProtocolContext = createContext<ProtocolState | undefined>(undefined);

export function ProtocolProvider({ children }: { children: ReactNode }) {
  const [triggers, setTriggers] = React.useState<Trigger[]>(() => {
    const saved = localStorage.getItem('ghost_triggers');
    return saved ? JSON.parse(saved) : [];
  });
  const [isWatermarked, setIsWatermarked] = React.useState(() => {
    const saved = localStorage.getItem('ghost_is_watermarked');
    return saved === 'true';
  });
  const [activeModel, setActiveModel] = React.useState<string | null>(() => {
    return localStorage.getItem('ghost_active_model');
  });
  const [incidentReport, setIncidentReport] = React.useState<IncidentReport | null>(null);
  const [activeEndpoint, setActiveEndpoint] = React.useState<string>(() => {
    return localStorage.getItem('ghost_active_endpoint') || "https://api.competitor-ai.com/v1/chat";
  });
  const [activeTab, setActiveTab] = React.useState<string>(() => {
    return localStorage.getItem('ghost_active_tab') || 'vault';
  });

  React.useEffect(() => {
    localStorage.setItem('ghost_triggers', JSON.stringify(triggers));
  }, [triggers]);

  React.useEffect(() => {
    localStorage.setItem('ghost_is_watermarked', isWatermarked.toString());
  }, [isWatermarked]);

  React.useEffect(() => {
    if (activeModel) localStorage.setItem('ghost_active_model', activeModel);
    else localStorage.removeItem('ghost_active_model');
  }, [activeModel]);

  React.useEffect(() => {
    localStorage.setItem('ghost_active_endpoint', activeEndpoint);
  }, [activeEndpoint]);

  React.useEffect(() => {
    localStorage.setItem('ghost_active_tab', activeTab);
  }, [activeTab]);

  return (
    <ProtocolContext.Provider
      value={{
        triggers,
        setTriggers,
        isWatermarked,
        setIsWatermarked,
        activeModel,
        setActiveModel,
        incidentReport,
        setIncidentReport,
        activeEndpoint,
        setActiveEndpoint,
        activeTab,
        setActiveTab
      }}
    >
      {children}
    </ProtocolContext.Provider>
  );
}

export function useProtocol() {
  const context = useContext(ProtocolContext);
  if (context === undefined) {
    throw new Error('useProtocol must be used within a ProtocolProvider');
  }
  return context;
}
