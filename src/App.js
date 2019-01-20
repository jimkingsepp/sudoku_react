import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board base="9"
            onClick={i => this.handleClick(i)}
          />
        </div>
      </div>
    );
  }
}

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: null};
  }

  render() {
    return (
      <button className="square" Id={this.props.id}>
        {this.state.value}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(this.props.base).fill(null)
    };
  }

  renderSquare(i) {
    return <Square value={this.state.squares[i]} id={i} />;
  }

  createRow(row) {
    var squares = [];
    var len = this.props.base;
    for(var i = 0; i < len; i++) {
      squares.push( this.renderSquare(row + i.toString() ));
    }

    return <div className="board-row">{squares}</div>;
  }

  render() {
    return (
      <div>
        {this.createRow('A')}
        {this.createRow('B')}
        {this.createRow('C')}
        {this.createRow('D')}
        {this.createRow('E')}
        {this.createRow('F')}
        {this.createRow('G')}
        {this.createRow('H')}
        {this.createRow('I')}
      </div>
    );
  }
}


export default App;
