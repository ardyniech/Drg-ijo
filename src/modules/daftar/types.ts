export interface ScreeningQuestion {
  id: string;
  urutan: number;
  pertanyaan: string;
  tipe: string;
  opsi: { label: string }[] | null;
}

export interface DaftarFormState {
  nama: string;
  no_hp: string;
  email: string;
  alamat: string;
  kota: string;
  motivasi: string;
}

export interface DaftarDoneState {
  token: string;
  email: string;
}
