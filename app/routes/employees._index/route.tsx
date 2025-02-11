import { Link, useLoaderData } from "react-router";
import { Button } from "~/components/Button";
import { getDB } from "~/db/getDB";

export async function loader() {
  const db = await getDB();
  const employees = await db.all("SELECT * FROM employees LIMIT 5;");
  const totalEmployees = await db.get(
    "SELECT COUNT(*) as total FROM employees;"
  ); // Fetch total count
  return { employees, totalEmployees: totalEmployees.total };
}

export default function EmployeesPage() {
  const { employees, totalEmployees } = useLoaderData();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Employees</h1>

      {/* Employee List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-[#f2f2f2]">
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Full Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Job Title</th>
              <th className="py-2 px-4 border">Department</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee: any) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{employee.id}</td>
                <td className="py-2 px-4 border">{employee.full_name}</td>
                <td className="py-2 px-4 border">{employee.email}</td>
                <td className="py-2 px-4 border">{employee.job_title}</td>
                <td className="py-2 px-4 border">{employee.department}</td>
                <td className="py-2 px-4 border">
                  <Link
                    to={`/employees/${employee.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalEmployees > 5 && (
        <div className="mt-3 text-[#395B56]">
          Showing 5 of {totalEmployees} employees.{" "}
          <Link to="/employees/all" className="text-blue-500 hover:underline">
            View all
          </Link>
        </div>
      )}
      <div className="flex gap-5 px-10 mt-5 justify-center">
        <Button  linkTo="/employees/new">New Employee</Button>
        <Button linkTo="/timesheets/">Timesheets</Button>
      </div>
    </div>
  );
}
