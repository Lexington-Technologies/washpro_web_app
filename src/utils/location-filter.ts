// utils/wardUtils.ts
import { kudanData } from '../api/data';

interface Hamlet {
  name: string;
}

interface Village {
  name: string;
  hamlets: Hamlet[];
}

interface Ward {
  name: string;
  villages: Village[];
}

// Function to retrieve all ward names
export const getWards = (): string[] => {
  return kudanData.map(item => item.name);
};

// Function to retrieve village names based on the selected ward
export const getVillagesByWard = (wardName: string): string[] => {
  const selectedWard = kudanData.find(ward => ward.name === wardName);
  return selectedWard ? selectedWard.villages.map(village => village.name) : [];
};

// Function to retrieve hamlets based on the selected ward and village
export const getHamletsByVillage = (wardName: string, villageName: string): string[] => {
  const selectedWard = kudanData.find(ward => ward.name === wardName);
  if (!selectedWard) return [];

  const selectedVillage = selectedWard.villages.find(village => village.name === villageName);
  return selectedVillage ? selectedVillage.hamlets : [];
};
