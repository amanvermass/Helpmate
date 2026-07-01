import React from "react";
import {
  Brush,
  Wind,
  Zap,
  Droplet,
  Paintbrush,
  Hammer,
  Scissors,
  Flower,
  Tv,
  ShieldAlert,
  Shirt,
  Home,
  Layers,
  Truck,
  Grid
} from "lucide-react";

interface Props {
  name: string;
  className?: string;
}

export default function CategoryIcon({ name, className }: Props) {
  switch (name) {
    case "Brush":
      return <Brush className={className} />;
    case "Wind":
      return <Wind className={className} />;
    case "Zap":
      return <Zap className={className} />;
    case "Droplet":
      return <Droplet className={className} />;
    case "Paintbrush":
      return <Paintbrush className={className} />;
    case "Hammer":
      return <Hammer className={className} />;
    case "Scissors":
      return <Scissors className={className} />;
    case "Flower":
      return <Flower className={className} />;
    case "Tv":
      return <Tv className={className} />;
    case "ShieldAlert":
      return <ShieldAlert className={className} />;
    case "Shirt":
      return <Shirt className={className} />;
    case "Home":
      return <Home className={className} />;
    case "Layers":
      return <Layers className={className} />;
    case "Truck":
      return <Truck className={className} />;
    default:
      return <Grid className={className} />;
  }
}
