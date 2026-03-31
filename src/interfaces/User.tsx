export default interface UserType {
  _id?: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  password?: string;
  userType: string;
};
