import React from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/homepage/homepage.component";
import ShopPage from "./pages/shop/shop.component";
import Header from "./components/header/header.component";
import SignInAndSignUp from "./pages/sign-in-and-sign-up/sign-in-and-sign-up.component";

import { auth, createUserProfile } from "./firebase/firebase.utils";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentUser: null
    };
  }

  unsubscribeFromAuth = null;

  componentDidMount() {
    //? adds an observer for changes in user's sign-in state
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfile(userAuth);

        userRef.onSnapshot(snapShot => {
          //onSnapshot: listen if there's any changes regarding CRUD of the object we give
          this.setState({
            currentUser: {
              id: snapShot.id, //the uid
              ...snapShot.data() //the displayName,email,createdAt
            }
          });
          console.log(this.state);
        });
      } else {
        //if it's null
        this.setState({ currentUser: userAuth });
      }
    });
  }

  componentWillUnmount() {
    //?stopping the observer to prevent memory leaks
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div className="App">
        <Header currentUser={this.state.currentUser} />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/shop" component={ShopPage} />
          <Route exact path="/signin" component={SignInAndSignUp} />
        </Switch>
      </div>
    );
  }
}

export default App;
