export interface ClientType {
  _id: string;
  name: string;
  lastname: string;
  phone: string;
  email: string;
  whatsappNumberLink: string;
  IsRegistered: boolean;
  CurrentReports: any[];
  createdOn: string;
  hasAccount: boolean;
  __v?: number;
}
