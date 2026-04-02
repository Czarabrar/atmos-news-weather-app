import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();

const LANGUAGE_KEY = '@app_language';

export const AppProvider = ({ children }) => {
  const [unit, setUnit] = useState('metric');
  const [categories, setCategories] = useState(['general']);
  const [weatherCondition, setWeatherCondition] = useState('Default');
  const [iconCode, setIconCode] = useState('01d');
  const [language, setLanguageState] = useState('en');
  const [showAllNews, setShowAllNews] = useState(false);
  const [debugWeather, setDebugWeather] = useState(null); // null means use real weather

  // Load saved language on mount
  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then(saved => {
      if (saved) {
        setLanguageState(saved);
      }
    });
  }, []);

  // Persist language on change
  const setLanguage = lang => {
    setLanguageState(lang);
    AsyncStorage.setItem(LANGUAGE_KEY, lang);
  };

  return (
    <AppContext.Provider
      value={{
        unit,
        setUnit,
        categories,
        setCategories,
        weatherCondition,
        setWeatherCondition,
        iconCode,
        setIconCode,
        language,
        setLanguage,
        showAllNews,
        setShowAllNews,
        debugWeather,
        setDebugWeather,
      }}>
      {children}
    </AppContext.Provider>
  );
};
