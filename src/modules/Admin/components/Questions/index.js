import React, { Component } from 'react';
import classNames from "classnames/bind";
import { connect } from "react-redux";
import { dict } from 'dict';


import AdminLayout from '../AdminLayout';
import Tabs from './components/Tabs';
import styles from "./styles.css";
import * as selectors from "../../selectors";
import * as ducks from '../../ducks';

import { WO_ANSWERS, W_ANSWERS, ALL_ANSWERS } from './components/Tabs';
import { isDataNotFetched } from '../../utils';
import Loader from '../../../../components/componentKit/Loader';
import ModuleCard from './components/ModuleCard';


const page = 'questions';

const cx = classNames.bind(styles);

const payload = {
  [WO_ANSWERS]: 0,
  [W_ANSWERS]: 2,
  [ALL_ANSWERS]: null
}


class QuestionsPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentTab: WO_ANSWERS,
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(ducks.getQuestions({"chatStatus":payload[this.state.currentTab]}));
  }

  handleChangeTab = (tab) => {
    const { dispatch } = this.props;
    dispatch(ducks.getQuestions({ "chatStatus": payload[tab] }));
  }

  getTab = (tab) => {
    this.handleChangeTab(tab)
    this.setState({ currentTab: tab })
  }
  
  render() {
    const { questions } = this.props;
    const i18n = dict[this.props.lang];
    return (
      <AdminLayout page={page} location={location} >
        <section className={cx('layout')}>
          <h1 className={cx('title')}>{i18n['admin.questions.title']}</h1>
          <Tabs getTab={this.getTab} currentTab={this.state.currentTab} disabled={isDataNotFetched(questions)} />
          {isDataNotFetched(questions) ? <Loader /> : 
          questions.data.map(module => <ModuleCard key={module.id} module={module} />)
          }
        </section>
      </AdminLayout>
    )
  }
}

const mapStateToProps = state => ({ lang: state.lang, questions: selectors.selectQuestons(state) })
const mapDispatchToProps = dispatch => ({ dispatch })


export default connect(mapStateToProps, mapDispatchToProps)(QuestionsPage)