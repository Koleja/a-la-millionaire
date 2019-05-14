import React, { Component } from 'react';

export default class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gameData: []
    }
  }

  componentDidMount() {
    this.setState({
      gameData: this.props.data,
    })
  }

  render() {
    return (
      <div className="container m-game">
          <div>
              <h1>GAME AREA</h1>
              <div>
                <ul>
                {this.state.gameData.length <= 0
                  ? "NO DB ENTRIES YET"
                  : this.state.gameData.map(dat => (
                    <li style={{ padding: "10px" }} key={dat.id}>
                    <p style={{ color: "gray" }}> question: {dat.question} </p>
                    <p style={{ color: "gray" }}> good answer: {dat.correct_answer} </p>
                    <p style={{ color: "gray" }}> incorrect answers: {dat.wrong_answer} </p>
                    <p style={{ color: "gray" }}> level: {dat.level} </p>
                    </li>
                    
                  ))}
                </ul>
              </div>
          </div>
      </div>
    )
  }
}