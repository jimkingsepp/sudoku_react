const ASCII_A = 65;

class Sudoku {
  constructor(squares, base) {
    this.squares = squares;
    this.base = base;

    this.sets = [
      this.nonets = Array.apply(null, Array(this.base)).map(function () { return []; }),
      this.rows = Array.apply(null, Array(this.base)).map(function () { return []; }),
      this.columns = Array.apply(null, Array(this.base)).map(function () { return []; })
    ];
    this.possible_values = Array.apply(null, Array(this.base)).map(function (item, idx) { return (idx+1).toString(); });

    this.createNonets();
  }

/*
  Given a set of all squares,
  create set of nonets (3x3 sets), rows, and columns.
  These are the solvable units.
  Note all objects are stored by reference.
*/
  createNonets() {
    let squares = this.squares;
    var nonet_idx, row_idx, column_idx;
    for (var idx = 0; idx < squares.length; idx++) {
      nonet_idx = this.nonet_index(squares[idx].name);
      this.nonets[nonet_idx].push(squares[idx]);

      row_idx = squares[idx].name[0].charCodeAt() - ASCII_A;
      this.rows[row_idx].push(squares[idx]);

      column_idx = parseInt(squares[idx].name[1]) - 1;
      this.columns[column_idx].push(squares[idx]);
    }
  }

  squaresToString(squares) {
    var returnstr = '';
    for (var idx = 0; idx < squares.length; idx++) {
      returnstr += squares[idx].value.join('') + "|";
    }

    return returnstr;
  }

  solve() {
    let stored_squares = this.squaresToString(this.squares);
    this.clearPencilValues();

    this.solveNonet(this.nonets);
    this.solveNonet(this.rows);
    this.solveNonet(this.columns);

    var new_squares = this.squaresToString(this.squares);
    if(stored_squares !== new_squares) {
      this.solve();
    }

    return this.squares;
  }

  solveNonet(nonet) {
    for(var nonet_idx = 0; nonet_idx < this.base; nonet_idx++) {
      this.solveSet(nonet[nonet_idx]);
    }
  }

  solveSet(set) {
    var solvable_set = set; //  the nonet, row, or column that is being checked
    var locked_values = []; //  array of known values
    var to_check = [];  //  array of objects with no solution

    //  get list of values that are "locked"
    //  "locked" values are those that are known
    //  also get list of squares whose solution is unknown
    solvable_set.forEach(
      function (item, idx) {
        if(item.value.length === 1) {
          locked_values.push(item.value[0]);
        }
        else {
          to_check.push(item);
        }
      });


      //  loop thru all the objects to to_check
      //  check value in object against the locked_values
      for(var idx = 0; idx < to_check.length; idx++) {
        for (var locked_idx = 0; locked_idx < locked_values.length; locked_idx++) {
          var locked_val = locked_values[locked_idx];
          var pos = to_check[idx].value.indexOf(locked_val);
          if(pos !== -1) {
            to_check[idx].value.splice(pos, 1);
          }
        }
      }
  }

  clearPencilValues() {
    for(var idx = 0; idx < this.squares.length; idx++) {
      if(this.squares[idx].value.length !== 1) {
        this.squares[idx].value = this.possible_values.slice();
      }
    }
  }

  report() {
    console.log ("nonets: ");
    console.log(this.nonets);
    console.log ("rows: ");
    console.log(this.rows);
    console.log ("columns: ");
    console.log(this.columns);
  }

  nonet_index(name) {
    var step = Math.sqrt(this.base);
    var character_code = name[0].charCodeAt() - ASCII_A;
    character_code++;
    var character_idx = step;
    for (var idx = this.base; idx > 0; idx -= step) {
      if(character_code <= idx) {
        character_idx--;
      }
    }

    var number_code = parseInt(name[1]);
    var number_idx = step;
    for(idx = this.base; idx > 0; idx -= step) {
      if(number_code <= idx) {
        number_idx--;
      }
    }

    return ((character_idx*step)+number_idx);
  }
}

export default Sudoku
