import { useLoaderData, useParams, Link } from "react-router";
import { Button } from "~/components/Button";
import { getDB } from "~/db/getDB";

export async function loader({ params }: { params: { timesheetId: string } }) {
  const db = await getDB();
  const timesheet = await db.get(
    `SELECT timesheets.*, employees.full_name 
     FROM timesheets 
     JOIN employees ON timesheets.employee_id = employees.id 
     WHERE timesheets.id = ?`,
    [params.timesheetId]
  );

  if (!timesheet) {
    throw new Response("Timesheet not found", { status: 404 });
  }

  return { timesheet };
}

export default function TimesheetPage() {
  const { timesheet } = useLoaderData(); // Destructure timesheet from the loader data

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Timesheet #{timesheet.id}</h1>

      {/* Timesheet Details */}
      <div className="mb-5 p-4 border rounded bg-gray-50">
        <ul>
          <li className="font-bold mb-2">Timesheet #{timesheet.id}</li>
          <ul className="ml-4 space-y-2">
            <li>
              <strong>Employee:</strong> {timesheet.full_name} (ID:{" "}
              {timesheet.employee_id})
            </li>
            <li>
              <strong>Start Time:</strong>{" "}
              {new Date(timesheet.start_time).toLocaleString()}
            </li>
            <li>
              <strong>End Time:</strong>{" "}
              {new Date(timesheet.end_time).toLocaleString()}
            </li>
            <li>
              <strong>Summary:</strong>{" "}
              {timesheet.summary || "No summary provided."}
            </li>
          </ul>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-5 px-10 mt-5 justify-center">
        <Button linkTo="/timesheets">Timesheets</Button>
        <Button linkTo="/timesheets/new">Create a New Timesheet</Button>
        <Button linkTo="/employees">Employees</Button>
      </div>
    </div>
  );
}
