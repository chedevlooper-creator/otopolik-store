import {
  EDGE_COLORS,
  FLOOR_COLORS,
  type MatColor,
} from "@/lib/mat-colors";
import type { VehicleDetails } from "@/lib/vehicle-compatibility";

export type ConfiguratorChatGoldenCase = {
  id: string;
  vehicle: VehicleDetails;
  floor: MatColor;
  edge: MatColor;
  heelPad: boolean;
  trunkMat: boolean;
};

const vehicles: VehicleDetails[] = [
  {
    brand: "BMW",
    model: "3 Serisi",
    year: "2021",
    bodyOrChassis: "Sedan",
  },
  {
    brand: "Volkswagen",
    model: "Passat Sedan",
    year: "2020",
    bodyOrChassis: "Sedan",
  },
  {
    brand: "Renault",
    model: "Clio",
    year: "2022",
    bodyOrChassis: "Hatchback",
  },
  {
    brand: "Toyota",
    model: "Corolla",
    year: "2023",
    bodyOrChassis: "Sedan",
  },
];

export const CONFIGURATOR_CHAT_GOLDEN_CASES: ConfiguratorChatGoldenCase[] = [
  {
    id: "base-black-red",
    vehicle: vehicles[0],
    floor: FLOOR_COLORS[0],
    edge: EDGE_COLORS[10],
    heelPad: false,
    trunkMat: false,
  },
  {
    id: "heel-pad-only",
    vehicle: vehicles[1],
    floor: FLOOR_COLORS[2],
    edge: EDGE_COLORS[4],
    heelPad: true,
    trunkMat: false,
  },
  {
    id: "trunk-only",
    vehicle: vehicles[2],
    floor: FLOOR_COLORS[4],
    edge: EDGE_COLORS[8],
    heelPad: false,
    trunkMat: true,
  },
  {
    id: "all-extras",
    vehicle: vehicles[3],
    floor: FLOOR_COLORS[10],
    edge: EDGE_COLORS[16],
    heelPad: true,
    trunkMat: true,
  },
  {
    id: "base-brown-cream",
    vehicle: vehicles[0],
    floor: FLOOR_COLORS[3],
    edge: EDGE_COLORS[5],
    heelPad: false,
    trunkMat: false,
  },
  {
    id: "heel-pad-burgundy",
    vehicle: vehicles[1],
    floor: FLOOR_COLORS[5],
    edge: EDGE_COLORS[9],
    heelPad: true,
    trunkMat: false,
  },
  {
    id: "trunk-blue-mint",
    vehicle: vehicles[2],
    floor: FLOOR_COLORS[11],
    edge: EDGE_COLORS[20],
    heelPad: false,
    trunkMat: true,
  },
  {
    id: "all-extras-gray-indigo",
    vehicle: vehicles[3],
    floor: FLOOR_COLORS[12],
    edge: EDGE_COLORS[15],
    heelPad: true,
    trunkMat: true,
  },
];
