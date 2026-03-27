"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export const vehicleData = {
  avanza: { name: "Toyota Avanza 2025", vin: "MHKA1BA1JFK000001", health: 87, nextService: "In 15 days", owner: "Pak Budi", licensePlate: "B 1234 CD", mileage: "34,521" },
  bmw_m4: { name: "BMW M4 G82 2025", vin: "WBA43AZ0X0CH00001", health: 95, nextService: "In 45 days", owner: "Andi Wijaya", licensePlate: "B 4 M", mileage: "12,400" },
  beat: { name: "Honda Beat 2024", vin: "MH1JFZ110K000042", health: 92, nextService: "In 60 days", owner: "Siti Nur", licensePlate: "D 5678 EF", mileage: "14,200" },
  harley: { name: "Harley-Davidson Sportster S", vin: "HD1ME23145K998212", health: 98, nextService: "In 120 days", owner: "John Doe", licensePlate: "B 8888 HD", mileage: "8,900" }
};

export type VehicleKey = keyof typeof vehicleData;

interface ActiveVehicleContextType {
  activeVehicle: VehicleKey;
  setActiveVehicle: (key: VehicleKey) => void;
  currentVehicleData: typeof vehicleData[VehicleKey];
}

const ActiveVehicleContext = createContext<ActiveVehicleContextType | undefined>(undefined);

export function ActiveVehicleProvider({ children }: { children: ReactNode }) {
  const [activeVehicle, setActiveVehicleState] = useState<VehicleKey>("avanza");

  useEffect(() => {
    const saved = localStorage.getItem("noc_active_vehicle") as VehicleKey;
    if (saved && vehicleData[saved]) {
      setActiveVehicleState(saved);
    }
  }, []);

  const setActiveVehicle = (key: VehicleKey) => {
    setActiveVehicleState(key);
    localStorage.setItem("noc_active_vehicle", key);
  };

  return (
    <ActiveVehicleContext.Provider value={{
      activeVehicle,
      setActiveVehicle,
      currentVehicleData: vehicleData[activeVehicle]
    }}>
      {children}
    </ActiveVehicleContext.Provider>
  );
}

export function useActiveVehicle() {
  return useContext(ActiveVehicleContext);
}
