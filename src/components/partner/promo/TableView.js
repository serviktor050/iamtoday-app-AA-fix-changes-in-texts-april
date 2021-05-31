import React from 'react'

/**
 *   Компонент для таблиц.
 */
export default class TableView extends React.Component {
  /**
   * Рендер тела.
   */
  renderBody() {
    const {body} = this.props

    return (
        <tbody className="promo-report-tbody">
        {body}
        </tbody>
    )
  }

  /**
   * Рендер шапки.
   */
  renderHead() {
    const {head} = this.props

    return head ? (
        <thead>
        {head}
        </thead>
    ) : ''
  }

  /**
   * Рендер.
   */
  render() {
    const {className} = this.props

    return (
        <table className={className}>
            {this.renderHead()}
            {this.renderBody()}
        </table>
    )
  }
}
