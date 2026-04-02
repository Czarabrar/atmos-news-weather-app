import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Alert,
  Linking,
  Animated,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from 'react-native-geolocation-service';
import { fetchWeather, fetchFiveDayForecast } from '../services/weatherService';
import { fetchNews, filterNewsByWeather, clearNewsCache } from '../services/newsService';
import { AppContext } from '../context/AppContext';
import WeatherCard from '../components/WeatherCard';
import NewsCard from '../components/NewsCard';
import { useNavigation } from '@react-navigation/native';
import { getWeatherGradient, glass, typography, spacing } from '../utils/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

export default function HomeScreen() {
  const { unit, categories, weatherCondition, iconCode, language, showAllNews, debugWeather } =
    useContext(AppContext);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [loading]);

  const getLocationAndData = async () => {
    setLoading(true);
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            async pos => {
              const { latitude, longitude } = pos.coords;
              const weatherRes = await fetchWeather(latitude, longitude, unit);
              const forecastRes = await fetchFiveDayForecast(
                latitude,
                longitude,
                unit,
              );
              setWeather(weatherRes);
              setForecast(forecastRes);
              setLoading(false);
            },
            error => {
              console.error(error);
              setLoading(false);
            },
            { enableHighAccuracy: true },
          );
        } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
          Alert.alert(
            'Permission Required',
            'Location permission is needed to show weather and news based on your location.',
            [
              { text: 'Try Again', onPress: () => getLocationAndData() },
              { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) },
            ],
            { cancelable: false },
          );
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(
            'Permission Permanently Denied',
            'Please enable location access manually in settings.',
            [
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
              { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) },
            ],
            { cancelable: false },
          );
        }
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocationAndData();
  }, [unit]);

  // Fetch initial news (page 0) when deps change
  useEffect(() => {
    const getNews = async () => {
      if (!weather || !weather.weather || !weather.weather[0]) return;

      const currentCondition = weather.weather[0].main;
      const selectedCategory = categories[0] || 'general';

      try {
        const { articles, hasMore: more } = await fetchNews(
          selectedCategory,
          language,
          0,
        );

        let finalArticles = articles;
        if (!showAllNews) {
          const currentCondition = debugWeather || weather.weather[0].main;
          finalArticles = filterNewsByWeather(currentCondition, articles);
        }

        setNews(finalArticles);
        setPage(0);
        setHasMore(more);
      } catch (err) {
        console.error('Error fetching news:', err);
        setNews([]);
        setHasMore(false);
      }
    };

    getNews();
  }, [weather, categories, language, showAllNews]);

  // Load more news (infinite scroll)
  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore) return;
    if (!weather || !weather.weather || !weather.weather[0]) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    const selectedCategory = categories[0] || 'general';

    try {
      const { articles, hasMore: more } = await fetchNews(
        selectedCategory,
        language,
        nextPage,
      );

      const currentCondition = debugWeather || weather.weather[0].main;
      let finalArticles = articles;
      if (!showAllNews) {
        finalArticles = filterNewsByWeather(currentCondition, articles);
      }

      setNews(prev => [...prev, ...finalArticles]);
      setPage(nextPage);
      setHasMore(more);
    } catch (err) {
      console.error('Error loading more news:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, page, categories, language, weather, showAllNews]);

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    clearNewsCache();
    await getLocationAndData();
    setRefreshing(false);
  }, [unit]);

  const gradientColors = getWeatherGradient(weatherCondition, iconCode);

  // Footer component for FlatList
  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color="rgba(255,255,255,0.7)" />
        </View>
      );
    }
    if (!hasMore && news.length > 0) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>No more news</Text>
        </View>
      );
    }
    return null;
  };

  // Empty state
  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyCard}>
        <Icon name="newspaper-outline" size={48} color="rgba(255,255,255,0.3)" />
        <Text style={styles.emptyTitle}>No News Found</Text>
        <Text style={styles.emptySubtext}>
          Try changing your category or language in Settings
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <LinearGradient colors={gradientColors} style={styles.loadingContainer}>
        <StatusBar translucent backgroundColor="transparent" />
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading weather...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ marginRight: 10 }}>
            <Icon name="settings-outline" size={20} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>
          <Icon name="location-outline" size={14} color="rgba(255,255,255,0.7)" />
          <Text style={styles.headerLocation}>
            {weather ? weather.name : 'Weather'}
          </Text>
        </View>
        <Text style={styles.headerTime}>
          {moment().format('ddd, MMM D · h:mm A')}
        </Text>
      </View>

      <FlatList
        ListHeaderComponent={
          weather ? (
            <Animated.View style={{ opacity: fadeAnim }}>
              <View style={styles.weatherWrapper}>
                <WeatherCard weather={weather} forecast={forecast} unit={unit} />
              </View>

              {news.length > 0 && (
                <Text style={styles.newsSectionTitle}>Latest News</Text>
              )}
            </Animated.View>
          ) : (
            <Text style={styles.noLocation}>
              Location not available. Allow location to see weather info.
            </Text>
          )
        }
        contentContainerStyle={styles.listContent}
        data={news}
        keyExtractor={(item, index) => item.url + index}
        renderItem={({ item }) => (
          <NewsCard
            article={item}
            category={item.category || categories[0] || 'general'}
            onPress={() => navigation.navigate('NewsDetail', { article: item })}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="rgba(255,255,255,0.7)"
            colors={['rgba(255,255,255,0.7)']}
            progressBackgroundColor="rgba(0,0,0,0.2)"
          />
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 44,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.subheading,
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLocation: {
    ...typography.body,
    marginLeft: 4,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  headerTime: {
    ...typography.caption,
    fontSize: 11,
  },
  weatherWrapper: {
    marginBottom: spacing.md,
  },
  noLocation: {
    ...typography.subheading,
    textAlign: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  newsSectionTitle: {
    ...typography.sectionTitle,
    marginBottom: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: 20,
  },
  footer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.5)',
  },
  emptyCard: {
    ...glass.light,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  emptyTitle: {
    ...typography.heading,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 20,
  },
});
