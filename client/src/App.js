
import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  // initialize our state 
  state = {
    data: [],
    id: 0,
    question: null,
    answer: null,
    options: [],
    level: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has 
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    /* if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    } */
  }

  // never let a process live forever 
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    /* if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    } */
  }

  // just a note, here, in the front end, we use the id key of our data object 
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify 
  // data base entries

  // our first get method that uses our backend api to 
  // fetch data from our data base
  getDataFromDb = () => {
    fetch('http://localhost:3001/api/getData')
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = (question, answer, options, level) => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }
    options.split(',');

    axios.post("http://localhost:3001/api/putData", {
      id: idToBeAdded,
      question: question,
      correct_answer: answer,
      wrong_answer: options,
      level: level
    });
  };


  // our delete method that uses our backend api 
  // to remove existing database information
  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id === idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    console.log(objIdToDelete);

    axios.delete("http://localhost:3001/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };


  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post("http://localhost:3001/api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };


  // here is our UI
  // it is easy to understand their functions when you 
  // see them render into our screen
  render() {
    const { data } = this.state;
    return (
      <div>
        <div>
          <h1>OBSZAR GRY</h1>
          <ul>
            {data.length <= 0
              ? "NO DB ENTRIES YET"
              : data.map(dat => (
                  <li style={{ padding: "10px" }} key={data.question}>
                    <p style={{ color: "gray" }}> question: {dat.question} </p>
                    <p style={{ color: "gray" }}> good answer: {dat.correct_answer} </p>
                    <p style={{ color: "gray" }}> incorrect answers: {dat.wrong_answer} </p>
                    <p style={{ color: "gray" }}> level: {dat.level} </p>
                  </li>
                ))}
          </ul>
        </div>
        
        <div>
          <h2>PANEL</h2>
          <div style={{ padding: "10px" }}>
            <h3>Adding new question</h3>
            <input
              type="text"
              onChange={e => this.setState({ question: e.target.value })}
              placeholder="add question"
              style={{ width: "200px" }}
            />
            <input
              type="text"
              onChange={e => this.setState({ answer: e.target.value })}
              placeholder="add correct answer"
              style={{ width: "200px" }}
            />
            <input
              type="text"
              onChange={e => this.setState({ options: e.target.value })}
              placeholder="add three wrong answers"
              style={{ width: "200px" }}
            />
            <input
              type="text"
              onChange={e => this.setState({ level: e.target.value })}
              placeholder="add level"
              style={{ width: "200px" }}
            />
            <button onClick={() => this.putDataToDB(
              this.state.question, 
              this.state.answer, 
              this.state.options, 
              this.state.level)}>
              ADD
            </button>
          </div>
          <div style={{ padding: "10px" }}>
            <h3>Delete question</h3>
            <input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ idToDelete: e.target.value })}
              placeholder="put id of item to delete here"
            />
            <select
              onChange={e => this.setState({ idToDelete: e.target.value })}>
              {data.length <= 0
                ? "NO QUESTIONS IN DB"
                : data.map(dat => (
                    <option value={dat._id}> {dat.question} </option>
                  ))}
            </select>
            
            <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
              DELETE
            </button>
          </div>
          <div style={{ padding: "10px" }}>
            <h3>Update question</h3>
            <input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ idToUpdate: e.target.value })}
              placeholder="id of item to update here"
            />
            <input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ updateToApply: e.target.value })}
              placeholder="put new value of the item here"
            />
            <button
              onClick={() =>
                this.updateDB(this.state.idToUpdate, this.state.updateToApply)
              }
            >
              UPDATE
            </button>
          </div>
        </div>
        
      </div>
    );
  }
}

export default App;