import { Document, Model } from 'mongoose';

declare global {
  namespace Express {
    interface User extends Document {
      _id: string;
      email: string;
      nama_lengkap: string;
      role: string;
      is_verified: boolean;
      googleId?: string;
      password?: string;
      no_hp?: string;
      no_hp_hash?: string;
      customUserId?: string;
      verificationCode?: string;
      verificationCodeExpires?: Date;
      otpAttempts?: number;
      otpLockUntil?: Date;
      resetOtp?: string;
      resetOtpExpires?: Date;
      refreshTokens: string[];
      is_active: boolean;
      createdAt: Date;
      updatedAt: Date;
    }
  }
}

export interface IUser extends Document {
  email: string;
  nama_lengkap: string;
  role: string;
  is_verified: boolean;
  googleId?: string;
  password?: string;
  no_hp?: string;
  no_hp_hash?: string;
  customUserId?: string;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  otpAttempts?: number;
  otpLockUntil?: Date;
  resetOtp?: string;
  resetOtpExpires?: Date;
  refreshTokens: string[];
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends Model<IUser> {}

export interface IPasien extends Document {
  user_id: mongoose.Types.ObjectId;
  nik: string;
  tanggal_lahir: Date;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  alamat: string;
}

export interface IPasienModel extends Model<IPasien> {}

export interface IDokter extends Document {
  user_id: mongoose.Types.ObjectId;
  spesialisasi: string;
  noIzinPraktik: string;
  alamatKlinik: string;
}

export interface IDokterModel extends Model<IDokter> {}

export interface IApoteker extends Document {
  user_id: mongoose.Types.ObjectId;
  noSTRA: string;
  alamatApotek: string;
}

export interface IApotekerModel extends Model<IApoteker> {}

export interface IActivityLog extends Document {
  user_id?: mongoose.Types.ObjectId;
  action: string;
  timestamp: Date;
  details?: Record<string, any>;
}

export interface IActivityLogModel extends Model<IActivityLog> {}

export interface IAdmin extends Document {
  user_id: mongoose.Types.ObjectId;
}

export interface IAdminModel extends Model<IAdmin> {}

export interface IArtikelKesehatan extends Document {
  judul: string;
  slug: string;
  konten: string;
  penulis_id: mongoose.Types.ObjectId;
  penulis_type: 'Admin' | 'Dokter';
  status_publikasi: 'draft' | 'published' | 'archived';
}

export interface IArtikelKesehatanModel extends Model<IArtikelKesehatan> {}

export interface IChatMessage extends Document {
  konsultasi_id: mongoose.Types.ObjectId;
  pengirim_id: mongoose.Types.ObjectId;
  isi: string;
  tipe: 'text' | 'image' | 'file';
  file_url?: string;
  is_read: boolean;
}

export interface IChatMessageModel extends Model<IChatMessage> {}

export interface IDetailPesananObat extends Document {
  pesanan_id: mongoose.Types.ObjectId;
  obat_id: mongoose.Types.ObjectId;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
}

export interface IDetailPesananObatModel extends Model<IDetailPesananObat> {}

export interface IDokterKlinik extends Document {
  dokter_id: mongoose.Types.ObjectId;
  klinik_id: mongoose.Types.ObjectId;
}

export interface IDokterKlinikModel extends Model<IDokterKlinik> {}

export interface IJadwalPraktik extends Document {
  dokter_id: mongoose.Types.ObjectId;
  klinik_id: mongoose.Types.ObjectId;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
  jam_mulai: string;
  jam_selesai: string;
  is_active: boolean;
}

export interface IJadwalPraktikModel extends Model<IJadwalPraktik> {}

export interface IKeranjangObat extends Document {
  pasien_id: mongoose.Types.ObjectId;
  obat_id: mongoose.Types.ObjectId;
  jumlah: number;
}

export interface IKeranjangObatModel extends Model<IKeranjangObat> {}

export interface IKlinik extends Document {
  nama: string;
  alamat?: string;
  no_telepon?: string;
  email?: string;
  status?: 'active' | 'inactive';
}

export interface IKlinikModel extends Model<IKlinik> {}

export interface IKonsultasi extends Document {
  pasien_id: mongoose.Types.ObjectId;
  dokter_id: mongoose.Types.ObjectId;
  jadwal_id?: mongoose.Types.ObjectId;
  tanggal: Date;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  keluhan?: string;
  diagnosa?: string;
  tindakan?: string;
  catatan_dokter?: string;
  video_call_url?: string;
}

export interface IKonsultasiModel extends Model<IKonsultasi> {}

export interface IMedia extends Document {
  model_type: string;
  model_id: mongoose.Types.ObjectId;
  url: string;
  mime_type?: string;
  size?: number;
}

export interface IMediaModel extends Model<IMedia> {}

export interface IMetodePembayaran extends Document {
  nama: string;
  kode: string;
  deskripsi?: string;
  is_active: boolean;
}

export interface IMetodePembayaranModel extends Model<IMetodePembayaran> {}

export interface INotifikasi extends Document {
  user_id: mongoose.Types.ObjectId;
  judul: string;
  isi: string;
  tipe: 'info' | 'warning' | 'error' | 'success' | 'appointment' | 'order';
  is_read: boolean;
}

export interface INotifikasiModel extends Model<INotifikasi> {}

export interface IObat extends Document {
  nama: string;
  deskripsi?: string;
  kategori?: string;
  stok: number;
  satuan?: string;
  harga: number;
  kode_obat?: string;
  butuh_resep?: boolean;
  tgl_kadaluarsa?: Date;
}

export interface IObatModel extends Model<IObat> {}

export interface IPeran extends Document {
  nama_peran: string;
  deskripsi?: string;
}

export interface IPeranModel extends Model<IPeran> {}

export interface IPeranPengguna extends Document {
  user_id: mongoose.Types.ObjectId;
  peran_id: mongoose.Types.ObjectId;
}

export interface IPeranPenggunaModel extends Model<IPeranPengguna> {}

export interface IPesananObat extends Document {
  pasien_id: mongoose.Types.ObjectId;
  kode_pesanan: string;
  total_harga: number;
  status: 'pending' | 'processed' | 'shipped' | 'delivered' | 'cancelled';
  alamat_pengiriman: string;
}

export interface IPesananObatModel extends Model<IPesananObat> {}

export interface IRefreshToken extends Document {
  user_id: mongoose.Types.ObjectId;
  token: string;
  expired_at: Date;
}

export interface IRefreshTokenModel extends Model<IRefreshToken> {}

export interface IRekamMedis extends Document {
  pasien_id: mongoose.Types.ObjectId;
  riwayat_penyakit?: string[];
  alergi?: string[];
  riwayat_vaksinasi?: string[];
}

export interface IRekamMedisModel extends Model<IRekamMedis> {}

export interface IResep extends Document {
  konsultasi_id: mongoose.Types.ObjectId;
  catatan?: string;
  status: 'pending' | 'issued' | 'filled' | 'cancelled';
  expired_at?: Date;
}

export interface IResepModel extends Model<IResep> {}

export interface IResepObat extends Document {
  resep_id: mongoose.Types.ObjectId;
  obat_id: mongoose.Types.ObjectId;
  dosis?: string;
  jumlah: number;
  aturan_pakai?: string;
}

export interface IResepObatModel extends Model<IResepObat> {}

export interface IReviewDokter extends Document {
  pasien_id: mongoose.Types.ObjectId;
  dokter_id: mongoose.Types.ObjectId;
  konsultasi_id: mongoose.Types.ObjectId;
  rating: number;
  komentar?: string;
}

export interface IReviewDokterModel extends Model<IReviewDokter> {}

export interface ISpesialisasi extends Document {
  nama: string;
  deskripsi?: string;
  is_active: boolean;
}

export interface ISpesialisasiModel extends Model<ISpesialisasi> {}

export interface ITransaksi extends Document {
  user_id: mongoose.Types.ObjectId;
  total_biaya: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  metode_pembayaran_id?: mongoose.Types.ObjectId;
  external_id?: string;
  transaksiable_id: mongoose.Types.ObjectId;
  transaksiable_type: 'Konsultasi' | 'PesananObat';
}

export interface ITransaksiModel extends Model<ITransaksi> {}

export interface IUserProfile extends Document {
  user_id: mongoose.Types.ObjectId;
  nama: string;
  tanggal_lahir?: Date;
  jenis_kelamin?: 'Laki-laki' | 'Perempuan';
  alamat?: string;
  nomor_telepon?: string;
  foto?: string;
  bio?: string;
}

export interface IUserProfileModel extends Model<IUserProfile> {}