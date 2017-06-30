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
    var rowCount = 0;
    for(let i=0; i < rows*cols; i++){
      if(i%cols===0){
        rowCount++;
        newField[rowCount] = [];
      }
      newField[rowCount].push(
        {
          id: i,
          type: 'empty',
          visibility: true
        }
      )
    }
    return newField;
  }

  componentDidMount(){
    var rows = this.props.rows;
    var columns = this.props.columns;
    var bombs = this.props.columns;

    this.setState({fieldObject: this.generateField(rows, columns, bombs)});
  }

  render() {
    var field = this.state.fieldObject;
    var rowArrays = Object.keys(field);
    return (
      <div className='field'>
        {rowArrays.length > 0 &&
          rowArrays.map((row, index)=> {
            return <div key={'rowIndex'+index} className='fieldRow'> {field[row].map(cell => {
              return <Cell key={cell.id} cellObject={cell}/>
            })} </div>
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
