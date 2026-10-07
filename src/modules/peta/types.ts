export interface ActiveDriverMarker {
  id: string;
  nama: string;
  pangkalan: string;
  lat: number;
  lng: number;
  status: "on_bit" | "standby" | "off_bit";
  distance_km: number;
  updated_at: string;
}

export interface OfficialShelter {
  id: string;
  nama: string;
  alamat: string;
  lat: number;
  lng: number;
  korlap_nama: string;
  korlap_phone: string;
  kapasitas: number;
  fasilitas: string[];
}
