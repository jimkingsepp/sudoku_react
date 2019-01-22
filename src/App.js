import React, { Component } from 'react';
import './App.css';

var ASCII_A = 65;
var BASE = 9;

class App extends Component {
  render() {
    return (
          <Board />
    );
  }
}

class Square extends React.Component {
  class_name (name) {
    var increment = Math.sqrt(BASE);
    var class_name = "square";
    for(var code = ASCII_A; code < ASCII_A+BASE; code+=increment) {
      if(name[0] === String.fromCharCode(code)) {
        class_name += " square-top";
      }
    }
    if(name[0] === String.fromCharCode(ASCII_A+(BASE-1))) {
      class_name += " square-bottom";
    }

    var column = parseInt(name[1]);
    for (var i = 0; i < BASE; i+=increment) {
      if(column === i) {
        class_name += " square-left";
      }
    }
    if(column === BASE-1) {
      class_name += " square-right";
    }

    return class_name;
  }

  render() {
    return (
      <button className={this.class_name(this.props.name)} id={this.props.name}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    //BASE = parseInt(this.props.base);
    this.state = {
      squares: []
    };

//  initialize squares
    var idx = 0;
    var square_id;
      for(var a = ASCII_A; a < (ASCII_A+BASE); a++) {
        square_id = String.fromCharCode(a) ;
        for(var i = 0; i < BASE; i++) {
          var obj = { name: square_id + parseInt(i), value: 'V' };
          this.state.squares[idx] = obj;
          idx++;
        }
      }
  }

  renderSquare(idx) {
    return <Square value={this.state.squares[idx].value} name={this.state.squares[idx].name} />;
  }

  //  nine squares === one row (assuming base === 9)
  createRow(row) {
    var base = parseInt(this.props.base);
    var row_idx = row * BASE;
    var squares = [];
    for(var i = 0; i < BASE; i++) {
      this.state.squares[row_idx + i].value = parseInt(i);
      squares.push( this.renderSquare(row_idx + i ));
    }

    return <div className="board-row">{squares}</div>;
  }

  //  create nine rows (assuming base === 9)
  createGrid() {
    var rows = [];
    for (var i = 0; i < BASE; i++) {
      rows.push( this.createRow(i) );
    }
    return <div className="game-board">{rows}</div>;
  }

  render() {
    return (
      <div className="game">
        {this.createGrid()}
      </div>
    );
  }
}


export default App;
