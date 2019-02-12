const ASCII_A = 65;

class Sudoku {
  constructor(squares, base) {
    //  squares should be in Excel-style
    //    A1 = first cell of first row
    //    B2 = second cell of second row
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
    //  take a snapshot of the values in squares array
    let stored_squares = this.squaresToString(this.squares);

    this.setPencilValues();

    //  straight solve of each nonet
    for(var idx = 0; idx < this.sets.length; idx++) {
      var nonet = this.sets[idx];
      for(var nonet_idx = 0; nonet_idx < nonet.length; nonet_idx++) {
        this.solveSet(nonet[nonet_idx]);
      }
    }

    //  narrow possible values by checking duplicate pairs
    for(idx = 0; idx < this.sets.length; idx++) {
      nonet = this.sets[idx];
      for(nonet_idx = 0; nonet_idx < nonet.length; nonet_idx++) {
        this.solveDouble(nonet[nonet_idx]);
      }
    }

    //  check snapshot against the revised (solved) values
    var new_squares = this.squaresToString(this.squares);
    if(stored_squares !== new_squares) {
      this.solve();
    }

    return this.squares;
  }

  solveDouble(set) {
    let locked_values = []; //  array of known values
    let to_check = [];  //  array of objects with no solution

    for(var idx = 0; idx < set.length; idx++) {
      if(set[idx].value.length === 2) {
        locked_values.push(set[idx].value[0]+","+set[idx].value[1]);
      }
      else {
        to_check.push(set[idx]);
      }
    }

      //  check for duplicate dupe_values
      //  save only these into dupe_values
      let dupe_values = [];
      locked_values.forEach(
        function (element, idx) {
          if(locked_values.indexOf(element,idx+1) > -1) {
            if(dupe_values.indexOf(element) === -1) {
              dupe_values.push(element);
            }
          }
        }
      );

      if(dupe_values.length) {
        //  loop thru all the objects to to_check
        //  check value in object against the locked_values
      for(var dupe_idx = 0; dupe_idx < dupe_values.length; dupe_idx++) {
        this.checkObjects(to_check, dupe_values[dupe_idx].split(","));
      }
    }
  }

  solveSet(set) {
    let solvable_set = set; //  the nonet, row, or column that is being checked
    let locked_values = []; //  array of known values
    let to_check = [];  //  array of objects with no solution

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
      this.checkObjects(to_check,locked_values);
  }

  checkObjects(to_check,locked_values) {
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

//  if there is no value, set value to default values
  setPencilValues() {
    for(var idx = 0; idx < this.squares.length; idx++) {
      if(this.squares[idx].value.length === 0) {
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
