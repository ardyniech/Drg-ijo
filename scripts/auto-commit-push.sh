#!/usr/bin/env bash
set -e

# DRG App Auto-Commit & Push Script (SOP v4.0 compliant)
# Digunakan untuk commit otomatis lokal & push ke GitHub remote

COMMIT_MSG="${1:-chore(sync): update drg-app development progress}"
REMOTE_BRANCH="${2:-main}"

echo "🚗 [DRG Git Auto-Sync] Memeriksa status repositori..."

# Pastikan identitas git sudah terpasang
git config user.name "ardyniech"
git config user.email "54908304+ardyniech@users.noreply.github.com"

# Perbarui log dan roadmap otomatis dari kode sumber terkini
echo "🔄 Memperbarui development log & roadmap progress otomatis..."
node scripts/gen-development-log.mjs || true
node scripts/gen-roadmap-progress.mjs || true
node scripts/gen-feature-tree.mjs || true
node scripts/gen-live-feature-status.mjs || true

# Periksa apakah ada perubahan
if [ -z "$(git status --porcelain)" ]; then
  echo "✅ Repositori bersih, tidak ada perubahan yang perlu di-commit."
else
  echo "📦 Menambahkan perubahan ke staging..."
  git add -A
  
  echo "📝 Melakukan git commit..."
  git commit -m "$COMMIT_MSG"
  echo "✅ Berhasil commit: $(git log -1 --oneline)"
fi

# Cek opsi push ke remote
TOKEN="${GITHUB_TOKEN:-${GH_TOKEN}}"

if [ -n "$TOKEN" ]; then
  echo "🚀 Melakukan push otomatis ke GitHub (menggunakan kredensial aman)..."
  if git push "https://${TOKEN}@github.com/ardyniech/Drg-ijo.git" "$REMOTE_BRANCH"; then
    echo "✅ Berhasil push ke GitHub main!"
  else
    echo "⚠️ Push ke remote gagal (kredensial token GitHub tidak memiliki izin tulis atau kadaluarsa 403)."
    echo "   Commit lokal tersimpan aman."
  fi
else
  echo "ℹ️ Catatan Push: GitHub memerlukan Personal Access Token (PAT) untuk push."
  echo "   Untuk auto-push, sediakan GITHUB_TOKEN atau jalankan:"
  echo "   git push https://<TOKEN>@github.com/ardyniech/Drg-ijo.git $REMOTE_BRANCH"
fi
