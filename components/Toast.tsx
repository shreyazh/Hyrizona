import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Bell,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  visible: boolean;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');

export default function Toast({
  visible,
  type,
  title,
  message,
  duration = 4000,
  onClose,
  onPress,
}: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide in from top
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          colors: ['#10B981', '#34D399'],
          backgroundColor: '#ECFDF5',
          borderColor: '#10B981',
          iconColor: '#10B981',
        };
      case 'error':
        return {
          icon: AlertCircle,
          colors: ['#EF4444', '#F87171'],
          backgroundColor: '#FEF2F2',
          borderColor: '#EF4444',
          iconColor: '#EF4444',
        };
      case 'warning':
        return {
          icon: AlertCircle,
          colors: ['#F59E0B', '#FBBF24'],
          backgroundColor: '#FFFBEB',
          borderColor: '#F59E0B',
          iconColor: '#F59E0B',
        };
      case 'info':
        return {
          icon: Info,
          colors: ['#2563EB', '#3B82F6'],
          backgroundColor: '#EFF6FF',
          borderColor: '#2563EB',
          iconColor: '#2563EB',
        };
      default:
        return {
          icon: Bell,
          colors: ['#6B7280', '#9CA3AF'],
          backgroundColor: '#F9FAFB',
          borderColor: '#6B7280',
          iconColor: '#6B7280',
        };
    }
  };

  const config = getToastConfig();
  const Icon = config.icon;

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.toast,
          {
            backgroundColor: config.backgroundColor,
            borderColor: config.borderColor,
          },
        ]}
        onPress={onPress}
        activeOpacity={onPress ? 0.8 : 1}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={config.colors}
              style={styles.iconGradient}
            >
              <Icon size={20} color="white" />
            </LinearGradient>
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            {message && <Text style={styles.message}>{message}</Text>}
          </View>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={hideToast}>
          <X size={16} color={config.iconColor} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  iconGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
}); 