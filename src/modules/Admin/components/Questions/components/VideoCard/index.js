import React, { Component } from 'react';
import classNames from "classnames/bind";
import { connect } from "react-redux";
import { dict } from 'dict';

import styles from "./styles.css";
import Questions from '../../../../../Training/components/Questions';

const cx = classNames.bind(styles);

class VideoCard extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       isExpanded: false,
    }
  }
  
  render() {
    const { video } = this.props;
    return (
      <div className={cx('video__card')}> 
        <div className={cx('video__header', { 'video__header-border': this.state.isExpanded })}>
          <img className={cx('video__thumbnail')} src={video.thumbnail} alt='thumbnail' width='56' />
          <h3 className={cx('video__name')}>{video.name}</h3>
          <button 
            onClick={_ => this.setState(({ isExpanded }) => ({ isExpanded: !isExpanded }))}
            className={cx('video__btn', this.state.isExpanded ? 'video__btn-hide' : 'video__btn-expand')}></button>
        </div>
        {this.state.isExpanded && <Questions exercise={video} />}
      </div>
    )
  }
}

const mapStateToProps = state => ({ lang: state.lang })
const mapDispatchToProps = dispatch => ({ dispatch })


export default connect(mapStateToProps, mapDispatchToProps)(VideoCard)