import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Memeriksa apakah string merupakan hash bcrypt valid ($2a$, $2b$, $2y$)
 */
export function isBcryptHash(str: string): boolean {
  if (!str || typeof str !== "string") return false;
  return /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(str);
}

/**
 * Menghasilkan hash bcrypt dari kata sandi plain-text
 */
export async function hashPassword(plainText: string): Promise<string> {
  if (!plainText) throw new Error("Kata sandi tidak boleh kosong.");
  return bcrypt.hash(plainText, SALT_ROUNDS);
}

/**
 * Hash sinkron untuk inisialisasi dev/seed data
 */
export function hashPasswordSync(plainText: string): string {
  return bcrypt.hashSync(plainText, SALT_ROUNDS);
}

/**
 * Memvalidasi kata sandi plain-text terhadap hash atau backward-compatibility plain string
 */
export async function verifyPassword(
  plainText: string,
  storedHashOrPlain: string,
): Promise<{ isValid: boolean; needsRehash: boolean }> {
  if (!plainText || !storedHashOrPlain) {
    return { isValid: false, needsRehash: false };
  }

  if (isBcryptHash(storedHashOrPlain)) {
    const isValid = await bcrypt.compare(plainText, storedHashOrPlain);
    return { isValid, needsRehash: false };
  }

  // Fallback transisi untuk legacy plaintext: validasi kesamaan lalu tandai rehash
  const isValid = plainText === storedHashOrPlain;
  return { isValid, needsRehash: isValid };
}
