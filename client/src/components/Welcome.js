import React, { Component } from 'react';

export default class Welcome extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pickedView: 'welcome'
        }
    }

    componentDidMount() {
    }

    pickedView = e => {
        this.setState({
            pickedView: e.target.id
        })
        this.props.view(e.target.id)

        const cont = document.getElementsByClassName('c-welcome')
        if (e.target.id !== 'welcome') {
            cont[0].classList.add('sidebar')
            cont[0].classList.remove('container')
        }
        else {
            cont[0].classList.add('container')
            cont[0].classList.remove('sidebar')
        }
        

    }

    render() {
        return (
            <div className="container c-welcome">
                <div className="c-welcome__container area">
                    <h1 className="c-welcome__title">Welcome to 'a la Millionaire'</h1>

                    {
                        this.state.pickedView === 'welcome' && 
                        <div className="c-welcome__options">
                            <button className="c-welcome__btn" onClick={(e) => this.pickedView(e)} id="game">PLAY</button>
                            <p style={{color: '#ffffff'}}>or</p>
                            <button className="c-welcome__btn  " onClick={(e) => this.pickedView(e)} id="panel">GO TO A PANEL</button>
                        </div>
                    }
                    

                    {
                        this.state.pickedView !== 'welcome' &&
                        <div>
                            <p className="c-welcome__btn" onClick={(e) => this.pickedView(e)} id="welcome">BACK</p>
                        </div>
                    }
                    
                </div>
            </div>
        )
    }
}