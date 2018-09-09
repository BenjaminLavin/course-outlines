import React, {Component}  from 'react';
import Popup from 'reactjs-popup';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import firebase from '../Config/Firebase';

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Email and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID
  ],
  callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
};

class SignInModal extends Component {
  render(){
    return (
  <Popup
    trigger={<button className="mh2" style={styles.signInButtonStyle}><span style={styles.signInButtonTextStyle}>Sign in</span></button>}
    modal
    closeOnDocumentClick
  >
    <h2 className='f2 ma3' >Sign In</h2>
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
  </Popup>)
}
}

const styles = {
  signInButtonStyle: {
    backgroundColor: 'white',
    direction: 'ltr',
    fontWeight: 500,
    height: 'auto',
    lineHeight: 'normal',
    minHeight: 40,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    textAlign: 'center',
    boxShadow: '0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12)',
    border: 'none',
    borderRadius: 2,
    fontFamily: 'Roboto,Helvetica,Arial,sans-serif'
  },
  signInButtonTextStyle: {
    color:'#757575',
    fontSize:14,
    textTransform:'none',
    verticalAlign:'middle'
  }
}

export default SignInModal;
