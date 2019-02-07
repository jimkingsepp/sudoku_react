import React, { Component } from 'react';
import './App.css';
const Sudoku = require( "./sudoku_solve.js" ).default;

const ASCII_A = 65;
const BASE = 9;

class App extends Component {
  render() {
    return (
          <Board />
    );
  }
}

class Square extends React.Component {

//  'name' is the row/column indicator (i.e., A0, H8, etc.)
//  This function adds frame to the square based on the value of name
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
    for (var i = 1; i < BASE+1; i+=increment) {
      if(column === i) {
        class_name += " square-left";
      }
    }
    if(column === BASE) {
      class_name += " square-right";
    }

    return class_name;
  }

  render() {
    var classTag = this.class_name(this.props.tag);
    if(this.props.value.length === 1) {
      classTag += " locked";
    }
    if(this.props.id === this.props.focus) {
      classTag += " focus";
    }
    return (
      <textarea
        className={classTag}
        id={this.props.id}
        name={this.props.tag}
        onClick={this.props.clickHandler}
        onKeyPress={this.props.keyPressHandler}
        readOnly={true}
        value={this.props.value.join('')}
      />
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: [],
      mode: 'Pencil',
      focus: null
    };

    this.initializeSquares();
  }

/*
  initializeSquares
  Populates this.state.squares with initial values.

  Can't use setState() here.
  setState() refreshes the virtual DOM which
  isn't created yet.

  From react console message:
  "Warning: Can't call setState on a component that is not
  yet mounted. This is a no-op, but it might indicate a bug
  in your application. Instead, assign to `this.state` directly
  or define a `state = {};` class property with the desired
  state in the Board component."
*/
  initializeSquares() {
    var idx = 0;
    var square_id;
      for(var a = ASCII_A; a < (ASCII_A+BASE); a++) {
        square_id = String.fromCharCode(a);
        for(var i = 1; i < BASE+1; i++) {
          var obj = {
            name: square_id + parseInt(i),
            value: []
          };
          // eslint-disable-next-line
          this.state.squares[idx] = obj;
          idx++;
        }
      }
  }

  handleKeyPress(event) {
    const ASCII_1 = 49;
    const ASCII_9 = 57;

    var ascii_value = event.key.charCodeAt(0);
    if(ascii_value < ASCII_1 || ascii_value > ASCII_9) {
      //  not a digit; don't process keypress
      return;
    }

    var elements = document.getElementsByClassName('focus');
    var element = elements[0];
    var idx = element.id;

    var squares = this.state.squares;
    if(this.state.mode === 'Pencil') {
      var value = squares[idx].value;
      var position = value.indexOf(event.key);
      if(position === -1) {
        value.push(event.key);
        value.sort();
      }
      else {
        if(value.length === 1) {
          value = [];
        }
        else {
          value.splice(position, 1);
        }
      }
      squares[idx].value = value;
    }
    else {
      squares[idx].value = [event.key];
    }
    this.setState({squares: squares});
  }

  handleClick(idx) {
    //  toggle the class name 'focus'
    var elements = document.getElementsByClassName('focus');
    while ( elements.length > 0 ) {
      elements[0].classList.remove('focus');
    }
    var element = document.getElementById(idx)
    element.classList.add('focus');
    this.setState({focus: idx})
  }

  renderSquare(idx) {
    return <Square
      value={this.state.squares[idx].value}
      tag={this.state.squares[idx].name}
      key={idx}
      id={idx}
      clickHandler={() => this.handleClick(idx)}
      keyPressHandler={(event) => this.handleKeyPress(event)}
      focus={this.state.focus}
    />;
  }

  //  nine squares === one row (assuming base === 9)
  createRow(row) {
    var row_idx = row * BASE;
    var squares = [];
    for(var i = 0; i < BASE; i++) {
      squares.push( this.renderSquare(row_idx + i ));
    }

    return <div className="board-row" key={row} >{squares}</div>;
  }

  //  create nine rows (assuming base === 9)
  createGrid() {
    var rows = [];
    for (var i = 0; i < BASE; i++) {
      rows.push( this.createRow(i) );
    }
    return (
    <div className="game-board">
      {rows}
    </div>);
  }

  handleModeButton() {
    if(this.state.mode === 'Pencil') {
      this.setState({mode: 'Ink'});
    }
    else {
      this.setState({mode: 'Pencil'});
    }
  }

  handleSolve() {
    let game = new Sudoku (this.state.squares, BASE);
    var solved_set = game.solve();
    this.setState({squares: solved_set});
  }

  clearPuzzle() {
    var squares = this.state.squares;
    for(var idx = 0; idx < this.state.squares.length; idx++) {
      squares[idx].value = [];
    }
    this.setState({squares: squares});
  }

  loadPuzzle() {
    var squares = this.state.squares;
    /*  EASY
    squares[0].value = ["8"];
    squares[1].value = ["3"];
    squares[2].value = [];
    squares[3].value = ["4"];
    squares[4].value = [];
    squares[5].value = ["5"];
    squares[6].value = [];
    squares[7].value = ["2"];
    squares[8].value = [];

    squares[9].value = ["9"];
    squares[10].value = [];
    squares[11].value = [];
    squares[12].value = ["7"];
    squares[13].value = [];
    squares[14].value = [];
    squares[15].value = [];
    squares[16].value = ["5"];
    squares[17].value = ["8"];

    squares[18].value = ["1"];
    squares[19].value = ["5"];
    squares[20].value = ["6"];
    squares[21].value = [];
    squares[22].value = ["2"];
    squares[23].value = [];
    squares[24].value = ["3"];
    squares[25].value = [];
    squares[26].value = [];

    squares[27].value = [];
    squares[28].value = [];
    squares[29].value = ["8"];
    squares[30].value = [];
    squares[31].value = ["7"];
    squares[32].value = ["2"];
    squares[33].value = ["5"];
    squares[34].value = ["1"];
    squares[35].value = [];

    squares[36].value = ["7"];
    squares[37].value = ["2"];
    squares[38].value = ["5"];
    squares[39].value = [];
    squares[40].value = ["3"];
    squares[41].value = [];
    squares[42].value = ["6"];
    squares[43].value = [];
    squares[44].value = [];

    squares[45].value = [];
    squares[46].value = ["6"];
    squares[47].value = [];
    squares[48].value = [];
    squares[49].value = ["4"];
    squares[50].value = ["9"];
    squares[51].value = ["8"];
    squares[52].value = [];
    squares[53].value = ["2"];

    squares[54].value = ["2"];
    squares[55].value = [];
    squares[56].value = [];
    squares[57].value = [];
    squares[58].value = [];
    squares[59].value = [];
    squares[60].value = ["4"];
    squares[61].value = ["6"];
    squares[62].value = ["9"];

    squares[63].value = [];
    squares[64].value = [];
    squares[65].value = [];
    squares[66].value = ["2"];
    squares[67].value = ["8"];
    squares[68].value = ["4"];
    squares[69].value = ["7"];
    squares[70].value = [];
    squares[71].value = [];

    squares[72].value = ["5"];
    squares[73].value = [];
    squares[74].value = ["4"];
    squares[75].value = ["3"];
    squares[76].value = [];
    squares[77].value = [];
    squares[78].value = [];
    squares[79].value = ["8"];
    squares[80].value = ["1"];
    */

    squares[0].value = [];
    squares[1].value = ["4"];
    squares[2].value = ["6"];
    squares[3].value = [];
    squares[4].value = [];
    squares[5].value = ["7"];
    squares[6].value = ["8"];
    squares[7].value = [];
    squares[8].value = [];

    squares[9].value = [];
    squares[10].value = [];
    squares[11].value = ["8"];
    squares[12].value = ["9"];
    squares[13].value = [];
    squares[14].value = [];
    squares[15].value = ["7"];
    squares[16].value = [];
    squares[17].value = [];

    squares[18].value = ["5"];
    squares[19].value = [];
    squares[20].value = [];
    squares[21].value = [];
    squares[22].value = ["2"];
    squares[23].value = [];
    squares[24].value = [];
    squares[25].value = [];
    squares[26].value = [];

    squares[27].value = [];
    squares[28].value = [];
    squares[29].value = [];
    squares[30].value = [];
    squares[31].value = ["6"];
    squares[32].value = ["2"];
    squares[33].value = [];
    squares[34].value = [];
    squares[35].value = ["4"];

    squares[36].value = ["4"];
    squares[37].value = [];
    squares[38].value = [];
    squares[39].value = [];
    squares[40].value = [];
    squares[41].value = [];
    squares[42].value = [];
    squares[43].value = [];
    squares[44].value = ["7"];

    squares[45].value = [];
    squares[46].value = [];
    squares[47].value = [];
    squares[48].value = [];
    squares[49].value = ["5"];
    squares[50].value = [];
    squares[51].value = [];
    squares[52].value = ["1"];
    squares[53].value = [];

    squares[54].value = [];
    squares[55].value = [];
    squares[56].value = ["2"];
    squares[57].value = [];
    squares[58].value = [];
    squares[59].value = [];
    squares[60].value = [];
    squares[61].value = [];
    squares[62].value = [];

    squares[63].value = [];
    squares[64].value = ["1"];
    squares[65].value = ["5"];
    squares[66].value = [];
    squares[67].value = [];
    squares[68].value = [];
    squares[69].value = [];
    squares[70].value = ["2"];
    squares[71].value = [];

    squares[72].value = [];
    squares[73].value = [];
    squares[74].value = [];
    squares[75].value = [];
    squares[76].value = [];
    squares[77].value = ["8"];
    squares[78].value = [];
    squares[79].value = ["6"];
    squares[80].value = [];

    this.setState({squares: squares});
  }

  render() {
    return (
      <div>
        <Mode
          mode={this.state.mode}
          modeButtonHandler={() => this.handleModeButton()}
        />
        <Solver
          SolveHandler={() => this.handleSolve()}
        />
        <Loader
          LoadPuzzleHandler={() => this.loadPuzzle()}
        />
      <ClearPuzzle
          ClearPuzzleHandler={() => this.clearPuzzle()}
        />
        <div className="game" >
          {this.createGrid()}
        </div>
      </div>
    );
  }
}

class Mode extends React.Component {
  render () {
    return(
      <button
        className='mode'
        onClick={this.props.modeButtonHandler}>
          {this.props.mode}
      </button>
    );
  }
}

class Solver extends React.Component {
  render () {
    return(
      <button onClick={this.props.SolveHandler}>
        Solve
      </button>
    )
  }
}

class Loader extends React.Component {
  render () {
    return(
      <button onClick={this.props.LoadPuzzleHandler}>
        Load
      </button>
    )
  }
}

class ClearPuzzle extends React.Component {
  render () {
    return(
      <button onClick={this.props.ClearPuzzleHandler}>
        Clear
      </button>
    )
  }
}

export default App;
