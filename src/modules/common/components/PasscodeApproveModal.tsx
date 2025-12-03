import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { Button, Spacer } from '../../../ui';
import SecurityCode from './SecurityCode';
import { useTranslation } from '../../../i18n';

interface PasscodeApproveModalProps {
  visible: boolean;
  onRequestClose: () => void;
  onPasscodeComplete: (passcode: (string | number)[]) => Promise<void>;
  disabled?: boolean;
  title?: string;
}

export default function PasscodeApproveModal({
  visible,
  onRequestClose,
  onPasscodeComplete,
  disabled = false,
  title,
}: PasscodeApproveModalProps) {
  const { t } = useTranslation() as any;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <SecurityCode
            title={title || t.auth?.enterPasscode || 'შეიყვანეთ პასკოდი'}
            onPassCodeComplete={onPasscodeComplete}
            disabled={disabled}
          />
          <Spacer size="md" />
          <Button
            title={t.common?.close || 'დახურვა'}
            onPress={onRequestClose}
            variant="tertiary"
            size="medium"
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    marginHorizontal: 16,
    alignSelf: 'stretch',
  },
});

