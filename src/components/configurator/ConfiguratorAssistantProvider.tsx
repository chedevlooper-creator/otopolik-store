"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { buildConfiguredMatCartItem } from "@/lib/configurator-cart-item";
import { calculateMatPrice, type BagSize } from "@/lib/mat-pricing";
import {
  EDGE_COLORS,
  FLOOR_COLORS,
  type MatColor,
} from "@/lib/mat-colors";
import type { CartItem } from "@/lib/types";
import {
  EMPTY_VEHICLE_DETAILS,
  formatVehicleLabel,
  isVehicleDetailsComplete,
  type VehicleDetails,
} from "@/lib/vehicle-compatibility";

type InitialConfiguration = Partial<VehicleDetails>;

type ConfiguratorAssistantContextValue = {
  vehicle: VehicleDetails;
  setVehicle: (vehicle: VehicleDetails) => void;
  floor: MatColor;
  setFloor: (color: MatColor) => void;
  edge: MatColor;
  setEdge: (color: MatColor) => void;
  heelPad: boolean;
  setHeelPad: (selected: boolean) => void;
  trunkMat: boolean;
  setTrunkMat: (selected: boolean) => void;
  quality: "ithal" | "yerli";
  setQuality: (quality: "ithal" | "yerli") => void;
  logoCount: number;
  setLogoCount: (count: number) => void;
  bagSize: BagSize;
  setBagSize: (size: BagSize) => void;
  floorTouched: boolean;
  edgeTouched: boolean;
  vehicleComplete: boolean;
  vehicleLabel: string;
  totalPrice: number;
  currentStep: number;
  applyVehicle: (vehicle: {
    brand: string;
    model: string;
    year?: string;
    bodyOrChassis?: string;
  }) => void;
  applyFloor: (name: string) => boolean;
  applyEdge: (name: string) => boolean;
  applyExtras: (extras: { heelPad: boolean; trunkMat: boolean }) => void;
  selectFloor: (color: MatColor) => void;
  selectEdge: (color: MatColor) => void;
  buildCartItem: () => CartItem | null;
};

const ConfiguratorAssistantContext =
  createContext<ConfiguratorAssistantContextValue | null>(null);

export function ConfiguratorAssistantProvider({
  children,
  initialConfiguration = {},
  initialFloor,
  initialEdge,
}: {
  children: ReactNode;
  initialConfiguration?: InitialConfiguration;
  initialFloor?: string;
  initialEdge?: string;
}) {
  const [vehicle, setVehicle] = useState<VehicleDetails>({
    ...EMPTY_VEHICLE_DETAILS,
    ...initialConfiguration,
  });

  const resolvedFloor = useMemo(() => {
    if (!initialFloor) return FLOOR_COLORS[0];
    return FLOOR_COLORS.find(
      (c) => c.slug === initialFloor || c.name.toLowerCase() === initialFloor.toLowerCase()
    ) ?? FLOOR_COLORS[0];
  }, [initialFloor]);

  const resolvedEdge = useMemo(() => {
    if (!initialEdge) return EDGE_COLORS[10];
    return EDGE_COLORS.find(
      (c) => c.slug === initialEdge || c.name.toLowerCase() === initialEdge.toLowerCase()
    ) ?? EDGE_COLORS[10];
  }, [initialEdge]);

  const [floor, setFloor] = useState<MatColor>(resolvedFloor);
  const [edge, setEdge] = useState<MatColor>(resolvedEdge);
  const [heelPad, setHeelPad] = useState(false);
  const [trunkMat, setTrunkMat] = useState(false);
  const [quality, setQuality] = useState<"ithal" | "yerli">("ithal");
  const [logoCount, setLogoCount] = useState(0);
  const [bagSize, setBagSize] = useState<BagSize>("none");
  const [floorTouched, setFloorTouched] = useState(!!initialFloor);
  const [edgeTouched, setEdgeTouched] = useState(!!initialEdge);

  const vehicleComplete = isVehicleDetailsComplete(vehicle);
  const vehicleLabel = vehicleComplete ? formatVehicleLabel(vehicle) : "";
  const totalPrice = calculateMatPrice({ heelPad, trunkMat, quality, logoCount, bagSize });
  const currentStep = !vehicleComplete
    ? 0
    : (!floorTouched || !edgeTouched)
      ? 1
      : 2;

  const applyVehicle = useCallback(
    (next: {
      brand: string;
      model: string;
      year?: string;
      bodyOrChassis?: string;
    }) => {
      setVehicle((current) => ({
        brand: next.brand,
        model: next.model,
        year: next.year ?? current.year,
        bodyOrChassis: next.bodyOrChassis ?? current.bodyOrChassis,
      }));
    },
    []
  );

  const applyFloor = useCallback((name: string) => {
    const color = FLOOR_COLORS.find((candidate) => candidate.name === name);
    if (!color) return false;
    setFloor(color);
    setFloorTouched(true);
    return true;
  }, []);

  const applyEdge = useCallback((name: string) => {
    const color = EDGE_COLORS.find((candidate) => candidate.name === name);
    if (!color) return false;
    setEdge(color);
    setEdgeTouched(true);
    return true;
  }, []);

  const applyExtras = useCallback(
    (extras: { heelPad: boolean; trunkMat: boolean }) => {
      setHeelPad(extras.heelPad);
      setTrunkMat(extras.trunkMat);
    },
    []
  );

  const selectFloor = useCallback((color: MatColor) => {
    setFloor(color);
    setFloorTouched(true);
  }, []);

  const selectEdge = useCallback((color: MatColor) => {
    setEdge(color);
    setEdgeTouched(true);
  }, []);

  const buildCartItem = useCallback(
    () =>
      buildConfiguredMatCartItem({
        vehicle,
        floor,
        edge,
        heelPad,
        trunkMat,
        quality,
        logoCount,
        bagSize,
      }),
    [edge, floor, heelPad, trunkMat, vehicle, quality, logoCount, bagSize]
  );

  const value = useMemo<ConfiguratorAssistantContextValue>(
    () => ({
      vehicle,
      setVehicle,
      floor,
      setFloor,
      edge,
      setEdge,
      heelPad,
      setHeelPad,
      trunkMat,
      setTrunkMat,
      quality,
      setQuality,
      logoCount,
      setLogoCount,
      bagSize,
      setBagSize,
      floorTouched,
      edgeTouched,
      vehicleComplete,
      vehicleLabel,
      totalPrice,
      currentStep,
      applyVehicle,
      applyFloor,
      applyEdge,
      applyExtras,
      selectFloor,
      selectEdge,
      buildCartItem,
    }),
    [
      applyEdge,
      applyExtras,
      applyFloor,
      applyVehicle,
      buildCartItem,
      currentStep,
      edge,
      edgeTouched,
      floor,
      floorTouched,
      heelPad,
      selectEdge,
      selectFloor,
      totalPrice,
      trunkMat,
      vehicle,
      vehicleComplete,
      vehicleLabel,
      quality,
      logoCount,
      bagSize,
    ]
  );

  return (
    <ConfiguratorAssistantContext.Provider value={value}>
      {children}
    </ConfiguratorAssistantContext.Provider>
  );
}

export function useConfiguratorAssistant() {
  const context = useContext(ConfiguratorAssistantContext);
  if (!context) {
    throw new Error(
      "useConfiguratorAssistant, ConfiguratorAssistantProvider içinde kullanılmalıdır"
    );
  }
  return context;
}
