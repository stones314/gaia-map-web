import React from 'react';
import './App.css';
import s01 from './img/s01.png';
import s02 from './img/s02.png';
import s03 from './img/s03.png';
import s04 from './img/s04.png';
import s05 from './img/s05.png';
import s06 from './img/s06.png';
import s07 from './img/s07.png';
import s08 from './img/s08.png';
import s09 from './img/s09.png';
import s10 from './img/s10.png';
import s05b from './img/s05b.png';
import s06b from './img/s06b.png';
import s07b from './img/s07b.png';


class Sector extends React.Component {
  getClassName(rot, col, b) {
    var s = "map-sec"+
        " rot"+rot+
        " map-col-"+ col;
    if (b)
      s = s +" map-sec-border";
    return s;
  }
  
  render() {
    return(
    <img
      src={this.props.sector}
      className={this.getClassName(this.props.rotation, this.props.col, false)}
      onClick={this.props.onClick}
	  alt={this.props.sector}
    />
    )
  }
}


class Map extends React.Component {
  renderSector(i, col) {
    return (
        <Sector
          key={i}
          sid={i}
          numSect={this.props.numSect}
          sector={this.props.sectors[i]}
          rotation={this.props.rotation[i]}
          col={col}
          onClick={() => this.props.onClick(i)}
        />      
    );
  }
 
  render(){
    return (
      <div className="map-box">
        <div className="map-row map-row-1">
          {this.renderSector(0,1)}
          {this.renderSector(1,2)}
          {this.renderSector(2,3)}
        </div>
        <div className="map-row map-row-2">
          {this.renderSector(3,1)}
          {this.renderSector(4,2)}
          {this.renderSector(5,3)}
          {this.renderSector(6,4)}
        </div>
        <div className="map-row map-row-3">
          {this.renderSector(7,1)}
          {this.renderSector(8,2)}
          {this.renderSector(9,3)}
       </div>
     </div>
    )
  }
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sectors: [s10,s01,s05,s09,s02,s03,s06,s08,s04,s07],
      rotation: [0,0,0,0,0,0,0,0,0,0],
      numSect: 10,
    };
    this.onClickSector = this.onClickSector.bind(this);
  }
  
 
  onClickSector(i) {
    var rot = this.state.rotation.slice();
    if(rot[i] === 300){
      rot[i] = 0;
      this.setState({rotation : rot});
    }
    else
    {
      rot[i] = rot[i] + 60;
      this.setState({rotation: rot});
    }
  }
  
  render() {
    return (
      <div className="App">
        <Map
          numSect={this.state.numSect}
          sectors={this.state.sectors}
          rotation={this.state.rotation}
          onClick={(i) => this.onClickSector(i)}
        />
   </div>
    )
  }
}

export default App;
