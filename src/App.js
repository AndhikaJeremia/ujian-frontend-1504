import React from 'react'
import Navigation from './component/navbar'
import {
  Route,
  Switch
} from 'react-router-dom'
import HomePage from './page/home';
import Login from './page/login';
import Axios from 'axios';
import { connect } from 'react-redux';
import { login } from './action'
import detailProduct from './page/detail-product';
import cartpage from './page/cartPage';
import HistoryPage from './page/history';

class App extends React.Component {
  componentDidMount() {
    Axios.get(`http://localhost:2000/users?email=${localStorage.getItem('email')}`)
      .then((res) => this.props.login(res.data[0]))
      .catch((err) => console.log(err))
  }
  render() {
    return (
      <div>
        <Navigation />
        <Switch>
          <Route path='/' component={HomePage} exact />
          <Route path='/Login' component={Login} />
          <Route path='/Detail' component={detailProduct} />
          <Route path='/CartPage' component={cartpage} />
          <Route path='/History' component={HistoryPage} />
        </Switch>
      </div>
    )
  }
}

export default connect(null, { login })(App);
