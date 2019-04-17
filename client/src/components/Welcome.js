import React, { Component } from 'react';

export default class Welcome extends Component {
    constructor(props) {
        super(props)
        this.state = {
            view: ''
        }
    }

    componentDidMount() {
    }

    pickedView = e => {
        this.props.view(e.target.id)
    }

    render() {
        return (
            <div className="container c-welcome">
                <h1 className="c-welcome__title">Welcome to 'a la Millionaire'</h1>
                <div className="c-welcome__options">
                    <p onClick={(e) => this.pickedView(e)} id="game">PLAY</p>
                    <p style={{color: '#ffffff'}}>or</p>
                    <p onClick={(e) => this.pickedView(e)} id="panel">GO TO A PANEL</p>
                </div>
            </div>
        )
    }
}