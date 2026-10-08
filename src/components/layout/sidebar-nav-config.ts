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
  Settings,
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
  { title: "Beranda Pangkalan", url: "/dashboard", icon: LayoutDashboard },
  { title: "SOS & Pantau Jalur", url: "/kejadian", icon: Siren },
  { title: "Radar Dulur & Shelter", url: "/peta", icon: Map },
  { title: "Piket Satgas Basecamp", url: "/piket", icon: CalendarClock },
];

export const administrasiBaseNav: NavItem[] = [
  { title: "Direktori Sedulur", url: "/anggota", icon: Users },
  { title: "Kas Gotong Royong", url: "/kas", icon: Wallet },
  { title: "Notulen Rembug & Kopdar", url: "/notulen", icon: FileText },
  { title: "Inventaris Basecamp", url: "/inventaris", icon: Boxes },
  { title: "Catatan Aktivitas", url: "/activity-log", icon: Activity },
  { title: "Setelan Sistem", url: "/pengaturan", icon: Settings },
];

export const kaderisasiNav: NavItem[] = [
  { title: "Screening Dulur Anyar", url: "/screening", icon: ClipboardList },
  { title: "Tingkat Satu Aspal", url: "/kaderisasi", icon: GraduationCap },
  { title: "Marwah & Etika Jalur", url: "/etik", icon: ShieldAlert },
];

export function getAdminNav(isAdmin: boolean): NavItem[] {
  if (!isAdmin) return administrasiBaseNav;
  return [
    ...administrasiBaseNav.filter((n) => n.url !== "/pengaturan"),
    { title: "Persetujuan Dulur", url: "/persetujuan", icon: UserCheck },
    { title: "Amanah Pengurus", url: "/roles", icon: ShieldCheck },
    { title: "Setelan Sistem", url: "/pengaturan", icon: Settings },
  ];
}
