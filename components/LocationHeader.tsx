import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Bell } from 'lucide-react-native';

interface LocationHeaderProps {
  location: string;
  onLocationPress: () => void;
  onNotificationPress: () => void;
  notificationCount?: number;
}

export default function LocationHeader({ 
  location, 
  onLocationPress, 
  onNotificationPress,
  notificationCount = 0 
}: LocationHeaderProps) {
  return (
    <LinearGradient
      colors={['#2563EB', '#3B82F6']}
      style={styles.container}
    >
      <TouchableOpacity 
        style={styles.locationButton}
        onPress={onLocationPress}
      >
        <MapPin size={20} color="white" strokeWidth={2} />
        <View style={styles.locationText}>
          <Text style={styles.locationLabel}>Your Location</Text>
          <Text style={styles.locationName}>{location}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.notificationButton}
        onPress={onNotificationPress}
      >
        <Bell size={24} color="white" strokeWidth={2} />
        {notificationCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>
              {notificationCount > 99 ? '99+' : notificationCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 20,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    marginLeft: 12,
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  locationName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  notificationCount: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
});