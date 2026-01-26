import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const theme = React.useContext(ThemeContext);
  if (!theme) throw new Error('ThemeContext must be used within ThemeProvider');
  const { colors } = theme;

  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    if (variant === 'primary') {
      baseStyle.push({ backgroundColor: colors.primary });
    } else if (variant === 'secondary') {
      baseStyle.push({ backgroundColor: colors.secondary });
    } else if (variant === 'outline') {
      baseStyle.push({ 
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
      });
    }
    
    if (disabled || loading) {
      baseStyle.push({ opacity: 0.5 });
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text];
    
    if (variant === 'primary' || variant === 'secondary') {
      baseStyle.push({ color: colors.white });
    } else {
      baseStyle.push({ color: colors.primary });
    }
    
    if (disabled || loading) {
      baseStyle.push({ opacity: 0.7 });
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'secondary' ? colors.white : colors.primary} />
      ) : (
        <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});




