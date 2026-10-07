import { ActiveDriverMarker, OfficialShelter } from "../types";

export const SEED_SHELTERS: OfficialShelter[] = [
  {
    id: "sh-01",
    nama: "Basecamp Utama DRG Suhat",
    alamat: "Jl. Soekarno Hatta No. 45 (Samping Masjid Jami)",
    lat: -7.9485,
    lng: 112.6175,
    korlap_nama: "Pengurus Posko",
    korlap_phone: "081234567890",
    kapasitas: 40,
    fasilitas: ["Stop Kontak", "Kopi & Air Minum", "Kompresor Ban", "Wi-Fi Gratis", "Kotak P3K"],
  },
  {
    id: "sh-02",
    nama: "Pos Pantau Dinoyo Barat",
    alamat: "Jl. MT Haryono No. 120 (Depan Ruko Dinoyo)",
    lat: -7.9395,
    lng: 112.6078,
    korlap_nama: "Pengurus Posko",
    korlap_phone: "081987654321",
    kapasitas: 25,
    fasilitas: ["Alat Tambal Ban", "Air Minum", "Tempat Istirahat"],
  },
  {
    id: "sh-03",
    nama: "Shelter Stasiun Kota Baru",
    alamat: "Jl. Trunojoyo No. 10 (Area Parkir Timur)",
    lat: -7.9775,
    lng: 112.6375,
    korlap_nama: "Pengurus Posko",
    korlap_phone: "081211223344",
    kapasitas: 30,
    fasilitas: ["Parkir Khusus Driver", "Stop Kontak", "Musholla"],
  },
];

export const SEED_DRIVERS: ActiveDriverMarker[] = [];
