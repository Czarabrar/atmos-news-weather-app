import React, { useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
  FlatList,
} from 'react-native';
import moment from 'moment';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppContext } from '../context/AppContext';
import { glass, typography, spacing } from '../utils/theme';

import ClearSvg from '../assets/images/clouds-sun-svgrepo-com.svg';
import CloudySvg from '../assets/images/clouds-cloud-svgrepo-com.svg';
import RainSvg from '../assets/images/clouds-strom-2-svgrepo-com.svg';
import MoonSvg from '../assets/images/clouds-moon-svgrepo-com.svg';

const { width } = Dimensions.get('window');

const weatherAnimations = {
  Clear: require('../../Assets/gifs/clear.json.json'),
  Clouds: require('../../Assets/gifs/cloudy.json.json'),
  Rain: require('../../Assets/gifs/rainy.json.json'),
  Drizzle: require('../../Assets/gifs/rainy.json.json'),
  Thunderstorm: require('../../Assets/gifs/rainy.json.json'),
  Snow: require('../../Assets/gifs/cloudy.json.json'),
  Mist: require('../../Assets/gifs/cloudy.json.json'),
  Smoke: require('../../Assets/gifs/cloudy.json.json'),
  Haze: require('../../Assets/gifs/cloudy.json.json'),
  Dust: require('../../Assets/gifs/clear.json.json'),
  Fog: require('../../Assets/gifs/cloudy.json.json'),
  Sand: require('../../Assets/gifs/clear.json.json'),
  Ash: require('../../Assets/gifs/cloudy.json.json'),
  Squall: require('../../Assets/gifs/rainy.json.json'),
  Tornado: require('../../Assets/gifs/rainy.json.json'),
};

export default function WeatherCard({ weather, forecast, unit }) {
  const { setWeatherCondition, setIconCode } = useContext(AppContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  const currentCondition = weather.weather[0].main;
  const currentIcon = weather.weather[0].icon;
  const animationSource =
    weatherAnimations[currentCondition] || weatherAnimations.Clear;

  useEffect(() => {
    setWeatherCondition(currentCondition);
    setIconCode(currentIcon);
  }, [currentCondition, currentIcon]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  // Build daily forecast
  const groupedForecast = forecast.reduce((acc, item) => {
    const date = moment(item.dt_txt).format('YYYY-MM-DD');
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const dailyForecasts = Object.entries(groupedForecast).map(
    ([date, items]) => {
      const temps = items.map(i => i.main.temp);
      const avgTemp = (
        temps.reduce((sum, t) => sum + t, 0) / temps.length
      ).toFixed(0);
      const condition = items[0].weather[0].main;
      return { date, avgTemp, condition };
    },
  );

  const renderForecastDay = ({ item }) => (
    <View style={styles.dayCard}>
      <Text style={styles.dayLabel}>{moment(item.date).format('ddd')}</Text>
      <LottieView
        autoPlay
        loop
        source={weatherAnimations[item.condition] || weatherAnimations.Clear}
        style={styles.dayIcon}
      />
      <Text style={styles.dayTemp}>
        {item.avgTemp}°
      </Text>
      <Text style={styles.dayCondition}>{item.condition}</Text>
      <Text style={styles.dayDate}>{moment(item.date).format('D MMM')}</Text>
    </View>
  );

  const renderBackgroundSvg = () => {
    const props = {
      width: width * 1.2,
      height: width * 1.2,
      style: {
        position: 'absolute',
        top: -width * 0.2,
        right: -width * 0.3,
        opacity: 0.35,
      },
    };

    if (currentCondition === 'Clear') {
      const isNight = currentIcon.includes('n');
      if (isNight) return <MoonSvg {...props} fill="#FFF" />;
      return <ClearSvg {...props} fill="#FFF" />;
    } else if (currentCondition === 'Rain' || currentCondition === 'Drizzle' || currentCondition === 'Thunderstorm') {
      return <RainSvg {...props} fill="#FFF" />;
    } else {
      return <CloudySvg {...props} fill="#FFF" />;
    }
  };

  return (
    <Animated.View
      style={[
        styles.heroCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: floatAnim }],
        },
      ]}>
      {renderBackgroundSvg()}
      {/* Location */}
      <View style={styles.locationRow}>
        <Icon name="location-outline" size={16} color="rgba(255,255,255,0.8)" />
        <Text style={styles.locationText}>{weather.name}</Text>
      </View>

      {/* Lottie Animation */}
      <LottieView
        source={animationSource}
        autoPlay
        loop
        style={styles.lottie}
      />

      {/* Temperature */}
      <Text style={styles.heroTemp}>
        {Math.round(weather.main.temp)}°
      </Text>
      <Text style={styles.unitText}>
        {unit === 'metric' ? 'Celsius' : 'Fahrenheit'}
      </Text>

      {/* Condition */}
      <Text style={styles.conditionText}>{currentCondition}</Text>

      {/* Secondary Info */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Icon name="thermometer-outline" size={16} color="#FFD54F" />
          <Text style={styles.infoLabel}>Feels</Text>
          <Text style={styles.infoValue}>
            {Math.round(weather.main.feels_like)}°
          </Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoItem}>
          <Icon name="water-outline" size={16} color="#81C784" />
          <Text style={styles.infoLabel}>Humidity</Text>
          <Text style={styles.infoValue}>{weather.main.humidity}%</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoItem}>
          <Icon name="speedometer-outline" size={16} color="#64B5F6" />
          <Text style={styles.infoLabel}>Wind</Text>
          <Text style={styles.infoValue}>
            {Math.round(weather.wind.speed)} m/s
          </Text>
        </View>
      </View>

      {/* 5-Day Forecast — Horizontal Scroll */}
      {dailyForecasts.length > 0 && (
        <View style={styles.forecastSection}>
          <Text style={styles.forecastTitle}>5-Day Forecast</Text>
          <FlatList
            data={dailyForecasts.slice(0, 5)}
            renderItem={renderForecastDay}
            keyExtractor={item => item.date}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.forecastList}
          />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    ...glass.light,
    padding: spacing.lg,
    alignItems: 'center',
    overflow: 'hidden',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  locationText: {
    ...typography.subheading,
    marginLeft: spacing.xs,
  },
  lottie: {
    width: width * 0.28,
    height: width * 0.28,
  },
  heroTemp: {
    ...typography.heroTemp,
    marginTop: spacing.xs,
  },
  unitText: {
    ...typography.caption,
    marginTop: -4,
  },
  conditionText: {
    ...typography.heading,
    fontSize: 20,
    marginTop: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    ...glass.medium,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    width: '100%',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    ...typography.caption,
    marginTop: 2,
  },
  infoValue: {
    ...typography.subheading,
    fontSize: 15,
    fontWeight: '700',
  },
  infoDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  // Forecast section
  forecastSection: {
    width: '100%',
    marginTop: spacing.md,
  },
  forecastTitle: {
    ...typography.sectionTitle,
    fontSize: 15,
    marginBottom: spacing.sm,
  },
  forecastList: {
    gap: spacing.sm,
  },
  dayCard: {
    ...glass.medium,
    width: 80,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
  },
  dayLabel: {
    ...typography.subheading,
    fontSize: 13,
    fontWeight: '700',
  },
  dayIcon: {
    width: 36,
    height: 36,
    marginVertical: 4,
  },
  dayTemp: {
    ...typography.subheading,
    fontSize: 16,
    fontWeight: '700',
  },
  dayCondition: {
    ...typography.caption,
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
  },
  dayDate: {
    ...typography.caption,
    fontSize: 9,
    marginTop: 2,
  },
});
