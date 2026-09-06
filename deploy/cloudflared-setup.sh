#!/usr/bin/env bash
# ==============================================================================
# Cloudflare Tunnel Setup Helper (Akses Luar Tanpa Buka Port Router / IP Publik)
# ==============================================================================
set -e

if [ "$EUID" -ne 0 ]; then
  echo "Error: Skrip ini wajib dijalankan dengan sudo (sudo ./deploy/cloudflared-setup.sh)"
  exit 1
fi

echo "==> Mengunduh & menginstal cloudflared binary..."
ARCH=$(dpkg --print-architecture)
curl -L --output /tmp/cloudflared.deb "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-${ARCH}.deb"
dpkg -i /tmp/cloudflared.deb
rm /tmp/cloudflared.deb

echo "=========================================================================="
echo "cloudflared BERHASIL DIINSTAL!"
echo ""
echo "Pilihan Menghubungkan ke Internet:"
echo "1. Uji Coba Cepat (Quick Tunnel dengan URL HTTPS acak gratis):"
echo "   cloudflared tunnel --url http://127.0.0.1:3000"
echo ""
echo "2. Domain Sendiri (Permanen via Cloudflare Dashboard Zero Trust):"
echo "   - Buka zero-trust.cloudflare.com -> Networks -> Tunnels -> Create Tunnel"
echo "   - Salin perintah token instalasi yang diberikan Cloudflare, lalu paste di sini."
echo "=========================================================================="
