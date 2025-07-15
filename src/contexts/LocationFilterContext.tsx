import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getWards, getVillagesByWard, getHamletsByVillage } from '../utils/location-filter';

interface LocationFilterContextType {
  ward: string;
  village: string;
  hamlet: string;
  wardOptions: string[];
  villageOptions: string[];
  hamletOptions: string[];
  setWard: (ward: string) => void;
  setVillage: (village: string) => void;
  setHamlet: (hamlet: string) => void;
  getLocationParams: () => string;
}

const LocationFilterContext = createContext<LocationFilterContextType | undefined>(undefined);

export const LocationFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ward, setWard] = useState('');
  const [village, setVillage] = useState('');
  const [hamlet, setHamlet] = useState('');

  // Get available options based on selections
  const wardOptions = getWards();
  const villageOptions = ward ? getVillagesByWard(ward) : [];
  const hamletOptions = (ward && village) ? getHamletsByVillage(ward, village) : [];

  // Reset dependent filters when parent filter changes
  React.useEffect(() => {
    if (!ward) {
      setVillage('');
      setHamlet('');
    }
    if (!village) {
      setHamlet('');
    }
  }, [ward, village]);

  // Function to get location parameters in the correct format
  const getLocationParams = () => {
    const params = new URLSearchParams();
    
    if (ward) params.append('ward', ward);
    if (village) params.append('village', village);
    if (hamlet) params.append('hamlet', hamlet);
    
    return params.toString();
  };

  const value = {
    ward,
    village,
    hamlet,
    wardOptions,
    villageOptions,
    hamletOptions,
    setWard,
    setVillage,
    setHamlet,
    getLocationParams
  };

  return (
    <LocationFilterContext.Provider value={value}>
      {children}
    </LocationFilterContext.Provider>
  );
};

export const useLocationFilter = () => {
  const context = useContext(LocationFilterContext);
  if (context === undefined) {
    throw new Error('useLocationFilter must be used within a LocationFilterProvider');
  }
  return context;
}; 