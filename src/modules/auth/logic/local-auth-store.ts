import { z } from "zod";
import { UserRole } from "@/hooks/use-me";
import { generatePrefixedId } from "@/shared/utils/id-generator";

export const LocalUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  nama: z.string(),
  no_hp: z.string().optional(),
  role: z.string() as z.ZodType<UserRole>,
  jenjang: z.enum(["calon", "muda", "madya", "purna"]),
  status: z.enum(["aktif", "nonaktif", "cuti", "pending_review"]),
  passwordHash: z.string(),
  created_at: z.string(),
});

export const LocalSessionSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  expires_at: z.number(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    user_metadata: z.object({
      nama: z.string(),
      full_name: z.string(),
      role: z.string(),
    }),
  }),
});

export type LocalUser = z.infer<typeof LocalUserSchema>;
export type LocalSession = z.infer<typeof LocalSessionSchema>;

export function createLocalSession(user: LocalUser): LocalSession {
  const token = generatePrefixedId(`loc_tok_${user.id}`);
  return {
    access_token: token,
    token_type: "bearer",
    expires_in: 86400 * 30,
    expires_at: Math.floor(Date.now() / 1000) + 86400 * 30,
    user: {
      id: user.id,
      email: user.email,
      user_metadata: { nama: user.nama, full_name: user.nama, role: user.role },
    },
  };
}
