import {
  Pressable,
  ScrollView,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import NewsEachComponent from '../../components/NewsEachComponent';
import {getAllBlogs} from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const News = () => {
  const [news, setNews] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const data = await getAllBlogs();
      if (data?.success) {
        setNews(data?.allBlogs);

        await AsyncStorage.setItem('news', JSON.stringify(data?.allBlogs));
      }
    };
    getData();
  }, []);

  return (
    <ScrollView
      style={{
        display: 'flex',
        backgroundColor: '#5387C6',
        marginTop: -30,
        paddingTop: 30,
      }}>
      <View style={{marginBottom: 40}}>
        {news?.length > 0 &&
          news.map((m, index) => {
            const nextData =
              index === news?.length - 1 ? news[0] : news[index + 1] || null;
            return (
              <View key={m._id}>
                {news && (
                  <NewsEachComponent
                    data={m}
                    index={index}
                    nextData={nextData}
                    allNews={news} /*  afternextData={afternextData}*/
                  />
                )}
              </View>
            );
          })}
      </View>
    </ScrollView>
  );
};

export default News;

const styles = StyleSheet.create({});
