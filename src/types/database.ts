export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole = "KORSEC" | "SCC_ADMIN";
export type ContactPersonJenis = "OPERATIONAL_COMMANDER" | "SCC" | "ESS";
export type ActivityJenis = "GIAT_MASYARAKAT" | "UNRAS";
export type TingkatPerhatian = "RENDAH" | "SEDANG" | "TINGGI" | "KRITIS";

export type Profile = {
  id: string;
  full_name: string;
  role: AppRole;
  created_at: string;
  updated_at: string;
};

export type MasterWilayah = {
  id: string;
  nama_wilayah: string;
  keterangan: string | null;
  active: boolean;
  created_at: string;
  created_by: string | null;
};

export type MasterGedung = {
  id: string;
  wilayah_id: string;
  nama_gedung: string;
  alamat: string | null;
  active: boolean;
  created_at: string;
  created_by: string | null;
};

export type MasterShift = {
  id: string;
  nama_shift: string;
  jam_mulai: string;
  jam_selesai: string;
  active: boolean;
  created_at: string;
  created_by: string | null;
};

export type MasterKorsec = {
  id: string;
  nama_korsec: string;
  no_hp: string | null;
  active: boolean;
  created_at: string;
  created_by: string | null;
};

export type MasterPambiOrganik = {
  id: string;
  nama: string;
  nip: string | null;
  jabatan: string | null;
  photo_url: string | null;
  active: boolean;
  created_at: string;
  created_by: string | null;
};

export type MasterContactPerson = {
  id: string;
  nama: string;
  jenis: ContactPersonJenis;
  jabatan: string | null;
  no_hp: string | null;
  foto_url: string | null;
  active: boolean;
  created_at: string;
  created_by: string | null;
};

export type DailyContactAssignment = {
  id: string;
  tanggal: string;
  jenis: ContactPersonJenis;
  contact_person_id: string;
  created_at: string;
  created_by: string | null;
};

export type DailyPersonnelReport = {
  id: string;
  tanggal: string;
  wilayah_id: string;
  gedung_id: string;
  shift_id: string;
  korsec_id: string;
  jumlah_personil: number;
  created_by: string;
  created_at: string;
};

export type ActivityReport = {
  id: string;
  jenis: ActivityJenis;
  tanggal: string;
  waktu_mulai: string;
  waktu_selesai: string;
  wilayah_id: string | null;
  gedung_id: string | null;
  lokasi_text: string;
  nama_kegiatan: string | null;
  jumlah_peserta: number;
  pihak_terlibat: string;
  tingkat_perhatian: TingkatPerhatian;
  uraian: string;
  created_by: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          full_name: string;
          role?: AppRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Profile>;
        Relationships: [];
      };
      master_wilayah: {
        Row: MasterWilayah;
        Insert: Omit<MasterWilayah, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<MasterWilayah>;
        Relationships: [];
      };
      master_gedung: {
        Row: MasterGedung;
        Insert: Omit<MasterGedung, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<MasterGedung>;
        Relationships: [];
      };
      master_shift: {
        Row: MasterShift;
        Insert: Omit<MasterShift, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<MasterShift>;
        Relationships: [];
      };
      master_korsec: {
        Row: MasterKorsec;
        Insert: Omit<MasterKorsec, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<MasterKorsec>;
        Relationships: [];
      };
      master_pambi_organik: {
        Row: MasterPambiOrganik;
        Insert: Omit<MasterPambiOrganik, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<MasterPambiOrganik>;
        Relationships: [];
      };
      master_contact_person: {
        Row: MasterContactPerson;
        Insert: Omit<MasterContactPerson, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<MasterContactPerson>;
        Relationships: [];
      };
      daily_contact_assignment: {
        Row: DailyContactAssignment;
        Insert: Omit<DailyContactAssignment, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<DailyContactAssignment>;
        Relationships: [];
      };
      daily_personnel_reports: {
        Row: DailyPersonnelReport;
        Insert: Omit<DailyPersonnelReport, "id" | "created_at" | "created_by"> & {
          id?: string;
          created_at?: string;
          created_by?: string;
        };
        Update: Partial<DailyPersonnelReport>;
        Relationships: [];
      };
      activity_reports: {
        Row: ActivityReport;
        Insert: Omit<ActivityReport, "id" | "created_at" | "created_by"> & {
          id?: string;
          created_at?: string;
          created_by?: string;
        };
        Update: Partial<ActivityReport>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_scc_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      app_role: AppRole;
      contact_person_jenis: ContactPersonJenis;
      activity_jenis: ActivityJenis;
      tingkat_perhatian: TingkatPerhatian;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type AuthUserContext = {
  id: string;
  email: string | undefined;
  fullName: string;
  role: AppRole;
};

export const TINGKAT_PERHATIAN_LABEL: Record<TingkatPerhatian, string> = {
  RENDAH: "Rendah",
  SEDANG: "Sedang",
  TINGGI: "Tinggi",
  KRITIS: "Kritis",
};

export const CONTACT_JENIS_LABEL: Record<ContactPersonJenis, string> = {
  OPERATIONAL_COMMANDER: "Operational Commander",
  SCC: "SCC",
  ESS: "ESS / Penyelamatan",
};

export const ACTIVITY_JENIS_LABEL: Record<ActivityJenis, string> = {
  GIAT_MASYARAKAT: "Giat Masyarakat",
  UNRAS: "Unjuk Rasa",
};

