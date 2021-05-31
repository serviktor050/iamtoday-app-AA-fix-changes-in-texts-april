import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Media from 'react-media';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import YouTube from 'react-youtube';
import { pluralize } from 'utils/helpers';
import { browserHistory, Link } from 'react-router'
import {dict} from 'dict';
import Layout from 'components/componentKit2/Layout';
import ListExercises from '../../components/ListExercises';
import * as ducks from '../../ducks';
import * as selectors from '../../selectors';
import { pageNumber } from '../../main';
import Loader from 'components/componentKit/Loader'
import TabsNav from 'components/common/TabsNav';
import NotePad from 'components/common/NotePad';
import ReactRichTextEditor from 'react-rte';

import {
    Entity,
    Editor,
    EditorState,
    ContentState,
    convertFromHTML,
    convertFromRaw,
    CompositeDecorator
} from 'draft-js'
import { getCustomStyleMap } from 'draftjs-utils';
import {groupByWithKeys} from "utils";
import {GLOBAL_MEDIA_QUERIES} from "utils/data";
import {getPreferSelectedTabName, getTabs, TAB_NAMES} from "../../utils";
import styles from './styles.css';
import RatingVideo from '../../components/Rating';
import Questions from '../../components/Questions';

const cx = classNames.bind(styles);
const videoSettings = (width, height, autoplay) => ({
    height: height,
    width: width,
    playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: autoplay
    }
});

const customStyleMap = getCustomStyleMap()

const decorator = new CompositeDecorator([
    {
        strategy: (contentBlock, callback) => {
            contentBlock.findEntityRanges(
                (character) => {
                    const entityKey = character.getEntity()
                    return (
                        entityKey !== null &&
                        Entity.get(entityKey).getType() === 'LINK'
                    )
                },
                callback
            )
        },
        component: (props) => {
            const {url} = Entity.get(props.entityKey).getData()
            return (
                <a href='#' onClick={() => {
                    window.open(url, '_blank')
                    return false
                }}>
                    {props.children}
                </a>
            )
        }
    }
])

const Image = (props) => {
    return <img src={props.src} style={{
        maxWidth: '100%',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto' }}/>
}

const Atomic = (props) => {
    const entity = Entity.get(props.block.getEntityAt(0))
    const {src} = entity.getData()
    const type = entity.getType()

    let media
    if (type === 'IMAGE') {
        media = <Image src={src} />
    }

    return media
}

function mediaBlockRenderer(block) {
    if (block.getType() === 'atomic') {
        return {
            component: Atomic,
            editable: false
        }
    }

    return null
}

class TrainingExercise extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            activeExercise: null,
            exerciseIdx: null,
            selectedTab : TAB_NAMES.DESCRIPTION,
            isPlaylistVisible: false,
        }

        this.playlist = null;
        this.setPlaylistRef = element => {
            this.playlist = element
        }
    }
    

    async componentDidMount(){
        const { dispatch, params, playlist, exercise } = this.props;

        const id = params.playlist;
        const exerciseId = params.exercise;
        if(!playlist){
            await dispatch(ducks.getPlaylist({id, exerciseId}))
        } else {
          let exercise = {};
          playlist.data.videos.forEach((video) => {
              if(video.id == exerciseId){
                exercise = video;
              }
          });
          dispatch(ducks.setExercise(exercise));
        }

        this.setState({ activeExercise: exerciseId });
    }

    componentDidUpdate() {
        const { params, playlist } = this.props;
        if (!this.state.exerciseIdx && this.state.exerciseIdx !== 0 && playlist && playlist.data && playlist.data.videos && playlist.data.videos.length) {
            const exerciseId = params.exercise;
            const currentExerciseIndex = playlist.data.videos.findIndex(item => item.id == exerciseId) 

            this.setState({ exerciseIdx: currentExerciseIndex });
        }
    }

    getVideoId = (video) => {
        return video.split('/')[video.split('/').length - 1];
    }

    setExerciseIdx = ({id, exerciseIdx}) => {
        const { playlist } = this.props;
        browserHistory.push(`/trainings/module/${playlist.data.id}/${id}`);
        this.setState({ exerciseIdx })
    }

    setPrevExerciseIdx = async () => {
        const { playlist, dispatch } = this.props;
        const exercise = playlist.data.videos[this.state.exerciseIdx - 1]
        await dispatch(ducks.setExercise(exercise));
        await dispatch(ducks.sendView({ id: exercise.id }));
        browserHistory.push(`/trainings/module/${playlist.data.id}/${exercise.id}`);
        this.setState({ exerciseIdx: this.state.exerciseIdx - 1, activeExercise: exercise.id })
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setNextExerciseIdx = async () => {
        const { playlist, dispatch } = this.props;
        const exercise = playlist.data.videos[this.state.exerciseIdx + 1]
        await dispatch(ducks.setExercise(exercise));
        await dispatch(ducks.sendView({ id: exercise.id }));
        browserHistory.push(`/trainings/module/${playlist.data.id}/${exercise.id}`);
        this.setState({ exerciseIdx: this.state.exerciseIdx + 1, activeExercise: exercise.id })
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    toPlaylist = () => {
        const { playlist } = this.props;
        browserHistory.push(`/trainings/module/${playlist.data.id}`);
    }

    toMain = () => {
        browserHistory.push('/trainings');
    }

    toggleLike = () => {
      const { dispatch, exercise } = this.props;
      const method = exercise.liked ? 'unlike' : 'like';
      dispatch(ducks.toggleLike(exercise.id, method, this.afterToggleLike));
    }

    afterToggleLike = (method) => {
        const { exercise, dispatch } = this.props;
        const likes = method === 'like' ? exercise.likes  + 1 : exercise.likes - 1;
        const liked = method === 'like';
    }

    toggleTab = (tab) => {
        const {dispatch} = this.props;
        dispatch(ducks.setVideoTab(tab.name))
    };

    notePadOnSave = ({itemId, value}) => {
        const {dispatch} = this.props;
        dispatch(ducks.saveVideoUserNote(itemId, value ? value.toString("html") : ''));
    };

    renderDescription = (exercise) => {
        const editorState = exercise && exercise.description
            ? EditorState.createWithContent(convertFromRaw(JSON.parse(exercise.description)), decorator)
            : EditorState.createEmpty();
        return (
                <Editor
                    readOnly={true}
                    customStyleMap={customStyleMap}
                    editorState={editorState}
                    blockRendererFn={mediaBlockRenderer}
                />
        )
    };


    renderAdditionalMaterial = (exercise) => {

        let editorState = EditorState.createEmpty();

        const additionalMaterials = R.path(['additionalMaterials'], exercise);
        if (additionalMaterials) {
            const blocksFromHTML = convertFromHTML(additionalMaterials);
            const contentState = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap,
            );
            editorState = contentState
                ? EditorState.createWithContent(contentState, decorator)
                : EditorState.createEmpty();
        }

        return (additionalMaterials ? (<Editor
                    readOnly={true}
                    customStyleMap={customStyleMap}
                    editorState={editorState}
                    blockRendererFn={mediaBlockRenderer}
                />) : <div/>)
    }

    renderNotePad(exercise, lang) {
        const {id} = exercise;
        let userNote = R.path(['userNote'], exercise);
        const value = userNote
            ? ReactRichTextEditor.createValueFromString(userNote, "html")
            : ReactRichTextEditor.createEmptyValue();
        return (<NotePad key={`videoNotePad${id}`}
                         itemId={id}
                         placeholder={dict[lang]['notepad.placeholder']}
                         value={value}
                         onSave={this.notePadOnSave}/>)
    }

    renderTabContent = (tabName, lang, matches, isPaid) => {
        const { exercise, dispatch, playlist }= this.props;
        switch (tabName) {
            case TAB_NAMES.DESCRIPTION: return this.renderDescription(exercise);
            case TAB_NAMES.ADDITIONAL_MATERIALS: return this.renderAdditionalMaterial(exercise);
            case TAB_NAMES.NOTES: return this.renderNotePad(exercise, lang);
            case TAB_NAMES.EXERCISES: return !matches.desktop &&  <ListExercises
                    isPaid={isPaid}
                    list={groupByWithKeys(playlist.data.videos, (v) => v.tags || '')}
                    optsVideo={videoSettings('130', '85', 1)}
                    activeExercise={this.state.activeExercise !== null ? this.state.activeExercise : exercise.id}
                    getVideoId={this.getVideoId}
                    dispatch={dispatch}
                    setExerciseIdx={this.setExerciseIdx}
                />;
            case TAB_NAMES.QUESTIONS: return <Questions exercise={exercise} />;
            default: return <div/>;
        }
    };

    onClickPlaylistToggleButton = (e)  => {
        e.preventDefault();
        const {dispatch, playlistCollapsed} = this.props;
        dispatch(ducks.setPlayListCollapsed(!playlistCollapsed))
    };

    render() {
        const { location, playlist, userInfo, exercise, dispatch , lang, selectedTab, playlistCollapsed} = this.props;

        const prevSeasons = R.path(['data', 'prevSeasons'], userInfo);
        const isPaid = R.path(['data', 'isPaid'], playlist);
        const isEmpty = !exercise || !playlist || !playlist.data || R.path(['isFetching'], playlist);

        const tagsArr = exercise && exercise.tags ? exercise.tags.split('|') : [];

        return (
            <Layout
                scroller={true}
                page={'trainings'}
                prevSeasons={prevSeasons}
                location={location}
                buy={true}
            >
                {
                    isEmpty ? <Loader /> : !exercise.id ? <div>Нет такого видео</div> :

                        <Media queries={{ desktop: GLOBAL_MEDIA_QUERIES.desktop }}>
                            {matches => {
                                const tabs = getTabs(playlist, lang, !matches.desktop);
                                const selectedTabName  = getPreferSelectedTabName(matches, tabs, selectedTab);
                                return (
                                    <div>
                                        <div className={cx('content')}>
                                        <div className={cx('bread')}>
                                            <div className={cx('bread__item', 'bread__item--link')} onClick={this.toMain}>Модули</div>
                                            <div className={cx('bread__item', 'bread__item--link')}
                                                onClick={this.toPlaylist}>{playlist.data.name}</div>
                                            <div className={cx('bread__item')}>{exercise.name}</div>
                                        </div>
                                        <div className={cx('exercise')}>
                                            <div className={cx('main')}>
                                                {
                                                    exercise.isPaid && exercise.video ?
                                                        <div className={cx('video')}>
                                                            <iframe src={`${exercise.video}?autoplay=1&loop=1&autopause=0`} frameBorder="0" allow="autoplay; fullscreen" allowFullScreen></iframe>
                                                        </div> :
                                                        <div className={cx('images')}>
                                                            <img src={R.path(['thumbnail'], exercise)} alt=""/>
                                                        </div>

                                                }
                                                <div className={cx('main__container')}>
                                                    <div className={cx('info')}>
                                                        <div className={cx('name')}>{exercise.name}</div>
                                                    </div>
                                                    <div className={cx('tags')}>
                                                        {tagsArr.map((tag, index) => <div key={"tag_"+index} className={cx('tag')}>{`#${tag}`}</div>)}
                                                    </div>
                                                    <div className={cx('rating')}>
                                                        {/* <RatingVideo video={exercise} /> */}
                                                        {playlist && playlist.data && playlist.data.videos.length && <div className={cx('video__control')}>
                                                            <button
                                                             disabled={!this.state.exerciseIdx}
                                                             className={cx('video__control-btn', 'video__control-btnPrev')} 
                                                             onClick={this.setPrevExerciseIdx} 
                                                            ></button>
                                                            <button
                                                             disabled={this.state.exerciseIdx === (playlist.data.videos.length - 1)}
                                                             className={cx('video__control-btn', 'video__control-btnNext' )} 
                                                             onClick={this.setNextExerciseIdx}
                                                            ></button>
                                                        </div>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={cx('content')}>
                                        <div className={cx('desc__header')}>
                                            <div className={cx('desc__editor')}>
                                                <TabsNav
                                                    tabs={tabs}
                                                    tabNavClass="tabWebinars"
                                                    setActive={(tab) => tab.name === selectedTabName}
                                                    onClick={this.toggleTab}
                                                    mobile="scroll"
                                                />
                                            </div>
                                            
                                            {this.renderPlaylistHeader(playlist, playlistCollapsed, lang, isPaid, dispatch, matches)}
                                            
                                        </div>
                                        <div className={cx('desc')}>
                                            <div className={cx('desc__editor',{[styles.collapsed] : playlistCollapsed})}>
                                                {this.renderTabContent(selectedTabName, lang, matches, isPaid)}
                                                {matches.desktop && playlistCollapsed && 
                                                <div className={cx('playlist__container')} style={{ minWidth: this.playlist ? this.playlist.clientWidth : '330px', width: this.playlist ? this.playlist.clientWidth : '330px' }}>
                                                    <ListExercises
                                                        activeGroup={playlist.data.videos.length > 0 ? playlist.data.videos[0].tags : null}
                                                        activeExercise={this.state.activeExercise}
                                                        list={groupByWithKeys(playlist.data.videos, (v) => v.tags || '')}
                                                        setExerciseIdx={this.setExerciseIdx}
                                                        dispatch={dispatch}
                                                        isPaid={isPaid}
                                                    />
                                                </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}}
                    </Media>
                }
            </Layout>
        )
    }

    renderPlaylistHeader(playlist, playlistCollapsed, lang, isPaid, dispatch, matches) {
        return (
            <div ref={this.setPlaylistRef} className={cx('list')}>
                <div onClick={this.onClickPlaylistToggleButton} className={cx('list__control')}>
                    <span className={cx('list__textWrapper')}><span className={cx('list__text')}>{`${this.state.exerciseIdx + 1} видео`}</span>&nbsp;{` из ${playlist.data.videos.length}`}</span>
                    <span className={cx(playlistCollapsed ? 'list__hide' : 'list__expand')}>{playlistCollapsed ? `Свернуть` : 'Развернуть'}</span>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        exercise: selectors.selectExercise(state),
        playlistCollapsed: selectors.selectPlaylistCollapsed(state),
        playlist: selectors.selectPlaylist(state),
        lang: state.lang,
        userInfo: selectors.userInfo(state),
        selectedTab: selectors.selectVideoSelectedTab(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(TrainingExercise);
