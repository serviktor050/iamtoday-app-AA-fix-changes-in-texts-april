import PropTypes from 'prop-types';
import React, {
  Component
} from 'react'
import ReactDOM from 'react-dom'

import {
  visualization
} from './google-jsapi-loader'

class GoogleChart extends Component {
  static propTypes = {
    chartType: PropTypes.string.isRequired,
    containerId: PropTypes.string,
    data: PropTypes.array,
    height: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    onError: PropTypes.func,
    width: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired
  }

  static defaultProps = {
    onError: () => {},
    options: {}
  }

  componentDidUpdate(nextProps, nextState) {
    const {
      data: dataTable,
      options
    } = this.props
    this.redraw(dataTable, options)
  }

  redraw(dataTable, options) {
    if (this.chartWrapper) {
      this.chartWrapper.setOptions(options)
      this.chartWrapper.setDataTable(dataTable)
      this.chartWrapper.draw(ReactDOM.findDOMNode(this))
    }
  }

  componentDidMount() {
    visualization().then(() => this.drawChart(this.props)).catch(this.props.onError)
  }

  drawChart = (props) => {
    const {
      containerId,
      chartType,
      data: dataTable,
      options
    } = props
    if (!dataTable) {
      return
    }
    if (global.google && global.google.visualization) {
      this.chartWrapper = new global.google.visualization.ChartWrapper({
        chartType,
        containerId,
        dataTable,
        options
      })
      this.chartWrapper.draw(ReactDOM.findDOMNode(this))
    }
  }

  render() {
    const {
      height,
      width
    } = this.props
    return React.createElement('div', {
      style: {
        height,
        width
      }
    })
  }
}

export default GoogleChart
