#!/usr/bin/env bash
# ==============================================================================
# Sony Vaio Ubuntu Server Auto-Maintenance & Disk Cleanup Cron
# Run weekly via cron: 0 3 * * 0 /var/www/drg-app/deploy/vaio-maintenance.sh
# ==============================================================================
set -e

echo "==> [1/4] Membersihkan systemd journal log lebih dari 7 hari..."
journalctl --vacuum-time=7d > /dev/null 2>&1 || true

echo "==> [2/4] Membersihkan apt cache & paket usang..."
apt-get clean > /dev/null 2>&1 || true
apt-get autoremove -y -qq > /dev/null 2>&1 || true

echo "==> [3/4] Membersihkan npm cache & build artifacts lama..."
rm -rf /var/www/drg-app/.output/server/_ssr/*.map 2>/dev/null || true
npm cache clean --force > /dev/null 2>&1 || true

echo "==> [4/4] Menjalankan fstrim untuk kesehatan storage..."
fstrim -av > /dev/null 2>&1 || true

echo "Maintenance Sony Vaio selesai. Penyimpanan dan RAM tetap bersih."
