import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { eventAPI, Event } from '../services/eventAPI';

// Optional calendar import - feature will be disabled if not available
let Calendar: any = null;
try {
  Calendar = require('expo-calendar');
} catch (e) {
  console.log('expo-calendar not available - calendar feature disabled');
}

const EventDetailScreen = ({ navigation, route }: any) => {
  const { eventId } = route.params;
  const theme = React.useContext(ThemeContext);
  if (!theme) throw new Error('ThemeContext must be used within ThemeProvider');
  const { colors } = theme;
  const authContext = React.useContext(AuthContext);
  const user = authContext?.user;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [attending, setAttending] = useState<'going' | 'interested' | null>(null);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getById(eventId);
      if (response.success) {
        setEvent(response.data);
        setAttending(response.data.userAttendance?.status || null);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      Alert.alert('Error', 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleAttend = async (status: 'going' | 'interested') => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to attend events');
      navigation.navigate('Login');
      return;
    }

    try {
      setLoadingAttendance(true);
      if (attending) {
        // Remove existing attendance
        await eventAPI.removeAttendance(eventId);
        setAttending(null);
      } else {
        // Add new attendance
        await eventAPI.attend(eventId, status);
        setAttending(status);
      }
      // Refresh event to get updated attendee count
      await fetchEvent();
    } catch (error) {
      console.error('Error updating attendance:', error);
      Alert.alert('Error', 'Failed to update attendance');
    } finally {
      setLoadingAttendance(false);
    }
  };

  const handleShareWhatsApp = () => {
    if (!event) return;
    
    const message = `Check out this event: ${event.title}\n${event.location}\n${new Date(event.date).toLocaleDateString()} at ${event.time.substring(0, 5)}`;
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'WhatsApp is not installed');
        }
      })
      .catch((err) => {
        console.error('Error opening WhatsApp:', err);
        Alert.alert('Error', 'Failed to open WhatsApp');
      });
  };

  const handleAddToCalendar = async () => {
    if (!event) return;

    if (!Calendar) {
      Alert.alert('Not Available', 'Calendar feature requires expo-calendar package. Install it with: npx expo install expo-calendar');
      return;
    }

    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Calendar access is required to add events');
        return;
      }

      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      if (calendars.length === 0) {
        Alert.alert('No Calendars', 'No calendars found on your device');
        return;
      }

      const eventDate = new Date(`${event.date}T${event.time}`);
      const endDate = event.endTime 
        ? new Date(`${event.date}T${event.endTime}`)
        : new Date(eventDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours

      await Calendar.createEventAsync(calendars[0].id, {
        title: event.title,
        startDate: eventDate,
        endDate: endDate,
        location: event.location,
        notes: event.description,
        timeZone: 'Africa/Nairobi',
      });

      Alert.alert('Success', 'Event added to calendar');
    } catch (error) {
      console.error('Error adding to calendar:', error);
      Alert.alert('Error', 'Failed to add event to calendar');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textLight }]}>Loading event...</Text>
        </View>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.textLight} />
          <Text style={[styles.emptyText, { color: colors.textLight }]}>Event not found</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Event Image */}
      <View style={styles.imageContainer}>
        {event.imageUrl ? (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="calendar" size={64} color={colors.primary} />
          </View>
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="calendar" size={64} color={colors.primary} />
          </View>
        )}
      </View>

      {/* Event Content */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{event.title}</Text>

        {/* Date & Time */}
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: colors.textLight }]}>Date</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{formatDate(event.date)}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={20} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: colors.textLight }]}>Time</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {event.time.substring(0, 5)}
              {event.endTime && ` - ${event.endTime.substring(0, 5)}`}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: colors.textLight }]}>Location</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{event.location}</Text>
          </View>
        </View>

        {event.price && (
          <View style={styles.infoRow}>
            <Ionicons name="cash-outline" size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textLight }]}>Price</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>KES {event.price}</Text>
            </View>
          </View>
        )}

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={[styles.descriptionTitle, { color: colors.text }]}>About</Text>
          <Text style={[styles.description, { color: colors.text }]}>{event.description}</Text>
        </View>

        {/* Restaurant Info */}
        {event.restaurant && (
          <TouchableOpacity
            style={[styles.restaurantCard, { backgroundColor: colors.cardBackground }]}
            onPress={() => navigation.navigate('Restaurant', { id: event.restaurantId })}
          >
            <Ionicons name="restaurant" size={24} color={colors.primary} />
            <View style={styles.restaurantInfo}>
              <Text style={[styles.restaurantName, { color: colors.text }]}>
                {event.restaurant.name}
              </Text>
              {event.restaurant.neighborhood && (
                <Text style={[styles.restaurantNeighborhood, { color: colors.textLight }]}>
                  {event.restaurant.neighborhood}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>
        )}

        {/* Attendees Count */}
        <View style={styles.attendeesContainer}>
          <Ionicons name="people" size={20} color={colors.primary} />
          <Text style={[styles.attendeesText, { color: colors.text }]}>
            {event.attendeesCount} {event.attendeesCount === 1 ? 'person' : 'people'} going
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: attending === 'going' ? colors.primary : colors.cardBackground,
                borderColor: colors.primary,
                borderWidth: 1,
              },
            ]}
            onPress={() => handleAttend('going')}
            disabled={loadingAttendance}
          >
            {loadingAttendance ? (
              <ActivityIndicator size="small" color={attending === 'going' ? '#FFFFFF' : colors.primary} />
            ) : (
              <>
                <Ionicons 
                  name={attending === 'going' ? 'checkmark-circle' : 'checkmark-circle-outline'} 
                  size={20} 
                  color={attending === 'going' ? '#FFFFFF' : colors.primary} 
                />
                <Text
                  style={[
                    styles.actionButtonText,
                    { color: attending === 'going' ? '#FFFFFF' : colors.primary },
                  ]}
                >
                  Going
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: attending === 'interested' ? colors.primary : colors.cardBackground,
                borderColor: colors.primary,
                borderWidth: 1,
              },
            ]}
            onPress={() => handleAttend('interested')}
            disabled={loadingAttendance}
          >
            {loadingAttendance ? (
              <ActivityIndicator size="small" color={attending === 'interested' ? '#FFFFFF' : colors.primary} />
            ) : (
              <>
                <Ionicons 
                  name={attending === 'interested' ? 'heart' : 'heart-outline'} 
                  size={20} 
                  color={attending === 'interested' ? '#FFFFFF' : colors.primary} 
                />
                <Text
                  style={[
                    styles.actionButtonText,
                    { color: attending === 'interested' ? '#FFFFFF' : colors.primary },
                  ]}
                >
                  Interested
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Share & Calendar */}
        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: colors.cardBackground }]}
            onPress={handleShareWhatsApp}
          >
            <Ionicons name="logo-whatsapp" size={20} color={colors.success} />
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: colors.cardBackground }]}
            onPress={handleAddToCalendar}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Add to Calendar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 200,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  descriptionContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
  },
  restaurantNeighborhood: {
    fontSize: 14,
    marginTop: 4,
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  attendeesText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
  },
});

export default EventDetailScreen;


