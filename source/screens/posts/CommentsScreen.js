/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  View,
  StatusBar,
  Pressable,
  SectionList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import getLoginClient from '../../libs/api/loginClientApi';

import {
  Container,
  IconWithBg,
  Divider,
  Text,
  Image,
  CommentModal,
  Snackbar,
} from '../../components/common';

import { COLORS, rh, STATUS_BAR_HEIGHT } from '../../configs';

const DATA = [
  {
    title: 'کامنت اول',
    data: ['Pizza', 'Burger', 'Risotto'],
  },
  {
    title: 'کامنت دوم',
    data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
  },
  {
    title: 'کامنت سوم',
    data: ['Water', 'Coke', 'Beer'],
  },
  {
    title: 'کامنت چهارم',
    data: ['Cheese Cake', 'Ice Cream'],
  },
];
const CommentScreen = ({ navigation, route }) => {
  const params = route.params;
  const [posts, setPosts] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const getComments = async function () {
    setIsLoading(true);
    const loginClient = await getLoginClient();
    const newcomments = [];
    loginClient
      .get(`show/comments?post_id=${params.postId}&gender=man`)
      .then((response) => {
        setIsLoading(false);
        if (response.data.is_successful) {
          response.data.data.map((comment) => {
            newcomments.push({
              title: comment.comment_text,
              data: comment.children_recursive,
            });
          });
          setComments(newcomments);
        } else {
          setSnackbar({
            msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
            visible: true,
          });
        }
      });
  };

  const renderItems = function (item) {
    return (
      <View
        style={{ justifyContent: 'center', width: '100%', marginRight: 20 }}>
        <View style={{ flexDirection: 'row', margin: 10 }}>
          <Text marginRight="5" color={COLORS.dark} small>
            {item}
          </Text>
          <Image
            imageSource={require('../../assets/images/Ellipse.png')}
            width="45px"
            height="45px"
          />
        </View>
      </View>
    );
  };

  useEffect(() => {
    getComments();
  }, []);

  if (isLoading) {
    return (
      <Container>
        <View
          style={{
            flex: 1,
            width: '100%',
            marginTop: STATUS_BAR_HEIGHT + rh(2),
          }}>
          <Text color={COLORS.blue} large>
            بانک آموزشی
          </Text>
          <Divider
            width="100%"
            color={COLORS.dark}
            style={{ alignSelf: 'center' }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <ActivityIndicator size="large" color={COLORS.blue} />
        </View>
      </Container>
    );
  } else {
    return (
      <Container justifyContent="flex-start">
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <View style={styles.headers}>
          <Pressable onPress={() => navigation.goBack()}>
            <IconWithBg
              bgColor={COLORS.blue}
              width="40px"
              height="40px"
              borderRadius="20px"
              icon="chevron-left"
              iconSize={30}
              marginTop="20px"
              marginLeft="10px"
              marginBottom="10px"
              alignSelf="flex-start"
            />
          </Pressable>

          <View style={{ flex: 1, marginRight: 20 }}>
            <Text color={COLORS.blue} large>
              نظرات
            </Text>
          </View>
          <Pressable onPress={() => navigation.openDrawer()}>
            <MaterialCommunityIcons
              name="menu"
              color={COLORS.grey}
              size={28}
              style={{ marginRight: 10 }}
            />
          </Pressable>
        </View>

        <Divider width="100%" color={COLORS.dark} />

        {comments.length !== 0 ? (
          <SectionList
            sections={comments}
            keyExtractor={(item, index) => item + index}
            renderItem={renderItems}
            renderSectionHeader={({ section: { title } }) => (
              <View
                style={{
                  flexDirection: 'row',
                  margin: 10,
                }}>
                <Text marginRight="5" color={COLORS.dark} small>
                  {title}
                </Text>
                <Text marginRight="5" bold color={COLORS.dark} small>
                  نگار قاسمی
                </Text>
                <Image
                  imageSource={require('../../assets/images/Ellipse.png')}
                  width="45px"
                  height="45px"
                />
              </View>
            )}
            style={{ flex: 1, width: '100%' }}
            contentContainerStyle={{
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}
          />
        ) : (
          <ActivityIndicator size="large" color={COLORS.blue} />
        )}
      </Container>
    );
  }
};

const styles = StyleSheet.create({
  postContainer: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headers: {
    flexDirection: 'row',
    width: '100%',
    marginTop: STATUS_BAR_HEIGHT + rh(2),
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
  },
});

export default CommentScreen;
