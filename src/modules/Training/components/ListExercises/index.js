import React, { Component} from 'react';
import classNames from 'classnames/bind';
import * as ducks from '../../ducks';
import * as R from 'ramda';

import styles from './styles.css';

import {compose} from "redux";
import {connect} from "react-redux";
import {dict} from 'dict';
const cx = classNames.bind(styles);

class ListExercise extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            activeExercise: null,
            groupsVisibility:{}
        };
    }
    

    componentDidMount() {
        const {list, setExerciseIdx, activeExercise, activeGroup} = this.props;
        const groupsVisibility = {};

        if (activeExercise) {

            var myElement = document.querySelector(`.exercise-${activeExercise}`);
            if (myElement) {
                // eslint-disable-next-line no-unused-expressions
                myElement.getBoundingClientRect().top;
            }

            const {exercise, exerciseIdx} = this.findExerciseWithIndex(list, Number(activeExercise));

            groupsVisibility[exercise.tags || ''] = true;
            setExerciseIdx({id: activeExercise, exerciseIdx});
            this.scrollTo(exerciseIdx);
        } else {
            if (activeGroup) {
                groupsVisibility[activeGroup || ''] = true;
            }
        }
        const locationPathname = location.pathname.split('/');
        if (list.keys.length > 1 && activeGroup === list.keys[0]) {
            const activeGroupReal = list.keys.filter(block => list.data[block].find(video => video.id === Number(locationPathname[locationPathname.length - 1])));
            groupsVisibility[activeGroupReal[0] || ''] = true;
            groupsVisibility[activeGroup] = false;
        }

        this.setState({activeExercise: Number(activeExercise) || Number(locationPathname[locationPathname.length - 1]), groupsVisibility});
    }

    componentDidUpdate(prevProps) {
        const {list, setExerciseIdx, activeExercise, activeGroup} = this.props;
        if (prevProps.activeExercise !== activeExercise || prevProps.activeGroup !== activeGroup) {
            const groupsVisibility = {};
            if (activeExercise) {

                var myElement = document.querySelector(`.exercise-${activeExercise}`);
                if (myElement) {
                    // eslint-disable-next-line no-unused-expressions
                    myElement.getBoundingClientRect().top;
                }

                const {exercise, exerciseIdx} = this.findExerciseWithIndex(list, activeExercise);

                const tags = R.path(['tags'], exercise);

                groupsVisibility[tags || ''] = true;
                setExerciseIdx({id: activeExercise, exerciseIdx});
                this.scrollTo(exerciseIdx);
            } else {
                if (activeGroup) {
                    groupsVisibility[activeGroup || ''] = true;
                }
            }
            const locationPathname = location.pathname.split('/');
            if (list.keys.length > 1 && activeGroup === list.keys[0]) {
                const activeGroupReal = list.keys.filter(block => list.data[block].find(video => video.id === Number(locationPathname[locationPathname.length - 1])));
                groupsVisibility[activeGroupReal[0] || ''] = true;
                groupsVisibility[activeGroup] = false;
            }

            this.setState({activeExercise: Number(activeExercise) || Number(locationPathname[locationPathname.length - 1]), groupsVisibility});
        }
    }

    scrollTo = (exerciseIdx) => {
        document.getElementById('list').scrollTop = exerciseIdx * 110;
    };

    findExerciseWithIndex = (list, id) => {
        let cursorExerciseIdx = 0;
        let exercise = null;
        let exerciseIdx = 0;
        list.keys.forEach((key) => {
            list.data[key].forEach((item) => {
                if (item.id === id) {
                    exercise = item;
                    exerciseIdx = cursorExerciseIdx;
                }
                cursorExerciseIdx++;
            });
        });
        return { exercise, exerciseIdx };
    };

    toggleExercise = async (id) => {
        const { list, dispatch, setExerciseIdx } = this.props;
        const {exercise, exerciseIdx} = await this.findExerciseWithIndex(list, id);
        await dispatch(ducks.setExercise(exercise));
        await dispatch(ducks.sendView({ id: exercise.id }));
        await this.setState({ activeExercise: exercise.id });
        await setExerciseIdx({exercise, id, exerciseIdx});
        await window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    toggleExerciseGroupVisibility = (tags) => {
        if (tags) {
            const {groupsVisibility} = this.state;
            groupsVisibility[tags] = !groupsVisibility[tags];
            this.setState({groupsVisibility: {...groupsVisibility}});
        }
    };

    getVideoLength = (duration) => {
        const hours = (duration / 60).toFixed(0)
        return hours > 0 ? `${hours}ч. ${duration % 60}мин.` : `${duration} мин.`
    }

    renderVideos(videos) {
        return (videos || []).map((exercise, index) => {
            const isActive = exercise.id === this.state.activeExercise;
            const name = exercise.name && exercise.name.length > 50 ? `${exercise.name.slice(0, 50)}...` : exercise.name;
            return (
                <div key={exercise.id} className={cx('exercise-preview', `exercise-${exercise.id}`, {'active': isActive})}
                        onClick={() => this.toggleExercise(exercise.id)}
                >
                    <div className={cx('exercise-preview__index', isActive)}/>
                    <div className={cx('exercise-preview__info')}>
                        <div className={cx('exercise-preview__name')}>
                            <span className={cx('exercise-preview__number')}>{`${index + 1}.`}</span>&nbsp;
                            {name}
                        </div>
                        <div className={cx('exercise-preview__timing')}>{exercise.duration ? this.getVideoLength(exercise.duration) : "0 мин."}</div>
                        {isActive && exercise.isPaid && <div className={cx('exercise-preview__status')}></div>}
                    </div>
                </div>
            )
        })
    }

    render() {
        const {list, lang, playlistNode} = this.props;
        const {groupsVisibility} = this.state;
        return (
            <div id='list' className={cx('list__content')} style={{maxHeight: playlistNode ? playlistNode.clientHeight : 'initial'}} >
                {list.keys.map((groupName, index) => {
                    const videos = list.data[groupName] || [];
                    if(groupName){
                        return (<div key={`${groupName}_${index}`}>
                            <div className={cx('group')} onClick={() => this.toggleExerciseGroupVisibility(groupName)}>{groupName}
                                <span className={cx('group-meta')}>{videos.length} {dict[lang]['lecture.playlist.primaryText.video']}</span>
                                <span className={cx('group__toggle__arrow',
                                    {'group__toggle__arrow-up':!groupsVisibility[groupName]},
                                    {'group__toggle__arrow-down':!!groupsVisibility[groupName]})}/></div>
                            <div className={cx('group-videos', {'group-hidden': !groupsVisibility[groupName]})}>
                                {this.renderVideos(videos)}
                            </div>
                        </div>)
                    }
                    return (<div className={cx('group-videos')}>
                        {this.renderVideos(videos)}
                    </div>)})
                }
            </div>
        )
    }
}
const mapStateToProps = (state) => ({ lang: state.lang })

const mapDispatchToProps = (dispatch) => ({ dispatch })

export default compose(connect(mapStateToProps, mapDispatchToProps))(ListExercise);
