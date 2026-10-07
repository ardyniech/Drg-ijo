import { UserRole } from "@/hooks/use-me";
import { KetuaDashboardWidget } from "../widgets/ketua-dashboard-widget";
import { SekretarisDashboardWidget } from "../widgets/sekretaris-dashboard-widget";
import { BendaharaDashboardWidget } from "../widgets/bendahara-dashboard-widget";
import { AdminDashboardWidget } from "../widgets/admin-dashboard-widget";
import { KorlapDashboardWidget } from "../widgets/korlap-dashboard-widget";
import { SatgasDashboardWidget } from "../widgets/satgas-dashboard-widget";
import { DewanEtikDashboardWidget } from "../widgets/dewan-etik-dashboard-widget";
import { DriverDashboardWidget } from "../widgets/driver-dashboard-widget";

interface Props {
  role: UserRole;
}

export function DashboardRoleWidgetRenderer({ role }: Props) {
  switch (role) {
    case "ketua":
    case "super_admin":
      return <KetuaDashboardWidget />;
    case "sekretaris":
      return <SekretarisDashboardWidget />;
    case "bendahara":
      return <BendaharaDashboardWidget />;
    case "admin":
      return <AdminDashboardWidget />;
    case "korlap":
      return <KorlapDashboardWidget />;
    case "satgas":
      return <SatgasDashboardWidget />;
    case "dewan_etik":
      return <DewanEtikDashboardWidget />;
    case "anggota":
    case "driver":
    default:
      return <DriverDashboardWidget />;
  }
}
