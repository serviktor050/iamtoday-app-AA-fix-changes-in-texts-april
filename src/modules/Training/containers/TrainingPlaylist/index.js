import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import * as R from 'ramda';
import classNames from 'classnames/bind';
import {browserHistory} from 'react-router'
import Layout from 'components/componentKit2/Layout';
import TabsNav from 'components/common/TabsNav';

import moment from 'moment'
import Loader from 'components/componentKit/Loader'
import {Button} from 'components/common/Button';
import {dict} from 'dict';
import NotePad from 'components/common/NotePad';
import ReactRichTextEditor from 'react-rte';
import cookie from "react-cookie";

import {CompositeDecorator, ContentState, convertFromHTML, convertFromRaw, Editor, EditorState, Entity} from 'draft-js'
import {getCustomStyleMap} from 'draftjs-utils';
import {groupByWithKeys} from "utils";
import {GLOBAL_MEDIA_QUERIES} from "utils/data";
import {getTabs, getPreferSelectedTabName, TAB_NAMES} from "../../utils";
import Media from "react-media";
import { UncontrolledTooltip } from "reactstrap";
import Modal from 'boron-react-modal/FadeModal'
import {
    isQuizPending,
    isQuizReadyToStart,
    resolveRemainingTimeTextAndValue
} from "../../../Quiz/common";
import ListExercises from "../../components/ListExercises";
import * as ducks from '../../ducks';
import * as selectors from '../../selectors';
import styles from './styles.css';
import InformingBlock from "../../../../components/common/InformingBlock";
import { host } from "../../../../config.js";
import { sendPayment, getCost } from 'modules/Buy/ducks';
import api from 'utils/api';
import Questions from '../../components/Questions';

const cx = classNames.bind(styles);

const customStyleMap = getCustomStyleMap();

const breadCrumbsName = {
    module: 'lecture.modules',
    thematic: 'lecture.thematicModule',
    video: 'lecture.videos',
    congress: 'lecture.congress'
};

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

// TEMPORARY\

let contentStyle = {
    borderRadius: '18px',
    padding: '30px'
  }

// END

class TrainingPlaylist extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            playTrailer: false,
            selectedTab : TAB_NAMES.DESCRIPTION,
            activationError: null,
            activationSuccess: false,
        }

        this.playlist = null;

        this.setPlaylistRef = element => {
            this.playlist = element
        }
    }
    

    componentDidMount(){
        const { params, dispatch, playlist, location } = this.props;
        const id = params.playlist;
        dispatch(ducks.getPlaylist({id}));
        if (location.query.success === 'true') {
            this.refs.successModal.show()
            setTimeout(() => {
                browserHistory.push('/trainings')
            }, 5000)
        }
    }

    // TEMPORARY

    toggleLoading = () => {
        this.refs.loadingModal.show();
    }

    toggleSuccess = () => {
        const { location } = this.props;
        this.refs.loadingModal.hide()
        this.refs.successModal.show()
        setTimeout(() => {
            browserHistory.push('/trainings')
        }, 5000)
    }

    // END

    getModuleCost = async () => {
        const { playlist } = this.props;
        const token = cookie.load('token');
        const data = {itemType: 2, itemId: playlist.data.id}
        const result = await api.getCost({ AuthToken: token, data })
        return result.data.data[0].cost 
    }

    toggleTab = (tab) => {
        const {dispatch} = this.props;
        dispatch(ducks.setModuleTab(tab.name))
    };

    goToExercise = (exercise, playlistId) => {
        browserHistory.push(`/trainings/module/${playlistId}/${exercise.id}`);
    }

    toMain = () => {
        browserHistory.push('/trainings');
    }

    notePadOnSave = ({itemId, value}) => {
        const {dispatch} = this.props;
        dispatch(ducks.saveModuleUserNote(itemId,value ? value.toString("html"):''));
    };

    toExercise = () => {
        const { dispatch, playlist } = this.props;
        browserHistory.push(`/trainings/module/${playlist.data.id}/${playlist.data.exercises[0].id}`);
    }

    activateModule = async () => {
        const { dispatch, playlist } = this.props;
        await dispatch(ducks.activateModule(
            { id: playlist.data.id },
            () => {
                this.setState({ activationSuccess: true })
            }, 
            () => {
                this.refs.errorModal.show();
            }))
    }

    togglePlaylist = () => {
        this.setState({ isPlaylistVisible: !this.state.isPlaylistVisible })
    }

    renderDescriptionTabContent(playlist) {

        const editorState = R.path(['data', 'description'], playlist)
            ? EditorState.createWithContent(convertFromRaw(JSON.parse(playlist.data.description)), decorator)
            : EditorState.createEmpty();

        return (<div className={cx('editor__content')}>
            <div className={cx('title')}>
                <div className={cx('name')}>{R.path(['data', 'name'], playlist)}</div>
            </div>
            <div className={cx('description')}>
                <Editor
                    readOnly={true}
                    customStyleMap={customStyleMap}
                    editorState={editorState}
                    blockRendererFn={mediaBlockRenderer}
                />
            </div>
        </div>)
    }

    renderAdditionalMaterialTabContent(playlist) {

        let editorState = EditorState.createEmpty();

        const additionalMaterials = R.path(['data', 'additionalMaterials'], playlist);
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

        return (<div className={cx('editor__content')}>
            <div className={cx('description')}>
                <Editor
                    readOnly={true}
                    customStyleMap={customStyleMap}
                    editorState={editorState}
                    blockRendererFn={mediaBlockRenderer}
                />
            </div>
        </div>)
    }

    renderNotePad(playlist, lang) {
        let userNote = R.path(['data', 'userNote'], playlist);
        const value = userNote
            ? ReactRichTextEditor.createValueFromString(userNote, "html")
            : ReactRichTextEditor.createEmptyValue();
        return (<NotePad key={`moduleNotePad${playlist.data.id}`}
                         itemId={playlist.data.id}
                         placeholder={dict[lang]['notepad.placeholder']}
                         value={value}
                         onSave={this.notePadOnSave}/>)
    }

    renderTabContent = (tabName, lang, matches) => {
        const { playlist} = this.props;
        switch (tabName) {
            case TAB_NAMES.DESCRIPTION: return this.renderDescriptionTabContent(playlist)
            case TAB_NAMES.ADDITIONAL_MATERIALS: return this.renderAdditionalMaterialTabContent(playlist)
            case TAB_NAMES.NOTES: return this.renderNotePad(playlist, lang)
            case TAB_NAMES.EXERCISES: return !matches.desktop && this.renderList(matches);
            case TAB_NAMES.QUESTIONS: return <Questions exercise={playlist.data} />;
            default: return <div/>;
        }
    };

    renderList = (matches) => {

        const {playlist, dispatch} = this.props;
        const isPaid = R.path(['data', 'isPaid'], playlist);

        const videos = R.path(['data', 'videos'], playlist) && playlist.data.videos.length
            ? playlist.data.videos
            : [];

        if(videos.length === 0){
            return;
        }


        if (matches && !matches.desktop) {
            return (
            <div className={cx('playlist__container')} style={{ minWidth: this.playlist ? this.playlist.clientWidth : '350px', width: this.playlist ? this.playlist.clientWidth : '350px' }}>
                <ListExercises
                setExerciseIdx={({exercise}) => this.goToExercise(exercise, playlist.data.id)}
                activeGroup={videos.length > 0 ? videos[0].tags : null}
                list={groupByWithKeys(videos, (v) => v.tags || '')}
                dispatch={dispatch}
                isPaid={isPaid}
                />
            </div>)
        }

        return <div ref={this.setPlaylistRef} className={cx('list')}>
            <div onClick={this.togglePlaylist} className={cx('list__control')}>
                <span className={cx('list__textWrapper')}><span className={cx('list__text')}>{`${videos.length} видео`}</span></span>
                <span className={cx(this.state.isPlaylistVisible ? 'list__hide' : 'list__expand')}>{this.state.isPlaylistVisible ? `Свернуть` : 'Развернуть'}</span>
            </div>
        </div>;
    };

    render() {
        const { page, location, playlist, userInfo, dispatch, lang, selectedTab } = this.props;

        // TEMPORARY FOR EVENT (NOT ON~LY)

        const ids = [28, 29];
        const MODULE_GIFT_ID = 30
        const specialId = Number(R.path(['data', 'id'], playlist));

        // END

        const prevSeasons = R.path(['data', 'prevSeasons'], userInfo);
        const isEmpty = !playlist || !playlist.data || R.path(['isFetching'], playlist);
        const isPaid = R.path(['data', 'isPaid'], playlist);

        const isAfter = moment(R.path(['data', 'date'], playlist)).isAfter(moment());
        const exercisesAmount = R.path(['data', 'exercises'], playlist) ? playlist.data.exercises.length : 0;
        const editorState = R.path(['data', 'description'], playlist) ? EditorState.createWithContent(convertFromRaw(JSON.parse(playlist.data.description)), decorator) : EditorState.createEmpty();
        const isNeedActivation = R.path(['data', 'needActivation'], playlist);
        const expirationDays = R.path(['data', 'expirationDays'], playlist);
        const isAvailable = (moment() - moment(R.path(['data', 'expirationDate'], playlist))) < 0;
        if (this.state.activationSuccess) {
            return (
                <Layout
                scroller={true}
                page={page}
                prevSeasons={prevSeasons}
                location={location}>
                    <div className={cx("activationSuccess")}>
                        <div className={cx("activationSuccess__header")}>{`${dict[lang]["buy.activationSuccessful"]} ${Number(expirationDays * 24).toLocaleString()} часа`}</div>
                        <div className={cx("activationSuccess__content")}>
                        <div className={cx("activationSuccess__pic")}>
                            <img src="/assets/img/antiage/checkup.svg" alt="" />
                        </div>
                        <div className={cx("activationSuccess__info")}>
                            <div className={cx("activationSuccess__text")}>{`${dict[lang]["buy.activationSuccessful.text1"]} ${Number(expirationDays * 24).toLocaleString()} часов. ${dict[lang]['buy.activationSuccessful.text2']}`}</div>
                            <div className={cx("activationSuccess__btns")}>
                            <Button
                                kind={"main"}
                                onClick={() => {
                                    dispatch(ducks.getPlaylist({ id: playlist.data.id }));
                                    this.setState({ activationSuccess: false })
                                }}
                                className={cx("activationSuccess__buy-btn")}
                            >
                                {dict[lang]["buy.activation.button"]}
                            </Button>
                            </div>
                        </div>
                        </div>
                    </div>
                </Layout>
                
            )
        }


        const ShowCard = ({ userInfo: {data: userInfo} }) => {
            const { mlmUserInfo: { parentUser, tutorRequests}} = userInfo;
            let props;
      
            if(parentUser && typeof parentUser == 'object' && R.isNil(tutorRequests[0])) return null;
      
            if(tutorRequests.length && typeof tutorRequests == 'object') {
      
              const { firstName, middleName, lastName, id } = tutorRequests[0].tutorInfo.userInfo;
              const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');
      
              const helluva = (
                <div className={cx('informingBlock__mainText')}>
                  <p>{dict[lang]['mlm.mentorship.chousenTutor']}</p>
                  <p className={cx('informingBlock__tutorName')}>{fullName}</p>
                </div>
              );
      
              props = {
                linkText: '', 
                mainText: helluva,
                buttonText: 'Открыть профиль наставника',
                buttonClick: _ => browserHistory.push(`/tutor/${id}`),
                linkHref: '#',
                type: 'alert',
                infoText: dict[lang]['mlm.mentorship.waitForApproving'],
              };
            }
      
            if(!parentUser && !tutorRequests.length) {
              props = {
                linkText: dict[this.props.lang]['lecture.info-block.message-why-i-need-mentor'],
                mainText: dict[this.props.lang]['lecture.info-block.message-chose-mentor'],
                buttonText: dict[this.props.lang]['lecture.info-block.btn-chose-mentor'],
                buttonClick: _ => browserHistory.push('/chose-mentor'),
                linkHref: '/faq#tutor',
                type: 'alert',
              };
            }
      
            return <InformingBlock {...props} />
          };

        return (
            <Layout
                scroller={true}
                page={page}
                prevSeasons={prevSeasons}
                location={location}
                buy={true}
                >
                <Modal ref='loadingModal' contentStyle={contentStyle} ><h2>Загрузка...</h2></Modal>
                <Modal ref='successModal' contentStyle={contentStyle} ><div><h2>Покупка успешно совершена!</h2><br/><h2>Через 5 секунд вы будете перенаправлены на главную страницу...</h2></div></Modal>
                <Modal ref='errorModal' contentStyle={contentStyle} ><h2>{dict[lang]['server.error.unexpectedError']}</h2></Modal>
                {
                    isEmpty ? <Loader /> : !R.path(['data', 'id'], playlist) ? <div>{dict[lang]['noModules']}</div>:

                        <div>
                            <div className={cx('content')}>
                                <div className={cx('bread')}>
                                    <div className={cx('bread__item', 'bread__item--link')}
                                        onClick={this.toMain}>{dict[lang][breadCrumbsName[playlist.data.categories]] || dict[lang]['section']}</div>
                                    <div className={cx('bread__item')}>{R.path(['data', 'name'], playlist)}</div>
                                </div>
                                {userInfo.data && userInfo.data.mlmUserInfo && <ShowCard userInfo={userInfo} />}
                                <div className={cx('detail', {'detail_paid': isPaid && playlist.data && playlist.data.videos && playlist.data.videos.length})}>
                                    <div className={cx('image')}>
                                        {
                                            this.state.playTrailer && R.path(['data', 'trailer'], playlist) ?
                                                <div className={cx('video')}>
                                                    <iframe src={playlist.data.trailer} frameBorder="0" allow="autoplay; fullscreen"
                                                            allowFullScreen></iframe>
                                                </div> :

                                                <img src={R.path(['data', 'thumbnail'], playlist)} alt=""/>
                                        }

                                        {
                                            isAfter &&
                                            <div className={cx('anonce')}>
                                                <div className={cx('anonce__text')}>{dict[lang]['expectedDate']}</div>
                                                <div className={cx('anonce__date')}>{moment(R.path(['data', 'date'], playlist)).lang(lang).format('ll')}</div>
                                            </div>
                                        }
                                    </div>
                                    <div className={cx('btns', {})}>
                                        {this.renderQuizButton(lang,  isPaid, playlist)}
                                        <div className={cx('btns__item')}>
                                            <Button
                                                kind='side'
                                                onClick={() => this.setState({playTrailer: !this.state.playTrailer})}>
                                                <svg className={styles.icon}>
                                                    <use xlinkHref="#trailer"/>
                                                </svg>
                                                <span>{dict[lang]['lecture.trailer']}</span>
                                            </Button>
                                        </div>
                                        {isAfter &&
                                            <div className={cx('btns__item')}>
                                                <Button
                                                    kind={!playlist.data.remind ? 'side-inverse' : 'disabled'}
                                                    onClick={() => {
                                                        const payload = {
                                                            remind: true,
                                                            id: playlist.data.id
                                                        };
                                                        dispatch(ducks.setRemind({itemType: 2, payload}))
                                                    }}>
                                                    <svg className={styles.icon}>
                                                        <use xlinkHref="#bell"/>
                                                    </svg>
                                                    <span>{dict[lang]['lecture.remind']}</span>
                                                </Button>
                                            </div>
                                        }
                                    {!isAfter && isPaid && isNeedActivation && 
                                        <div className={cx('btns__item')}>
                                            <Button
                                                king={'main'}
                                                onClick={this.activateModule}
                                            >
                                                <span>{isNeedActivation ? dict[lang]['activate'] : dict[lang]['activated']}</span>
                                            </Button>
                                        </div>
                                    }
                                    {!isAfter &&
                                    <div className={cx('btns__item', 'btns__item-buy')}>
                                        {isAvailable && this.renderRemainTime(lang, playlist)}
                                        <Button
                                            id="buyButton"
                                            kind={isPaid ? 'disabled' : 'main'}
                                            onClick={() => {
                                                if (!isPaid) {
                                                    if (ids.includes(specialId)) {
                                                        return ((_) => {
                                                            this.toggleLoading();
                                                            return dispatch(ducks.userCreateWebinar(
                                                                {
                                                                    email: userInfo.data.email, 
                                                                    firstName: userInfo.data.firstName, 
                                                                    lastName: userInfo.data.lastName,
                                                                    phone: userInfo.data.phone,
                                                                    package: 1,
                                                                    program: specialId === 28 ? 3 : 4,
                                                                    isBabyFeeding: specialId === 28,
                                                                    address: `${host}${location.pathname}?success=true`
                                                                }, "/trainings", this.toggleSuccess
                                                            ));
                                                        })();
                                                    }
                                                    if (specialId === MODULE_GIFT_ID) { 
                                                        (async () => {
                                                            const cost = await this.getModuleCost()
                                                            if (!cost) {
                                                                dispatch(sendPayment([{ itemType: 2, itemId: playlist.data.id, returnUrl: location.pathname }], 'yandex', location.pathname ))
                                                                return
                                                            } else {
                                                                return browserHistory.push(`/buy?itemType=2&itemId=${playlist.data.id}&returnUrl=${location.pathname}&zeroCost=true`);
                                                            }
                                                        })();    
                                                    }
                                                    return browserHistory.push(`/buy?itemType=2&itemId=${playlist.data.id}&returnUrl=${location.pathname}`);
                                                } 
                                                return null;
                                            }} >
                                            <svg className={styles.icon}>
                                                <use xlinkHref="#shopping-cart"/>
                                            </svg>
                                            <span>{isPaid ? dict[lang]['purchased'] : dict[lang]['buy']}</span>
                                        </Button>
                                    </div>
                                    }
                                </div>
                            </div>
                            </div>
                            <div className={cx('content')}>
                                <div className={cx('content__text')}>
                                    {
                                        isPaid && R.path(['data', 'presentation'], playlist) &&
                                        <div className={cx('presentation')}>
                                            <div className={cx('presentation__text')}>{dict[lang]['lecture.presentation']}</div>
                                            <div className={cx('presentation__link')}>
                                                <svg className={styles.iconFile}>
                                                    <use xlinkHref="#file"/>
                                                </svg>
                                                <a href={R.path(['data', 'presentation'], playlist)} target="_blank">{dict[lang]['lecture.download']}</a>
                                            </div>
                                        </div>
                                    }
                                    <Media queries={{desktop: GLOBAL_MEDIA_QUERIES.desktop}}>
                                        {matches => {
                                            let tabs = getTabs(playlist, lang, !matches.desktop).filter(item => item.name !== TAB_NAMES.QUESTIONS);
                                            const selectedTabName = getPreferSelectedTabName(matches, tabs, selectedTab, true);
                                            const videos = R.path(['data', 'videos'], playlist) && playlist.data.videos.length
                                                ? playlist.data.videos
                                                : [];
                                            return (<div className={cx('info')}>
                                                <div className={cx('top', {'top_paid': !R.path(['data', 'videos'], playlist) || !playlist.data.videos.length})}>
                                                    <div className={cx('tabs')}>
                                                        <TabsNav
                                                            tabs={tabs}
                                                            tabNavClass="tabWebinars"
                                                            setActive={(tab) => tab.name === selectedTabName}
                                                            onClick={this.toggleTab}
                                                            mobile="scroll"
                                                        />
                                                        <div className={cx('tab__text')}>
                                                            {this.renderTabContent(selectedTabName, lang, matches)}
                                                            {this.state.isPlaylistVisible && 
                                                                <div className={cx('playlist__container')} style={{ minWidth: this.playlist ? this.playlist.clientWidth : '350px', width: this.playlist ? this.playlist.clientWidth : '350px' }}>
                                                                    <ListExercises
                                                                    setExerciseIdx={({exercise}) => this.goToExercise(exercise, playlist.data.id)}
                                                                    activeGroup={videos.length > 0 ? videos[0].tags : null}
                                                                    list={groupByWithKeys(videos, (v) => v.tags || '')}
                                                                    dispatch={dispatch}
                                                                    isPaid={isPaid}
                                                                    />
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                {R.path(['data', 'videos'], playlist) && matches.desktop && this.renderList()}
                                            </div>)
                                        }
                                        }
                                    </Media>
                                </div>
                            </div>   
                        </div>}
            </Layout>
        )
    }

    renderRemainTime(lang, playlist) {
        const i18n = dict[lang];
        return (<UncontrolledTooltip placement="top" target="buyButton">
            <div className={cx("tooltipButton")}>
                <span className={cx('remainingTimeValue')}>{`Осталось дней: ${moment(playlist.data.expirationDate).date() - moment().date()}`}</span>
            </div>
        </UncontrolledTooltip>)
    }

    renderQuizButton(lang, isPaid, playlist) {

        if(!playlist.data){
            return 
        }

        const i18n = dict[lang];

        if (!isPaid) {
            return this.renderTooltipButton(i18n['lecture.quiz'],
                () => i18n['lecture.quiz.button.payInfo'],
                true);
        }

        const readyToStart = isQuizReadyToStart(playlist);
        if (readyToStart) {
            return this.renderTooltipButton(i18n['lecture.quiz'],
                null,
                false,
                () => browserHistory.push(`/quiz/${playlist.data.id}`))
        }

        const quizPending = isQuizPending(playlist.data)
        if (quizPending) {
            const {retry, value} = resolveRemainingTimeTextAndValue(playlist.data, i18n, lang);
            const message = retry ? i18n['lecture.quiz.button.retryAttempt'] : i18n['lecture.quiz.button.willBeAccessibleAt'];
            return this.renderTooltipButton(i18n['lecture.quiz'],
                () => <div>{message} <span className={cx('remainingTimeValue')}>{value}</span></div>,
                true);
        }

    }

    renderTooltipButton(name, getMessage, isDisabled, action) {
        return <div className={cx('btns__item', 'btns__tooltip')}>
            <Button id="quizButton" kind={isDisabled ? 'disabled' : 'main'} onClick={() => action && action()}>
                <svg className={cx(styles.icon, styles.iconQuiz)}>
                    <use xlinkHref="#quiz"/>
                </svg>
                <span>{name}</span>
            </Button>
            {getMessage && <UncontrolledTooltip placement="top" target="quizButton">
                <div className={cx("tooltipButton")}>
                    {getMessage()}
                </div>
            </UncontrolledTooltip>}
        </div>;
    }
}

const mapStateToProps = (state) => {
    return {
        playlist: selectors.selectPlaylist(state),
        selectedTab: selectors.selectModuleSelectedTab(state) || TAB_NAMES.DESCRIPTION,
        userInfo: selectors.userInfo(state),
        lang: state.lang,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(TrainingPlaylist);
