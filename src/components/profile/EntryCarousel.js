
import React from "react";
import { dict } from "dict";
import { connect } from "react-redux";
import styles from "./entryCarousel.css";
import { slidesData } from "../../utils/dataSlides";

const mapDispatchToProps = (dispatch) => ({ dispatch });
const mapStateToProps = ({ lang }) => ({ lang });

class Carousel extends React.Component {
    state = {
        activeSlideId: 0,
    }

    slideRight = () => {
        const { activeSlideId } = this.state;
        const isLastSlide = activeSlideId === slidesData[slidesData.length - 1].id;

        isLastSlide ? this.setState({activeSlideId: 0}) : this.setState({ activeSlideId: activeSlideId + 1 })
    }
    slideLeft = () => {
        const { activeSlideId } = this.state;
        this.setState({ activeSlideId: activeSlideId - 1 })
    }

    handleIndicatorClick = (id) => {
        this.setState({ activeSlideId: id })
    }
    render() {
        const { activeSlideId } = this.state;
        const activeSlide = slidesData[activeSlideId]
        const isFirstSlide = activeSlideId === 0;
        const isLastSlide = activeSlideId === slidesData[slidesData.length - 1].id;

        const carouselIndicators = slidesData.map(i => {
            return (
                <span className={styles.carouselIndicator} onClick={() => this.handleIndicatorClick(i.id)}>
                    <span className={i.id === activeSlideId ? styles.active : null}></span>
                </span>
            )
        })


        return (
            <div className={styles.entryBg}>
                <div className={styles.carouselContainer}>
                    {isFirstSlide ? <a className={styles.arrowDisabled}></a> : <a className={styles.arrowLeft} onClick={this.slideLeft}></a>}
                    <div className={styles.carouselContent} id={activeSlide.id}>
                        <h2>{activeSlide.title}</h2>
                        {activeSlide.content.split('\n').map(i => <p>{i}</p>)}
                    </div>
                    <a className={styles.arrowRight} onClick={this.slideRight}></a>
                </div>
                <div className={styles.carouselIndicators}>
                    {carouselIndicators}
                </div>
            </div>
        )
    }
}


export const EntryCarousel = connect(
    mapStateToProps,
    mapDispatchToProps
)(Carousel);