import React from 'react';
import PropTypes from 'prop-types';
import Cell from './Cell';

class Field extends React.Component {
  constructor (props){
    super(props);
    this.state = {
      fieldObject: {}
    };
  }

  generateField(rows, cols, bombs){
    var newField = {};
    for(let i=0; i < rows*cols; i++){
      newField[i] = {
          id: i,
          type: 'empty',
          visibility: true
        }
    }
    return newField;//this.placeBombs(rows, cols, bombs, newField);
  }

  placeBombs(rows, cols, bombs, field){
    var potentialBombIndex = Math.floor(Math.random()*(rows*cols));
    var occupied = [];
    for(let i=0; i<bombs; i++){
      let xIndex = Math.floor(potentialBombIndex/cols);
      let yIndex = potentialBombIndex%cols;
      field[xIndex][yIndex].type = 'bomb';
      occupied.push(potentialBombIndex);
      while(occupied.indexOf(potentialBombIndex)>=0){
        potentialBombIndex = Math.floor(Math.random()*(rows*cols));
      }
    }
    return field;
  }

  updateNumbers(field){
    for(let row of field){
      for(let cell of row){
        cell.number = this.countNearbyBombs(cell, field);
      }
    }
  }

  countNearbyBombs (cell, field){

  }

  componentDidMount(){
    var rows = this.props.rows;
    var columns = this.props.columns;
    var bombs = this.props.columns;

    this.setState({fieldObject: this.generateField(rows, columns, bombs)});
  }

  render() {
    var field = this.state.fieldObject;
    var fieldArray = Object.keys(field);
    return (
      <div className='field' style={{width: (this.props.columns+1)*50+'px'}}>
        {fieldArray.length > 0 &&
          fieldArray.map((cellId)=> {
              let cell = field[cellId];
              return <Cell key={cell.id} cellObject={cell}/>
            })
          }
      </div>
    )
  }
}

Field.propTypes = {
  rows: PropTypes.number.isRequired,
  columns: PropTypes.number.isRequired,
  bombs: PropTypes.number.isRequired,
}

Field.defaultProps = {
  rows: 6,
  columns: 6,
  bombs: 6,
}


export default Field;
