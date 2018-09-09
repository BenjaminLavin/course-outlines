import React from 'react';
import CardList from './CardList';

const SyllabusCardList = ({list}) => {

  var syllabusList = [];
  list.forEach((syllabus) => {
    var item = [];
    item.id = syllabus.id;
    item.key = syllabus.key;
    item.title = `${syllabus.course_type} ${syllabus.course_number}`;
    item.subtitle = syllabus.course_name;
    item.url = syllabus.remote ? syllabus.remote_url : syllabus.url;
    item.imageSource = require('../img/pdf.png');
    item.handleClick = () => void(0);
    item.type = 'syllabus';
    item.author = syllabus.author;
    syllabusList.push(item);
  });

  return (
    <CardList list={syllabusList}/>
  );
}

export default SyllabusCardList;
