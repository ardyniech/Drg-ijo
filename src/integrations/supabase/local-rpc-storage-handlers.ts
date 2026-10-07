import { LocalAuthClient } from "@/modules/auth/logic/local-auth-client";
import { computeKasBalances } from "./local-tx-store";
import { addApplicantApproval } from "@/modules/persetujuan/storage/persetujuan-storage";
import { saveScreeningApplication, saveScreeningAnswers } from "./local-screening-store";
import { generatePrefixedId } from "@/shared/utils/id-generator";

export async function handleLocalRpc(fn: string, args?: Record<string, unknown>) {
  if (fn === "kas_balances") return { data: computeKasBalances(), error: null };
  if (fn === "member_contacts") {
    const users = LocalAuthClient.getUsers();
    return {
      data: users.map((u) => ({
        id: u.id,
        nama: u.nama,
        no_hp: u.no_hp || "-",
        alamat: "Malang, Jawa Timur",
        email: u.email,
      })),
      error: null,
    };
  }
  if (fn === "submit_screening_application") {
    const token = generatePrefixedId("token");
    if (args) {
      const appId = generatePrefixedId("scr");
      saveScreeningApplication({
        id: appId,
        nama: String(args._nama || "Calon Driver"),
        no_hp: String(args._no_hp || "-"),
        email: String(args._email || ""),
        alamat: String(args._alamat || ""),
        kota: String(args._kota || ""),
        motivasi: String(args._motivasi || ""),
      });
      if (args._answers && Array.isArray(args._answers)) {
        saveScreeningAnswers(
          appId,
          args._answers as Array<{ question_id: string; jawaban: string }>,
        );
      }
      addApplicantApproval({
        nama: String(args._nama || "Calon Driver"),
        no_hp: String(args._no_hp || "-"),
        email: String(args._email || ""),
        alamat: String(args._alamat || ""),
        kota: String(args._kota || ""),
      });
    }
    return { data: token, error: null };
  }
  return { data: null, error: null };
}

export function createLocalStorageAdapter() {
  return {
    from() {
      return {
        async upload(_path: string, file?: File | Blob) {
          const url = file ? URL.createObjectURL(file) : "avatar.jpg";
          return { data: { path: url }, error: null };
        },
        async createSignedUrl(path: string) {
          const signedUrl =
            path.startsWith("blob:") || path.startsWith("http")
              ? path
              : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";
          return { data: { signedUrl }, error: null };
        },
      };
    },
  };
}
