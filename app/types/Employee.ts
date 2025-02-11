export interface Employee {
  // Personal
  full_name: string;
  email: string;
  phone_number: string;
  date_of_birth: Date;
  photo: string;
  cv: string;

  // Professional
  job_title: string;
  department: string;
  salary: number;
  start_date: string;
  end_date: string;
}
