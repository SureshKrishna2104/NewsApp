import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Image,
  Platform,
  Share,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NativeViewGestureHandler} from 'react-native-gesture-handler';

const NewsDetailScreen = props => {
  const newsName = props.navigation.getParam('newsName');
  const newsId = props.navigation.getParam('newsId');
  const newsDes = props.navigation.getParam('newsDes');
  const newsCat = props.navigation.getParam('newsCat');
  const newsUrl = props.navigation.getParam('newsUrl');
  //given doesnt provide any image url so i defaulty declare common image
  const REMOTE_IMAGE_PATH =
    'https://image.shutterstock.com/image-vector/news-line-vector-icon-260nw-1468976129.jpg';
  const checkPermission = async () => {
    // Function to check the platform
    // If iOS then start downloading
    // If Android then ask for permission

    if (Platform.OS === 'ios') {
      downloadImage();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download Photos',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Once user grant the permission start downloading
          console.log('Storage Permission Granted.');
          downloadImage();
        } else {
          // If permission denied then show alert
          alert('Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.warn(err);
      }
    }
  };

  const downloadImage = () => {
    // Main function to download the image

    // To add the time suffix in filename
    let date = new Date();
    // Image URL which we want to download
    let image_URL = REMOTE_IMAGE_PATH;
    // Getting the extention of the file
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        // Showing alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        alert('Image Downloaded Successfully.');
      });
  };

  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };
  const onShare = async () => {
    try {
      const result = await Share.share(
        {
          message: newsDes,
          title: newsName,
          url: newsUrl,
        },
        {
          excludedActivityTypes: [
            'com.apple.UIKit.activity.PostToWeibo',
            'com.apple.UIKit.activity.Print',
            'com.apple.UIKit.activity.CopyToPasteboard',
            'com.apple.UIKit.activity.AssignToContact',
            'com.apple.UIKit.activity.SaveToCameraRoll',
            'com.apple.UIKit.activity.AddToReadingList',
            'com.apple.UIKit.activity.PostToFlickr',
            'com.apple.UIKit.activity.PostToVimeo',
            'com.apple.UIKit.activity.PostToTencentWeibo',
            'com.apple.UIKit.activity.AirDrop',
            'com.apple.UIKit.activity.OpenInIBooks',
            'com.apple.UIKit.activity.MarkupAsPDF',
            'com.apple.reminders.RemindersEditorExtension',
            'com.apple.mobilenotes.SharingExtension',
            'com.apple.mobileslideshow.StreamShareService',
            'com.linkedin.LinkedIn.ShareExtension',
            'pinterest.ShareExtension',
            'com.google.GooglePlus.ShareExtension',
            'com.tumblr.tumblr.Share-With-Tumblr',
            'net.whatsapp.WhatsApp.ShareExtension',
          ],
        },
      );
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image
          source={{
            uri: REMOTE_IMAGE_PATH,
          }}
          style={{
            width: '100%',
            height: 300,
          }}
        />
        <TouchableOpacity
          style={styles.ButtonContainer}
          onPress={checkPermission}>
          <Text style={styles.text}>Save Image</Text>
        </TouchableOpacity>

        <View style={{...styles.newsRow, ...styles.titleContainer}}>
          <Text style={styles.title}>{newsName}</Text>
          <TouchableOpacity onPress={onShare} style={styles.ButtonContainer}>
            <Text style={styles.ButtonText}>
              <Icon name="share" /> Share
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text>{newsDes}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  ButtonText: {
    fontSize: 10,
    color: '#000',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  titleContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  ButtonContainer: {
    elevation: 0,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 30,
    padding: 5,
    justifyContent: 'center',
    marginHorizontal: 100,
    borderWidth: 0.5,
    borderColor: '#d3d3d3',
  },
  newsRow: {
    flexDirection: 'row',
  },

  newsDetail: {
    paddingHorizontal: 80,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '10%',
  },
  button: {
    width: '80%',
    padding: 10,
    backgroundColor: 'orange',
    margin: 10,
  },
  text: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    padding: 5,
  },
  image: {
    width: '100%',
    height: 300,
  },
  actions: {
    marginVertical: 10,
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'open-sans-bold',
  },
  description: {
    fontFamily: 'open-sans',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
});

export default NewsDetailScreen;
