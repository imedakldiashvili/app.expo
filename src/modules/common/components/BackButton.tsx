import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Button } from "../../../ui";
import { useTranslation } from "../../../i18n";
import { KeyboardAwareView } from "../screens";

interface BackButtonProps {
  onPress: () => void;
  style?: ViewStyle;
}

export default function BackButton({ onPress, style }: BackButtonProps) {
  const { t } = useTranslation();

  return (
    <KeyboardAwareView>
      <Button
        title={t.common.back}
        variant="tertiary"
        onPress={onPress}
        style={{ ...style }}
      />
    </KeyboardAwareView>
  );
}
