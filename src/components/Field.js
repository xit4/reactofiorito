import React from 'react';
import PropTypes from 'prop-types';
import Cell from './Cell';

class Field extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldObject: {},
      isGameWon: false,
      isGameLost: false
    };
    this.handleClickCell = this.handleClickCell.bind(this);
    this.traverseMatrix = this.traverseMatrix.bind(this);
    this.revealCell = this.revealCell.bind(this);
    this.checkGameWon = this.checkGameWon.bind(this);
  }

  generateField(rows, cols, bombs) {
    let newField = {};
    for (let i = 0; i < rows * cols; i++) {
      newField[i] = {
        id: i,
        type: 'empty',
        visibility: false,
        number: 0
      }
    }
    newField = this.placeBombs(bombs, newField);
    newField = this.updateNumbers(newField);
    return newField;
  }

  placeBombs(bombs, field) {
    let numberOfCells = Object.keys(field).length;
    let potentialBombIndex = Math.floor(Math.random() * (numberOfCells));
    let occupied = [];
    for (let i = 0; i < bombs; i++) {
      field[potentialBombIndex].type = 'bomb';
      occupied.push(potentialBombIndex);
      while (occupied.indexOf(potentialBombIndex) >= 0) {
        potentialBombIndex = Math.floor(Math.random() * (numberOfCells));
      }
    }
    return field;
  }

  updateNumbers(field) {
    for (let cellId of Object.keys(field)) {
      let bombCount = this.countNearbyBombs(cellId, field);
      field[cellId].number = bombCount;
      if (bombCount > 0 && field[cellId].type !== 'bomb') {
        field[cellId].type = 'number';
      }
    }
    return field;
  }

  countNearbyBombs(cellId, field) {
    const {rows, columns} = this.props;
    const cellNumber = parseInt(cellId, 10);
    let bombCount = 0;
    const leftSide = cellNumber % columns === 0;
    const rightSide = (cellNumber + 1) % columns === 0;
    const topSide = cellNumber - columns < 0;
    const bottomSide = cellNumber + columns >= columns * rows;

    if (!leftSide) {
      if (field[cellNumber - 1].type === 'bomb') {
        bombCount++;
      }
      if (!topSide && field[cellNumber - columns - 1].type === 'bomb') {
        bombCount++;
      }
      if (!bottomSide && field[cellNumber + columns - 1].type === 'bomb') {
        bombCount++;
      }
    }
    if (!rightSide) {
      if (field[cellNumber + 1].type === 'bomb') {
        bombCount++;
      }
      if (!topSide && field[cellNumber - columns + 1].type === 'bomb') {
        bombCount++;
      }
      if (!bottomSide && field[cellNumber + columns + 1].type === 'bomb') {
        bombCount++;
      }

    }
    if (!bottomSide && field[cellNumber + columns].type === 'bomb') {
      bombCount++;
    }
    if (!topSide && field[cellNumber - columns].type === 'bomb') {
      bombCount++;
    }

    return bombCount;
  }

  revealCell(cell) {
    this.setState(prevState => ({
      ...prevState,
      fieldObject: {
        ...prevState.fieldObject,
        [cell.id]: {
          ...prevState.fieldObject[cell.id],
          visibility: true
        }
      }
    }))
  }

  handleClickCell(cell) {
    if (cell.visibility) {
      return;
    }
    const {fieldObject} = this.state;
    this.revealCell(cell);
    switch (cell.type) {
      case 'bomb':
        this.setState({isGameLost: true})
        break;
      case 'empty':
        let queue = this.traverseMatrix(cell.id, []);
        queue.forEach(cellId => {
          this.revealCell(fieldObject[cellId])
        })
        break;
      case 'number':
        //nothing??
        break;
      default:
        //I'm here so I won't get fined
        break;
    }
  }

  traverseMatrix(index, queue) {
    const {rows, columns} = this.props;
    const {fieldObject} = this.state;

    if (queue.indexOf(index) !== -1)
      return queue;
    if (fieldObject[index].type === 'number') {
      queue.push(index);
      return queue;
    } else if (fieldObject[index].type === 'empty') {
      queue.push(index);
    } else {
      return queue;
    }

    var leftSide = index % columns === 0;
    var rightSide = (index + 1) % columns === 0;
    var topSide = index - columns < 0;
    var bottomSide = index + columns >= columns * rows;

    if (!leftSide) {
      queue.concat(this.traverseMatrix(index - 1, queue));
      if (!topSide) {
        queue.concat(this.traverseMatrix(index - columns - 1, queue));
      }
      if (!bottomSide) {
        queue.concat(this.traverseMatrix(index + columns - 1, queue));
      }
    }
    if (!rightSide) {
      if (!topSide) {
        queue.concat(this.traverseMatrix(index - columns + 1, queue));
      }
      if (!bottomSide) {
        queue.concat(this.traverseMatrix(index + columns + 1, queue));
      }
      queue.concat(this.traverseMatrix(index + 1, queue));
    }
    if (!bottomSide) {
      queue.concat(this.traverseMatrix(index + columns, queue));
    }
    if (!topSide) {
      queue.concat(this.traverseMatrix(index - columns, queue));
    }
    return queue;
  }

  checkGameWon() {
    const {fieldObject: field, isGameWon, isGameLost} = this.state;
    if(isGameWon || isGameLost)
      return;
    const gameWon = Object.keys(field).every(cellId => {
      let isBomb = field[cellId].type === 'bomb';
      let isVisible = field[cellId].visibility;
      return isBomb || isVisible;
    })
    if(gameWon){
      this.setState({isGameWon: gameWon});
    }
  }

  shouldComponentUpdate(){
      return !this.setState.isGameWon || !this.setState.isGameLost
  }

  componentDidMount() {
    const {rows, columns, bombs} = this.props;

    const newField = this.generateField(rows, columns, bombs);

    this.setState({fieldObject: newField});
  }

  componentDidUpdate(){
    this.checkGameWon();
  }

  render() {
    const {fieldObject: field, isGameLost, isGameWon} = this.state;
    var fieldArray = Object.keys(field);
    return ((isGameLost && <span>Lost</span>) ||
       (isGameWon && <span>Won</span>)  ||
       <div className='field' style={{
      width: (this.props.columns + 1) * 50 + 'px'
    }}>
      {fieldArray.length > 0 && fieldArray.map((cellId) => {
        let cell = field[cellId];
        return <Cell key={cell.id} cellObject={cell} onClickCell={this.handleClickCell}/>
      })
}
    </div>)
  }
}

Field.propTypes = {
  rows: PropTypes.number.isRequired,
  columns: PropTypes.number.isRequired,
  bombs: PropTypes.number.isRequired
}

Field.defaultProps = {
  rows: 6,
  columns: 6,
  bombs: 6
}

export default Field;
