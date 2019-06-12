import React, { Component } from 'react';
import axios from "axios";

export default class Panel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gameData: [],
      idToDelete: null,
      idToUpdate: null,
      qAdded: false,
      qDeleted: false,
      qUpdated: false,
    }
  }

  componentDidMount() {
    this.setState({
      gameData: this.props.data,
    })
  }

  putDataToDB = (question, answer, options, level) => {
    const self = this;
    let currentIds = this.state.gameData.map(data => data.id);
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
    })
    .then(response => {
      self.setState({
        qAdded: true,
      })
    });
  };

  updateDB = (idToUpdate, updateToApply) => {
    const self = this;
    let objIdToUpdate = null;
    this.state.gameData.forEach(dat => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post("http://localhost:3001/api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    })
    .then(response => {
      self.setState({
        qUpdated: true,
      })
    });
  };

  getSelectedOption = qID => {
    this.setState({ 
      idToDelete: qID 
    })
    console.log(qID);
  }

  deleteFromDB = idTodelete => {
    const self = this;
    let objIdToDelete = null;
    this.state.gameData.forEach(dat => {
      if (dat._id === idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    /* et objIdToDelete = idTodelete; */

    console.log('to delete: '+objIdToDelete);

    axios.delete("http://localhost:3001/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    })
    .then( response => {
      self.setState({
        qDeleted: true,
      })
    }); 
  };

  sendForm = e => {
    e.preventDefault();

    //clearing inputs values
    const el = document.querySelectorAll('input');
    [...el].forEach(element => {
      element.value = null;
    });

  }

  render() {
    return (
      <div className="container m-panel">
        <div>
          <h2>PANEL</h2>
          <form style={{ padding: "10px" }} onSubmit={this.sendForm}>
            <h3>Adding new question</h3>
            <input
              type="text"
              onFocus={() => this.setState({ qAdded: false })}
              onChange={e => this.setState({ question: e.target.value })}
              placeholder="add question"
              style={{ width: "200px" }}
            />
            <input
              type="text"
              onFocus={() => this.setState({ qAdded: false })}
              onChange={e => this.setState({ answer: e.target.value })}
              placeholder="add correct answer"
              style={{ width: "200px" }}
            />
            <input
              type="text"
              onFocus={() => this.setState({ qAdded: false })}
              onChange={e => this.setState({ options: e.target.value })}
              placeholder="add three wrong answers"
              style={{ width: "200px" }}
            />
            <input
              type="text"
              onFocus={() => this.setState({ qAdded: false })}
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
            {
              this.state.qAdded &&
              <p>Question added successfully!</p>
            }
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
              {this.state.gameData.length <= 0
                ? "NO QUESTIONS IN DB"
                : this.state.gameData.map(dat => (
                    <option value={dat._id} key={dat._id}> {dat.question} </option>
                  ))}
            </select>
            
            <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
              DELETE
            </button>
            {
              this.state.qDeleted &&
              <p>Question deleted successfully!</p>
            }
          </div>
          
          <div style={{ padding: "10px" }}>
            <h3>Update question</h3>
            <input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ idToUpdate: e.target.value })}
              placeholder="id of item to update here"
            />
            <select
              style={{ width: "200px" }}
              id="selectQtoDelete"
              onChange={e => this.setState({ idToUpdate: e.target.value })}>
              {this.state.gameData.length <= 0
                ? "NO QUESTIONS IN DB"
                : this.state.gameData.map(dat => (
                    <option value={dat._id} key={dat._id}> {dat.question} </option>
                  ))}
            </select>
            <input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ newQuestion: e.target.value })}
              placeholder="put new content of the question"
            />
            <input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ newAnswer: e.target.value })}
              placeholder="put new correct answer"
            />
            <input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ newOptions: e.target.value })}
              placeholder="put new incorrect answers"
            />
            <input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ newLevel: e.target.value })}
              placeholder="put new level"
            />
            <button
              onClick={() =>
                this.updateDB(
                  this.state.idToUpdate, 
                  this.state.newQuestion, 
                  this.state.newAnswer, 
                  this.state.newOptions, 
                  this.state.newLevel)
              }>
              UPDATE
            </button>
            {
              this.state.qUpdated&&
              <p>Question updated successfully!</p>
            }
          </div>
        </div>
      </div>
    )
  }
}