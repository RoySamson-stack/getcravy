import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  TextInput,
  Alert,
  Modal,
  Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, updateUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    personalInfo: true,
    preferences: false,
    account: false
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [paymentMethods, setPaymentMethods] = useState([
    { id: '1', type: 'Visa', last4: '4242', default: true },
    { id: '2', type: 'Mastercard', last4: '5555', default: false }
  ]);
  const [favorites, setFavorites] = useState([
    { id: '1', name: 'Margherita Pizza', restaurant: 'Pizza Heaven' },
    { id: '2', name: 'Chicken Burger', restaurant: 'Burger Palace' }
  ]);

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePasswordChange = (name, value) => {
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleSave = () => {
    // Update user in context and potentially backend
    updateUser(formData);
    Alert.alert('Profile Updated', 'Your changes have been saved successfully');
    setEditing(false);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    // Here you would typically call your API to change password
    Alert.alert('Success', 'Password changed successfully');
    setModalVisible(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleAddPaymentMethod = () => {
    // In a real app, you would integrate with a payment processor like Stripe
    const newMethod = {
      id: String(paymentMethods.length + 1),
      type: 'Amex',
      last4: '1234',
      default: false
    };
    setPaymentMethods([...paymentMethods, newMethod]);
    Alert.alert('Added', 'New payment method added');
    setModalVisible(false);
  };

  const handleSetDefaultPayment = (id) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      default: method.id === id
    })));
  };

  const handleRemovePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const handleRemoveFavorite = (id) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
    Alert.alert('Removed', 'Item removed from favorites');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: () => {
            logout();
            navigation.navigate('Login');
          }
        }
      ]
    );
  };

  const openModal = (modalType) => {
    setCurrentModal(modalType);
    setModalVisible(true);
  };

  const renderModalContent = () => {
    switch (currentModal) {
      case 'password':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Current Password"
              secureTextEntry
              value={passwordData.currentPassword}
              onChangeText={(text) => handlePasswordChange('currentPassword', text)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="New Password"
              secureTextEntry
              value={passwordData.newPassword}
              onChangeText={(text) => handlePasswordChange('newPassword', text)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Confirm New Password"
              secureTextEntry
              value={passwordData.confirmPassword}
              onChangeText={(text) => handlePasswordChange('confirmPassword', text)}
            />
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={handleChangePassword}
            >
              <Text style={styles.modalButtonText}>Update Password</Text>
            </TouchableOpacity>
          </View>
        );
      case 'payment':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Payment Method</Text>
            <Text style={styles.modalText}>
              In a real app, this would integrate with a payment processor like Stripe to securely add payment methods.
            </Text>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={handleAddPaymentMethod}
            >
              <Text style={styles.modalButtonText}>Add Test Payment Method</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <LinearGradient
        colors={['#E23744', '#E23744']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        {editing ? (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
            <Ionicons name="pencil" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </LinearGradient>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.avatar}
          />
          {editing && (
            <TouchableOpacity style={styles.cameraIcon}>
              <Ionicons name="camera" size={20} color="#E23744" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {/* Personal Information Section */}
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => toggleSection('personalInfo')}
      >
        <Text style={styles.sectionHeaderTitle}>Personal Information</Text>
        <Ionicons 
          name={expandedSections.personalInfo ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#E23744" 
        />
      </TouchableOpacity>
      
      {expandedSections.personalInfo && (
        <View style={styles.section}>
          <View style={styles.infoItem}>
            <Ionicons name="person" size={20} color="#E23744" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              {editing ? (
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                />
              ) : (
                <Text style={styles.infoValue}>{user?.name}</Text>
              )}
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="mail" size={20} color="#E23744" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              {editing ? (
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  keyboardType="email-address"
                />
              ) : (
                <Text style={styles.infoValue}>{user?.email}</Text>
              )}
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="call" size={20} color="#E23744" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              {editing ? (
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(text) => handleInputChange('phone', text)}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoValue}>{formData.phone || 'Not set'}</Text>
              )}
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="location" size={20} color="#E23744" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Address</Text>
              {editing ? (
                <TextInput
                  style={styles.input}
                  value={formData.address}
                  onChangeText={(text) => handleInputChange('address', text)}
                />
              ) : (
                <Text style={styles.infoValue}>{formData.address || 'Not set'}</Text>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Preferences Section */}
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => toggleSection('preferences')}
      >
        <Text style={styles.sectionHeaderTitle}>Preferences</Text>
        <Ionicons 
          name={expandedSections.preferences ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#E23744" 
        />
      </TouchableOpacity>
      
      {expandedSections.preferences && (
        <View style={styles.section}>
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Ionicons name="notifications" size={20} color="#E23744" />
              <Text style={styles.preferenceLabel}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#767577", true: "#FFEEDD" }}
              thumbColor={notificationsEnabled ? "#E23744" : "#f4f3f4"}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Ionicons name="moon" size={20} color="#E23744" />
              <Text style={styles.preferenceLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: "#767577", true: "#FFEEDD" }}
              thumbColor={darkModeEnabled ? "#E23744" : "#f4f3f4"}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Ionicons name="language" size={20} color="#E23744" />
              <Text style={styles.preferenceLabel}>Language</Text>
            </View>
            <Text style={styles.preferenceValue}>English</Text>
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Ionicons name="time" size={20} color="#E23744" />
              <Text style={styles.preferenceLabel}>Preferred Delivery Time</Text>
            </View>
            <Text style={styles.preferenceValue}>30-45 mins</Text>
          </View>
        </View>
      )}

      {/* Account Section */}
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => toggleSection('account')}
      >
        <Text style={styles.sectionHeaderTitle}>Account</Text>
        <Ionicons 
          name={expandedSections.account ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#E23744" 
        />
      </TouchableOpacity>
      
      {expandedSections.account && (
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.accountItem} 
            onPress={() => openModal('password')}
          >
            <View style={styles.accountInfo}>
              <Ionicons name="lock-closed" size={20} color="#E23744" />
              <Text style={styles.accountLabel}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <View style={styles.subSection}>
            <Text style={styles.subSectionTitle}>Payment Methods</Text>
            {paymentMethods.map((method) => (
              <View key={method.id} style={styles.paymentMethodItem}>
                <View style={styles.paymentMethodInfo}>
                  <Ionicons 
                    name={method.type.toLowerCase() === 'visa' ? 'card' : 'wallet'} 
                    size={20} 
                    color="#E23744" 
                  />
                  <Text style={styles.paymentMethodText}>
                    {method.type} •••• {method.last4}
                  </Text>
                  {method.default && (
                    <Text style={styles.defaultBadge}>Default</Text>
                  )}
                </View>
                <View style={styles.paymentMethodActions}>
                  {!method.default && (
                    <TouchableOpacity 
                      style={styles.paymentMethodAction} 
                      onPress={() => handleSetDefaultPayment(method.id)}
                    >
                      <Text style={styles.paymentMethodActionText}>Set Default</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    style={styles.paymentMethodAction} 
                    onPress={() => handleRemovePaymentMethod(method.id)}
                  >
                    <Text style={styles.paymentMethodActionText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => openModal('payment')}
            >
              <Ionicons name="add" size={20} color="#E23744" />
              <Text style={styles.addButtonText}>Add Payment Method</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.subSection}>
            <Text style={styles.subSectionTitle}>Favorites ({favorites.length})</Text>
            {favorites.length > 0 ? (
              favorites.map((fav) => (
                <View key={fav.id} style={styles.favoriteItem}>
                  <View style={styles.favoriteInfo}>
                    <Text style={styles.favoriteName}>{fav.name}</Text>
                    <Text style={styles.favoriteRestaurant}>{fav.restaurant}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.favoriteAction} 
                    onPress={() => handleRemoveFavorite(fav.id)}
                  >
                    <Ionicons name="trash" size={18} color="#E23744" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>You don't have any favorites yet</Text>
            )}
          </View>

          <TouchableOpacity style={styles.accountItem}>
            <View style={styles.accountInfo}>
              <Ionicons name="time" size={20} color="#E23744" />
              <Text style={styles.accountLabel}>Order History</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <View style={styles.accountInfo}>
              <Ionicons name="help-circle" size={20} color="#E23744" />
              <Text style={styles.accountLabel}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Modal for various actions */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <Pressable 
            style={styles.modalOverlay} 
            onPress={() => setModalVisible(false)}
          />
          {renderModalContent()}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  editButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 5,
  },
  saveButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: -40,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  cameraIcon: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 15,
    marginBottom: 5,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  subSection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoContent: {
    flex: 1,
    marginLeft: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E23744',
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  preferenceValue: {
    fontSize: 16,
    color: '#666',
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 15,
  },
  defaultBadge: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#E23744',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
  },
  paymentMethodActions: {
    flexDirection: 'row',
  },
  paymentMethodAction: {
    marginLeft: 15,
  },
  paymentMethodActionText: {
    color: '#E23744',
    fontSize: 14,
  },
  favoriteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  favoriteRestaurant: {
    fontSize: 13,
    color: '#666',
    marginTop: 3,
  },
  favoriteAction: {
    padding: 5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 10,
  },
  addButtonText: {
    color: '#E23744',
    fontSize: 15,
    marginLeft: 10,
    fontWeight: '500',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 15,
  },
  logoutButton: {
    backgroundColor: '#E23744',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#E23744',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;