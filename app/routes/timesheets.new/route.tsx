import { useLoaderData, Form, redirect } from "react-router";
import { getDB } from "~/db/getDB";

export async function loader() {
  const db = await getDB();
  const employees = await db.all("SELECT id, full_name FROM employees");
  return { employees };
}

import type { ActionFunction } from "react-router";
import { Button } from "~/components/Button";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id");
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");
  const summary = formData.get("summary");


  const db = await getDB();
  await db.run(
    "INSERT INTO timesheets (employee_id, start_time, end_time, summary) VALUES (?, ?, ?, ?)",
    [employee_id, start_time, end_time, summary]
  );

  return redirect("/timesheets");
};

export default function NewTimesheetPage() {
  const { employees } = useLoaderData(); // Used to create a select input
  return (
    <div>
      <h1 className="text-2xl font-bold">Create New Timesheet</h1>
      <Form
        method="post"
        className="space-y-4 border mb-5 border-[#f2f2f2] p-5 rounded"
      >
        <div className="flex justify-end w-full">
          <button
            type="submit"
            className="bg-[#005e9c] hover:border-[#005e9c] border border-[#005e9c] cursor-pointer text-white px-4 py-2 transition-all rounded hover:bg-white hover:text-[#005e9c]"
          >
            Create Timesheet
          </button>
        </div>
        <div>
          <label htmlFor="employee_id" className="block font-medium">
            Employee <span className="text-red-600">*</span>
          </label>
          <select
            name="employee_id"
            id="employee_id"
            className="border bg-white rounded px-3 py-2 w-full"
            required
          >
            <option value="">Select an employee</option>
            {employees.map((employee: any) => (
              <option key={employee.id} value={employee.id}>
                {employee.full_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="start_time" className="block font-medium">
            Start Time <span className="text-red-600">*</span>
          </label>
          <input
            type="datetime-local"
            name="start_time"
            id="start_time"
            className="border bg-white rounded px-3 py-2 w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="end_time" className="block font-medium">
            End Time <span className="text-red-600">*</span>
          </label>
          <input
            type="datetime-local"
            name="end_time"
            id="end_time"
            className="border bg-white rounded px-3 py-2 w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="summary" className="block font-medium">
            Summary
          </label>
          <textarea
            name="summary"
            id="summary"
            className="border bg-white rounded px-3 py-2 w-full"
            rows={4}
          />
        </div>
      </Form>

      <div className="flex gap-5 px-10 mt-5 justify-center">
        <Button linkTo="/timesheets">Timesheets</Button>
        <Button linkTo="/employees">Employees</Button>
      </div>
    </div>
  );
}
