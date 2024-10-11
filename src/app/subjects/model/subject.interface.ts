import { Professor } from "../../professors/model/professor.interface";

export interface Subject {
  id?: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  startDate: string;
  professor?: Professor;
}
