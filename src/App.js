import React, { Component } from 'react';
import './App.css';

const ASCII_A = 65;
const BASE = 9;

class App extends Component {
  /*
  constructor(props) {
    super(props);
    this.setUpKeyPress();
  }

  setUpKeyPress() {
    document.getElementsByTagName("body")[0]
      .addEventListener('keypress',this.triggerKeypress);
  }

  triggerKeypress(event) {
    var element = document.getElementsByClassName('focus');
    if(element[0] !== undefined) {
      console.log("global keypress");
      element[0].dispatchEvent(new KeyboardEvent('keypress',{'key':event.key}));
    }
    else {
      console.log("null element");
    }
  }
*/
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
    var classTag = this.class_name(this.props.tag);
    if(this.props.value.length === 1) {
      classTag += " locked";
    }
    if(this.props.tag === this.props.focus) {
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
        value={this.props.value}
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

//  initialize squares
    var idx = 0;
    var square_id;
      for(var a = ASCII_A; a < (ASCII_A+BASE); a++) {
        square_id = String.fromCharCode(a);
        for(var i = 0; i < BASE; i++) {
          var obj = {
            name: square_id + parseInt(i),
            value: '123456789'
          };
          this.state.squares[idx] = obj;
          idx++;
        }
      }
  }

  handleKeyPress(event) {
    const ASCII_1 = 49;
    const ASCII_9 = 57;

    console.log("local keypress");

    var ascii_value = event.key.charCodeAt(0);
    if(ascii_value < ASCII_1 || ascii_value > ASCII_9) {
      console.log("not a digit");
      return;
    }

    var elements = document.getElementsByClassName('focus');
    var element = elements[0];
    var idx = element.id;

    var squares = Array.from(this.state.squares);
    if(this.state.mode === 'Pencil') {
      var value = squares[idx].value;
      var arr_values = value.split("");
      var position = arr_values.indexOf(event.key);
      if(position === -1) {
        arr_values.push(event.key);
        arr_values.sort();
      }
      else {
        arr_values.splice(position, 1, '');
      }

      squares[idx].value = arr_values.join("");
    }
    else {
      squares[idx].value = event.key;
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

  render() {
    return (
      <div>
        <Mode
          mode={this.state.mode}
          modeButtonHandler={() => this.handleModeButton()}
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

export default App;
