import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import ReactRichTextEditor from 'react-rte';
import styles from './styles.css';

var debounce = require('lodash.debounce');

class NotePad extends PureComponent {

    static propTypes = {
        onChange: PropTypes.func,
        placeholder: PropTypes.string,
        itemId: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            lastValue: props.value,
            forceUpdate: false,
            scheduleUpdateValue: debounce(() => this.updateValue(this.state.value), 5000, {'maxWait': 20000})
        };
    }

    componentWillUnmount() {
        this.updateValue = () => {};
    }

    handleReturn = () => {
        this.setState({forceUpdate: true});
    };

    onChange = (value) => {
        this.setState({value}, () => {
            if (this.state.forceUpdate) {
                this.setState({forceUpdate: false});
                this.updateValue(value);
            } else {
                this.state.scheduleUpdateValue()
            }
        });
    };

    updateValue = (value) => {
        const {onSave, itemId} = this.props;
        const {lastValue} = this.state;
        const htmlLastValue = lastValue ? lastValue.toString("html") : '';
        const htmValue = value ? value.toString("html") : '';
        if (htmValue !== htmlLastValue) {
            this.setState({lastValue: value});
            onSave && onSave({itemId, value});
        }
    };

    onBlur = () => this.updateValue(this.state.value);

    render() {
        return (
            <ReactRichTextEditor
                className={styles.root}
                handleReturn={this.handleReturn}
                placeholder={this.props.placeholder}
                toolbarClassName={styles.rteToolbar}
                editorClassName={styles.rteEditor}
                value={this.state.value}
                onBlur={this.onBlur}
                onChange={this.onChange}
            />
        );
    }
}

export default NotePad;