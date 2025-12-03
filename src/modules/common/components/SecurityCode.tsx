import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import SecurityCodeCell from './SecurityCodeCell';
import SecurityCodeValue from './SecurityCodeValue';
import Title from './Title';
import { colors } from '../../../constants/colors';

interface SecurityCodeProps {
  onPassCodeComplete: (passCode: (string | number)[]) => Promise<void>;
  title: string;
  exPassCode?: (string | number)[];
  newPassCode?: (string | number)[];
  mode?: 'pass-code' | 'otp-code';
  disabled?: boolean;
}

const SecurityCode: React.FC<SecurityCodeProps> = ({ 
  onPassCodeComplete, 
  title, 
  exPassCode, 
  newPassCode,
  mode = 'pass-code',
  disabled = false
}) => {
  const [passCodeValue, setPassCodeValue] = useState<(string | number)[]>([]);

  const onPress = (i: string | number) => {
    if (disabled) return;
    const newPassCodeValue = [...passCodeValue, i];
    setPassCodeValue(newPassCodeValue);
  };

  const onPressClear = () => {
    if (disabled) return;
    setPassCodeValue([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (passCodeValue.length >= 4 && !disabled) {
        await onPassCodeComplete(passCodeValue);
        setPassCodeValue([]);
      }
    };
    fetchData();
  }, [passCodeValue, disabled]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Title style={styles.title}>{title}</Title>
      </View>      
      <View style={styles.valueContainer}>
        <SecurityCodeValue value={passCodeValue} mode={mode} /> 
      </View>
      <View style={styles.row}>
        <SecurityCodeCell onPress={onPress} i={"1"} disabled={disabled} />
        <SecurityCodeCell onPress={onPress} i={"2"} disabled={disabled} />
        <SecurityCodeCell onPress={onPress} i={"3"} disabled={disabled} />
      </View>
      <View style={styles.row}>
        <SecurityCodeCell onPress={onPress} i={"4"} disabled={disabled} />
        <SecurityCodeCell onPress={onPress} i={"5"} disabled={disabled} />
        <SecurityCodeCell onPress={onPress} i={"6"} disabled={disabled} />
      </View>
      <View style={styles.row}>
        <SecurityCodeCell onPress={onPress} i={"7"} disabled={disabled} />
        <SecurityCodeCell onPress={onPress} i={"8"} disabled={disabled} />
        <SecurityCodeCell onPress={onPress} i={"9"} disabled={disabled} />
      </View>
      <View style={styles.row}>
        <SecurityCodeCell i="?" disabled={disabled} />
        <SecurityCodeCell onPress={onPress} i={"0"} disabled={disabled} />
        <SecurityCodeCell onPress={onPressClear} i="x" disabled={disabled} />
      </View>
    </View>
  );
};

export default SecurityCode;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 0,
  },
  title: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
