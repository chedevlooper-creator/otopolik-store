"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import FlatMatPreview from "@/components/configurator/FlatMatPreview";
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronRightIcon,
  ShoppingBagIcon,
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  TimerIcon,
  Maximize2Icon,
  Rotate3dIcon,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useStoreSettings } from "@/context/settings-context";
import { formatPrice } from "@/lib/format";
import { calculateMatPrice } from "@/lib/mat-pricing";
import { getAllBrands, getModelsByBrand, getVehiclePrice } from "@/lib/vehicle-data";
import {
  formatVehicleLabel,
  vehicleDetailsKey,
} from "@/lib/vehicle-compatibility";

// Stüdyo kalitesinde araç fotoğrafı bulunan 6 marka (public/media/cars/)
const QUICK_BRANDS = [
  {
    name: "Mercedes-Benz",
    short: "MERCEDES",
    customerPhoto: "/media/cars/mercedes.jpg",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 0C5.38 0 0 5.38 0 12s5.38 12 12 12 12-5.38 12-12S18.62 0 12 0zm0 2.25c.57 0 1.13.04 1.68.12l-4.54 7.87L4.57 4.57A9.73 9.73 0 0 1 12 2.25zm-6.28 3.5l4.57 7.89H4.14a9.75 9.75 0 0 1 7.86-7.89zm1.36 9.17l4.54 7.87A9.73 9.73 0 0 1 2.25 12c0-.57.04-1.13.12-1.68l7.87 4.54zm9.21 0l-4.54-7.87 4.54-7.87c.08.55.12 1.11.12 1.68a9.73 9.73 0 0 1-7.87 7.36l7.87 4.54-4.54 7.87c.55.08 1.11.12 1.68.12a9.73 9.73 0 0 0 7.36-7.87z" />
      </svg>
    ),
  },
  {
    name: "BMW",
    short: "BMW",
    customerPhoto: "/media/cars/bmw.jpg",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 .78C18.196.78 23.219 5.803 23.219 12c0 6.196-5.022 11.219-11.219 11.219C5.803 23.219.781 18.196.781 12S5.804.78 12 .78zm-.678.63c-.33.014-.66.042-.992.078l-.107 2.944a9.95 9.95 0 0 1 .71-.094l.07-1.988-.013-.137.043.13.664 1.489h.606l.664-1.488.04-.131-.01.137.07 1.988c.232.022.473.054.71.094l-.109-2.944a14.746 14.746 0 0 0-.992-.078l-.653 1.625-.023.12-.023-.12-.655-1.625zm6.696 1.824l-1.543 2.428c.195.15.452.371.617.522l1.453-.754.092-.069-.069.094-.752 1.453c.163.175.398.458.53.63l2.43-1.544a16.135 16.135 0 0 0-.46-.568L18.777 6.44l-.105.092.078-.115.68-1.356-.48-.48-1.356.68-.115.078.091-.106 1.018-1.539c-.18-.152-.351-.291-.57-.46zM5.5 3.785c-.36.037-.638.283-1.393 1.125a18.97 18.97 0 0 0-.757.914l2.074 1.967c.687-.76.966-1.042 1.508-1.613.383-.405.6-.87.216-1.317-.208-.242-.558-.295-.85-.175l-.028.01.01-.026a.7.7 0 0 0-.243-.734.724.724 0 0 0-.537-.15zm.006.615c.136-.037.277.06.308.2.032.14-.056.272-.154.382-.22.25-1.031 1.098-1.031 1.098l-.402-.383c.417-.51.861-.974 1.062-1.158a.55.55 0 0 1 .217-.139zM12 4.883a7.114 7.114 0 0 0-7.08 6.388v.002a7.122 7.122 0 0 0 8.516 7.697 7.112 7.112 0 0 0 5.68-6.97A7.122 7.122 0 0 0 12 4.885v-.002zm-5.537.242c.047 0 .096.013.14.043.088.059.128.16.106.26-.026.119-.125.231-.205.318l-1.045 1.12-.42-.4s.787-.832 1.045-1.099c.102-.106.168-.17.238-.205a.331.331 0 0 1 .14-.037zM12 5.818A6.175 6.175 0 0 1 18.182 12H12v6.182A6.175 6.175 0 0 1 5.818 12H12V5.818Z" />
      </svg>
    ),
  },
  {
    name: "Audi",
    short: "AUDI",
    customerPhoto: "/media/cars/audi.jpg",
    logo: (
      <svg viewBox="0 7.8 24 8.4" fill="currentColor" className="h-[18px] w-auto">
        <path d="M19.848,7.848c-0.992,0-1.902,0.348-2.616,0.928c-0.714-0.58-1.624-0.928-2.616-0.928 c-0.992,0-1.902,0.348-2.616,0.928c-0.714-0.58-1.624-0.928-2.616-0.928c-0.992,0-1.902,0.348-2.616,0.928 c-0.714-0.58-1.624-0.928-2.616-0.928C1.859,7.848,0,9.707,0,12s1.859,4.152,4.152,4.152c0.992,0,1.902-0.348,2.616-0.928 c0.714,0.58,1.624,0.928,2.616,0.928c0.992,0,1.902-0.348,2.616-0.928c0.714,0.58,1.624,0.928,2.616,0.928 c0.992,0,1.902-0.348,2.616-0.928c0.714,0.58,1.624,0.928,2.616,0.928C22.141,16.152,24,14.293,24,12S22.141,7.848,19.848,7.848z M17.232,13.866c-0.376-0.526-0.598-1.17-0.598-1.866c0-0.696,0.222-1.34,0.598-1.866c0.376,0.526,0.598,1.17,0.598,1.866 C17.83,12.696,17.608,13.34,17.232,13.866z M12,13.866c-0.376-0.526-0.598-1.17-0.598-1.866c0-0.696,0.222-1.34,0.598-1.866 c0.376,0.526,0.598,1.17,0.598,1.866C12.598,12.696,12.376,13.34,12,13.866z M6.768,13.866C6.392,13.34,6.17,12.696,6.17,12 c0-0.696,0.222-1.34,0.598-1.866C7.144,10.66,7.366,11.304,7.366,12C7.366,12.696,7.144,13.34,6.768,13.866z M0.938,12 c0-1.775,1.439-3.214,3.214-3.214c0.736,0,1.414,0.248,1.956,0.665C5.56,10.154,5.232,11.039,5.232,12 c0,0.961,0.328,1.846,0.876,2.549c-0.542,0.416-1.22,0.665-1.956,0.665C2.377,15.214,0.938,13.775,0.938,12z M7.428,14.549 C7.976,13.846,8.304,12.961,8.304,12c0-0.961-0.328-1.846-0.876-2.549c0.542-0.416,1.22-0.665,1.956-0.665 c0.736,0,1.414,0.248,1.956,0.665c-0.549,0.704-0.876,1.588-0.876,2.549c0,0.961,0.328,1.846,0.876,2.549 c-0.542,0.416-1.22,0.665-1.956,0.665C8.648,15.214,7.97,14.966,7.428,14.549z M12.66,14.549c0.549-0.704,0.876-1.588,0.876-2.549 c0-0.961-0.328-1.846-0.876-2.55c0.542-0.416,1.22-0.665,1.956-0.665s1.414,0.248,1.956,0.665 c-0.549,0.704-0.876,1.588-0.876,2.549c0,0.961,0.328,1.846,0.876,2.549c-0.542,0.416-1.22,0.665-1.956,0.665 C13.88,15.214,13.202,14.966,12.66,14.549z M19.848,15.214c-0.736,0-1.414-0.248-1.956-0.665c0.548-0.704,0.876-1.588,0.876-2.549 c0-0.961-0.328-1.846-0.876-2.549c0.542-0.416,1.22-0.665,1.956-0.665c1.775,0,3.214,1.439,3.214,3.214 S21.623,15.214,19.848,15.214z" />
      </svg>
    ),
  },
  {
    name: "Toyota",
    short: "TOYOTA",
    customerPhoto: "/media/cars/toyota.jpg",
    logo: (
      <svg viewBox="0 3.8 24 16.4" fill="currentColor" className="h-5 w-auto">
        <path d="M12 3.848C5.223 3.848 0 7.298 0 12c0 4.702 5.224 8.152 12 8.152S24 16.702 24 12c0-4.702-5.223-8.152-12-8.152zm7.334 3.839c0 1.08-1.725 1.913-4.488 2.246-.26-2.58-1.005-4.279-1.963-4.913 2.948.184 6.45 1.227 6.45 2.667zM12 16.401c-.96 0-1.746-1.5-1.808-4.389.577.047 1.18.072 1.808.072.628 0 1.23-.025 1.807-.072-.061 2.89-.847 4.389-1.807 4.389zm0-6.308c-.59 0-1.155-.019-1.69-.054.261-1.728.92-3.15 1.69-3.15.77 0 1.428 1.422 1.689 3.15-.535.034-1.099.054-1.689.054zm-.882-5.075c-.956.633-1.706 2.333-1.964 4.915C6.391 9.6 4.665 8.767 4.665 7.687c0-1.44 3.504-2.49 6.453-2.669zM2.037 11.68a5.265 5.265 0 011.048-3.164c.27 1.547 2.522 2.881 5.972 3.37V12c0 3.772.879 6.203 2.087 6.97-5.107-.321-9.107-3.48-9.107-7.29zm10.823 7.29c1.207-.767 2.087-3.198 2.087-6.97v-.115c3.447-.488 5.704-1.826 5.972-3.37a5.26 5.26 0 011.049 3.165c-.004 3.81-4.008 6.969-9.109 7.29z" />
      </svg>
    ),
  },
  {
    name: "Jeep",
    short: "JEEP",
    customerPhoto: "/media/cars/jeep.jpg",
    logo: (
      <svg viewBox="0 7.1 24 8.2" fill="currentColor" className="h-[14px] w-auto">
        <path d="M4.1651 7.1687v5.2011c0 .6762-.444 1.0777-1.1628 1.0777-.7185 0-1.0992-.5283-1.0992-1.0992v-.9299H0v.9514c0 .972.296 2.7068 3.0235 2.7068 2.7272 0 3.1082-1.8614 3.1082-2.7488V7.1687Zm4.9177 2.1562c-1.7973 0-2.6003 1.6485-2.6003 3.0657 0 1.4168.9094 2.7912 2.7695 2.7912 1.6285.021 2.707-1.0361 2.707-1.8187h-1.7977s-.2113.5078-.8458.5078c-.6343 0-.9934-.3596-.9934-1.2265h3.6576c0-2.7277-1.3526-3.3195-2.897-3.3195zm5.8471 0c-1.7968 0-2.6007 1.6485-2.6007 3.0657 0 1.4168.9094 2.7912 2.7705 2.7912 1.628.021 2.7067-1.0361 2.7067-1.8187h-1.7978s-.2116.5078-.8454.5078c-.6348 0-.9942-.3596-.9942-1.2265h3.6574c0-2.7277-1.3523-3.3195-2.8965-3.3195zm6.7435.0635c-.9132 0-1.3186.4962-1.3401.522-.1283.1538-.2875.3165-.2875-.0782v-.2959h-1.8193v7.295h1.8398V14.822c0-.148.1478-.126.2543 0 .1063.1277.5711.4443 1.3752.4443C23.155 15.2663 24 13.9978 24 12.264c0-2.2415-1.4162-2.8757-2.3266-2.8756Zm-12.401 1.1203c.6766 0 .972.5073.972 1.0365H8.3843c0-.5718.2327-1.0365.8882-1.0365zm5.8468 0c.6767 0 .9724.5073.9724 1.0365H14.231c0-.5718.2332-1.0365.8883-1.0365zm5.9204.296c.9318 0 1.1.7189 1.1 1.4593 0 .74-.1272 1.7124-1.0141 1.7124-.8884 0-1.1212-.5709-1.1017-1.6486.022-1.0788.4441-1.523 1.0158-1.523zm2.2813 4.5664a.5855.5855 0 0 0-.5856.5857c0 .3233.2617.5856.5856.5856.3218 0 .585-.2623.585-.5856 0-.3233-.2632-.5857-.585-.5857zm0 .062a.524.524 0 0 1 .5236.5237c0 .2884-.2346.5246-.5236.5246a.5258.5258 0 0 1-.525-.5246c0-.289.2352-.5236.525-.5236zm-.2108.2024v.6208h.0725v-.2689h.1764l.1159.269h.0806l-.1216-.2873c.0386-.0133.0514-.0227.072-.0447.0266-.0287.0434-.0739.0434-.115 0-.1034-.0796-.174-.195-.174zm.0705.0676h.1722c.072 0 .1177.041.1177.1045 0 .072-.0485.1168-.1278.1168h-.1621z" />
      </svg>
    ),
  },
  {
    name: "Ford",
    short: "FORD",
    customerPhoto: "/media/cars/ford.jpg",
    logo: (
      <svg viewBox="0 7.5 24 9" fill="currentColor" className="h-[18px] w-auto">
        <path d="M12 8.236C5.872 8.236.905 9.93.905 12.002S5.872 15.767 12 15.767c6.127 0 11.094-1.693 11.094-3.765 0-2.073-4.967-3.766-11.094-3.766zm-5.698 6.24c-.656.005-1.233-.4-1.3-1.101a1.415 1.415 0 0 1 .294-1.02c.195-.254.525-.465.804-.517.09-.017.213-.006.264.054.079.093.056.194-.023.234-.213.109-.47.295-.597.55a.675.675 0 0 0 .034.696c.263.397.997.408 1.679-.225.169-.156.32-.304.473-.48.3-.344.4-.47.8-1.024.005-.006.006-.014.004-.018-.003-.007-.009-.01-.02-.01-.267.007-.5.087-.725.255-.065.048-.159.041-.2-.021-.046-.07-.013-.163.062-.215.363-.253.76-.298 1.166-.367 0 0 .028.002.051-.03.167-.213.292-.405.47-.621.178-.22.41-.42.586-.572.246-.212.404-.283.564-.37.043-.022-.005-.049-.018-.049-.896-.168-1.827-.386-2.717-.056-.616.23-.887.718-.757 1.045.093.231.397.27.683.13a1.55 1.55 0 0 0 .611-.544c.087-.134.27-.038.171.195-.26.611-.757 1.097-1.363 1.118-.516.016-.849-.363-.848-.831.002-.924 1.03-1.532 2.11-1.622 1.301-.108 2.533.239 3.825.395.989.12 1.938.123 2.932-.106.118-.025.2.05.193.168-.01.172-.143.337-.47.516-.373.204-.763.266-1.17.27-.984.008-1.901-.376-2.85-.582.002.041.012.091-.023.117-.525.388-1 .782-1.318 1.334-.011.013-.005.025.013.024.277-.015.525-.022.783-.042.045-.004.047-.015.043-.048a.64.64 0 0 1 .2-.558c.172-.153.387-.17.53-.06.16.126.147.353.058.523a.63.63 0 0 1-.382.31s-.03.006-.026.034c.006.043.2.151.217.18.017.027.008.07-.021.102a.123.123 0 0 1-.095.045c-.033 0-.053-.012-.096-.035a.92.92 0 0 1-.27-.217c-.024-.031-.037-.032-.099-.029-.279.017-.714.059-1.009.096-.071.008-.082.022-.096.047-.47.775-.972 1.61-1.523 2.17-.592.6-1.083.758-1.604.762zM19.05 10.71c-.091.158-1.849 2.834-1.96 3.11-.035.088-.04.155-.004.204.092.124.297.051.425-.038.381-.262.645-.58.937-.858.017-.013.046-.018.065 0 .043.04.106.091.15.137a.04.04 0 0 1 .002.057 5.873 5.873 0 0 1-.904.911c-.47.364-.939.457-1.172.224a.508.508 0 0 1-.14-.316c-.002-.057-.031-.06-.058-.034-.278.275-.76.579-1.198.362-.366-.18-.451-.618-.383-.986.001-.008-.006-.06-.051-.03a1.28 1.28 0 0 1-.3.162.853.853 0 0 1-.366.077.518.518 0 0 1-.451-.253.759.759 0 0 1-.095-.347c-.001-.011-.017-.032-.033-.005-.3.457-.579.899-.875 1.363-.016.022-.03.036-.06.037l-.587.001c-.036 0-.053-.028-.034-.063.104-.2.674-1.03 1.06-1.736.107-.194.085-.294.019-.337-.083-.054-.248.027-.387.133-.379.287-.697.735-.859.935-.095.117-.185.291-.433.56-.391.425-.91.669-1.408.5a.848.848 0 0 1-.546-.58c-.015-.052-.044-.066-.073-.032-.08.1-.245.249-.383.342-.015.011-.052.033-.084.017a.851.851 0 0 1-.152-.199.07.07 0 0 1 .016-.08c.197-.173.305-.271.391-.38.064-.08.113-.17.17-.315.12-.302.393-.866.938-1.158a1.81 1.81 0 0 1 .652-.219c.1-.01.183.002.213.08.011.033.039.105.056.158.011.032.003.057-.035.071-.32.122-.643.311-.865.61-.253.338-.321.746-.152.98.123.17.322.2.514.139.29-.092.538-.363.666-.663.138-.329.16-.717.058-1.059-.016-.059-.001-.104.037-.136.077-.063.184-.112.215-.128a.14.14 0 0 1 .182.045c.106.157.163.378.17.607.006.049.026.05.05.025.19-.202.366-.418.568-.58.185-.147.422-.267.643-.262.286.006.428.2.419.546-.001.044.03.04.051.011a1.19 1.19 0 0 1 .24-.264c.198-.163.4-.236.611-.222.26.02.468.257.425.527a.53.53 0 0 1-.281.406.362.362 0 0 1-.405-.044.336.336 0 0 1-.096-.322c.005-.025-.027-.048-.054-.02-.254.264-.273.606-.107.76.183.17.458.056.658-.075.366-.239.65-.563.979-.813.218-.166.467-.314.746-.351a.87.87 0 0 1 .454.052c.2.081.326.25.342.396.004.043.036.048.063.01.158-.246 1.005-1.517 1.075-1.65.02-.041.044-.047.089-.047h.606c.035 0 .051.02.036.047zm-2.32 2.204a.053.053 0 0 0-.003.04c.003.02.03.04.056.05.01.003.015.01.004.032-.075.16-.143.252-.237.391a1.472 1.472 0 0 1-.3.325c-.178.147-.424.307-.628.2-.09-.047-.13-.174-.127-.276.004-.288.132-.584.369-.875.288-.355.607-.539.816-.438.216.103.148.354.05.55zm-5.949-1.881a.398.398 0 0 1 .132-.345c.057-.05.133-.062.18-.022.052.045.027.157-.026.234a.43.43 0 0 1-.245.177c-.018.004-.034-.004-.041-.044zM12 7.5C5.34 7.5 0 9.497 0 12c0 2.488 5.383 4.5 12 4.5s12-2.02 12-4.5-5.383-4.5-12-4.5zm0 8.608C5.649 16.108.5 14.27.5 12.002.5 9.733 5.65 7.895 12 7.895s11.498 1.838 11.498 4.107c0 2.268-5.148 4.106-11.498 4.106z" />
      </svg>
    ),
  },
] as const;

// Colors defined in the color picker of the mockup
const COLOR_OPTIONS = [
  { name: "Siyah", hex: "#111111", glow: "rgba(255,255,255,0.06)", image: "/media/configurator/siyah-siyah.png" },
  { name: "Gri", hex: "#5b5b5b", glow: "rgba(120,120,120,0.15)", image: "/media/configurator/siyah-gri.png" },
  { name: "Bej", hex: "#c9b38d", glow: "rgba(201,179,141,0.18)", image: "/media/configurator/siyah-bej.png" },
  { name: "Turuncu", hex: "#d7682f", glow: "rgba(215,104,47,0.18)", image: "/media/configurator/siyah-turuncu.png" },
  { name: "Mavi", hex: "#234d8f", glow: "rgba(35,77,143,0.18)", image: "/media/configurator/siyah-mavi.png" },
  { name: "Mor", hex: "#65468b", glow: "rgba(101,70,139,0.18)", image: "/media/configurator/siyah-mor.png" },
  { name: "Yeşil", hex: "#356b4c", glow: "rgba(53,107,76,0.18)", image: "/media/configurator/siyah-yesil.png" },
] as const;

const YEARS = Array.from({ length: 38 }, (_, index) => String(2027 - index));

// Marka rozeti fotoğrafta net teyit edilemediği için başlıklar nötr tutulur
const REAL_APPLICATIONS = [
  { src: "/media/galeri/musteri/photo_5906683564177165681_w.webp", label: "Ön koltuk uygulaması" },
  { src: "/media/galeri/musteri/photo_5845771899898629465_w.webp", label: "Arka bagaj havuzu" },
  { src: "/media/galeri/musteri/photo_5845771899898629467_w.webp", label: "Ön torpido detayı" },
  { src: "/media/galeri/musteri/photo_6030412024262626515_w.webp", label: "Arka koltuk paspası" },
  { src: "/media/galeri/musteri/photo_5866003077058465479_w.webp", label: "Sürücü koltuğu detayı" },
];

export default function HomeConfiguratorShowcase() {
  const { addItem } = useCart();
  const settings = useStoreSettings();

  // Configuration States
  const [selectedBrand, setSelectedBrand] = useState<string>("Mercedes-Benz");
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    const initialModels = getModelsByBrand("Mercedes-Benz");
    return initialModels[0]?.name ?? "";
  });
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedBodyOrChassis, setSelectedBodyOrChassis] = useState("");
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);

  // Interaction States
  const [isZoomed, setIsZoomed] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });
  const [added, setAdded] = useState(false);

  const handleZoomMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomCoords({ x, y });
  };

  // DOM Refs
  const brandScrollRef = useRef<HTMLDivElement>(null);

  // Initialize and list models dynamically
  const allBrands = useMemo(() => getAllBrands(), []);
  const models = useMemo(() => getModelsByBrand(selectedBrand), [selectedBrand]);

  // Find active brand details
  const activeBrandDetails = useMemo(() => {
    return QUICK_BRANDS.find((b) => b.name === selectedBrand) ?? QUICK_BRANDS[0];
  }, [selectedBrand]);

  // Brand Scroll Handlers
  const scrollBrands = (direction: "left" | "right") => {
    if (brandScrollRef.current) {
      const scrollAmount = 240;
      brandScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleBrandSelect = (brandName: string) => {
    setSelectedBrand(brandName);
    setSelectedBodyOrChassis("");
    const nextModels = getModelsByBrand(brandName);
    if (nextModels.length > 0) {
      setSelectedModel(nextModels[0].name);
    }
  };

  const activeColor = COLOR_OPTIONS[selectedColorIdx];
  const vehicleDetails = {
    brand: selectedBrand,
    model: selectedModel,
    year: selectedYear,
    bodyOrChassis: selectedBodyOrChassis,
  };
  const canAddConfiguredSet = Boolean(
    selectedModel && /^\d{4}$/.test(selectedYear) && selectedBodyOrChassis.trim()
  );
  const configuredPrice = calculateMatPrice({
    basePrice: getVehiclePrice(selectedBrand, selectedModel),
    heelPad: false,
    trunkMat: false,
  });

  // Eksik alanı bul ve odakla (buton "ölü" görünmesin, kullanıcıyı yönlendirsin)
  const focusFirstMissingField = () => {
    const missingId = !selectedModel
      ? "home-config-model"
      : !/^\d{4}$/.test(selectedYear)
        ? "home-config-year"
        : "home-config-body";
    window.requestAnimationFrame(() => {
      document.getElementById(missingId)?.focus();
    });
  };

  const handleCtaClick = () => {
    if (!canAddConfiguredSet) {
      focusFirstMissingField();
      return;
    }
    handleAddToCart();
  };

  // Add to Cart
  const handleAddToCart = () => {
    if (!canAddConfiguredSet) return;
    const vehicleLabel = formatVehicleLabel(vehicleDetails);
    addItem({
      slug: `ozel-tasarim-${vehicleDetailsKey(vehicleDetails)}-siyah-${activeColor.name}`.toLocaleLowerCase("tr-TR"),
      name: `Araca Özel Premium EVA Paspas - ${vehicleLabel}`,
      image: activeColor.image,
      price: configuredPrice,
      color: `Siyah / ${activeColor.name}`,
      quantity: 1,
      configuration: {
        vehicle: vehicleLabel,
        baseColor: "Siyah",
        edgeColor: activeColor.name,
        heelPad: false,
        trunkMat: false,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const getEdgeColorFromOption = (optionName: string) => {
    switch (optionName) {
      case "Siyah": return { name: "Gece Siyahı", hex: "#2e292c", slug: "gece-siyahi" };
      case "Gri": return { name: "Şehrin Grisi", hex: "#544648", slug: "sehrin-grisi" };
      case "Bej": return { name: "Kum Işığı", hex: "#b79688", slug: "kum-isigi" };
      case "Turuncu": return { name: "Turuncu", hex: "#ed6b22", slug: "turuncu" };
      case "Mavi": return { name: "Saks Mavisi", hex: "#335eb3", slug: "saks-mavisi" };
      case "Mor": return { name: "Lavanta Moru", hex: "#cd9ce0", slug: "lavanta-moru" };
      case "Yeşil": return { name: "Haki Yeşil", hex: "#292a18", slug: "haki-yesil" };
      default: return { name: "Gece Siyahı", hex: "#2e292c", slug: "gece-siyahi" };
    }
  };

  return (
    <section id="arac-sec" className="overflow-hidden border-y border-white/[0.07] bg-black py-14 text-white md:py-24">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 2xl:px-8">
        <div className="mb-16">
          <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-end">
            <div>
              <h2 className="font-heading text-3xl font-medium tracking-tight text-white sm:text-4xl">
                Her araca özel üretim
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">
                Marka, model ve yılı seçerek aracınıza özel paspasları görüntüleyin.
              </p>
              <Link
                href="/olusturucu"
                className="btn-press btn-ghost-rich mt-4 inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold text-white"
              >
                Tam oluşturucuya git
                <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            {/* Horizontal Brand Select Buttons Row */}
            <div className="relative group">
              <div
                ref={brandScrollRef}
                className="flex gap-3 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory pr-10"
                style={{ scrollbarWidth: "none" }}
              >
                {QUICK_BRANDS.map((item) => {
                  const isActive = item.name === selectedBrand;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleBrandSelect(item.name)}
                      aria-pressed={isActive}
                      aria-label={`${item.name} markasını seç`}
                      className={`flex h-[84px] w-[110px] shrink-0 flex-col items-center justify-center rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "bg-white/[0.08] text-white shadow-[0_0_24px_rgba(255,255,255,0.1)] ring-1 ring-white/25"
                          : "bg-transparent text-white/40 hover:bg-white/[0.03] hover:text-white/80"
                      }`}
                    >
                      <div className={`flex h-8 items-center justify-center transition-colors duration-300 ${
                        isActive ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-white/40"
                      }`}>
                        {item.logo}
                      </div>
                      <span className="mt-2 text-[9px] font-black uppercase tracking-[0.15em] block">
                        {item.short}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Scroll Right Trigger icon */}
              <button
                onClick={() => scrollBrands("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-black/95 active:scale-95"
                aria-label="Markaları Kaydır"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative grid items-stretch gap-8 rounded-[2.5rem] border border-white/[0.08] bg-[#050505] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.8)] lg:grid-cols-[1fr_1.2fr] lg:gap-10 lg:p-10">

            <div className="flex flex-col justify-between py-2 px-1">
              <div>
                <h3 className="mb-6 font-heading text-[1.15rem] font-bold tracking-tight text-white flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-red text-[10px] font-black text-white shadow-[0_0_12px_rgba(237,27,36,0.5)]">1</span>
                  Kişiselleştir
                </h3>

                <div className="space-y-4">
                  {/* Brand select */}
                  <div>
                    <label htmlFor="home-config-brand" className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.15em] text-white/50">
                      Marka
                    </label>
                    <select
                      id="home-config-brand"
                      value={selectedBrand}
                      onChange={(e) => handleBrandSelect(e.target.value)}
                      className="h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#0A0A0A] px-4 text-[13px] font-medium text-white outline-none transition focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                    >
                      {allBrands.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="home-config-model" className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.15em] text-white/50">
                      Model
                    </label>
                    <select
                      id="home-config-model"
                      value={selectedModel}
                      onChange={(e) => {
                        setSelectedModel(e.target.value);
                        setSelectedBodyOrChassis("");
                      }}
                      className="h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#0A0A0A] px-4 text-[13px] font-medium text-white outline-none transition focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                    >
                      {models.map((m) => (
                        <option key={m.name} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="home-config-year" className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.15em] text-white/50">
                      Yıl
                    </label>
                    <select
                      id="home-config-year"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#0A0A0A] px-4 text-[13px] font-medium text-white outline-none transition focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                    >
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="home-config-body" className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.15em] text-white/50">
                      Kasa / versiyon
                    </label>
                    <input
                      id="home-config-body"
                      type="text"
                      value={selectedBodyOrChassis}
                      onChange={(e) => setSelectedBodyOrChassis(e.target.value)}
                      placeholder="Örn. W205 / Sport"
                      className="h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#0A0A0A] px-4 text-[13px] font-medium text-white outline-none transition placeholder:text-white/30 focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                    />
                  </div>

                  <div>
                    <label htmlFor="home-config-color" className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.15em] text-white/50">
                      Kenar rengi
                    </label>
                    <select
                      id="home-config-color"
                      value={selectedColorIdx}
                      onChange={(e) => setSelectedColorIdx(Number(e.target.value))}
                      className="h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#0A0A0A] px-4 text-[13px] font-medium text-white outline-none transition focus:border-brand-red focus:ring-1 focus:ring-brand-red"
                    >
                      {COLOR_OPTIONS.map((item, idx) => (
                        <option key={item.name} value={idx}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col pt-5">
                <div className="flex items-end justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    Paspas Seti
                  </span>
                  <strong className="text-[1.35rem] font-bold tracking-tight text-white">
                    {formatPrice(configuredPrice)}
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={handleCtaClick}
                  aria-disabled={!canAddConfiguredSet}
                  className={`group relative flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] text-white transition-all active:scale-[0.98] ${
                    canAddConfiguredSet
                      ? "bg-brand-red/90 hover:bg-brand-red hover:shadow-[0_0_24px_rgba(237,27,36,0.4)]"
                      : "border border-brand-red/60 bg-brand-red/10 hover:border-brand-red hover:bg-brand-red/20"
                  }`}
                >
                  {added ? (
                    <>
                      <CheckIcon className="h-4 w-4 stroke-[3px]" />
                      Sepete Eklendi
                    </>
                  ) : canAddConfiguredSet ? (
                    <>
                      <ShoppingBagIcon className="h-4 w-4" />
                      Sepete Ekle
                    </>
                  ) : (
                    <>
                      Araç Bilgisini Tamamla
                      <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="relative flex flex-col items-center justify-center rounded-[2rem] bg-[#090909]/40 border border-white/[0.04] p-4 min-h-[300px] sm:min-h-[400px]">
              <FlatMatPreview
                floor={{ name: "Gece Siyahı", hex: "#0b0a0a", slug: "gece-siyahi" }}
                edge={getEdgeColorFromOption(activeColor.name)}
                heelPad={true}
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                icon: TruckIcon,
                title: "Kargo avantajı",
                body: `${formatPrice(settings.freeShippingThreshold)} üzeri ücretsiz kargo`,
              },
              {
                icon: ShieldCheckIcon,
                title: "Araca özel kalıp",
                body: "Marka, model, yıl ve kasa bilgisine göre üretim",
              },
              {
                icon: CreditCardIcon,
                title: "Güvenli sipariş",
                body: "WhatsApp onayı ve kapıda ödeme seçeneği",
              },
              {
                icon: TimerIcon,
                title: "Şeffaf iade",
                body: "Standart ve özel üretim koşulları açıkça belirtilir",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="mac-glass flex flex-col items-center justify-center rounded-2xl px-4 py-5 text-center"
              >
                <span className="mb-2 text-white">
                  <item.icon className="h-5 w-5 stroke-[1.5]" />
                </span>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">
                  {item.title}
                </h4>
                <p className="mt-1 text-[11px] leading-5 text-white/55">{item.body}</p>
              </div>
            ))}
          </div>
        </div>



        {/* ==========================================================
            SECTION 2: COLOR VISUALIZER & PEDESTAL PREVIEW (Mockup 1)
            ========================================================== */}
        <div id="ozellikler" className="mb-16 grid items-center gap-10 pt-8 lg:grid-cols-[240px_minmax(0,1fr)_88px]">
          <div className="flex flex-col">
            <h2 className="mb-2 font-heading text-2xl font-medium tracking-tight text-white">
              Tarzınıza uygun rengi seçin
            </h2>
            <p className="mb-6 text-sm text-white/50">
              Seçili kenar: <span className="text-white">{activeColor.name}</span>
            </p>

            <div className="mt-1 grid grid-cols-3 gap-4 sm:flex sm:flex-wrap lg:grid lg:grid-cols-2">
              {COLOR_OPTIONS.map((item, idx) => {
                const isActive = idx === selectedColorIdx;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedColorIdx(idx)}
                    className="group flex flex-col items-center gap-2 text-[10px] tracking-wider text-white/50 transition hover:text-white"
                  >
                    <span
                      className={`relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        isActive
                          ? "scale-105 border-white shadow-[0_0_0_4px_rgba(255,255,255,0.08)]"
                          : "border-white/10 group-hover:border-white/30"
                      }`}
                      style={{ backgroundColor: item.hex }}
                    >
                      {isActive && (
                        <CheckIcon
                          className={`h-4 w-4 drop-shadow-md ${item.name === "Bej" ? "text-black" : "text-white"}`}
                        />
                      )}
                    </span>
                    <span className={isActive ? "font-medium text-white" : ""}>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mac-glass relative flex h-[340px] items-center justify-center overflow-hidden rounded-3xl md:h-[420px]">
            <div
              className="absolute inset-0 transition-all duration-700"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${activeColor.glow} 0%, transparent 65%)`,
              }}
            />
            <div className="absolute bottom-8 z-0 flex h-[35px] w-[80%] max-w-[450px] items-center justify-center rounded-[50%] border-t border-white/[0.08] bg-[#121212] shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
              <div className="h-[90%] w-[95%] rounded-[50%] bg-gradient-to-b from-[#1c1c1c] to-black opacity-80" />
            </div>
            <div className="absolute bottom-10 z-0 h-[15px] w-[70%] max-w-[400px] rounded-[50%] bg-white/10 blur-md" />
            <motion.div
              animate={{
                scale: isZoomed ? 1.6 : 1,
                rotate: isRotated ? -8 : 0,
                y: isRotated ? -10 : 0,
              }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              style={{
                transformOrigin: isZoomed ? `${zoomCoords.x}% ${zoomCoords.y}%` : "center center",
              }}
              onClick={() => setIsZoomed(!isZoomed)}
              onMouseMove={handleZoomMouseMove}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsZoomed(!isZoomed);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={isZoomed ? "Önizlemeyi küçült" : "Önizlemeyi büyüt"}
              className={`relative z-10 h-[80%] w-[85%] ${
                isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
            >
              <Image
                src="/media/eva_mat_pedestal.jpg"
                alt="OTO POLİK EVA paspas önizleme"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </motion.div>
          </div>

          <div className="flex justify-center gap-4 lg:flex-col lg:items-center">
            <button
              type="button"
              onClick={() => setIsRotated(!isRotated)}
              className={`mac-glass flex h-[72px] w-[72px] flex-col items-center justify-center gap-2 rounded-2xl text-center transition duration-300 ${
                isRotated ? "border-white/50 text-white" : "text-white/50 hover:border-white/20 hover:text-white"
              }`}
            >
              <Rotate3dIcon className="h-5 w-5" />
              <span className="text-[9px] font-semibold uppercase tracking-wider">3D</span>
            </button>
            <button
              type="button"
              onClick={() => setIsZoomed(!isZoomed)}
              className={`mac-glass flex h-[72px] w-[72px] flex-col items-center justify-center gap-2 rounded-2xl text-center transition duration-300 ${
                isZoomed ? "border-white/50 text-white" : "text-white/50 hover:border-white/20 hover:text-white"
              }`}
            >
              <Maximize2Icon className="h-5 w-5" />
              <span className="text-[9px] font-semibold uppercase tracking-wider">Yakın</span>
            </button>
          </div>
        </div>


        {/* ==========================================================
            SECTION 4: REAL APPLICATION IMAGES (Mockup 1)
            ========================================================== */}
        <div className="mb-4 border-t border-white/[0.04] pt-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-medium tracking-tight text-white">
                Gerçek müşteri uygulamaları
              </h2>
              <p className="mt-2 text-sm text-white/50">Araç içi montajlardan seçilmiş kareler.</p>
            </div>
            <Link
              href="/galeri"
              className="btn-press btn-ghost-rich hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white transition hover:text-white sm:inline-flex"
            >
              Tüm galeri <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid auto-cols-[85%] grid-flow-col gap-4 overflow-x-auto pb-4 scrollbar-none sm:auto-cols-[45%] lg:grid-cols-5 lg:auto-cols-auto lg:overflow-visible">
            {REAL_APPLICATIONS.map((item) => (
              <figure
                key={item.src}
                className="group relative h-[260px] overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0a]"
              >
                <Image
                  src={item.src}
                  alt={`${item.label} — EVA paspas uygulama fotoğrafı`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 80vw, 250px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                <figcaption className="absolute bottom-0 left-0 p-4 text-[11px] font-medium tracking-wide text-white/70">
                  {item.label}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/galeri"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-white"
            >
              Daha fazla görsel <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
