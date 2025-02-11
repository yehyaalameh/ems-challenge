import { useLoaderData, Link } from "react-router";
import { Button } from "~/components/Button";
import { getDB } from "~/db/getDB";

export async function loader({ params }: { params: { employeeId: string } }) {
  const db = await getDB();
  const employee = await db.get(`SELECT * FROM employees WHERE id = ?`, [
    params.employeeId,
  ]);

  if (!employee) {
    throw new Response("Employee not found", { status: 404 });
  }

  return { employee };
}

export default function EmployeePage() {
  const { employee } = useLoaderData(); // Destructure employee from the loader data

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Employee Details</h1>

      {/* Employee Details */}
      <div className="mb-5 p-4 border rounded bg-[#f2f2f2]">
        <ul className="space-y-2">
          {/* Personal Details */}
          <li>
            <strong>ID:</strong> {employee.id}
          </li>
          <li>
            <strong>Full Name:</strong> {employee.full_name}
          </li>
          <li>
            <strong>Email:</strong> {employee.email}
          </li>
          <li>
            <strong>Phone Number:</strong> {employee.phone_number || "N/A"}
          </li>
          <li>
            <strong>Date of Birth:</strong>{" "}
            {employee.date_of_birth
              ? new Date(employee.date_of_birth).toLocaleDateString()
              : "N/A"}
          </li>
          <li>
            <strong>Photo:</strong>{" "}
            {employee.photo_path ? (
              <img
                src={employee.photo_path}
                alt="Employee Photo"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              "N/A"
            )}
          </li>

          {/* Professional Details */}
          <li>
            <strong>Job Title:</strong> {employee.job_title}
          </li>
          <li>
            <strong>Department:</strong> {employee.department}
          </li>
          <li>
            <strong>Salary:</strong> $
            {employee.salary?.toLocaleString() || "N/A"}
          </li>
          <li>
            <strong>Start Date:</strong>{" "}
            {new Date(employee.start_date).toLocaleDateString()}
          </li>
          <li>
            <strong>End Date:</strong>{" "}
            {employee.end_date
              ? new Date(employee.end_date).toLocaleDateString()
              : "N/A"}
          </li>
          <li>
            <strong>CV:</strong>{" "}
            {employee.cv_path ? (
              <a
                href={employee.cv_path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#005e9c] hover:underline"
              >
                Download CV
              </a>
            ) : (
              "N/A"
            )}
          </li>
        </ul>
      </div>
      <div className="flex gap-5 px-10 mt-5 justify-center">
        <Button linkTo="/employees">Employees</Button>
        <Button linkTo="/employees/new">Create a New Timesheet</Button>
        <Button linkTo="/timesheets">Timesheets</Button>
      </div>
    </div>
  );
}
