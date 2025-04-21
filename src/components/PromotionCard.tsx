import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

interface PromotionCardProps {
  title: string;
  description: string;
  imageUrl: string;
  discount: string;
  onPress: () => void;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ 
  title, 
  description, 
  imageUrl, 
  discount, 
  onPress 
}) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{discount}</Text>
        </View>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.description, { color: colors.placeholder }]}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 8,
    marginVertical: 4,
    elevation: 2,
    width: 280,
  },
  image: {
    width: '100%',
    height: 140,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF5252',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  discountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default PromotionCard;