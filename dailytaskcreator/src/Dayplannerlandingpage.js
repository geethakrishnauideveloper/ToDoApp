// DayPlannerLandingPage.js
import React, { useState, useEffect } from "react";
import Addtask from "./Addtask";
import { getTasks, deleteTask } from "./db";
import { jsPDF } from "jspdf";
import "./App.css";

function DayPlannerLandingPage() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [tasksForDate, setTasksForDate] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const loadTasks = async () => {
    const stored = await getTasks();
    setAllTasks(stored);
    if (selectedDate) {
      const filtered = stored.filter((t) => t.date === selectedDate);
      setTasksForDate(filtered);
    }
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line
  }, []);

  const handleCheckTasksClick = () => {
    setShowCalendar(true);
    setSelectedDate("");
    setTasksForDate([]);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const filtered = allTasks.filter((t) => t.date === date);
    setTasksForDate(filtered);
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    await loadTasks();
  };

  const editTask = async () => {
    await loadTasks();
    setTaskToEdit(null);
  };

  const handleEdit = (id) => {
    const task = tasksForDate.find((t) => t.id === id);
    setTaskToEdit(task);
  };

  const clearEdit = () => setTaskToEdit(null);

  /** Build merged timeline (continuous ranges) */
  const buildTimeSlots = () => {
    if (!selectedDate) return [];

    const sortedTasks = [...tasksForDate].sort(
      (a, b) => a.startTime.localeCompare(b.startTime)
    );

    const merged = [];
    let lastEnd = "00:00";

    for (let t of sortedTasks) {
      if (lastEnd < t.startTime) {
        merged.push({
          range: `${lastEnd} — ${t.startTime}`,
          task: "No task yet",
          id: null,
        });
      }

      merged.push({
        range: `${t.startTime} — ${t.endTime}`,
        task: t.name,
        id: t.id,
      });

      lastEnd = t.endTime;
    }

    if (lastEnd < "24:00") {
      merged.push({
        range: `${lastEnd} — 24:00`,
        task: "No task yet",
        id: null,
      });
    }

    return merged;
  };

  /** Export tasks to PDF */
  const exportToPDF = () => {
    if (!selectedDate) {
      alert("Please select a date first!");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Tasks for ${selectedDate}`, 14, 20);

    const slots = buildTimeSlots();
    let y = 30;
    slots.forEach((slot) => {
      const taskText = `${slot.range} : ${slot.task}`;
      doc.text(taskText, 14, y);
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`Tasks_${selectedDate}.pdf`);
  };

return (
    <div className="page">
        <header className="hero">
            <div className="hero-inner">
                <h1 className="hero-title">Day Planner</h1>
                <p className="hero-sub">
                    Plan your day hour-by-hour and keep track of your tasks.
                </p>
            </div>
        </header>

        <main className="container">
            <div className="grid">
                <div className="left-col">
                    <Addtask
                        onTaskAdded={loadTasks}
                        taskToEdit={taskToEdit}
                        onTaskUpdated={editTask}
                        clearEdit={clearEdit}
                    />
                </div>

                <div className="right-col">
                    <div className="card">
                        <h3 className="card-title">Your Tasks</h3>
                       {!selectedDate && ( <p className="muted">
                            Select a date to view your tasks for the day
                        </p>)}

                        <div className="form-row button-row">
                            <button
                                className="btn outline"
                                onClick={handleCheckTasksClick}
                            >
                                Check Your Tasks
                            </button>
                            {showCalendar && (
                                <>
                                    <input
                                        className="input"
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => handleDateChange(e.target.value)}
                                        style={{ marginLeft: "10px" }}
                                    />
                                    {selectedDate && (
                                        <button
                                            className="btn icon-btn download-btn"
                                            onClick={exportToPDF}
                                            style={{ marginLeft: "10px", padding: "6px 10px" }}
                                            title="Download PDF"
                                        >
                                            {/* Modern Download Icon (SVG) */}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="22"
                                                height="22"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="download-icon"
                                            >
                                                <path d="M12 3v12"/>
                                                <path d="M6 15l6 6 6-6"/>
                                                <rect x="4" y="21" width="16" height="2" rx="1"/>
                                            </svg>
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        {showCalendar && (
                            <>
                                <div className="tasks-list" style={{ marginTop: "10px" }}>
                                    {selectedDate && (
                                        tasksForDate.length > 0 ? (
                                            <ul className="slot-ul">
                                                {buildTimeSlots().map((slot, idx) => (
                                                    <li
                                                        key={idx}
                                                        className={`slot-row ${
                                                            taskToEdit && taskToEdit.id === slot.id
                                                                ? "editing-row"
                                                                : ""
                                                        }`}
                                                        style={{ display: "flex", alignItems: "center" }}
                                                    >
                                                        <div className="slot-time">{slot.range}</div>
                                                        <div
                                                            className={`slot-task ${
                                                                slot.task === "No task yet" ? "empty" : ""
                                                            }`}
                                                            style={{ flex: 1 }}
                                                        >
                                                            {slot.task}
                                                        </div>
                                                        {slot.id && (
                                                            <div style={{ display: "flex", gap: "0" }}>
                                                                <button
                                                                    className="btn edit-btn small"
                                                                    onClick={() => handleEdit(slot.id)}
                                                                    title="Edit"
                                                                >
                                                                    ✏️
                                                                </button>
                                                                <button
                                                                    className="btn danger small delete-btn"
                                                                    onClick={() => handleDelete(slot.id)}
                                                                    title="Delete"
                                                                >
                                                                    🗑
                                                                </button>
                                                            </div>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="no-tasks">
                                                No tasks are created for this date.
                                            </p>
                                        )
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>

        <footer className="footer">
            <div>Made with ♥ — Geetha Krishna</div>
        </footer>

       
    </div>
);
}

export default DayPlannerLandingPage;
