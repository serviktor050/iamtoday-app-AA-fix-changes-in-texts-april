import React, { Component } from 'react';
import classNames from "classnames/bind";
import { Helmet } from "react-helmet";

import styles from './styles.css';

const cx = classNames.bind(styles);


class Video extends Component {
  constructor(props) {
    super(props)

    this.state = {
      
    }
  }
    

  render() {
    const { video } = this.props;
    
    const isHttp = video.slice(0, 4) === 'http';
    const isScript = video.slice(0, 7) === '<script';
    let iframe;
    if (isScript) {
      iframe = video.match(/<iframe[\S\s]+iframe>/)[0];
    }
    return (
      <div className={cx("video")} id='video'>
        {!isScript ? <iframe
          src={`${video}?autoplay=1&loop=1&autopause=0`}
          frameBorder="0"
          allowFullScreen
        ></iframe> : 
        <div dangerouslySetInnerHTML={{__html: iframe}}></div>
        }
      </div>
    )
  }
}

export default Video