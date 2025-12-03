import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../../../constants/colors';

interface SecurityCodeValueProps {
  value: (string | number | null)[];
  mode?: 'pass-code' | 'otp-code';
}

const SecurityCodeValue: React.FC<SecurityCodeValueProps> = ({ value, mode = 'pass-code' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.valueContainer}>
        <Text style={[
          styles.valueItemContainer, 
          value[0] ? { borderColor: colors.borderDark } : { borderColor: colors.borderLight }
        ]}>
          {value[0] ? (mode === 'pass-code' ? '*' : value[0]) : null}
        </Text>
        <Text style={[
          styles.valueItemContainer, 
          value[1] ? { borderColor: colors.borderDark } : { borderColor: colors.borderLight }
        ]}>
          {value[1] ? (mode === 'pass-code' ? '*' : value[1]) : null}
        </Text>
        <Text style={[
          styles.valueItemContainer, 
          value[2] ? { borderColor: colors.borderDark } : { borderColor: colors.borderLight }
        ]}>
          {value[2] ? (mode === 'pass-code' ? '*' : value[2]) : null}
        </Text>
        <Text style={[
          styles.valueItemContainer, 
          value[3] ? { borderColor: colors.borderDark } : { borderColor: colors.borderLight }
        ]}>
          {value[3] ? (mode === 'pass-code' ? '*' : value[3]) : null}
        </Text>
      </View>
    </View>
  );
};

export default SecurityCodeValue;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valueItemContainer: {
    paddingTop: 0,
    paddingBottom: 10,
    paddingHorizontal: 10,
    minWidth: 35,
    margin: 10,
    fontSize: 36,
    fontWeight: 'bold',
    borderBottomWidth: 2,
  },
});
