import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title: string;
  backButton?: boolean;
  rightContent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  backButton = true, 
  rightContent 
}) => {
  const router = useRouter();
  
  return (
    <Appbar.Header>
      {backButton && (
        <Appbar.BackAction onPress={() => router.back()} />
      )}
      <Appbar.Content title={title} />
      {rightContent && (
        <View style={styles.rightContentContainer}>
          {rightContent}
        </View>
      )}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  rightContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});