import React from 'react';
import PropTypes from 'prop-types';

class Cell extends React.Component {
  constructor (props){
    super(props);
    this.state = {
    };
  }

  render() {
    var cell = this.props.cellObject;
    var classes = ['fieldCell'];
    if(cell.visibility){
      classes.push(cell.type);
    }
    return (
      <div className={classes.join(' ')}>
        {
          cell.number &&
          <span>{cell.number}</span>
        }
      </div>
    )
  }
}

Cell.propTypes = {
  cellObject: PropTypes.object.isRequired
}

Cell.defaultProps = {
  cellObject: {}
}


export default Cell;
