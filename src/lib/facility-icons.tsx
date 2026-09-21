import {
  FaBook,
  FaDesktop,
  FaFlask,
  FaFutbol,
  FaUsers,
  FaMosque,
  FaUtensils,
  FaWifi,
  FaBuilding,
} from "react-icons/fa"
import type { IconType } from "react-icons/lib"

export const FACILITY_ICONS: Record<string, IconType> = {
  FaBook: FaBook,
  FaDesktop: FaDesktop,
  FaFlask: FaFlask,
  FaFutbol: FaFutbol,
  FaUsers: FaUsers,
  FaMosque: FaMosque,
  FaUtensils: FaUtensils,
  FaWifi: FaWifi,
  FaBuilding: FaBuilding,
}

export function getFacilityIcon(key: string): IconType {
  return FACILITY_ICONS[key] ?? FaBuilding
}

export function FacilityIcon({
  icon,
  size = 22,
  className,
}: {
  icon: string
  size?: number
  className?: string
}) {
  const Icon = getFacilityIcon(icon)
  return <Icon size={size} className={className} aria-hidden />
}
