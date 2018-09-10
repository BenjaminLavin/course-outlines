import React, {Component}  from 'react';
import Popup from 'reactjs-popup';
import { BeatLoader } from 'react-spinners';


import './SignInModal.css'
import firebase from '../Config/Firebase';
import CourseTypeSelect from './CourseTypeSelect';

class AccountModal extends Component {
  constructor(props){
    super(props);
    this.state = {
      error: '',
      user: this.props.user,
      loading: false,
      courseType: '',
      courseNumber: '',
      success: ''
    };
  }

  resetState(){
    this.setState({
      error: '',
      user: {},
      loading: false,
      courseType: '',
      courseNumber: '',
      success: ''
    });
  }

  resetForm(){
    this.setState({error: '', success: false, courseType: '', courseNumber: '', loading: false});
  }

  onSubmitRequest(){
    const {courseType, courseNumber, user} = this.state;
    if(!courseType) {this.onRequestFail('Select a course type'); return;}
    if(!courseNumber || courseNumber < 100 || courseNumber > 999) {this.onRequestFail('Enter a valid course number (100-999)'); return;}
    this.setState({error: '', loading: true});

    firebase.firestore().collection('users').doc(user.uid.toString()).collection('request_list').add({
      course_number: courseNumber,
      course_type: courseType
    })
    .then(() => this.onRequestSuccess())
    .catch((error) => this.onRequestFail(error.message));


  }

  onRequestSuccess(){
    this.setState({success: true, loading: false});
    setTimeout(() => this.resetForm(), 2000);
  }

  onRequestFail(error){
    this.setState({error, loading: false});
  }


  render(){
    const {error, user, courseType, courseNumber, loading, success} = this.state;
    const {errorStyle, formButtonStyle, formButtonSuccessStyle} = styles;

    const errorBox = error ? <div style={errorStyle}>{error}</div> : null;

    const loadingSpinner = <div className='pa3' style={success ? formButtonSuccessStyle : formButtonStyle}><BeatLoader sizeUnit={"px"} size={15} color={'whitesmoke'}/></div>;
    const form =
    <div>

      <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', height:25}}>
        <div style={{height:'100%', width:'49%'}}><CourseTypeSelect value={courseType} onChange={(event) => this.setState({courseType: event.target.value, error: ''})}/></div>
        <div style={{height:'100%', width:'49%'}}><input type="number" style={{height:'100%'}} placeholder="Course Number" value={courseNumber} onChange={(event) => this.setState({courseNumber: event.target.value, error: ''})}/></div>
      </div>
      <div className='mv3' style={{display:'flex', justifyContent:'center'}}>{loading ? loadingSpinner : <input className='pa3' style={success ? formButtonSuccessStyle : formButtonStyle} type="button" value={success ? "Request Submitted" : "Submit Request"} onClick={() => this.onSubmitRequest()}/>}</div>
    </div>;


    return (
      <Popup
        trigger={<button className="mh2" style={styles.signInButtonStyle}><span style={styles.signInButtonTextStyle}>Account</span></button>}
        modal
        closeOnDocumentClick
        onClose={() => this.resetState()}
        contentStyle={{width:this.state.modalWidth}}
        >
        <div style={{color:'#32383b', margin:'auto', width:350}}>
          <div className="pa3" style={{display:'flex', flexDirection:'column'}}>
          <h2 style={{margin:'auto', padding: 15}}>{user.displayName}</h2>
          <span className="pa3">If you're looking for a course outline which is not yet listed, enter the course details below to receive a notification when it becomes availible</span>
          {errorBox}
          {form}
          <div className='mt3'><button onClick={() => firebase.auth().signOut()} style={styles.signInButtonStyle}><span style={styles.signInButtonTextStyle}>Sign Out</span></button></div>
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
      textTransform:'none'
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
      border: 'none',
      borderRadius: 3,
      backgroundColor: '#00BBFF',
      color: 'whitesmoke',
      textTransform: 'uppercase',
      cursor: 'pointer',
      width: '75%',
      height: 55
    },
    formButtonSuccessStyle:{
      border: 'none',
      borderRadius: 3,
      backgroundColor: '#43ca86',
      color: 'whitesmoke',
      textTransform: 'uppercase',
      width: '75%',
      height: 55
    }
  }

  export default AccountModal;
