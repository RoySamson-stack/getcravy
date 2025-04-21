import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme, Appbar, FAB } from 'react-native-paper';
import PromotionCard from '../components/PromotionCard';
import AppHeader from '../components/AppHeader';

const HomeScreen: React.FC = ({ navigation }) => {
  const { colors } = useTheme();
  
  const promotions = [
    {
      id: '1',
      title: 'Weekend Brunch Special',
      description: 'Enjoy 30% off on all brunch items this weekend',
      imageUrl: 'https://example.com/brunch.jpg',
      discount: '30% OFF',
    },
    // More promotions...
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader 
        title="Tasty Deals" 
        onMenuPress={() => navigation.openDrawer()} 
        onSearchPress={() => navigation.navigate('Search')}
      />
      
      <ScrollView>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Today's Specials</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {promotions.map(promo => (
              <PromotionCard 
                key={promo.id}
                title={promo.title}
                description={promo.description}
                imageUrl={promo.imageUrl}
                discount={promo.discount}
                onPress={() => navigation.navigate('PromotionDetail', { promotion: promo })}
              />
            ))}
          </ScrollView>
        </View>
        
        {/* Add more sections: Nearby Restaurants, Delivery Options, etc. */}
      </ScrollView>
      
      <FAB
        style={[styles.fab, { backgroundColor: colors.primary }]}
        icon="map"
        onPress={() => navigation.navigate('Map')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;