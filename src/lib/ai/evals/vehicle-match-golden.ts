// Prompt veya model değişikliğinden önce `npm run ai:eval:vehicle-match` çalıştırın.
import { getVehiclePrice } from "@/lib/vehicle-data";

type MatchedExpectation = {
  status: "matched";
  brand: string;
  model: string;
  priceTier: number;
};

type VehicleMatchGoldenCase = {
  name: string;
  input: string;
  expected:
    | MatchedExpectation
    | { status: "needs_disambiguation" }
    | { status: "no_match" };
};

function matched(brand: string, model: string): MatchedExpectation {
  return {
    status: "matched",
    brand,
    model,
    priceTier: getVehiclePrice(brand, model),
  };
}

export const VEHICLE_MATCH_GOLDEN_CASES: VehicleMatchGoldenCase[] = [
  {
    name: "Honda City tam model",
    input: "Honda City Sedan",
    expected: matched("Honda", "City Sedan"),
  },
  {
    name: "Toyota Corolla tam model",
    input: "Toyota Corolla Sedan",
    expected: matched("Toyota", "Corolla Sedan"),
  },
  {
    name: "Renault Clio hatchback",
    input: "Renault Clio Hatchback",
    expected: matched("Renault", "Clio Hatchback"),
  },
  {
    name: "Fiat Egea Cross",
    input: "Fiat Egea Cross",
    expected: matched("Fiat", "Egea Cross"),
  },
  {
    name: "Volkswagen Golf hatchback",
    input: "Volkswagen Golf Hatchback",
    expected: matched("Volkswagen", "Golf Hatchback"),
  },
  {
    name: "Tesla Model Y",
    input: "Tesla Model Y SUV",
    expected: matched("Tesla", "Model Y SUV"),
  },
  {
    name: "Togg T10X",
    input: "Togg T10X SUV",
    expected: matched("Togg", "T10X SUV"),
  },
  {
    name: "BMW X5",
    input: "BMW X5 SUV",
    expected: matched("BMW", "X5 SUV"),
  },
  {
    name: "Mercedes C Serisi",
    input: "Mercedes-Benz C Serisi Sedan",
    expected: matched("Mercedes-Benz", "C Serisi Sedan"),
  },
  {
    name: "Hyundai Tucson",
    input: "Hyundai Tucson SUV",
    expected: matched("Hyundai", "Tucson SUV"),
  },
  {
    name: "Türkçe karakterli Şahin",
    input: "Tofaş Şahin Sedan",
    expected: matched("Tofaş", "Şahin Sedan"),
  },
  {
    name: "Citroen C-Elysee",
    input: "Citroen C-Elysee Sedan",
    expected: matched("Citroen", "C-Elysee Sedan"),
  },
  {
    name: "Yıl içeren Honda City",
    input: "2021 Honda City Sedan",
    expected: matched("Honda", "City Sedan"),
  },
  {
    name: "Yıl içeren Passat Sedan",
    input: "2019 Volkswagen Passat Sedan",
    expected: matched("Volkswagen", "Passat Sedan"),
  },
  {
    name: "Yıl içeren Egea Cross",
    input: "2020 Fiat Egea Cross",
    expected: matched("Fiat", "Egea Cross"),
  },
  {
    name: "Passat kasa belirsiz",
    input: "Passat",
    expected: { status: "needs_disambiguation" },
  },
  {
    name: "Egea kasa belirsiz",
    input: "Egea",
    expected: { status: "needs_disambiguation" },
  },
  {
    name: "Corolla kasa belirsiz",
    input: "Corolla",
    expected: { status: "needs_disambiguation" },
  },
  {
    name: "Audi A3 kasa belirsiz",
    input: "Audi A3",
    expected: { status: "needs_disambiguation" },
  },
  {
    name: "Ford Focus kasa belirsiz",
    input: "Ford Focus",
    expected: { status: "needs_disambiguation" },
  },
  {
    name: "BMW 3 Serisi kasa belirsiz",
    input: "BMW 3 Serisi",
    expected: { status: "needs_disambiguation" },
  },
  {
    name: "Passat yazım hatası",
    input: "pasat",
    expected: { status: "no_match" },
  },
  {
    name: "Gündelik kısa Egea ifadesi",
    input: "19 model Egea",
    expected: { status: "no_match" },
  },
  {
    name: "Boş araç metni",
    input: "",
    expected: { status: "no_match" },
  },
  {
    name: "Alan dışı ifade",
    input: "uçan halı paspası",
    expected: { status: "no_match" },
  },
  {
    name: "Sayıdan ibaret giriş",
    input: "999999",
    expected: { status: "no_match" },
  },
];
