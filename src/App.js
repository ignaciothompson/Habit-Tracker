import React, { useState, useEffect } from 'react';
import '../src/App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import ProgressBar from "progressbar.js";


function AddBar({ setGoalArr, goalArr }) {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [metric, setMetric] = useState("");
  var refreshGoals = []
  const handleSubmit = (event) => {
    event.preventDefault();
    const newGoal = { name: name, goal: goal, metric: metric, progress: 0 };
    setGoalArr((prevGoalArr) => [...prevGoalArr, newGoal]);
    setName("");
    setGoal("");
    setMetric("");
    refreshGoals = JSON.parse(localStorage.getItem("goalArr"));
    localStorage.setItem("goals", JSON.stringify([...refreshGoals, newGoal]));
    };


  return (
    <form onSubmit={handleSubmit} className="row justify-content-center">
      <div className="col-md-6">
        <div className="row mb-3">
          <div className="col-7">
            <label htmlFor="name" className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-2">
            <label htmlFor="goal" className="form-label">Objetivo</label>
            <input
              type="number"
              className="form-control"
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>
          <div className="col-3">
            <label htmlFor="metric" className="form-label">Metrica</label>
            <input
              type="text"
              className="form-control"
              id="metric"
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
            />
          </div>
          <div className="col-12">
            <label htmlFor="submit" className="form-label">&nbsp;</label>
            <button type="submit" className="btn btn-primary w-100">Agregar</button>
          </div>
        </div>
      </div>
    </form>
  );
}

function GoalProgressBar({ goal }) {
  const progressBarRef = React.useRef();
  const progressBar = React.useRef(null);

  React.useEffect(() => {
    if (!progressBar.current) {
      progressBar.current = new ProgressBar.Line(progressBarRef.current, {
        strokeWidth: 4,
        easing: "easeInOut",
        duration: 1400,
        color: "#007bff",
        trailColor: "#eee",
        trailWidth: 1,
        svgStyle: { width: "100%", height: "100%" },
        text: {
          style: {
            color: "#999",
            position: "absolute",
            right: "0",
            top: "30px",
            padding: 0,
            margin: 0,
            transform: null,
          },
          autoStyleContainer: false,
        },
        step: (state, bar) => {
          bar.setText(Math.round(bar.value() * 100) + " %");
        },
      });
    }

    progressBar.current.animate(goal.progress / goal.goal);
  }, [goal.progress, goal.goal]);

  return <div ref={progressBarRef}></div>;
}

function DisplayGoals(props) {
  const { goalArr, setGoalArr } = props;

  // new state variable to store input values
  const [inputValues, setInputValues] = useState(goalArr.map(goal => goal.progress || ""));

  // Load the saved goalArr from local storage
  useEffect(() => {
    const savedGoals = JSON.parse(localStorage.getItem("goals"));
    if (savedGoals) {
      setGoalArr(savedGoals);
    }
  }, [setGoalArr]);

  // Save the current goalArr to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("goalArr", JSON.stringify(goalArr));
  }, [goalArr]);

  const handleAddButtonClick = (index, addAmount) => {
    const newGoals = [...goalArr];
    const newGoal = { ...newGoals[index] };
    newGoal.progress += addAmount;
    newGoals[index] = newGoal;
    setGoalArr(newGoals);
    setInputValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = "";
      return newValues;
    });
    localStorage.setItem("goals", JSON.stringify(newGoals));
  };
  
  const handleDeleteButtonClick = (index) => {
    const newGoals = [...goalArr];
    newGoals.splice(index, 1);
    setGoalArr(newGoals);
    localStorage.setItem("goals", JSON.stringify(newGoals));
  };

  const handleInputChange = (index, value) => {
    setInputValues(prevValues => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        {goalArr.map((goal, index) => (
          <div key={index} className="card mb-3 d-flex flex-row align-items-center">
            <div className="card-body flex-grow-1">
              <h5 className="card-title">{goal.name}</h5>
              <p className="card-text">
                Objetivo: {goal.goal} {goal.metric}
              </p>
              <div className="d-flex flex-row align-items-center mb-3">
                <label htmlFor={`add-${index}`} className="form-label me-2">
                  Avance
                </label>
                <input
                  type="number"
                  className="form-control me-2"
                  id={`add-${index}`}
                  value={inputValues[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-primary me-2"
                  onClick={() => handleAddButtonClick(index, Number(inputValues[index]))}
                >
                  Agregar
                </button>
                <div className="progress-bar-lg col-5">
                <GoalProgressBar goal={goal} />
              </div>
                {goal.progress >= goal.goal && (
                  <button
                    type="button"
                    className="btn btn-danger ms-3"
                    onClick={() => handleDeleteButtonClick(index)}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [goalArr, setGoalArr] = useState([]);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">Objetivos</h1>
      <AddBar setGoalArr={setGoalArr} />
      <DisplayGoals goalArr={goalArr} setGoalArr={setGoalArr} />
    </div>
  );
}

export default App;