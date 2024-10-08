/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Button, Text } from '../index';
import { rw, rh, COLORS } from '../../../configs';
import { deleteCmApi } from '../../../libs/apiCalls';
import getLoginClient from '../../../libs/api/loginClientApi';

import deleteVector from '../../../assets/vectors/register/delete.png';
import Trash from '../../../assets/icons/btns/delete.svg';
import { WomanInfoContext } from '../../../libs/context/womanInfoContext';

const DeleteModal = ({
  id,
  type,
  title,
  visible,
  closeModal,
  setSnackbar,
  updateData,
}) => {
  const { getAndHandleRels } = useContext(WomanInfoContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const onDeleteRel = async () => {
    const loginClient = await getLoginClient();
    setIsDeleting(true);
    const formData = new FormData();
    formData.append('gender', 'man');
    formData.append('relation_id', id);
    loginClient.post('delete/relation', formData).then(response => {
      setIsDeleting(false);
      if (response.data.is_successful) {
        getAndHandleRels();
        setSnackbar({
          msg: 'رابطه شما با موفقیت حذف شد.',
          visible: true,
          type: 'success',
        });
        closeModal();
      } else {
        setSnackbar({
          msg: 'متاسفانه مشکلی رخ داده است.',
          visible: true,
        });
      }
    });
  };

  const onDeleteMem = async () => {
    setIsDeleting(true);
    const res = await deleteCmApi(id);
    setIsDeleting(false);
    res.is_successful &&
      setSnackbar({
        msg: res.data,
        visible: true,
        type: 'success',
      });
    updateData();
    closeModal();
  };

  return (
    <Modal
      testID={'modal'}
      isVisible={visible}
      coverScreen={true}
      hasBackdrop={true}
      backdropOpacity={0.5}
      backdropTransitionOutTiming={1}
      backdropTransitionInTiming={0}
      animationOutTiming={0}
      animationInTiming={0}
      animationIn="slideInUp"
      onBackdropPress={isDeleting ? () => {} : closeModal}
      style={styles.modal}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Pressable
            onPress={isDeleting ? () => {} : closeModal}
            hitSlop={7}
            style={{ marginLeft: 'auto' }}>
            <Ionicons
              name="close"
              size={32}
              color={COLORS.icon}
              style={styles.closeIcon}
            />
          </Pressable>
        </View>
        <Image source={deleteVector} style={{ width: 170, height: 170 }} />
        <Text bold size={13} color={COLORS.textCommentCal}>
          حذف {title}
        </Text>
        <Text size={12} color={COLORS.textLight} marginTop={rh(2)}>
          آیا از حذف {title} خود مطمئن هستید؟
        </Text>

        <Button
          title={`حذف ${title}`}
          Icon={() => <Trash style={{ width: 25, height: 25 }} />}
          color={COLORS.error}
          loading={isDeleting}
          disabled={isDeleting}
          onPress={type === 'rel' ? onDeleteRel : onDeleteMem}
          style={{ marginTop: 'auto', marginBottom: rh(2), width: rw(62) }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: rw(80),
    height: rh(47),
    elevation: 5,
    borderRadius: 25,
    backgroundColor: COLORS.mainBg,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: rh(2),
  },
  closeIcon: {
    alignSelf: 'flex-end',
    marginRight: rw(5),
  },
});

export default DeleteModal;
