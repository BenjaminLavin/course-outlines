import React, {Component}  from 'react';
import firebase from '../Config/Firebase';
import { BeatLoader } from 'react-spinners';

import './SignInModal.css'

class ResetPassword extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: this.props.email,
      loading: false,
      error: '',
      success: false
    };
  }

  sendPasswordReset(){
    const {email} = this.state;
    if(!email) {this.onPasswordResetFail('Enter an email address'); return;}
    firebase.auth().sendPasswordResetEmail(email)
    .then(() => this.onPasswordResetSuccess())
    .catch((error) => {
      error.code === 'auth/invalid-email' ? this.onPasswordResetFail(error.message) : this.onPasswordResetSuccess();
    });
  }

  onPasswordResetFail(error){
    this.setState({error, loading: false});
  }
  onPasswordResetSuccess(){
    this.setState({success:true});
  }

  render(){
    const {email, error, loading, success} = this.state;
    const {formButtonStyle, formButtonSuccessStyle, errorStyle} = styles;


    const loadingSpinner = <div className='pa3' style={success ? formButtonSuccessStyle : formButtonStyle}><BeatLoader sizeUnit={"px"} size={15} color={'whitesmoke'}/></div>;
    const errorBox = error ? <div style={errorStyle}>{error}</div> : null;

    return (
      <div style={{color:'#32383b'}}>
        <h2 style={{margin:'auto', padding: 15}}>Reset Password</h2>
        {errorBox}
        <input type="text" placeholder="Email" value={email} onChange={(event) => this.setState({email: event.target.value})}/>
        {loading ? loadingSpinner : <input className='pa3 mv1' style={success ? formButtonSuccessStyle : formButtonStyle} type="button" value={success ? "Email Sent" : "Reset Password"} onClick={() => this.sendPasswordReset()}/>}
      </div>
    );}
}

const styles = {
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
    border: 'none',
    borderRadius: 3,
    backgroundColor: '#00BBFF',
    color: 'whitesmoke',
    textTransform: 'uppercase',
    width: '100%',
    cursor: 'pointer'
  },
  formButtonSuccessStyle:{
    border: 'none',
    borderRadius: 3,
    backgroundColor: '#43ca86',
    color: 'whitesmoke',
    textTransform: 'uppercase',
    width: '100%',
    cursor: 'pointer'
  }
}

export default ResetPassword;
