import React from 'react';
import './Menu.css';

class ModeSelect extends React.Component {
  
  render() {
    var cn = "menu-mode-move";
    var txt = "Move";
    if (!this.props.moveMode){
      cn = "menu-mode-rot";
      txt = "Rotate";
    }
    return (
      <div className="menu-row">
        <div className="menu-label">
          <text>Mode:</text>
        </div>
        <div className={cn} onClick={this.props.onClick}>
          <text>{txt}</text>
        </div>
      </div>
    )
  }
}

class Menu extends React.Component {
  render() {
    return(
      <div className="menu-box">
        <ModeSelect
          onClick={() => this.props.onClickMode()}
          moveMode={this.props.moveMode}
        />
      </div>
    )
  }
}

export default Menu;
