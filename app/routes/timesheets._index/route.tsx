import { useLoaderData, Link } from "react-router";
import { useEffect, useState } from "react";
import { getDB } from "~/db/getDB";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
import "./index.css";
import { Button } from "~/components/Button";

export async function loader() {
  try {
    const db = await getDB();
    const timesheetsAndEmployees = await db.all(
      "SELECT timesheets.*, employees.full_name, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id"
    );
    return { timesheetsAndEmployees };
  } catch (error) {
    console.error("Failed to load timesheets:", error);
    throw new Response("Failed to load timesheets", { status: 500 });
  }
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees } = useLoaderData();
  const [view, setView] = useState("table");

  // Initialize the calendar and events service
  const eventsService = useState(() => createEventsServicePlugin())[0];
  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events: [], // Initially empty, populated dynamically
    plugins: [eventsService],
  });

  // Populate calendar events from timesheets
  useEffect(() => {
    const events = timesheetsAndEmployees.map((timesheet: any) => ({
      id: timesheet.id.toString(),
      title: `${timesheet.full_name} (Timesheet #${timesheet.id})`,
      start: timesheet.start_time,
      end: timesheet.end_time,
    }));

    eventsService.add(events);
  }, [timesheetsAndEmployees, eventsService]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Timesheets</h1>

      {/* View Toggle Buttons */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setView("table")}
          className={`px-4 py-2 rounded ${
            view === "table"
              ? "bg-[#005e9c] text-white"
              : "bg-[#f2f2f2] text-[#395b56]"
          }`}
        >
          Table View
        </button>
        <button
          onClick={() => setView("calendar")}
          className={`px-4 py-2 rounded ${
            view === "calendar"
              ? "bg-[#005e9c] text-white"
              : "bg-[#f2f2f2] text-[#395b56]"
          }`}
        >
          Calendar View
        </button>
      </div>

      {/* Table View */}
      {view === "table" ? (
        <div className="grid grid-cols-4 gap-5">
          {timesheetsAndEmployees.map((timesheet: any) => (
            <Link
              to={`/timesheets/${timesheet.id}`}
              key={timesheet.id}
              className="mb-4 p-4 border rounded cursor-pointer"
            >
              <ul>
                <li className="font-bold ">Timesheet #{timesheet.id}</li>
                <ul className="ml-4">
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
                </ul>
              </ul>
            </Link>
          ))}
        </div>
      ) : (
        /* Calendar View */
        <div className="h-[600px]">
          <ScheduleXCalendar calendarApp={calendar} />
        </div>
      )}

      <div className="flex gap-5 px-10 mt-5 justify-center">
        <Button linkTo="/timesheets/new"> New Timesheet</Button>
        <Button linkTo="/employees">Employees</Button>
      </div>
    </div>
  );
}
