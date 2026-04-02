import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, StatusBar, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { typography, spacing } from '../utils/theme';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        // Fade in and slightly scale up the logo and text
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        // After 2.5 seconds, navigate to the main App (Home)
        const timer = setTimeout(() => {
            navigation.replace('Home');
        }, 2800);

        return () => clearTimeout(timer);
    }, [fadeAnim, scaleAnim, navigation]);

    return (
        <LinearGradient
            colors={['#1F1135', '#0E0616']} // Deep purple gradient matching the logo
            style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}>
                <View style={styles.logoWrapper}>
                    <Image
                        source={require('../assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <Text style={styles.title}>Atmos</Text>
                <Text style={styles.tagline}>News based on your current weather mood.</Text>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    logoWrapper: {
        width: width * 0.45,
        height: width * 0.45,
        borderRadius: 36,
        marginBottom: spacing.xl,
        // Soft glowing shadow for the logo icon
        shadowColor: '#B39DDB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
        backgroundColor: '#1E1233', // fallback border matches icon
    },
    logo: {
        width: '100%',
        height: '100%',
        borderRadius: 36,
    },
    title: {
        ...typography.heroTemp,
        fontSize: 48,
        color: '#FFFFFF',
        marginBottom: spacing.sm,
        letterSpacing: 1,
    },
    tagline: {
        ...typography.subheading,
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: spacing.lg,
    },
});
