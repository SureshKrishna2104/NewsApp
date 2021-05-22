import React, {useState, useEffect} from 'react';
import {View, Text, FlatList} from 'react-native';
import NewsGrid from '../components/NewsGrid';

const NewsScreen = props => {
  const [data, setData] = React.useState();

  useEffect(() => {
    fetch(
      'https://newsapi.org/v2/sources?apiKey=d29d58aab88d4ea0b04ddb245a230068',
      {
        method: 'GET',
      },
    )
      .then(response => response.json())
      .then(responseData => {
        setData(responseData.sources);
        console.warn('out of ', responseData.sources);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const renderGrid = itemdata => {
    return (
      <NewsGrid
        image="https://image.shutterstock.com/image-vector/news-line-vector-icon-260nw-1468976129.jpg"
        title={itemdata.item.name}
        description={itemdata.item.description}
        onSelectNews={() => {
          props.navigation.navigate({
            routeName: 'NewsDetail',
            params: {
              newsName: itemdata.item.name,
              newsId: itemdata.item.id,
              newsDes: itemdata.item.description,
              newsCat: itemdata.item.category,
              newsUrl: itemdata.item.url,
            },
          });
        }}
      />
    );
  };

  return (
    <View>
      <FlatList data={data} renderItem={renderGrid} />
    </View>
  );
};
export default NewsScreen;
