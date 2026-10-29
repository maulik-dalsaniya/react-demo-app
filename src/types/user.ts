export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  location: string;
  status: "Active" | "Inactive";
}