import React, { Component } from 'react';
import classNames from 'classnames/bind';
import { dict } from 'dict';
import { connect } from 'react-redux';
import { compose } from 'redux';

import styles from './styles.css';
import * as ducks from '../../ducks.jsx';
import RatingStars from '../../../../components/common/RatingStars';

const cx = classNames.bind(styles);

const RATING_MATERIALS = 'material';
const RATING_INTEREST = 'interest';
const RATING_USABILITY = 'useful';

class RatingVideo extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            rating: {
                [RATING_MATERIALS]: null,
                [RATING_INTEREST]: null,
                [RATING_USABILITY]: null,
            }
        }
        this.handleRating = this.handleRating.bind(this)
    }

    componentDidMount() {
        const { video } = this.props;
        if ( video.ratings && video.ratings.length ) {
            const rating = video.ratings.reduce(((acc, item) => ({ ...acc, [item.ratingTypeName]: item.score })), {});
            this.setState({ rating })
        }
        
    }

    componentDidUpdate(prevProps) {
        const { video } = this.props;
        if (prevProps.video !== video && video.ratings && video.ratings.length) {
            const rating = video.ratings.reduce(((acc, item) => ({ ...acc, [item.ratingTypeName]: item.score })), {});
            this.setState({ rating })
        }
    }

    handleRating(value, name) {
        const { dispatch, video } = this.props;
        if (!this.state.rating[name]) {
            this.setState(({rating}) => ({ rating: { ...rating, [name]: value } }))
        }
        dispatch(ducks.setVideoRating({ id: video.id, ratingTypeName: name, score: value }, this.onSuccess))
    }

    onSuccess = (data) => {
        this.setState(({rating}) => ({ rating: { ...rating, [data.data.ratingTypeName]: data.data.score } }))
    }
    
    render() {
        const i18n = dict[this.props.lang];
        return (
            <div className={cx('rating')}>
                <div className={cx('rating__title')}>
                    <span>{i18n['lecture.ratings.how-you-rate-lection-quality']}</span>
                </div>
                <div className={cx('rating__card')}>
                    <p className={cx('rating__name')}>{i18n[`lecture.ratings.${RATING_MATERIALS}`]}</p>
                    {this.state.rating[RATING_MATERIALS] ? <p className={cx('rating__rate')}>{this.state.rating[RATING_MATERIALS]}</p>
                    : <RatingStars name={RATING_MATERIALS} handleValue={value => this.handleRating(value, RATING_MATERIALS)} />}
                </div>
                <div className={cx('rating__card')}>
                    <p className={cx('rating__name')}>{i18n[`lecture.ratings.${RATING_INTEREST}`]}</p>
                    {this.state.rating[RATING_INTEREST] ? <p className={cx('rating__rate')}>{this.state.rating[RATING_INTEREST]}</p>
                    : <RatingStars name={RATING_INTEREST} handleValue={value => this.handleRating(value, RATING_INTEREST)} />}
                </div>
                <div className={cx('rating__card')}>
                    <p className={cx('rating__name')}>{i18n[`lecture.ratings.${RATING_USABILITY}`]}</p>
                    {this.state.rating[RATING_USABILITY] ? <p className={cx('rating__rate')}>{this.state.rating[RATING_USABILITY]}</p>
                    : <RatingStars name={RATING_USABILITY} handleValue={value => this.handleRating(value, RATING_USABILITY)} />}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({ lang: state.lang })
const mapDispatchToProps = dispatch => ({ dispatch })

export default compose(connect(mapStateToProps, mapDispatchToProps))(RatingVideo);
