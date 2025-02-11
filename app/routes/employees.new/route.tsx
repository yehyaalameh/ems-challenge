import { Form, redirect, type ActionFunction } from "react-router";
import { Button } from "~/components/Button";
import { getDB } from "~/db/getDB";

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

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const full_name = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const phone_number = formData.get("phone_number") as string;
  const date_of_birth = new Date(formData.get("date_of_birth") as string);
  const job_title = formData.get("job_title") as string;
  const department = formData.get("department") as string;
  const salary = parseFloat(formData.get("salary") as string);
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;

  const photo = formData.get("photo") as File;
  const cv = formData.get("cv") as File;

  const saveFile = async (file: File) => {
    if (file) {
      const filePath = `/uploads/${file.name}`;
      return filePath;
    }
    return null;
  };

  const photoPath = await saveFile(photo);
  const cvPath = await saveFile(cv);

  const today = new Date();
  const age = today.getFullYear() - date_of_birth.getFullYear();
  if (age < 18) {
    throw new Error("Employee must be at least 18 years old.");
  }

  const minimumWage = 1000; 
  if (salary < minimumWage) {
    throw new Error(`Salary must be at least $${minimumWage}.`);
  }


  const db = await getDB();
  await db.run(
    "INSERT INTO employees (full_name, email, phone_number, date_of_birth, photo, cv, id_document, job_title, department, salary, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      full_name,
      email,
      phone_number,
      date_of_birth.toISOString(),
      photoPath,
      cvPath,
      job_title,
      department,
      salary,
      start_date,
      end_date,
    ]
  );

  return redirect("/employees");
};

export default function NewEmployeePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Create New Employee</h1>
      <Form
        method="post"
        encType="multipart/form-data"
        className="grid border bg-[#f2f2f2] p-5 mb-5 rounded grid-cols-2 gap-5"
      >
        {/* Personal Data */}
        <div className="col-span-2 px-5 flex justify-end">
          <button
            type="submit"
            className="text-white px-5 rounded cursor-pointer bg-[#005e9c] py-3"
          >
            Create Employee
          </button>
        </div>
        <div className="col-span-2">
          <h3 className="font-bold text-xl">Personal Data Section</h3>
        </div>
        <div className="flex flex-col gap-2">
          <label className="flex" htmlFor="full_name">
            Full Name<p className="text-red-600">*</p>
          </label>
          <input
            type="text"
            className="border rounded p-2 bg-white"
            name="full_name"
            id="full_name"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="flex" htmlFor="email">
            Email<p className="text-red-600">*</p>
          </label>
          <input
            type="email"
            className="border rounded p-2 bg-white"
            name="email"
            id="email"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="flex" htmlFor="phone_number">
            Phone Number
          </label>
          <input
            type="text"
            className="border rounded p-2 bg-white"
            name="phone_number"
            id="phone_number"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="flex" htmlFor="date_of_birth flex">
            <p>Date of Birth</p>
            <p className="text-red-600">*</p>
          </label>
          <input
            type="date"
            className="border rounded p-2 bg-white"
            name="date_of_birth"
            id="date_of_birth"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="flex" htmlFor="photo">
            Employee Photo<p className="text-red-600">*</p>
          </label>
          <input
            type="file"
            className="border rounded p-2 bg-white"
            name="photo"
            id="photo"
            accept="image/*"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="flex" htmlFor="cv">
            CV (PDF)<p className="text-red-600">*</p>
          </label>
          <input
            type="file"
            className="border rounded p-2 bg-white"
            name="cv"
            id="cv"
            accept=".pdf"
            required
          />
        </div>

        {/* Professional Data */}
        <div className="col-span-2">
          <h3 className="font-bold text-xl">Professional Data Section</h3>
        </div>
        <div className="flex flex-col gap-2">
          <label className="flex" htmlFor="job_title">
            Job Title<p className="text-red-600">*</p>
          </label>
          <input
            className="border rounded p-2 bg-white"
            type="text"
            name="job_title"
            id="job_title"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="flex" htmlFor="department">
            Department<p className="text-red-600">*</p>
          </label>
          <input
            type="text"
            className="border rounded p-2 bg-white"
            name="department"
            id="department"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="flex" htmlFor="salary">
            Salary<p className="text-red-600">*</p>
          </label>
          <input
            type="number"
            className="border rounded p-2 bg-white"
            name="salary"
            id="salary"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="flex" htmlFor="start_date">
            Start Date<p className="text-red-600">*</p>
          </label>
          <input
            type="date"
            className="border rounded p-2 bg-white"
            name="start_date"
            id="start_date"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="flex" htmlFor="end_date">
            End Date
          </label>
          <input
            type="date"
            className="border rounded p-2 bg-white"
            name="end_date"
            id="end_date"
          />
        </div>
      </Form>
      <div className="flex px-10 justify-center gap-10">
        <div>
          <Button linkTo="/employees">Employee</Button>
        </div>
        <div>
          <Button linkTo="/timesheets">Timesheets</Button>
        </div>
      </div>
    </div>
  );
}
