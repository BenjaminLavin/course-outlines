import React from 'react';
import CardList from './CardList';

const DepartmentCardList = ({list, onClick}) => {

  var departmentList = [];
  list.forEach((department) => {
    var item = [];
    item.id = department.id;
    item.key = department.key;
    item.title = department.department_name;
    item.subtitle = department.department_type;
    item.handleClick = onClick;
    item.imageSource = department.imageSource;
    item.type = 'department';
    departmentList.push(item);
  });

  return (
    <CardList list={departmentList}/>
  );
}

export default DepartmentCardList;
