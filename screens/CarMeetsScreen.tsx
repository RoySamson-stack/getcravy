import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { dummyCarMeets } from '../constants/dummyData';
import { CarMeet } from '../types/navigation';

const CarMeetsScreen = ({ navigation }: any) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const filters = ['All', 'This Week', 'JDM', 'Classic', 'Free Entry'];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  const filteredMeets = dummyCarMeets.filter((meet) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'This Week') {
      const meetDate = new Date(meet.date);
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return meetDate >= today && meetDate <= weekFromNow;
    }
    if (selectedFilter === 'JDM') return meet.carTypes.includes('JDM');
    if (selectedFilter === 'Classic') return meet.carTypes.includes('Classic');
    if (selectedFilter === 'Free Entry') return meet.entryFee === 0;
    return true;
  });

  const renderCarMeetCard = (meet: CarMeet) => (
    <TouchableOpacity
      key={meet.id}
      style={styles.meetCard}
      onPress={() => navigation.navigate('CarMeetDetail', { meetId: meet.id })}
    >
      <Image source={meet.image} style={styles.meetImage} />
      <View style={styles.meetInfo}>
        <View style={styles.meetHeader}>
          <Text style={styles.meetTitle}>{meet.title}</Text>
          <View style={styles.attendeesContainer}>
            <Ionicons name="people" size={16} color={colors.textLight} />
            <Text style={styles.attendeesText}>{meet.attendees}</Text>
          </View>
        </View>
        
        <View style={styles.meetDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color={colors.primary} />
            <Text style={styles.locationText}>{meet.location}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color={colors.primary} />
            <Text style={styles.dateText}>
              {formatDate(meet.date)} • {formatTime(meet.date)}
            </Text>
          </View>
        </View>

        <View style={styles.carTypesContainer}>
          {meet.carTypes.slice(0, 3).map((type, index) => (
            <View key={index} style={styles.carTypeTag}>
              <Text style={styles.carTypeText}>{type}</Text>
            </View>
          ))}
        </View>

        <View style={styles.meetFooter}>
          <View style={styles.entryFeeContainer}>
            <Text style={styles.entryFeeText}>
              {meet.entryFee === 0 ? 'Free Entry' : `Ksh ${meet.entryFee}`}
            </Text>
          </View>
          {meet.foodAvailable && (
            <View style={styles.foodAvailableContainer}>
              <Ionicons name="restaurant" size={14} color={colors.secondary} />
              <Text style={styles.foodAvailableText}>Food Available</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Car Meets</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.meetsContainer}>
          {filteredMeets.map(renderCarMeetCard)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  filtersContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filtersContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  activeFilterText: {
    color: colors.white,
  },
  content: {
    flex: 1,
  },
  meetsContainer: {
    padding: 20,
  },
  meetCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  meetImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  meetInfo: {
    padding: 16,
  },
  meetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  meetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    marginRight: 10,
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  meetDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 8,
  },
  dateText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 8,
  },
  carTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  carTypeTag: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  carTypeText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  meetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryFeeContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  entryFeeText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: 'bold',
  },
  foodAvailableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodAvailableText: {
    fontSize: 12,
    color: colors.secondary,
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default CarMeetsScreen;
