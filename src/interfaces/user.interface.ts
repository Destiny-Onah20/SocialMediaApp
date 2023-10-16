export interface UserAttribute {
  id: string;
  fullName: string;
  userName: string;
  password: string;
  email: string;
  image: string;
  phoneNumber: string;
  token: string;
  verifyCode: number;
  isVerified: boolean;
  updatedAt: Date;
  createdAt: Date;
}
