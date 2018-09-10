import React, {Component}  from 'react';
import Popup from 'reactjs-popup';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { BeatLoader } from 'react-spinners';


import './SignInModal.css'
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
  constructor(){
    super();
    this.state = {
      createAccount: false,
      error: '',
      email: '',
      password: '',
      repeatPassword: '',
      loading: false
    };
  }

  switchType(){
    var createAccount = !this.state.createAccount;
    this.setState({createAccount, error:''});
  }

  onSignInPress(){
    const {email, password} = this.state;
    this.setState({error: '', loading: true});
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => this.onAuthSuccess())
    .catch((error) => {
      const message = error.code === 'auth/invalid-email' ? error.message : 'Invalid email/password combination';
      this.onAuthFail(message)
    });
  }

  onCreateAccountPress(){
    const {email, password, repeatPassword} = this.state;
    if(!email) {this.onAuthFail('Enter an email address'); return;}
    if(!password) {this.onAuthFail('Enter a password'); return;}
    if(password !== repeatPassword) {this.onAuthFail('Passwords must match'); return;}
    this.setState({error: '', loading: true});
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => this.onAuthSuccess())
    .catch((error) => this.onAuthFail(error.message));
  }

  onAuthFail(error){
    this.setState({error, loading: false});
  }

  onAuthSuccess(){
    this.setState({error: '', email: '', password: '', repeatPassword: '', loading: false});
  }


  render(){
    const {createAccount, error, email, password, repeatPassword, loading} = this.state;
    const {errorStyle, formButtonStyle} = styles;

    const errorBox = error ? <div style={errorStyle}>{error}</div> : null;
    const switchType = createAccount ? <span>Already have an account? <a onClick={() => this.switchType()} style={{color: '#428bca'}}>Login</a></span> : <span>Looking to <a onClick={() => this.switchType()} style={{color: '#428bca'}}>create an account</a>?</span>;

    const loadingSpinner = <div className='pa3' style={formButtonStyle}><BeatLoader sizeUnit={"px"} size={15} color={'whitesmoke'}/></div>;
    const form = createAccount ?
    <div>
      <input type="text" placeholder="Email" value={email} onChange={(event) => this.setState({email: event.target.value, error: ''})}/>
      <input type="password" placeholder="Password" value={password} onChange={(event) => this.setState({password: event.target.value, error: ''})}/>
      <input type="password" placeholder="Repeat Password" value={repeatPassword} onChange={(event) => this.setState({repeatPassword: event.target.value, error: ''})}/>
      {loading ? loadingSpinner : <input className='pa3' style={formButtonStyle} type="button" value="Create Account" onClick={() => this.onCreateAccountPress()}/>}
    </div>
    :
    <div>
      <input type="text" placeholder="Email" value={email} onChange={(event) => this.setState({email: event.target.value, error: ''})}/>
      <input type="password" placeholder="Password" value={password} onChange={(event) => this.setState({password: event.target.value, error: ''})}/>
      {loading ? loadingSpinner : <input className='pa3' style={formButtonStyle} type="button" value="Sign In" onClick={() => this.onSignInPress()}/>}
    </div>;


    return (
      <Popup
        trigger={<button className="mh2" style={styles.signInButtonStyle}><span style={styles.signInButtonTextStyle}>Sign in</span></button>}
        modal
        closeOnDocumentClick
        contentStyle={{width:400}}
        >
        <div style={{color:'#32383b', margin:'auto', width:350}}>
          <h2 style={{margin:'auto', padding: 15}}>{createAccount ? 'Create Account': 'Sign In'}</h2>
          <div>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>

            <div style={{display: 'flex', flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18}}>
              <div style={{height: 1, backgroundColor: '#DFDFDF',width: '34%'}}/>
              <span style={{fontSize: 17}}>or</span>
              <div style={{height: 1, backgroundColor: '#DFDFDF',width: '34%'}}/>
            </div>
            {errorBox}
            {form}
          </div>
          <div className="pa3">
            {switchType}
          </div>
        </div>
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
    },
    errorStyle:{
      color:'#b94a48',
      backgroundColor:'#f2dede',
      borderColor:'#ebccd1',
      borderWidth:1,
      padding:15,
      marginBottom: 20,
      borderRadius: 3
    },
    formButtonStyle:{
      borderRadius: 3,
      backgroundColor: '#00BBFF',
      color: 'whitesmoke',
      textTransform: 'uppercase',
      width: '100%'
    }
  }

  export default SignInModal;
