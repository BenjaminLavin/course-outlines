import React from 'react';
import Card from './Card';

const CardList = ({list}) => {
  return (
    <div>
      {
        list.map((item, i) => {
          return (
            <Card
              key={item.id}
              id={item.id}
              title={item.title}
              subtitle={item.subtitle}
              url={item.url}
              imageSource={item.imageSource}
              handleClick={item.handleClick}
              type={item.type}
              author={item.author}
            />
          );
        })
      }
    </div>
  );
}

export default CardList;
