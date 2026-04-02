import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';
import { getWeatherGradient, glass, typography, spacing, categoryColors } from '../utils/theme';
import Icon from 'react-native-vector-icons/Ionicons';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'தமிழ்' },
];

const CATEGORIES = [
  { key: 'general', label: 'General', icon: 'globe-outline' },
  { key: 'business', label: 'Business', icon: 'briefcase-outline' },
  { key: 'sports', label: 'Sports', icon: 'football-outline' },
  { key: 'technology', label: 'Technology', icon: 'hardware-chip-outline' },
  { key: 'health', label: 'Health', icon: 'fitness-outline' },
  { key: 'entertainment', label: 'Entertainment', icon: 'film-outline' },
  { key: 'science', label: 'Science', icon: 'flask-outline' },
  { key: 'education', label: 'Education', icon: 'school-outline' },
];

export default function SettingsScreen() {
  const navigation = useNavigation();
  const {
    unit,
    setUnit,
    categories,
    setCategories,
    weatherCondition,
    iconCode,
    language,
    setLanguage,
    showAllNews,
    setShowAllNews,
    debugWeather,
    setDebugWeather,
  } = useContext(AppContext);

  const [modalVisible, setModalVisible] = useState(false);

  const toggleUnit = () =>
    setUnit(prev => (prev === 'metric' ? 'imperial' : 'metric'));

  const toggleCategory = cat => {
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat],
    );
  };

  const handleShowAllToggle = newValue => {
    if (newValue) {
      setModalVisible(true);
    } else {
      setShowAllNews(false);
    }
  };

  const confirmShowAll = () => {
    setShowAllNews(true);
    setModalVisible(false);
  };

  const gradientColors = getWeatherGradient(weatherCondition, iconCode);

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="chevron-back-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerScreenTitle}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Language Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="language-outline" size={20} color="rgba(255,255,255,0.8)" />
            <Text style={styles.sectionTitle}>News Language</Text>
          </View>
          <View style={styles.langContainer}>
            {LANGUAGES.map(lang => (
              <TouchableOpacity
                key={lang.code}
                activeOpacity={0.7}
                style={[
                  styles.langPill,
                  language === lang.code && styles.langPillActive,
                ]}
                onPress={() => setLanguage(lang.code)}>
                <Text
                  style={[
                    styles.langText,
                    language === lang.code && styles.langTextActive,
                  ]}>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weather News Mood */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="partly-sunny-outline" size={20} color="rgba(255,255,255,0.8)" />
            <Text style={styles.sectionTitle}>Weather News Mood</Text>
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Manually filter news by weather vibe</Text>
          </View>
          <View style={[styles.categoryContainer, { marginTop: 12 }]}>
            {['Clear', 'Rain', 'Clouds'].map(condition => {
              const labelMap = {
                Clear: 'Clear / Hot',
                Rain: 'Rain / Storm',
                Clouds: 'Cloudy / Cool',
              };
              return (
                <TouchableOpacity
                  key={condition}
                  style={[
                    styles.categoryPill,
                    debugWeather === condition && styles.categoryPillActive
                  ]}
                  onPress={() => setDebugWeather(debugWeather === condition ? null : condition)}>
                  <Text style={[styles.categoryText, debugWeather === condition && styles.categoryTextActive]}>
                    {labelMap[condition]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Temperature Unit */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="thermometer-outline" size={20} color="rgba(255,255,255,0.8)" />
            <Text style={styles.sectionTitle}>Temperature Unit</Text>
          </View>
          <View style={styles.unitToggle}>
            <Text style={[styles.unitLabel, unit === 'metric' && styles.activeUnit]}>
              °C
            </Text>
            <Switch
              value={unit === 'imperial'}
              onValueChange={toggleUnit}
              thumbColor="#fff"
              trackColor={{ false: 'rgba(255,255,255,0.3)', true: '#64B5F6' }}
            />
            <Text style={[styles.unitLabel, unit === 'imperial' && styles.activeUnit]}>
              °F
            </Text>
          </View>
        </View>

        {/* Show All News Toggle */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="eye-outline" size={20} color="rgba(255,255,255,0.8)" />
            <Text style={styles.sectionTitle}>Show All News</Text>
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>
              Ignore weather-based filtering
            </Text>
            <Switch
              value={showAllNews}
              onValueChange={handleShowAllToggle}
              thumbColor="#fff"
              trackColor={{ false: 'rgba(255,255,255,0.3)', true: '#81C784' }}
            />
          </View>
        </View>

        {/* News Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="newspaper-outline" size={20} color="rgba(255,255,255,0.8)" />
            <Text style={styles.sectionTitle}>News Categories</Text>
          </View>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.key}
                activeOpacity={0.7}
                style={[
                  styles.categoryPill,
                  categories.includes(cat.key) && {
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    borderColor: categoryColors[cat.key],
                    borderWidth: 1.5,
                  },
                ]}
                onPress={() => toggleCategory(cat.key)}>
                <Icon
                  name={cat.icon}
                  size={14}
                  color={
                    categories.includes(cat.key)
                      ? categoryColors[cat.key]
                      : 'rgba(255,255,255,0.6)'
                  }
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.categoryText,
                    categories.includes(cat.key) && {
                      color: categoryColors[cat.key],
                      fontWeight: '700',
                    },
                  ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Icon name="warning-outline" size={32} color="#FFA726" />
            <Text style={styles.modalTitle}>Show All News?</Text>
            <Text style={styles.modalMessage}>
              This will show all news regardless of current weather conditions.
              You may see less relevant content.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnConfirm}
                onPress={confirmShowAll}>
                <Text style={styles.modalBtnConfirmText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 44,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  headerScreenTitle: {
    ...typography.heroTemp,
    fontSize: 28,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: 40,
  },
  section: {
    ...glass.light,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    marginLeft: spacing.sm,
  },
  unitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitLabel: {
    ...typography.subheading,
    marginHorizontal: spacing.sm,
    color: 'rgba(255,255,255,0.5)',
  },
  activeUnit: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    ...typography.body,
    flex: 1,
    marginRight: spacing.sm,
  },
  langContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  langPill: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  langPillActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderColor: 'rgba(255,255,255,0.6)',
    elevation: 4,
  },
  langText: {
    ...typography.body,
    fontSize: 16,
  },
  langTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  categoryPillActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderColor: 'rgba(255,255,255,0.6)',
  },
  categoryText: {
    ...typography.body,
    fontSize: 13,
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalCard: {
    backgroundColor: '#1E1E2E',
    borderRadius: 24,
    padding: spacing.xl,
    marginHorizontal: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  modalTitle: {
    ...typography.heading,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  modalMessage: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalBtnCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
  },
  modalBtnCancelText: {
    ...typography.subheading,
    color: 'rgba(255,255,255,0.7)',
  },
  modalBtnConfirm: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(129,199,132,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(129,199,132,0.6)',
    alignItems: 'center',
  },
  modalBtnConfirmText: {
    ...typography.subheading,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
