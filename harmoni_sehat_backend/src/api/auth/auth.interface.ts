import { Types } from 'mongoose';

export interface ICreateUserInput {
  email: string;
  password?: string;
  role: string;
  name?: string;
  nik?: string;
  tanggal_lahir?: Date;
  jenis_kelamin?: 'Laki-laki' | 'Perempuan';
  alamat?: string;
  no_telepon?: string;
  nomor_str?: string;
  spesialisasi_id?: Types.ObjectId;
  biaya_konsultasi?: number;
  foto?: string;
  bio?: string;
  nomor_sipa?: string;
}
