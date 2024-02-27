import React, { useState } from "react";
import Header from "../components/Header";
import AddTask from "../components/AddTask";
import Tasks from "../components/Tasks";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const HomePage = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: "Doctors Appointment",
      day: "Feb 5th at 2:30pm",
      reminder: true,
    },
    {
      id: 2,
      text: "Doggy Appointment",
      day: "March 9th at 4:25am",
      reminder: false,
    },
    {
      id: 4,
      text: "HairCut",
      day: "May 15 at 8:42pm",
      reminder: true,
    },
  ]);

  // Delete Task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Toggle Reminder
  const toggleReminder = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: !task.reminder } : task
      )
    );
  };

  const navigate = useNavigate();

  const toTeamPage = () => {
    navigate("/team");
  };

  const toTestingPage = () => {
    navigate("/testingpage");
  };

  return (
    <div className="container">
      <Header />
      <AddTask />
      {tasks.length > 0 ? (
        <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />
      ) : (
        "No Tasks to Show"
      )}
      <h1>Home Page</h1>
      <Button text="Go to Team Page" onClick={toTeamPage} />
      <Button text="Go to Testing Page" onClick={toTestingPage} />
    </div>
  );
};

export default HomePage;
