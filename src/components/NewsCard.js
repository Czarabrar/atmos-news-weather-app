import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { glass, typography, spacing, categoryColors } from '../utils/theme';

export default function NewsCard({ article, category, onPress }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Relative time (e.g., "2h ago")
  const timeAgo = article.publishedAt
    ? moment(article.publishedAt).fromNow()
    : null;

  const renderCategoryPill = () => (
    <View style={[styles.categoryPill, { backgroundColor: categoryColors[category] || categoryColors.general }]}>
      <Text style={styles.categoryPillText}>{category.toUpperCase()}</Text>
    </View>
  );

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={styles.card}>
        {article.urlToImage ? (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: article.urlToImage }} style={styles.image} />
            <View style={styles.imageOverlay} />
            {renderCategoryPill()}
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Icon
              name="newspaper-outline"
              size={36}
              color="rgba(255,255,255,0.3)"
            />
            {renderCategoryPill()}
          </View>
        )}

        <View style={styles.textWrapper}>
          <Text style={styles.title} numberOfLines={2}>
            {article.title}
          </Text>
          {article.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {article.description}
            </Text>
          ) : null}
          {/* Meta row: author + time */}
          <View style={styles.metaRow}>
            {article.author ? (
              <Text style={styles.metaText} numberOfLines={1}>
                {article.author}
              </Text>
            ) : null}
            {timeAgo ? (
              <Text style={styles.metaTime}>{timeAgo}</Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...glass.medium,
    marginBottom: spacing.sm + 4,
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    height: 140,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  placeholder: {
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative',
  },
  categoryPill: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryPillText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 0.5,
  },
  textWrapper: {
    padding: spacing.md,
  },
  title: {
    ...typography.subheading,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.body,
    fontSize: 13,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  metaText: {
    ...typography.caption,
    fontSize: 11,
    flex: 1,
    marginRight: spacing.sm,
  },
  metaTime: {
    ...typography.caption,
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
});
