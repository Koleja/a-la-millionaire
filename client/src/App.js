
import React, { Component } from "react";
import axios from "axios";
import './styles/App.scss';
import Welcome from './components/Welcome';
import Game from './components/Game';
import Panel from './components/Panel';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      id: 0,
      question: null,
      answer: null,
      options: [],
      level: null,
      intervalIsSet: false,
      
      objectToUpdate: null,
      view: '',
      needUpdate: '',
    };
  }
  

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

      console.log('zbiera dane z db');
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
    /* let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id === idTodelete) {
        objIdToDelete = dat._id;
      }
    }); */

    let objIdToDelete = idTodelete;

    console.log('to delete: '+objIdToDelete);

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

  getSelectedOption = qID => {
    this.setState({ 
      idToDelete: qID 
    })
    console.log(qID);
  }

  onPickedView = a => {
    this.setState({
      view: a
    })
    this.getDataFromDb();
  }

  // here is our UI
  // it is easy to understand their functions when you 
  // see them render into our screen
  render() {
    return (
      <div>

          <Welcome view={ (a) => this.onPickedView(a) }/>

        {
          this.state.view === 'game' &&
          <Game data={this.state.data}/>
        }

        {
          this.state.view === 'panel' &&
          <Panel data={this.state.data} />
          /* <div>
            <h2>PANEL</h2>
            <form style={{ padding: "10px" }}>
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
              <button type="submit" onClick={() => this.putDataToDB(
                this.state.question, 
                this.state.answer, 
                this.state.options, 
                this.state.level)}>
                ADD
              </button>
            </form>
            <div style={{ padding: "10px" }}>
              <h3>Delete question</h3>
              <input
                type="text"
                style={{ width: "200px" }}
                onChange={e => this.setState({ idToDelete: e.target.value })}
                placeholder="put id of item to delete here"
              /><br />
              <label htmlFor="selectQtoDelete">Select question to delete</label><br />
              <select
                style={{ width: "200px" }}
                id="selectQtoDelete"
                onChange={ (e) => this.getSelectedOption(e.target.value) }>
                {data.length <= 0
                  ? "NO QUESTIONS IN DB"
                  : data.map(dat => (
                      <option value={dat._id} key={dat._id}> {dat.question} </option>
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
          </div> */
        }

      </div>
    );
  }
}

export default App;