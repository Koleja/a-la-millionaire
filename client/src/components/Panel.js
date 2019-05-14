import React, { Component } from 'react';
import axios from "axios";

export default class Panel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gameData: [],
      idToDelete: null,
      idToUpdate: null,
      needUpdate: '',
    }
  }

  componentDidMount() {
    this.setState({
      gameData: this.props.data,
    })
  }

  sendUpdate() {
    this.setState({
      needUpdate: true
    })

    console.log('needupdate: '+this.state.needUpdate)
    this.props.refresh(this.state.needUpdate)
    
  }

  putDataToDB = (question, answer, options, level) => {
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
    });
  };

  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.gameData.forEach(dat => {
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

    this.sendUpdate();
  };

  sendForm = e => {
    e.preventDefault();
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
              {this.state.gameData.length <= 0
                ? "NO QUESTIONS IN DB"
                : this.state.gameData.map(dat => (
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
        </div>
      </div>
    )
  }
}