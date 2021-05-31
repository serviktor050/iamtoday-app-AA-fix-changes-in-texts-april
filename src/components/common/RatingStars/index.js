import React, { Component } from 'react';
import classNames from 'classnames/bind';

import styles from './styles.css';

const cx = classNames.bind(styles);

class RatingStars extends Component {
    constructor(props) {
        super(props)
        this.handleRating = this.handleRating.bind(this)
    }

    handleRating = e => {
        this.props.handleValue(6 - e.target.value)
    }
    
    render() {
        const { name } = this.props
        return (
            <div className={cx("star")}>
                <input type="radio" name={name} id={`${name || ''}-r1`} value={1} onChange={this.handleRating} />
                <label htmlFor={`${name || ''}-r1`}></label>

                <input type="radio" name={name} id={`${name || ''}-r2`} value={2} onChange={this.handleRating} />
                <label htmlFor={`${name || ''}-r2`}></label>

                <input type="radio" name={name} id={`${name || ''}-r3`} value={3} onChange={this.handleRating} />
                <label htmlFor={`${name || ''}-r3`}></label>

                <input type="radio" name={name} id={`${name || ''}-r4`} value={4} onChange={this.handleRating} />
                <label htmlFor={`${name || ''}-r4`}></label>

                <input type="radio" name={name} id={`${name || ''}-r5`} value={5} onChange={this.handleRating} />
                <label htmlFor={`${name || ''}-r5`}></label>
            </div>
        )
    }
}

export default RatingStars
