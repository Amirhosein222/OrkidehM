/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useContext } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Text } from '../../../../components/common';
import { WomanInfoContext } from '../../../../libs/context/womanInfoContext';
import { baseUrl, COLORS, rh, rw } from '../../../../configs';

const PartnerSympSection = ({ onReadMore, symps, refresh }) => {
  const { activeRel } = useContext(WomanInfoContext);

  const RenderSymp = useCallback(item => {
    const symp = item.item.sign;
    return (
      <View style={styles.sympContainer}>
        <Image
          source={
            symp.image
              ? { uri: baseUrl + symp.image }
              : require('../../../../assets/images/icons8-heart-100.png')
          }
          style={styles.icon}
          resizeMode="contain"
        />

        <View style={styles.titleContainer}>
          <Text style={styles.sympText}>{symp.title}</Text>
          <Pressable onPress={() => onReadMore(symp)} hitSlop={5}>
            <Text
              style={{
                ...styles.text,
                color: '#B7AFB9',
                marginTop: rh(0.2),
                fontSize: 10,
              }}>
              بیشتر بخوانید...
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text
        color={COLORS.textDark}
        alignSelf="flex-end"
        marginRight={rw(4)}
        size={12}>
        علائم امروز {activeRel.label} :
      </Text>

      <FlatList
        data={symps}
        horizontal
        inverted
        keyExtractor={item => item.id.toString()}
        renderItem={RenderSymp}
        contentContainerStyle={{ paddingRight: rw(3) }}
        style={{ marginRight: rw(2) }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: rw(96),
  },
  sympContainer: {
    alignItems: 'center',
    width: rw(32),
    borderRadius: 20,
    elevation: 4,
    backgroundColor: COLORS.cardBg,
    marginVertical: rh(2),
    marginHorizontal: rw(1.5),
    paddingBottom: rh(1.5),
  },
  icon: {
    width: 60,
    height: 60,
    marginTop: rh(1),
  },
  sympText: {
    flexShrink: 1,
    fontFamily: 'IRANYekanMobileBold',
    COLOR: COLORS.textCommentCal,
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  titleContainer: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    marginRight: rw(3),
    justifyContent: 'center',
    flexShrink: 1,
    borderRightWidth: 2,
    borderRightColor: COLORS.expSympReadMore,
    paddingRight: rw(3),
    marginTop: rh(2),
  },
  selectedBadge: {
    ...StyleSheet.absoluteFillObject,
    top: rh(-1.5),
    left: rw(-3),
  },
  degreeContainer: {
    flexDirection: 'row',
    width: '90%',
    flexShrink: 1,
  },
});

export default PartnerSympSection;
