import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './timer.css'


const getSecondDigit = digits => {
	return ('' + digits)[1] ? digits : '0' + digits
}

class Timer extends Component {
	state ={
		timer:false,
		localMinutes: 1,
		localSeconds: 5,
	}

	componentDidMount(){
		const { timer } = this.props
		const { minutes, seconds } = timer
		this.setState({
			localMinutes: minutes,
			localSeconds: seconds,
		})
	}
	render() {
		const { timer, fromZero } = this.props
		return (
			<div>
				<div className={styles.timer}>
					<div className={styles.timerWrap}>
						<div className={styles.timerDisplay}>

            <span>
                <span ref="timerMin"  className={styles.timerMin}>{getSecondDigit(this.state.localMinutes)}</span>
                <span className={styles.timerDots}>:</span>
            </span>

							<span ref="timerSec"  className={styles.timerSec}>{getSecondDigit(this.state.localSeconds)}</span>
						</div>

						<button className={!this.state.timer ? styles.btnBaseTimer : styles.btnBaseTimerActive} onClick={e => {
							e.preventDefault()
							this.setState({
								timer:!this.state.timer
							})
							let localMinutes = this.state.localMinutes
							let localSeconds = this.state.localSeconds
							clearInterval(this.refreshTimer)
							if(!this.state.timer){
								this.refreshTimer = setInterval(() => {
									if(fromZero){
										localSeconds += 1
									} else {
										if (localMinutes > 0 || localSeconds > 0) {
											if (localSeconds === 0 && localMinutes > 0) {
												localMinutes -= 1;
												localSeconds = 59;
											} else {
												localSeconds -= 1;
											}

										}
									}
									this.setState({
										localMinutes: localMinutes,
										localSeconds: localSeconds,
									})
								}, 1000)
							}

						}}>
							Начать
						</button>



					</div>
				</div>

			</div>
		)
	}
}

export default CSSModules(Timer, styles)