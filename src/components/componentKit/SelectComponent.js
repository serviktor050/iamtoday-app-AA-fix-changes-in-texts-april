import React, { Component } from "react";
import CSSModules from "react-css-modules";
import Select from "react-select";
import styles from "./selectComponent.css";
//import 'react-select/dist/react-select.css';

import classNames from "classnames";

const stylesLocal = {
  pointerEvents: "none",
};

const stylesError = {
  color: "#F97B7C",
  fontSize: "1.2rem",
  position: "absolute",
  left: "0px",
  bottom: "-20px",
};

const defaultStyles = {
  // option: (provided, state) => ({
  //   ...provided,
  //   borderBottom: '1px dotted pink',
  //   color: state.isSelected ? 'red' : 'blue',
  //   padding: 20,
  // }),
  menu: (provided, state) => ({
    ...provided,
    zIndex: "999 !important",
  }),
  control: (provided, state) => {
    const borderColor = state.selectProps.error ? "#f97b7c" : "#ced9eb";
    return {
      ...provided,
      height: "46px",
      border: `1px solid ${borderColor}`,
      borderRadius: "5px",
      backgroundColor: "white",
    };
  },
  // singleValue: (provided, state) => {
  //   const opacity = state.isDisabled ? 0.5 : 1;
  //   const transition = 'opacity 300ms';
  //
  //   return { ...provided, opacity, transition };
  // }
};

class SelectComponent extends Component {
  state = {
    value: "",
    inputValue: "",
  };
  componentDidMount() {
    if (this.props.val !== "no") {
      this.setState({
        value: this.props.val,
      });
    }
    if (this.props.input.name.split(".")[2] === "endYear" && this.props.val) {
      this.setState({
        inputValue: this.props.val === "no" ? '' : this.props.val.toString(),
        value: this.props.val === "no" ? '' : this.props.val
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { val } = this.props;
    if (prevProps.val !== val) {
      if (this.props.val !== "no") {
        this.setState({
          value: this.props.val,
        });
      }
      if (this.props.input.name.split(".")[2] === "endYear" && this.props.val) {
        this.setState({
          inputValue: this.props.val === "no" ? '' : this.props.val.toString(),
          value: this.props.val === "no" ? '' : this.props.val
        });
      }
    }
  }

  onChange(value) {
    const { select, input, onChange } = this.props;
    this.setState({
      value: value,
    });
    this.props.input.onChange(value);
    if (onChange) {
      onChange(value);
    }
    if (select) {
      select({ name: input.name, value });
    }
  }

  onInputChange = (str, props) => {
    if (props && props.action === "set-value") return false;
    this.setState({ inputValue: str });
  };

  render() {
    const {
      input,
      placeholder,
      isPlaceholder = true,
      options,
      val,
      meta: { touched, error },
      customClass,
      menuIsOpen,
      customStyles,
      hasSeparator = true
    } = this.props;
    const style = {
      ...defaultStyles,
      ...customStyles,
    };
    return (
      <div
        className={classNames(styles.select, {
          [customClass]: !!customClass,
        })}
      >
        <div
          className={classNames(styles.inputName, {
            [styles.inputNameShow]: this.state.value && this.state.value.value,
          })}
        >
          {isPlaceholder && placeholder}
        </div>
        <Select
          name={input.name}
          onChange={this.onChange.bind(this)}
          placeholder={placeholder}
          options={options}
          value={
            this.state.value && this.state.value.value ? this.state.value : null
          }
          //className={styles.selectItem}
          inputValue={this.state.inputValue}
          onInputChange={this.onInputChange}
          styles={style}
          menuIsOpen={menuIsOpen}
          error={error && touched}

        />
        {val !== "no" ||
          (touched && !error && (
            <span className={styles.inputIcoRequiredSucceess}></span>
          ))}
        {val === "no" && touched && error && (
          <span className={styles.inputIcoRequired}></span>
        )}
        {touched && error && (!val || !val.value) && (
          <span style={stylesError}>{error}</span>
        )}
      </div>
    );
  }
}

export default CSSModules(SelectComponent, styles);
