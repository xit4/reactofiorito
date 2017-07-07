import React from 'react';
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
        <Field rows={6} columns={6} bombs={5}/>
        <Settings />
      </div>
    )
  }
}


export default Game;
