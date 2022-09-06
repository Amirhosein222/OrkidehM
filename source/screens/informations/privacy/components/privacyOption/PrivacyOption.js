/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Switch } from 'react-native-paper';

import { Text, InputRow } from '../../../../../components/common';
import { COLORS, rh, rw } from '../../../../../configs';

const PrivacyOption = ({ title, handleModal, type, modalType }) => {
  const [beforeP, setBeforeP] = useState(false);

  const onToggleSwitch = () => {
    if (type === 'finger') {
      setBeforeP(!beforeP);
      !beforeP && handleModal();
      return;
    }
    setBeforeP(!beforeP);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          width: rw(82),
          justifyContent: 'space-between',
        }}>
        <Switch
          value={beforeP}
          onValueChange={onToggleSwitch}
          color={COLORS.borderLinkBtn}
        />
        <Text color={COLORS.textDark}>{title} :</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: rw(82),
    marginTop: rh(3),
    marginVertical: rh(0.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PrivacyOption;
