/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StatusBar,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Keyboard,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Swiper from 'react-native-swiper';

import { VideoPlayerModal } from '../../../components/learningBank';

import getLoginClient from '../../../libs/api/loginClientApi';

import {
  Text,
  CommentModal,
  TextInput,
  Snackbar,
  BackgroundView,
  ScreenHeader,
} from '../../../components/common';

import {
  COLORS,
  STATUS_BAR_HEIGHT,
  WIDTH,
  SCROLL_VIEW_CONTAINER,
  baseUrl,
  rw,
  rh,
} from '../../../configs';
import { useIsPeriodDay } from '../../../libs/hooks';
import { numberConverter } from '../../../libs/helpers';

const FullPostScreen = ({ navigation, route }) => {
  const params = route.params;
  const isPeriodDay = useIsPeriodDay();
  const [post, setPost] = useState(null);
  const [medias, setMedias] = useState([]);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [newComment, setNewComment] = useState(null);
  const [btnPressed, setBtnPressed] = useState(false);
  const [replyCmId, setReplyCmId] = useState(null);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const video = useRef(null);

  const getFullPost = async function () {
    !isLoading && setIsLoading(true);
    post && setPost(null);
    medias.length && setMedias([]);
    comments.length && setComments([]);

    const loginClient = await getLoginClient();
    loginClient
      .get(`show/post/detail?id=${params.post.id}&gender=man`)
      .then(response => {
        setIsLoading(false);
        if (response.data.is_successful) {
          setPost(response.data.data);
          setMedias([
            ...response.data.data[0].images,
            ...response.data.data[0].videos,
          ]);
          console.log('full post ', response.data.data[0].images);
          setComments([...response.data.data[1]]);
        } else {
          setSnackbar({
            msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
            visible: true,
          });
        }
      });
  };

  const handleTextInput = function (text, name) {
    setNewComment(text);
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const validateComment = function () {
    if (!newComment) {
      setSnackbar({
        msg: 'لطفا ابتدا نظر خود را وارد کنید.',
        visible: true,
      });
      return false;
    }
    return true;
  };

  const sendComment = async function () {
    if (validateComment()) {
      Keyboard.dismiss();
      setBtnPressed(true);
      const formData = new FormData();
      formData.append('post_id', params.post.id);
      formData.append('post_type', 'post');
      formData.append('comment_text', newComment);
      formData.append('parent_id', '');
      formData.append('gender', 'man');
      const loginClient = await getLoginClient();
      loginClient.post('comment/store', formData).then(response => {
        setBtnPressed(false);
        if (response.data.is_successful) {
          setSnackbar({
            msg: 'نظر شما با موفقیت ثبت شد.',
            visible: true,
            type: 'success',
          });
          setNewComment('');
          setTimeout(() => {
            getFullPost();
          }, 2000);
        } else {
          setSnackbar({
            msg: 'مشکلی در ثبت نظر پیش آمده است',
            visible: true,
          });
        }
      });
    }
  };

  const handleModal = function (replyCm) {
    setReplyCmId(replyCm);
    setShowModal(!showModal);
  };

  const onPlayVideo = vid => {
    video.current = vid;
    setVideoModalVisible(true);
  };

  const closeModal = () => {
    setVideoModalVisible(false);
  };

  useEffect(() => {
    setVideoModalVisible(false);
    video.current = null;
    getFullPost();
  }, [params]);

  if (isLoading) {
    return (
      <BackgroundView>
        <ScreenHeader title="بانک آموزشی" />

        <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
          <ActivityIndicator
            size="large"
            color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
          />
        </View>
      </BackgroundView>
    );
  } else {
    return (
      <BackgroundView>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <ScreenHeader title="بانک آموزشی" />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[SCROLL_VIEW_CONTAINER]}>
          {medias.length ? (
            <View style={styles.mediaContainer}>
              <Swiper width={WIDTH} height={rh(40)} showsButtons={true}>
                {medias.map(item => {
                  return item.hasOwnProperty('image') ? (
                    <Image
                      source={{ uri: baseUrl + item.image }}
                      style={{ width: rw(100), height: '100%' }}
                    />
                  ) : (
                    <Pressable
                      style={styles.playVideo}
                      onPress={() => onPlayVideo(item.video)}>
                      <FontAwesome5
                        name="play-circle"
                        size={80}
                        color="white"
                        style={{ marginTop: rh(1) }}
                      />
                      <Text color="white" large>
                        مشاهده ویدیو
                      </Text>
                    </Pressable>
                  );
                })}
              </Swiper>
            </View>
          ) : null}
          {post ? (
            <>
              <View style={styles.textContainer}>
                <Text
                  color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
                  bold
                  size={13}
                  alignSelf="flex-end"
                  marginTop="20">
                  {post[0].title}
                </Text>
                <Text
                  color={COLORS.textDark}
                  bold
                  textAlign="right"
                  alignSelf="flex-end"
                  marginTop="0">
                  {post[0].text.replace(/(<([^>]+)>)/gi, '')}
                </Text>
              </View>

              <View style={styles.commentSection}>
                {comments.map(comment => {
                  return (
                    <View style={styles.commentContainer}>
                      <View style={styles.comment}>
                        <Pressable onPress={() => handleModal(comment.id)}>
                          <Text
                            marginRight="5"
                            marginTop="3"
                            mini
                            color={COLORS.primary}>
                            پاسخ دهید
                          </Text>
                        </Pressable>

                        <Text
                          marginRight="5"
                          color={COLORS.dark}
                          small
                          textAlign="right">
                          {comment.comment_text}
                        </Text>
                        <Text marginRight="5" color={COLORS.dark} bold small>
                          {comment.user_name}
                        </Text>
                        <Image
                          source={require('../../../assets/images/Ellipse.png')}
                          style={{ width: 20, height: 20 }}
                        />
                      </View>
                      {comment.replies.map(reply => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              marginRight: 20,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Pressable onPress={() => handleModal(reply.id)}>
                              <Text marginRight="5" mini color={COLORS.primary}>
                                پاسخ دهید
                              </Text>
                            </Pressable>

                            <Text marginRight="5" color={COLORS.dark} small>
                              {reply.comment_text}
                            </Text>
                            <Text
                              marginRight="3"
                              color={COLORS.dark}
                              bold
                              small>
                              {reply.user_name}
                            </Text>
                            <Image
                              source={require('../../../assets/images/Ellipse.png')}
                              style={{ width: 20, height: 20 }}
                            />
                            <MaterialCommunityIcons
                              name="subdirectory-arrow-left"
                              color={COLORS.grey}
                              size={20}
                              style={{ marginTop: 10 }}
                            />
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            </>
          ) : null}
        </ScrollView>
        <View style={styles.commentInput}>
          {btnPressed ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Pressable onPress={() => sendComment()}>
              <Text
                marginRight="5"
                alignSelf="flex-start"
                medium
                color={isPeriodDay ? COLORS.periodDay : COLORS.primary}>
                ثبت
              </Text>
            </Pressable>
          )}

          <TextInput
            placeholder="نظر دهید..."
            style={styles.input}
            onChangeText={handleTextInput}
            editedText={newComment}
          />
        </View>
        {showModal ? (
          <CommentModal
            visible={showModal}
            closeModal={handleModal}
            postId={selectedPostId}
            parent_id={replyCmId}
            updateComments={getFullPost}
            showPopup={setSnackbar}
          />
        ) : null}

        {snackbar.visible === true ? (
          <Snackbar
            message={snackbar.msg}
            type={snackbar.type}
            handleVisible={handleVisible}
          />
        ) : null}

        <VideoPlayerModal
          visible={videoModalVisible}
          video={video.current}
          closeModal={closeModal}
        />
      </BackgroundView>
    );
  }
};

const styles = StyleSheet.create({
  mediaContainer: {
    width: '100%',
    flex: 1,
    marginTop: rh(2),
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: rw(5),
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    marginTop: STATUS_BAR_HEIGHT + 5,
    alignItems: 'center',
  },
  commentContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
    marginRight: 0,
  },
  commentSection: {
    backgroundColor: 'transparent',
    width: '80%',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  input: {
    width: '75%',
    height: 40,
    marginBottom: 10,
    borderRadius: 35,
    justifyContent: 'center',
    backgroundColor: COLORS.grey,
  },
  commentInput: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 10,
    marginBottom: 5,
  },
  comment: {
    flexDirection: 'row',
    margin: 10,
    width: '100%',
    justifyContent: 'flex-end',
  },
  playVideo: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.grey,
    width: rw(100),
    height: '100%',
  },
  videoThumbnail: {
    width: rw(100),
    height: '100%',
  },
});

export default FullPostScreen;
