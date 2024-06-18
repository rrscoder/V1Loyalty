import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Platform
} from 'react-native';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Image } from 'react-native';
import { environment } from '../../environments/environment';
import RenderHtml from 'react-native-render-html';
import { useNavigation } from '@react-navigation/native';
import NewsEachComponent from '../../components/NewsEachComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewsDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(route?.params?.index);
  const [allNews, setAllNews] = useState([]);
  const [data, setData] = useState({});
  const [nextIndex, setNextIndex] = useState(0);

  useEffect(() => {
    const getAllNews = async () => {
      const allNewsData = await AsyncStorage.getItem('news');
      if (allNewsData) {
        const parseData = JSON.parse(allNewsData);
        setAllNews(parseData);
        setData(parseData?.[index]);
        const idx = index === parseData?.length - 1 ? 0 : index + 1;
        setNextIndex(idx);
      }
    };
    getAllNews();
  }, [index]);

  const { width } = useWindowDimensions();

  const source = useMemo(() => {
    const blogDescription = data?.blog_description;
    return blogDescription ? { html: blogDescription } : null;
  }, [data?.blog_description]);

  const tagStyles = useMemo(() => ({
    body: {
      fontSize: 15,
      color: 'black',
      lineHeight: 20,
    },
    p: {
      marginTop: -5,
      color: 'black',
    },
  }), []);

  const alterNode = useCallback((node) => {
    if (node.name === 'p') {
      node.attribs.style = 'color: black;';
    }
  }, []);

  const renderersProps = useMemo(() => ({
    p: {
      alterNode,
    },
  }), [alterNode]);

  return (
    <ScrollView style={{ display: 'flex', paddingBottom: 20, backgroundColor: '#5387C6' }}>
      <View style={{ marginBottom: 15 }}>
        <View>
          <Image
            source={{
              uri: `${environment.url}/uploads/blog/${data?.blog_image}`,
            }}
            resizeMode="cover"
            style={{
              height: 250,
              width: '100%',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }}
          />
        </View>
        <View style={styles.detailsContainer}>
          <Text  style={Platform.OS === 'ios'
                  ? styles.detailTitleIOS
                  : styles.detailTitle}>{data?.blog_name}</Text>
          {source && (
            <RenderHtml
              contentWidth={width}
              source={source}
              tagsStyles={tagStyles}
              renderersProps={renderersProps}
            />
          )}
        </View>
        {allNews?.length > 0 && (
          <View>
            <View style={styles.readmoreView}>
              <Text style={styles.readmoreText}>READ MORE</Text>
            </View>
            <NewsEachComponent setIndex={setIndex} data={allNews?.[nextIndex]} index={nextIndex} />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default NewsDetailsScreen;

const styles = StyleSheet.create({
  detailsContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  detailTitle: {
    fontSize: 40,
    fontFamily: 'CircularStd-Bold',
    color: '#5387C6',
    marginBottom: 15,
    lineHeight: 40
  },
  detailTitleIOS: {
    fontSize: 50,
    fontFamily: 'CircularStd-Bold',
    color: '#5387C6',
    marginBottom: 15,
    lineHeight: 50
  },
  readmoreView: {
    marginLeft: 30,
    marginVertical: -10,
  },
  readmoreText: {
    color: '#fff',
    fontSize: 25,
    marginBottom: 5,
    fontWeight: 'bold',
    fontFamily: 'CircularStd-Bold',
  },
});