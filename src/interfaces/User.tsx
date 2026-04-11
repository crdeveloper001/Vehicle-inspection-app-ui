export default interface UserType {
  _id?: String;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  password?: string;
  userType: string;
  IsProfileNew: boolean;
  IsPasswordChanged: boolean;
};
