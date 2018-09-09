import React, {Component} from 'react';
import './Card.css'

class Card extends Component {
  constructor(){
    super();
    this.state = {
      hovering: false
    };
  }

  mouseEnter(){
    this.setState({hovering: true});
  }

  mouseLeave(){
    this.setState({hovering: false});
  }

  render(){
    const {title, subtitle, url, imageSource, handleClick, type, author} = this.props;

    const outerDivStyle = type === 'department' ? {width:300, height:300, background:'whitesmoke'} : {maxWidth:300, background:'whitesmoke'};
    const imgClass = type === 'department' ? '' : 'pt3';
    const imgHeight = type === 'department' ? 200 : 100;
    return (
      <a href={url} target="_blank" onClick={() => handleClick(subtitle)} onMouseEnter={this.mouseEnter.bind(this)} onMouseLeave={this.mouseLeave.bind(this)}>
        <div className='tc dib br3 ma3 grow bw2 shadow-5' style={outerDivStyle}>
          {imageSource ? <img className={imgClass} src={imageSource} alt={title} height={imgHeight} style={{borderTopLeftRadius: '0.5em', borderTopRightRadius: '0.5em'}}/> : null}
          <div className='tc ph3 pb3'>
            <h3 className='mt2 mb1' style={{height:42, display:'flex', justifyContent:'center', alignItems: 'center'}}>{title}</h3>
            <p className='mt2 mb0' style={{display:'flex', justifyContent:'center', alignItems: 'center'}}>{subtitle}</p>
            {author ? <p className="f7 mt2 mb0 pt2 i">By {author}</p> : null}
          </div>
        </div>
      </a>
    );
  }
}

export default Card;
