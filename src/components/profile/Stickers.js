import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './stickers.css'
import classNames from 'classnames';
import ReactDOM from 'react-dom';

const stickers = [
  's-1.png', 's-2.png', 's-3.png', 's-4.png', 's-5.png',  's-6.png', 's-7.png', 's-8.png', 's-9.png', 's-10.png',
]

class Stickers extends Component {

  state = {
    show: false,
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  handleClickOutside = (e) => {
    const domNode = ReactDOM.findDOMNode(this);
    if (!domNode || !domNode.contains(e.target)) {
      this.setState({
        show: false
      });
    }
  }

  addSticker = (name) => {
    const { add } = this.props;
    const sticker = `sticker:${name}`//`<img className={styles.stickersAva} src=/assets/img/alfa/stickers/${name}.png alt=""/>`;
    add(sticker);
    this.setState({
      show: false
    })
  }

  showStickers = () => {
    this.setState({
      show: !this.state.show
    })
  }

  render() {
    const { miniChat, smm } = this.props;
    return (
      <div className={styles.stickers}>
        <div
          onClick={this.showStickers}
          className={classNames(styles.stickersBtn, {
            [styles.mini]: miniChat,
            [styles.smm]: smm
          })}>
          <img className={styles.stickersAva} src="/assets/img/alfa/stickers/s-1.png" alt=""/>
        </div>
        {
          this.state.show &&
          <div  className={classNames(styles.stickersBlock, {
            [styles.smm]: smm
          })}>
            <div  className={styles.stickerList}>
              {
                stickers.map((sticker) => {
                  return (
                    <div  key={sticker} className={styles.stickerItem}>
                      <img
                        src={`/assets/img/alfa/stickers/${sticker}`}
                        alt=""
                        onClick={() => this.addSticker(sticker)}
                      />
                    </div>
                  )
                })
              }

            </div>
          </div>
        }
      </div>
    )
  }
}
export default CSSModules(Stickers, styles);
