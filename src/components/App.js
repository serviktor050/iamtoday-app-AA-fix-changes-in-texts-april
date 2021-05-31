import React from 'react'
import './App.css'
import {Helmet} from "react-helmet";
import ProfileLogin from '../containers/ProfileLogin'
import Smm from '../containers/Smm';
import { api, host, domen } from '../config.js';

import { title, fav16, fav32 } from 'utils/helmet';

const isAlfa = domen.isAlfa;

class App extends React.Component {

render(){
return (
 <React.Fragment>
   <Helmet>
     <title>{title}</title>
     <link rel="icon"  href={fav16} sizes="32x32" />
     <link rel="icon"   href={fav32} sizes="16x16" />
     <meta name="apple-mobile-web-app-title" content={title} />
     <meta name="application-name" content={title} />
   </Helmet>
   {/*<Smm location={this.props.location}/>*/}
   <ProfileLogin />
 </React.Fragment>
)
  }
}

export default App