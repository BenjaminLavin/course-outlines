import React, {Component} from 'react';
import { BeatLoader } from 'react-spinners';
import {isMobile} from 'react-device-detect';
import AdSense from 'react-adsense';

import SyllabusCardList from '../Components/SyllabusCardList';
import DepartmentCardList from '../Components/DepartmentCardList';
import SearchBox from '../Components/SearchBox';
import SignInModal from '../Components/SignInModal';
import AccountModal from '../Components/AccountModal';
import './App.css'
import firestore from '../Config/Firestore';
import firebase from '../Config/Firebase';



class App extends Component {

  constructor(){
    super();
    this.state = {
      syllabusses: {},
      currentSyllabusses: [],
      departments: [],
      selectedDepartment: '',
      searchfield: '',
      error: false,
      sticky: false,
      loading: true,
      isSignedIn: false,
      user: {}
    };
  }

  componentDidMount(){
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
        (user) => this.setState({isSignedIn: !!user, user})
    );
    window.addEventListener('scroll', this.handleScroll.bind(this));
    firestore.collection('department_list').get()
    .then((snapshot) => {
      var departments = [];
      snapshot.forEach((doc) => {
        Object.keys(doc.data()).forEach(function (key) {
          var department = {};
          department.department_type = key;
          department.department_name = doc.data()[key];
          department.id = key;
          try {
            department.imageSource = require(`../img/${department.department_type.toLowerCase()}.jpg`);
          } catch (err) {
            department.imageSource = require('../img/default.jpg');
          }
          departments.push(department);
        });
      });
      departments.sort(function (a, b) {
        if (a.department_name < b.department_name) return -1;
        if (a.department_name > b.department_name) return 1;
        return 0;
      });
      this.setState({departments});
      this.setState({loading: false});
    })
    .catch((err) => {
      this.setState({error: true});
      this.setState({loading:false});

    });
  }

  getSyllabusses(department_type){
    var syllabusses = this.state.syllabusses;
    if (syllabusses[department_type] !== undefined){
      this.setState({currentSyllabusses: syllabusses[department_type]});
    }
    else{
      this.setState({loading:true});
      firestore.collection('syllabusses').where('course_type', '==', department_type).get()
      .then((snapshot) => {
        var newSyllabusses = [];
        snapshot.forEach((doc) => {
          var data = doc.data();
          data.id = doc.id;
          if (data.show){
            newSyllabusses.push(data);
          }
        });
        syllabusses[department_type] = newSyllabusses;
        this.setState({syllabusses});
        this.setState({currentSyllabusses: newSyllabusses});
        this.setState({loading:false});
      })
      .catch((err) => {
        this.setState({error: true});
        this.setState({loading:false});
      });
    }
  }

  componentWillUnmount(){
    window.removeEventListener('scroll', this.handleScroll);
    this.unregisterAuthObserver();
  }

  handleScroll(event) {
    if (window.pageYOffset > 103) {
      this.setState({sticky: true});
    }
    else {
      this.setState({sticky: false});
    }
  }

  onSearchChange = (event) => {
    this.setState({searchfield: event.target.value});
  }

  onDepartmentClick = (department_type) => {
    this.setState({searchfield: ''});
    this.setState({selectedDepartment: department_type});
    this.setState({currentSyllabusses:[]});
    this.getSyllabusses(department_type);
  }

  render(){
    const {departments, selectedDepartment, currentSyllabusses, searchfield, error, sticky, loading, isSignedIn, user} = this.state;
    const filteredSyllabusses = currentSyllabusses.filter( syllabus => {
      if(syllabus.course_name.toLowerCase().includes(searchfield.toLowerCase())){
        return true;
      }
      if(syllabus.author.toLowerCase().includes(searchfield.toLowerCase())){
        return true;
      }
      if(syllabus.course_number.toLowerCase().includes(searchfield.toLowerCase())){
        return true;
      }
      return false;
    }
  );
  filteredSyllabusses.sort(function (a, b) {
    if (a.course_number < b.course_number) return -1;
    if (a.course_number > b.course_number) return 1;
    return 0;
  });

  const filteredDepartments = departments.filter( department => {
    if(department.department_name.toLowerCase().includes(searchfield.toLowerCase())){
      return true;
    }
    if(department.department_type.toLowerCase().includes(searchfield.toLowerCase())){
      return true;
    }
    return false;
  });

  const stickyStyle = sticky ? {width:'100%', backgroundColor:'whitesmoke', zIndex:1, position: 'fixed', top: 0} : {width:'100%', backgroundColor:'whitesmoke', zIndex:1};
  const lowerDivStyle = sticky ? {marginTop:110, marginBottom:100} : {marginTop:12, marginBottom:100};
  const title = selectedDepartment.length !== 0 ? departments.filter(d => d.department_type === selectedDepartment).map(d => d.department_name) : 'Course Outline Search';
  return error ? (<div className = 'tc'><h1 className='f1' style={{color:'whitesmoke'}} >Something Went Wrong</h1></div>):(
      <div className='tc'>
        <div className='pt3' style={{width:'100%', backgroundColor:'whitesmoke', zIndex:1}}>
          <h1 className='f1 ma3' >{title}</h1>
          <div className='bb' style={stickyStyle}>
            <div className='pa2' style={{display:'flex', justifyContent:'space-between', alignItems:'center', height:82}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'flex-start', flex:1}}>
                  <div className='mh2'>
                    {selectedDepartment.length !== 0 ?
                    <a style={{display:'flex', alignItems:'center', justifyContent:'center'}} onClick={() => {this.setState({selectedDepartment: ''}); this.setState({searchfield: ''})}}>
                      <img src={require('../img/icon-arrow-left.svg')} alt="Back" height={40} width={40}/>{isMobile ? null : <h2 className='ph3'>Back</h2> }
                    </a>
                    : null }
                  </div>
                </div>
                <div style={{display:'flex', alignItems:'center', justifyContent:'center', flex:1}}>
                  <SearchBox searchfield={searchfield} searchChange={this.onSearchChange} style={styles.searchBoxStyle}/>
                </div>
                <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end', flex:1}}>
                  {isSignedIn ?
                    <AccountModal user={user}/> : <SignInModal/>}
                </div>
              </div>
            </div>
          </div>
          <div style={lowerDivStyle}>
            {loading ?
              <BeatLoader
                sizeUnit={"px"}
                size={15}
                color={'whitesmoke'}
                loading={this.state.loading}
                />
               :
               (!selectedDepartment.length ?
                 <DepartmentCardList list={filteredDepartments} onClick={this.onDepartmentClick}/>
                 :
                   (
                     <div>
                       <SyllabusCardList list={filteredSyllabusses}/>
                       <h1 className='f4 ma3' style={{color:'whitesmoke'}}><a href="mailto:hello@courseoutlinesearch.com?Subject=Course%20outline%20submission" target="_top">Do you have a course outline to contribute? Send it here</a></h1>
                     </div>
                   )
               )
              }
            </div>
            <div style={{zIndex:1, position: 'fixed', bottom: 0, width:'100%', maxHeight:90}}>
            <AdSense.Google
              client='ca-pub-6691808812841726'
              slot='5688275643'
              format='auto'
              responsive='true'/>
            </div>
          </div>
          )

        }
}

const styles = {
  searchBoxStyle: {
    background:'whitesmoke',
    borderColor:'#32383b',
    color:'#32383b'
  },
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
  }
}


export default App;
