import type { LucideIcon } from "lucide-react";
import {
  Building2,
  FileText,
  AlertTriangle,
  Vote,
  Calculator,
  Shield,
  Users,
  Scale,
  Briefcase,
  Home,
  Droplets,
  FileSearch,
  Landmark,
  Gavel,
  FileWarning,
  MapPin,
} from "lucide-react";

export const PRACTICE_AREA_ICONS: Record<string, LucideIcon> = {
  Building2,
  FileText,
  AlertTriangle,
  Vote,
  Calculator,
  Shield,
  Users,
  Scale,
  Briefcase,
  Home,
  Droplets,
  FileSearch,
};

export const HERO_INDICATOR_ICONS: LucideIcon[] = [
  Landmark,
  Scale,
  FileWarning,
  Gavel,
  MapPin,
];

export function getPracticeIcon(name: string): LucideIcon {
  return PRACTICE_AREA_ICONS[name] ?? Building2;
}
