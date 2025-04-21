import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from 'react-native-paper';

interface AppHeaderProps {
  title: string;
  onMenuPress?: () => void;
  onSearchPress?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, onMenuPress, onSearchPress }) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.header, { backgroundColor: colors.primary }]}>
      <TouchableOpacity onPress={onMenuPress}>
        <Icon name="menu" size={24} color="white" />
      </TouchableOpacity>
      <Text style={[styles.title, { color: 'white' }]}>{title}</Text>
      <TouchableOpacity onPress={onSearchPress}>
        <Icon name="search" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AppHeader;