import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { AppButton } from "../../components/AppButton";
import { ScreenHeading } from "../../components/ScreenHeading";
import { SectionCard } from "../../components/SectionCard";
import { screenStyles } from "../../components/screenStyles";
import { colors, spacing } from "../../theme";
import type { AuthRequest } from "../../api";

type AuthScreenProps = {
  isLoading: boolean;
  errorMessage: string;
  onSignIn: (request: AuthRequest) => void;
  onCreateAccount: (request: AuthRequest) => void;
};

export function AuthScreen({ isLoading, errorMessage, onSignIn, onCreateAccount }: AuthScreenProps) {
  const [email, setEmail] = useState("18868876912@163.com");
  const [displayName, setDisplayName] = useState("奶盖的家长");
  const request = {
    email: email.trim(),
    displayName: displayName.trim(),
  };

  return (
    <ScrollView contentContainerStyle={screenStyles.scrollContent}>
      <ScreenHeading eyebrow="账号" title="先确认家长身份，再开始匹配。" />
      <Text style={screenStyles.mutedCopy}>
        LuckyPets 会把聊天、举报、繁育审核和账号删除请求都绑定到家长账号。这里先使用本地 mock 登录，后续接真实后端。
      </Text>

      <SectionCard>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>邮箱</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>显示名</Text>
          <TextInput style={styles.input} value={displayName} onChangeText={setDisplayName} />
        </View>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <View style={styles.actionRow}>
          <AppButton label={isLoading ? "处理中" : "登录"} onPress={() => onSignIn(request)} />
          <AppButton label="创建账号" variant="quiet" onPress={() => onCreateAccount(request)} />
        </View>
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 7,
  },
  fieldLabel: {
    color: colors.text,
    fontWeight: "800",
  },
  input: {
    minHeight: 44,
    paddingHorizontal: spacing[2],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  errorText: {
    color: colors.danger,
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing[2],
  },
});
