import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { placeholderImages } from '../../constants/images';
import { Restaurant } from '../../types/navigation';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onPress,
  onFavoritePress,
  isFavorite = false,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={restaurant.image || placeholderImages.restaurant}
        style={styles.image}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={onFavoritePress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          color={isFavorite ? colors.primary : '#fff'}
        />
      </TouchableOpacity>
      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={colors.primary} />
            <Text style={styles.rating}>{restaurant.rating}</Text>
          </View>
        </View>
        <View style={styles.details}>
          <Text style={styles.detailText}>{restaurant.category}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.detailText}>{restaurant.price}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.detailText}>{restaurant.deliveryTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  image: {
    width: '100%',
    height: 150,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 5,
  },
  info: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 3,
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: colors.textLight,
  },
  dot: {
    fontSize: 12,
    color: colors.textLight,
    marginHorizontal: 4,
  },
});








