import React from 'react';
import PropTypes from 'prop-types';
import Field from './Field';
import Settings from './Settings';

class Game extends React.Component {
  constructor (props){
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <Field rows={10} columns={10} bombs={6}/>
        <Settings />
      </div>
    )
  }
}

Game.propTypes = {

}


export default Game;
