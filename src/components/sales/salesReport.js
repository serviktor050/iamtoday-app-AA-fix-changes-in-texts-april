import React, {Component} from "react";
import {api} from "../../config";
import {connect} from "react-redux";
import {compose} from "redux";
import classNames from 'classnames/bind';
import {dict} from "dict";
import {Breadcrumb} from "components/common/Breadcrumb";
import {HeaderCell} from "components/common/Table/HeaderCell/HeaderCell";
import Spinner from "components/componentKit2/Spinner";
import styles from "./styles.css";

const cx = classNames.bind(styles);

const renderSearchInputBox = (props) => (<div className={styles.searchInputBox}>
    <svg className={styles.svgIconFile}>
        <use xlinkHref="#ico-input-search"/>
    </svg>
    <input type="text" {...props}/>
</div>
)

const renderLevelSelectBox = (props) => (<div
    className={styles.selectBox}>
    <label className={styles.selectBoxLabel}>{props.label}</label>
    <select value={props.value} className={styles.selectBoxSelect} onChange={props.onChange}>
        {props.options.map((x, index) => {
            return <option key={index} value={x.value}>{x.label}</option>
        })}
    </select>
</div>
)

class SalesReport extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            sales: [] 
        };        
      }


    componentDidMount(){
         fetch(`${api}/payment/paymentItemReport-get`, {
             headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
             },
             method: 'POST',
             body: JSON.stringify({
               AuthToken: "e6c00bff-b1ab-47a3-f63b-08d88d2965b2",
               Data: {"take":500,"skip":0,"dateStart":"2020-07-02","dateEnd":"2020-07-15"}
             })
             })
             .then(res => res.json())          
             .then(res=>this.setState({sales: res.data}))
             .catch(console.error)
           };
           

        
    render ()
    {
        return(
        <div>
        {this.renderHeader()}
        {this.renderFilterForm()}
        {this.renderSalesReportTable()}        
        </div>
        )
    }

    renderFilterForm() {

        const {lang} = this.props;
        const {filter} = this.state;
        const i18n = dict[lang];

        
        const displayOptions = [
            {label: i18n['sales.options.displayBy.placeholder'], value: ''},
            {label: i18n['sales.options.displayBy.days'], value: 'day'},
            
        ];


        return <div className={styles.filterForm}>
            <div className={cx(styles.filterGroup, styles.leftFilterPart)}>
                <div className={styles.input}>
                    {/*renderSearchInputBox(
                        {
                            value: filter.userFilterText,
                            name: 'searchText', type: 'text', placeholder: i18n['sales.salesReport.searchText'],
                            //onChange: this.handleSearchTextOnChange,
                            //onKeyPress: this.handleSearchTextOnEnter
                        })*/}
                </div>
            </div>
            <div className={cx(styles.filterGroup, styles.rightFilterPart)}>
                
                <div className={styles.input}>
                    {renderLevelSelectBox({
                        //value: filter.activePeriod,
                        name: "displayBy",
                        placeholder: i18n['dropdown.options.placeholder.all'],
                        label: i18n['sales.salesReport.filter.displayBy'],
                        //onChange: this.handleStatusOnChange,
                        options: displayOptions,
                    })}
                </div>
                
            </div>
        </div>
    }



renderHeader() {
    const {lang} = this.props;
    const i18n = dict[lang];
    const items = [i18n['breadcrumb.main'], i18n['mlm.breadcrumb.mlm'], i18n['mlm.breadcrumb.mlmStructure']];
    const links = ['/', '/mlm'];
    return <div className={cx(styles.mlmStructureHeader)}>
        <h2 className={cx(styles.title)}>{i18n['sales.salesReport.title']}</h2>
        <Breadcrumb items={items} links={links}/>
        <hr/>
    </div>
}

renderSalesReportTableHeader() {
    const {lang} = this.props;    
    const i18n = dict[lang];
    return <div className={styles.heading}>
        <div className={styles.row}>
            {this.renderHeaderCell("doctor",  i18n['sales.salesReport.doctor'])}
            {this.renderHeaderCell("salesTime", i18n['sales.salesReport.salesTime'])}
            {this.renderHeaderCell("price",  i18n['sales.salesReport.price'])}
            {this.renderHeaderCell("module",  i18n['sales.salesReport.module'])}
        </div>
    </div>;
}

renderHeaderCell(fieldName, label) {
    return <HeaderCell className={cx(styles.cell, styles.sort)}
                       fieldName={fieldName}
                       label={label}/>
}

renderSalesReportTable() {
    const {sales} = this.state;
    return <div className={styles.structureTable}>
        {/*{this.isDataNotFetched() && <Spinner/>}*/}
        <div className={styles.table}>
            {this.renderSalesReportTableHeader()}
            <div className={styles.body}>
                {sales && sales.map(item => {
                    return <div key={`structureTable${item.itemId}`} className={styles.row}>
                        <div className={cx(styles.cell,styles.cellLink)}>{item.lastName} {item.firstName}</div>
                        <div className={styles.cell}>{item.date}</div>
                        <div className={cx(styles.cell, styles.value, styles.email)}>{item.amount} {item.currency}</div>
                        <div className={styles.cell}>{item.name}  </div>                      
                    </div>
                })}
            </div>
        </div>
    </div>
}

}

const mapStateToProps = (state) => {
    return {        
        lang: state.lang
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(SalesReport);
