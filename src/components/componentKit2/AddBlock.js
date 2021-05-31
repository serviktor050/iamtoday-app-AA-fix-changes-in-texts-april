import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './addBlock.css'
import { FieldArray } from 'redux-form'

class renderContent extends Component {

  componentDidMount(){
    if (!this.props.fields.length && (this.props.fields.name !== 'userInfoDocuments' && this.props.fields.name !== 'partnerInfoDocuments')) {
      this.props.fields.push({});
    }

    if (this.props.fields.name === 'userInfoDocuments' || this.props.fields.name === 'partnerInfoDocuments') {
      if (this.props.fields.length < 3) {
        let k = 3 - this.props.fields.length;
        while(k){
          this.props.fields.push({});
          k--;
        }
      }

    }
  }

  removeUser = () => {
    const { fields } = this.props;
    if ( fields.name === 'userInfoDocuments' && fields.length === 3 ) {
      return;
    }
    fields.pop();
  }

  addItem = () => {
    const { fields } = this.props;
    fields.push({})
  }

  checkRemoveBtn = (index, fields) => {
    if (index === fields.length - 1 && index > 0) {
      if (fields.name === 'userInfoDocuments' && index < 3) {
        return false
      }
      return true
    }

    return false
  }

  renderString = () => {
    const { content, fields } = this.props;
    const array = fields.getAll().split(', ');
    for (let i = 0; i < fields.length - 1; i++) {
      fields.pop();
    }
    for (let i = 0; i < array.length; i++ ) {
      fields.push({label: array[i], value: array[i]})
    }
    fields.shift();
    console.log(fields.getAll());
    return fields.getAll().split(', ').map((user, index) => {
      return (
        <div 
          key={user}
          className={fields.name !== 'userInfoDocuments' ? styles.border : null} 
          style={(this.checkRemoveBtn(index, fields)) ? null : ( fields.name === 'userInfoDocuments' && index === 0 ) ? null : { paddingTop: '20px' } } 
        >
          {this.checkRemoveBtn(index, fields) && <button
            className={styles.buttonActionWide}
            onClick={() => this.removeUser()}
            type='button'
          >
            Удалить
          </button>}
          {content(user, index)}
        </div>
        );
    })
  }

  render(){
    const { fields, content, text, errorsValidate,  meta: { error, submitFailed }  } = this.props;
    console.log(fields);
    console.log(fields.getAll());
    return(
      <div>
        {typeof fields.getAll() === 'string' ?
          this.renderString() :
          fields.map((user, index) => {
            return (
              <div 
                key={user}
                className={fields.name !== 'userInfoDocuments' ? styles.border : null} 
                style={(this.checkRemoveBtn(index, fields)) ? null : ( fields.name === 'userInfoDocuments' && index === 0 ) ? null : { paddingTop: '20px' } } 
              >
                {this.checkRemoveBtn(index, fields) && <button
                  className={styles.buttonActionWide}
                  onClick={() => this.removeUser()}
                  type='button'
                >
                  Удалить
                </button>}
                {content(user, index)}
              </div>
              );
          })
        }

        {submitFailed && error && <span>{error}</span>}
          <div className={styles.btn} onClick={() => this.addItem()}>
            <div className={styles.trigger}>+</div>
            <div className={styles.text}>{text}</div>
          </div>

      </div>

    )
  }
}
class AddBlock extends Component {

  // state = {
  //   count: [ Math.random()]
  // }

  // onClick = () => {
  //   console.log('onClickk')
  //   const count = this.state.count.concat(Math.random());
  //   this.setState({ count })
  // }

  render() {
    const { name, text, content } = this.props;
    return (
      <div className={styles.addBlock}>
        <FieldArray
          name={name}
          text={text}
          content={content}
          component={renderContent}
          //errorsValidate={errorsValidate}
        />
        {/*{*/}
          {/*this.state.count.map((key) => {*/}
            {/*console.log(key)*/}
            {/*console.log('keyyyyyy')*/}
            {/*return (<div key={key}>{children}</div>);*/}
          {/*})*/}
        {/*}*/}

      </div>
    )
  }
}
export default CSSModules(AddBlock, styles)
