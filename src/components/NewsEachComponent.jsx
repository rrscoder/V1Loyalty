
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import { Text } from 'react-native-paper';
import { textFormatter } from '../environments/formatter';
import { useNavigation } from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import { environment } from '../environments/environment';

const truncateHtmlContent = (htmlContent, limit) => {
  const textContent = htmlContent.replace(/<\/?[^>]+(>|$)/g, "");
  return textContent.length > limit ? textContent.slice(0, limit) : textContent;
};

const NewsEachComponent = ({ data, index, setIndex }) => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const truncatedDescription = truncateHtmlContent(data.blog_description, 100);
  const source = truncatedDescription ? { html: `${truncatedDescription}` } : null;

  const tagStyles = {
    body: {
      fontSize: 12,
    },
    p: {},
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.container}
      onPress={() => {
        if (setIndex) {
          setIndex(index);
        } else {
          navigation.navigate('NewsDetailsScreen', { data, index });
        }
      }}>
      <View style={styles.left}>
        <Image
          source={{
            uri: `${environment.url}/uploads/blog/${data?.blog_image}`,
          }}
          resizeMode="cover"
          style={{
            height: '100%',
            width: '100%',
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
          }}
        />
      </View>
      <View style={styles.right}>
        <Text style={[styles.rewardTitle]} numberOfLines={2}>
          {textFormatter(data?.blog_name, 30)}
        </Text>
        {/* {source && (
          <RenderHtml
            contentWidth={width}
            source={source}
            tagsStyles={tagStyles}
          />
        )} */}
        <View>
          <Text>{data?.preview_text}</Text>
        </View>
        <View style={styles.readMoreContainer}>
          <Text style={styles.readMoreText}>Read More</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NewsEachComponent;


const styles = StyleSheet.create({
  readMoreContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: '100%',
    paddingHorizontal:3,
  },
  readMoreText: {
    color: '#5387C6',
    textAlign: 'left',
    fontFamily: 'CircularStd-Bold',
    fontSize: 10,
  },
  container: {
    flexDirection: 'row',
    // alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    height: 150,
    overflow: 'hidden',
  },
  left: {
    width: '40%',
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  right: {
    width: '60%',
    padding: 8,
    gap: 5,
    // justifyContent: 'center',
  },
  rewardTitle: {
    fontSize: 18,
    fontFamily: 'CircularStd-Bold',
    color: '#5387C6',
    overflow: 'scroll',
    textTransform: 'uppercase',
  },
  rewardPoints: {
    fontSize: 12,
    fontFamily: 'CircularStd-Book',
    overflow: 'hidden',
    textAlign: 'justify',
  },
});
