import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import NewsScreen from '../screens/NewsScreen';
import NewsDetailScreen from '../screens/NewsDetailScreen';
import Colors from '../constants/Colors';
import {Platform} from 'react-native';

const NewsNavigator = createStackNavigator(
  {
    News: NewsScreen,
    NewsDetail: NewsDetailScreen,
  },
  {
    defaultNavigationOptions: {
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: Platform.OS === 'android' ? 'white' : '',
        alignContent: 'center',
      },
      headerTintColor: Platform.OS === 'android' ? 'black' : ' ',
    },
  },
);
export default createAppContainer(NewsNavigator);
