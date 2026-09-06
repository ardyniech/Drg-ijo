import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { DEFAULT_USERS } from "@/modules/auth/logic/local-auth-store";

export function createQueryBuilder(table: string) {
  let filterId: string | null = null;
  let inIds: string[] | null = null;

  const builder: any = {
    select: () => builder,
    order: () => builder,
    limit: () => builder,
    range: () => builder,
    eq: (col: string, val: any) => {
      if (col === "id" || col === "user_id" || col === "application_id") filterId = val;
      return builder;
    },
    in: (col: string, vals: any[]) => {
      if (col === "id" || col === "user_id") inIds = vals;
      return builder;
    },
    neq: () => builder,
    gt: () => builder,
    gte: () => builder,
    lt: () => builder,
    lte: () => builder,
    like: () => builder,
    ilike: () => builder,
    is: () => builder,
    or: () => builder,
    not: () => builder,
    match: () => builder,
    filter: () => builder,
    contains: () => builder,
    containedBy: () => builder,
    update: async (patch: any) => ({ data: patch, error: null }),
    insert: async (row: any) => ({ data: row, error: null }),
    upsert: async (row: any) => ({ data: row, error: null }),
    delete: () => builder,
    maybeSingle: async () => {
      const { data } = await builder.execute();
      return { data: Array.isArray(data) ? data[0] ?? null : data, error: null };
    },
    single: async () => {
      const { data } = await builder.execute();
      return { data: Array.isArray(data) ? data[0] ?? null : data, error: null };
    },
    then: (resolve: any) => builder.execute().then(resolve),
    execute: async () => {
      const session = LocalAuthClient.getSession();
      const currentUserId = filterId || session?.user?.id || DEFAULT_USERS[0].id;

      if (table === "profiles") {
        const allProfiles = DEFAULT_USERS.map((u) => ({
          id: u.id,
          nama: u.id === session?.user?.id ? session?.user?.user_metadata?.nama ?? u.nama : u.nama,
          pangkalan: "Pangkalan Utama DRG",
          foto_url: null,
          role: u.role,
          jenjang: u.jenjang,
          status: u.status,
          bio: "Driver Komunitas Riang Gembira.",
          notif_sos: true,
          notif_kas: true,
          notif_pengumuman: true,
          notif_email: false,
          created_at: u.created_at,
        }));
        if (inIds && inIds.length > 0) {
          return { data: allProfiles.filter((p) => inIds!.includes(p.id)), error: null };
        }
        if (filterId) {
          const matched = allProfiles.find((p) => p.id === currentUserId);
          return { data: matched ? [matched] : [], error: null };
        }
        return { data: allProfiles, error: null };
      }

      if (table === "user_roles") {
        const role = session?.user?.user_metadata?.role ?? "admin";
        return { data: [{ role }], error: null };
      }

      if (table === "kas_transactions") {
        return {
          data: [
            {
              id: "kas-01",
              jenis: "masuk",
              jumlah: 750000,
              kategori: "Iuran Anggota",
              deskripsi: "Iuran rutin bulan ini",
              tanggal: new Date().toISOString().split("T")[0],
              status: "disetujui",
              created_at: new Date().toISOString(),
            },
          ],
          error: null,
        };
      }

      if (table === "live_locations" || table === "push_subscriptions" || table === "kejadian" || table === "piket_shifts") {
        return { data: [], error: null };
      }

      if (table === "screening_questions_public") {
        return {
          data: [
            { id: "q1", urutan: 1, pertanyaan: "Berapa lama pengalaman mengemudi Anda?", tipe: "pilihan", opsi: [{ label: "> 3 tahun" }, { label: "1-3 tahun" }, { label: "< 1 tahun" }] },
            { id: "q2", urutan: 2, pertanyaan: "Apakah bersedia ikut piket malam darurat?", tipe: "pilihan", opsi: [{ label: "Sangat Bersedia" }, { label: "Kondisional" }] },
          ],
          error: null,
        };
      }

      return { data: [], error: null };
    },
  };

  return builder;
}
