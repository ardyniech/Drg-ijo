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
        alamat: u.alamat || "",
        email: u.email,
      })),
      error: null,
    };
  }
  if (fn === "submit_screening_application") {
    const token = generatePrefixedId("token");
    const cleanName = String(args?._nama ?? "").trim() || "-";
    if (args) {
      const appId = generatePrefixedId("scr");
      saveScreeningApplication({
        id: appId,
        nama: cleanName,
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
        nama: cleanName,
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
          if (path.startsWith("blob:") || path.startsWith("http")) {
            return { data: { signedUrl: path }, error: null };
          }
          return { data: null, error: { message: "preview tidak tersedia untuk berkas lokal" } };
        },
      };
    },
  };
}
