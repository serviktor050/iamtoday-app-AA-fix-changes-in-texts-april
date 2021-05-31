import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames/bind';
import styles from './tooltip.css';
const cx = classNames.bind(styles);

const isBrowser = typeof window !== 'undefined';

class Tooltip extends Component {
    static propTypes = {
        position: PropTypes.oneOf(['left', 'center', 'right']),
        fullScreenWidth: PropTypes.bool,
        tooltipCls: PropTypes.string,
        tooltipContainer: PropTypes.string,
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.element,
        ]),
    };

    static defaultProps = {
        position: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            show: false,
        };
    }

    componentDidMount(){
        document.addEventListener('click', this.close);
        document.addEventListener('touchstart', this.close);
        this.mount = true;
    }

    componentWillUnmount(){
        document.removeEventListener('click', this.close);
        document.removeEventListener('touchstart', this.close);
        this.mount = false;
    }

    close =(e) => {
        if(e.target.classList.contains(styles.icon) || e.target.classList.contains(styles.component)){
            return;
        }
        if (this.mount) {
          this.setState({ show: false})
        }
    }

    onMouseEnter = () => {
        if (this.mount) {
          this.setState({ show: true}, () => {
            this.calculatePosition();
          });
        }
    }
    onMouseLeave = () => {
        if (this.mount) {
          this.setState({ show: false});
        }
    }

    calculatePosition = () => {
        const elem = this.textElem;
        if (this.props.position) {
            const { left, right } = elem.getBoundingClientRect();

            let bias = this.state.bias;
            if(bias){
                return;
            }
            bias = - elem.offsetWidth / 2;
            if (left < 0) {
                bias += left;
            } else if (right > window.innerWidth) {
                bias -= (right - window.innerWidth) / 2;
            }
            if((left + bias) < 0){
                bias += left;
            }

            this.setState({ bias });
            return;
        }
        const { left, right } = elem.getBoundingClientRect();
        let { bias } = this.state;

        if (this.props.fullScreenWidth) {
            bias -= left;
            this.setState({ bias });
            return;
        }
        if (left < 0) {
            bias += (left - 12) * -1;
        } else if (right > window.innerWidth) {
            bias -= right - window.innerWidth + 12;
        }
        this.setState({ bias });
    };

    touchStart = (e) => {
      if (this.mount) {
        this.setState({ show: true}, () => {
          if(this.state.show) {
            this.calculatePosition();
          }
        });
      }
    };

    render() {
        const { bias } = this.state;
        const { fullScreenWidth, tooltipCls, tooltipContainer, targetTooltip } = this.props;
        return (
            <div
                className={cx('component') + ' ' + tooltipCls}
                onMouseEnter={!window.mobilecheck() ? this.onMouseEnter : null}
                onMouseLeave={this.onMouseLeave}
                onTouchStart={this.touchStart}
                onClick={() => {}}
                ref={(e) => { this.tooltip = e; }}
                role="button"
                tabIndex={-1}
            >
              {targetTooltip ? targetTooltip()  : <div className={cx('icon')}>?</div>}
                {this.state.show &&
                <div>
                    <div className={cx('arrow')} />
                    <div
                        className={cx('container')  + ' ' + tooltipContainer}
                        style={{
                            transform: `translateX(${bias}px)`,
                            //width: fullScreenWidth && isBrowser ? window.innerWidth : `${width}px`,
                            //maxWidth: fullScreenWidth ? 'none' : '87.5vw',
                        }}
                        ref={(e) => { this.textElem = e; }}
                    >
                        <div className={cx('text')}>
                            { this.props.children }
                        </div>
                    </div>
                </div>
                }
            </div>
        );
    }
}

export default Tooltip;