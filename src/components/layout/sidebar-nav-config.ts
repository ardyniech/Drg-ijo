import {
  LayoutDashboard,
  Users,
  Wallet,
  Siren,
  Map,
  CalendarClock,
  ClipboardList,
  FileText,
  Boxes,
  GraduationCap,
  ShieldAlert,
  UserCheck,
  ShieldCheck,
  Activity,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const operasionalNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "SOS & Kejadian", url: "/kejadian", icon: Siren },
  { title: "Peta & Lokasi", url: "/peta", icon: Map },
  { title: "Piket Satgas", url: "/piket", icon: CalendarClock },
];

export const administrasiBaseNav: NavItem[] = [
  { title: "Data Anggota", url: "/anggota", icon: Users },
  { title: "Kas & Keuangan", url: "/kas", icon: Wallet },
  { title: "Notulen Rapat", url: "/notulen", icon: FileText },
  { title: "Inventaris", url: "/inventaris", icon: Boxes },
  { title: "Log Aktivitas", url: "/activity-log", icon: Activity },
];

export const kaderisasiNav: NavItem[] = [
  { title: "Screening Calon", url: "/screening", icon: ClipboardList },
  { title: "Evaluasi Jenjang", url: "/kaderisasi", icon: GraduationCap },
  { title: "Dewan Etik", url: "/etik", icon: ShieldAlert },
];

export function getAdminNav(isAdmin: boolean): NavItem[] {
  if (!isAdmin) return administrasiBaseNav;
  return [
    ...administrasiBaseNav,
    { title: "Persetujuan Akun", url: "/persetujuan", icon: UserCheck },
    { title: "Manajemen Peran", url: "/roles", icon: ShieldCheck },
  ];
}
