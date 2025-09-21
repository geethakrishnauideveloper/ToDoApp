// Addtask.js
import React, { useState, useEffect } from "react";
import { addTask, updateTask } from "./db";
import "./Addtask.css";

function Addtask({ onTaskAdded, taskToEdit, onTaskUpdated, clearEdit }) {
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [previewTask, setPreviewTask] = useState(null);

  useEffect(() => {
    if (taskToEdit) {
      setTaskName(taskToEdit.name);
      setTaskDate(taskToEdit.date);
      setStartTime(taskToEdit.startTime);
      setEndTime(taskToEdit.endTime);
      setShowDateSelector(true);
    }
  }, [taskToEdit]);

  const handleTaskNameBlur = () => {
    if (taskName.trim() !== "") setShowDateSelector(true);
  };

  const handleCreateOrUpdate = async () => {
    if (!taskName || !taskDate || !startTime || !endTime) {
      alert("Please fill all fields!");
      return;
    }

    const newTask = {
      name: taskName.trim(),
      date: taskDate,
      startTime,
      endTime,
    };

    if (taskToEdit) {
      await updateTask(taskToEdit.id, newTask);
      if (onTaskUpdated) onTaskUpdated(newTask);
      clearEdit();
    } else {
      await addTask(newTask);
      if (onTaskAdded) onTaskAdded();
      setPreviewTask(newTask);
      setTimeout(() => setPreviewTask(null), 5000);
    }

    setTaskName("");
    setTaskDate("");
    setStartTime("");
    setEndTime("");
    setShowDateSelector(false);
  };

  return (
    <div className="card add-task-card">
      <h3 className="card-title">
        {taskToEdit ? "Edit Task" : "Create Task"}
      </h3>

      <div className="form-row">
        <input
          className="input"
          type="text"
          placeholder="Task name (e.g. Study)"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          onBlur={handleTaskNameBlur}
        />
      </div>

      {showDateSelector && (
        <>
          <div className="form-row">
            <label className="label">Date</label>
            <input
              className="input"
              type="date"
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
            />
          </div>

          <div className="form-row1 time-row">
            <div>
              <label className="label">From</label>
              <input
                className="input"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="label">To</label>
              <input
                className="input"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        </>
      )}

      <div className="form-row1">
        <button className="btn primary" onClick={handleCreateOrUpdate}>
          {taskToEdit ? "Update Task" : "Create Task"}
        </button>
        {taskToEdit && (
          <button className="btn outline" onClick={clearEdit}>
            Cancel
          </button>
        )}
      </div>

      {previewTask && !taskToEdit && (
        <div className="preview">
          <strong>Created:</strong>{" "}
          {previewTask.name} • {previewTask.date} • {previewTask.startTime} -{" "}
          {previewTask.endTime}
        </div>
      )}
    </div>
  );
}

export default Addtask;
