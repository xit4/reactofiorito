import React from 'react';
import PropTypes from 'prop-types';

class Cell extends React.Component {
  constructor (props){
    super(props);
    this.state = {
    };
  }

  render() {
    let {cellObject, onClickCell} = this.props;
    let classes = ['fieldCell'];
    if(cellObject.visibility){
      classes.push(cellObject.type);
    }
    return (
      <div className={classes.join(' ')} onClick={(e) => {
        e.preventDefault();
        onClickCell(cellObject);
      }}>
        {
          cellObject.visibility && cellObject.number > 0 && cellObject.type === 'number' &&
          <span>{cellObject.number}</span>
        }
      </div>
    )
  }
}

Cell.propTypes = {
  cellObject: PropTypes.object.isRequired,
  onClickCell: PropTypes.func.isRequired,
}

Cell.defaultProps = {
  cellObject: {}
}


export default Cell;
