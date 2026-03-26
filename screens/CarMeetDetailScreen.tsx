import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { dummyCarMeets } from '../constants/dummyData';

const CarMeetDetailScreen = ({ route, navigation }: any) => {
  const { meetId } = route.params;
  const meet = dummyCarMeets.find((m) => m.id === meetId);
  const [isGoing, setIsGoing] = useState(false);

  if (!meet) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Car meet not found</Text>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleCall = () => {
    Linking.openURL(`tel:${meet.phone}`);
  };

  const handleWhatsApp = () => {
    const message = `Hi! I'm interested in the ${meet.title} car meet.`;
    Linking.openURL(`whatsapp://send?phone=${meet.whatsapp}&text=${encodeURIComponent(message)}`);
  };

  const handleToggleGoing = () => {
    setIsGoing(!isGoing);
    Alert.alert(
      isGoing ? 'Removed from Going' : 'Added to Going',
      isGoing 
        ? 'You are no longer marked as going to this car meet.' 
        : 'You are now marked as going to this car meet!'
    );
  };

  const handleShare = () => {
    const shareText = `Check out this car meet: ${meet.title} at ${meet.location} on ${formatDate(meet.date)}`;
    Linking.openURL(`whatsapp://send?text=${encodeURIComponent(shareText)}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Image source={meet.image} style={styles.meetImage} />
        
        <View style={styles.meetInfo}>
          <Text style={styles.meetTitle}>{meet.title}</Text>
          <Text style={styles.organizer}>Organized by {meet.organizer}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={20} color={colors.primary} />
              <Text style={styles.statText}>{meet.attendees} going</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="car" size={20} color={colors.primary} />
              <Text style={styles.statText}>{meet.carTypes.length} car types</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="cash" size={20} color={colors.primary} />
              <Text style={styles.statText}>
                {meet.entryFee === 0 ? 'Free' : `Ksh ${meet.entryFee}`}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date & Time</Text>
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeItem}>
                <Ionicons name="calendar" size={18} color={colors.primary} />
                <Text style={styles.dateTimeText}>{formatDate(meet.date)}</Text>
              </View>
              <View style={styles.dateTimeItem}>
                <Ionicons name="time" size={18} color={colors.primary} />
                <Text style={styles.dateTimeText}>
                  {formatTime(meet.date)}
                  {meet.endDate && ` - ${formatTime(meet.endDate)}`}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={18} color={colors.primary} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{meet.location}</Text>
                <Text style={styles.locationAddress}>{meet.address}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{meet.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Car Types Welcome</Text>
            <View style={styles.carTypesContainer}>
              {meet.carTypes.map((type, index) => (
                <View key={index} style={styles.carTypeTag}>
                  <Text style={styles.carTypeText}>{type}</Text>
                </View>
              ))}
            </View>
          </View>

          {meet.foodAvailable && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Food & Drinks</Text>
              <View style={styles.foodContainer}>
                <Ionicons name="restaurant" size={18} color={colors.secondary} />
                <Text style={styles.foodText}>Food available on-site</Text>
              </View>
              {meet.foodVendors && meet.foodVendors.length > 0 && (
                <View style={styles.vendorsContainer}>
                  {meet.foodVendors.map((vendor, index) => (
                    <Text key={index} style={styles.vendorText}>• {vendor}</Text>
                  ))}
                </View>
              )}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {meet.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.goingButton, isGoing && styles.goingButtonActive]}
          onPress={handleToggleGoing}
        >
          <Ionicons 
            name={isGoing ? "checkmark-circle" : "add-circle-outline"} 
            size={20} 
            color={isGoing ? colors.white : colors.primary} 
          />
          <Text style={[styles.goingButtonText, isGoing && styles.goingButtonTextActive]}>
            {isGoing ? 'Going' : 'Mark as Going'}
          </Text>
        </TouchableOpacity>

        <View style={styles.contactButtons}>
          <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
            <Ionicons name="call" size={20} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
            <Ionicons name="logo-whatsapp" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  content: {
    flex: 1,
  },
  meetImage: {
    width: '100%',
    height: 250,
  },
  meetInfo: {
    padding: 20,
  },
  meetTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  organizer: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: colors.text,
    marginTop: 4,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  dateTimeContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateTimeText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  locationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  locationAddress: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 2,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  carTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  carTypeTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  carTypeText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '500',
  },
  foodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  foodText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  vendorsContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  vendorText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    fontSize: 14,
    color: colors.textLight,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  goingButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    marginRight: 12,
  },
  goingButtonActive: {
    backgroundColor: colors.primary,
  },
  goingButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 8,
  },
  goingButtonTextActive: {
    color: colors.white,
  },
  contactButtons: {
    flexDirection: 'row',
  },
  contactButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    borderRadius: 12,
    padding: 12,
  },
});

export default CarMeetDetailScreen;
