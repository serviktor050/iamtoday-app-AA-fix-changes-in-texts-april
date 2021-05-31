import React, { Component } from 'react';
import classNames from "classnames/bind";
import { connect } from "react-redux";
import { dict } from 'dict';

import styles from "./styles.css";
import VideoCard from '../VideoCard';

const cx = classNames.bind(styles);

class ModuleCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isExpanded: false,
    }
  }
  
  render() {
    const { module, lang } = this.props;
    const videosWithQuestions = module.videos.filter(video => video.chats.length > 0)
    if (videosWithQuestions.length === 0) {
      return null;
    } 
    const notNullQuestions = videosWithQuestions.filter(video => video.chats.filter(chat => chat.comments.length > 0).length > 0)
    if (notNullQuestions.length === 0) {
      return null;
    }
    return (
      <div className={cx('module__card')}>
        <div className={cx('module__header')}>
          <h2 className={cx('module__name')}>{module.name}</h2>
          <button 
            onClick={_ => this.setState(({ isExpanded }) => ({ isExpanded: !isExpanded }))} 
            className={cx('module__btn', this.state.isExpanded ? 'module__btn-hide' : 'module__btn-expand')}></button>
        </div>
        {this.state.isExpanded && 
        module.videos.filter(video => video.chats.length > 0).map(video => <VideoCard key={video.id} video={video} />)}
      </div>
    )
  }
}

const mapStateToProps = state => ({ lang: state.lang })
const mapDispatchToProps = dispatch => ({ dispatch })


export default connect(mapStateToProps, mapDispatchToProps)(ModuleCard)