import React, { Component } from 'react'
import Modal from 'react-modal'
import CSSModules from 'react-css-modules'
import styles from './exercises.css'
import { browserHistory, Link } from 'react-router'
import Layout from '../componentKit2/Layout'
import YoutubeModal from './YoutubeModal'

class ExerciseItem extends Component {

  render() {
    return (
      <Layout page={-1}>
        <div className={styles.video}>
          <YoutubeModal
            singlePage={true}
            exercise={this.props.location.state.exercise}
            ind={this.props.location.state.ind}
            isActive={this.props.location.state.isActive}
            activeItem={this.props.location.state.activeItem}
          />
        </div>
      </Layout>

    )
  }
}

export default CSSModules(ExerciseItem, styles)
