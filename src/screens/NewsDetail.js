import React, { useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from '../context/AppContext';
import {
  getWeatherGradient,
  glass,
  typography,
  spacing,
  categoryColors,
} from '../utils/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

const { height, width } = Dimensions.get('window');

const NewsDetailScreen = ({ route, navigation }) => {
  const { article, category = 'general' } = route.params;
  const { weatherCondition, iconCode } = useContext(AppContext);
  const gradientColors = getWeatherGradient(weatherCondition, iconCode);

  const timeAgo = article.publishedAt
    ? moment(article.publishedAt).fromNow()
    : null;

  const handleReadMore = () => {
    if (article.url) {
      Linking.openURL(article.url).catch(err =>
        console.error("Couldn't open URL", err),
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Background Image or Gradient Fallback */}
      {article.urlToImage ? (
        <Image
          source={{ uri: article.urlToImage }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={gradientColors}
          style={StyleSheet.absoluteFillObject}>
          <View style={styles.placeholderIconContainer}>
            <Icon name="newspaper-outline" size={120} color="rgba(255,255,255,0.15)" />
          </View>
        </LinearGradient>
      )}

      {/* Dark Gradient Overlay for Readability */}
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.95)']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Navigation Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}>
          <Icon name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={[styles.categoryPill, { backgroundColor: categoryColors[category] || categoryColors.general }]}>
          <Text style={styles.categoryPillText}>{category.toUpperCase()}</Text>
        </View>
      </View>

      {/* Content anchored to the bottom */}
      <View style={styles.contentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>

          <Text style={styles.title}>{article.title}</Text>

          <View style={styles.metaRow}>
            {article.author ? (
              <Text style={styles.author} numberOfLines={1}>
                {article.author}
              </Text>
            ) : null}
            {article.author && timeAgo && <Text style={styles.metaDot}>•</Text>}
            {timeAgo ? <Text style={styles.timeAgo}>{timeAgo}</Text> : null}
          </View>

          {/* Glass Description Card */}
          {(article.description || article.content) && (
            <View style={[
              styles.glassCard,
              { borderLeftColor: categoryColors[category] || categoryColors.general }
            ]}>
              {article.description ? (
                <Text style={styles.description}>{article.description}</Text>
              ) : null}
              {article.content && article.content !== article.description ? (
                <Text style={styles.content}>{article.content.replace(/\[\+\d+ chars\]/g, '')}</Text>
              ) : null}
            </View>
          )}
        </ScrollView>

        {/* Fixed Bottom Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.readButton, { borderColor: categoryColors[category] || categoryColors.general }]}
            onPress={handleReadMore}>
            <Text style={styles.readButtonText}>Read Full Article</Text>
            <Icon name="arrow-forward-circle" size={20} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default NewsDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  placeholderIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -100,
  },
  navHeader: {
    position: 'absolute',
    top: StatusBar.currentHeight || 44,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    zIndex: 10,
  },
  backButton: {
    ...glass.dark,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    ...glass.light, // adds thin white border
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  categoryPillText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 0.5,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollContent: {
    paddingTop: height * 0.45, // Map text to bottom half
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
  },
  title: {
    ...typography.heroTemp,
    fontSize: 28,
    lineHeight: 36,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  author: {
    ...typography.subheading,
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
  },
  metaDot: {
    color: 'rgba(255,255,255,0.5)',
    marginHorizontal: spacing.sm,
    fontSize: 14,
  },
  timeAgo: {
    ...typography.caption,
    fontSize: 13,
  },
  glassCard: {
    ...glass.medium,
    padding: spacing.lg,
    borderLeftWidth: 4,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF', // High contrast
  },
  content: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 24,
    marginTop: spacing.md,
    color: 'rgba(255,255,255,0.85)',
  },
  footer: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: Platform.OS === 'ios' ? 34 : spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.5)', // Subtle fade at very bottom
  },
  readButton: {
    ...glass.dark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 24,
    borderWidth: 1,
  },
  readButtonText: {
    ...typography.subheading,
    fontSize: 16,
    fontWeight: '700',
  },
});
