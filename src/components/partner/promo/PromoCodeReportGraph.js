import React, {Component} from 'react'
import GoogleChart from './GoogleChart'

class PromoCodeReportGraph extends Component {
  render() {
    const {data, options} = this.props
    return (
      <GoogleChart type='AnnotationChart' data={ data } width='100%' height='300px' options={ {} } {...options}/>
    )
  }
}

export default PromoCodeReportGraph
