/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { COLORS, rh, rw } from '../../../configs';

const Picker = ({
  data,
  onItemSelect,
  placeholder,
  listMode = 'FLATLIST',
  reset = false,
  defaultValue = null,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(data);

  useEffect(() => {
    setValue({});
  }, [reset]);

  useEffect(() => {
    setItems(data);
  }, [data]);

  return (
    <DropDownPicker
      open={open}
      value={defaultValue ? defaultValue : value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      listMode={listMode}
      onChangeValue={val => {
        onItemSelect(val);
      }}
      labelStyle={styles.labelStyle}
      listItemLabelStyle={{
        fontFamily: 'IRANYekanMobileBold',
        color: COLORS.textDark,
        fontSize: 12,
      }}
      ArrowDownIconComponent={() => (
        <MaterialIcons
          name="arrow-drop-down"
          size={28}
          color={COLORS.textLight}
        />
      )}
      ArrowUpIconComponent={() => (
        <MaterialIcons
          name="arrow-drop-up"
          size={28}
          color={COLORS.textLight}
        />
      )}
      containerStyle={styles.pickerContainer}
      style={{
        backgroundColor: COLORS.inputTabBarBg,
        borderWidth: 0,
        height: 40,
      }}
      itemStyle={{
        justifyContent: 'flex-start',
      }}
      dropDownContainerStyle={{
        borderWidth: 0,
        elevation: 3,
        backgroundColor: COLORS.mainBg,
      }}
      placeholderStyle={{
        fontFamily: 'IRANYekanMobileBold',
        color: COLORS.textLight,
      }}
      placeholder={placeholder}
    />
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    height: 40,
    width: rw(60),
    marginTop: rh(1),
    alignSelf: 'center',
  },
  labelStyle: {
    fontFamily: 'IRANYekanMobileBold',
    color: COLORS.textLight,
  },
});

export default Picker;
