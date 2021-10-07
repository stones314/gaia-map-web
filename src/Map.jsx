import React from 'react';
import './Map.css';

class Sector extends React.Component {
  getClassName(rot, col, sel, b) {
    var s = "rot"+rot+
        " map-col-"+ col +
        " map-sec";
    if (sel)
      s = s + "-selected";
    if (b)
      s = s +" map-sec-border";
    return s;
  }
  
  render() {
    return(
    <div className={this.getClassName(this.props.rotation, this.props.col, this.props.selected, false)}>
      <img
        src={this.props.sector}
        className="map-img"
        onClick={this.props.onClick}
        alt={this.props.sector}
      />
    </div>
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
          selected={this.props.selected == i}
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

export default Map;
