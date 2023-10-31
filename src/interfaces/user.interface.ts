export interface UserAttribute {
  id?: number;
  userId: string;
  fullName: string;
  userName: string;
  password: string;
  email: string;
  image?: string;
  cloudId?: string;
  coverPhoto?: string;
  phoneNumber: string;
  token?: string;
  verifyCode: string;
  isVerified?: boolean;
  updatedAt?: Date;
  createdAt?: Date;
}
