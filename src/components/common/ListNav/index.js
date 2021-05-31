import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import styles from './styles.css'
class ListNav extends Component {

    state = {
        collapsed: true
    };

    constructor(props, context) {
        super(props, context);
        this.onClickToggleButton = this.onClickToggleButton.bind(this)
        this.onClickItem = this.onClickItem.bind(this)
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside = event => {
        const domNode = ReactDOM.findDOMNode(this);
        if (!domNode || !domNode.contains(event.target)) {
            this.setState({ collapsed: true });
        }
    }

    onClickToggleButton(e) {
        e.preventDefault();
        const {collapsed} = this.state;
        this.setState({collapsed: !collapsed})
    };

    onClickItem(e, tab) {
        e.preventDefault();
        const {onClick} = this.props;
        this.setState({collapsed: true})
        onClick(tab);
    };

    render() {
        const {tabs, isActive} = this.props;
        const currentValue = tabs.find((tab) => isActive(tab)) || tabs[0];
        return (
            <div className={classNames(styles.listNav)}>
                <div className={styles.currentValue}
                     onClick={this.onClickToggleButton}>{currentValue && currentValue.label}<span
                    className={classNames(styles.arrow)}>
                    {this.state.collapsed ? <svg className={classNames(styles.icon, styles.iconChevron)}>
                        <use xlinkHref="#chevron-down"/>
                    </svg> : <svg className={classNames(styles.icon, styles.iconChevron)}>
                        <use xlinkHref="#chevron-up"/>
                    </svg>}
                </span></div>
                <div className={classNames(styles.dropdown, {[styles.show]: !this.state.collapsed})}>
                    <div className={classNames(styles.dropdownBlock)}>
                        {tabs.map((tab) => {
                            return (
                                <div className={classNames(styles.item)} key={tab.name}>
                                    <div onClick={(e) => this.onClickItem(e, tab)}>
                                        {tab.label}
                                        {isActive(tab) &&
                                        <svg className={classNames(styles.icon, styles.iconTick)}>
                                            <use xlinkHref="#ico-tick"/>
                                        </svg>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

        )
    }
}

export default ListNav;