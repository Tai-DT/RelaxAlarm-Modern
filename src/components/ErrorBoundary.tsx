/**
 * Error Boundary Component for React Native
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Import components
import { Button } from './ui';

// Import theme
import { lightAppTheme } from '../constants/theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }
  
  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
    
    // Log to crash reporting service
    // logErrorToService(error, errorInfo);
  }
  
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };
  
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <SafeAreaView style={[styles.container, { backgroundColor: lightAppTheme.colors.background }]}>
          <ScrollView 
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.iconContainer}>
              <View style={[styles.errorIcon, { backgroundColor: lightAppTheme.colors.errorContainer }]}>
                <Ionicons name="warning" size={48} color={lightAppTheme.colors.error} />
              </View>
            </View>
            
            <Text style={[styles.title, { color: lightAppTheme.colors.onSurface }]}>
              Oops! Something went wrong
            </Text>
            
            <Text style={[styles.message, { color: lightAppTheme.colors.onSurfaceVariant }]}>
              We're sorry for the inconvenience. The app has encountered an unexpected error.
            </Text>
            
            {__DEV__ && this.state.error && (
              <View style={[styles.debugContainer, { backgroundColor: lightAppTheme.colors.surfaceVariant }]}>
                <Text style={[styles.debugTitle, { color: lightAppTheme.colors.error }]}>
                  Debug Information:
                </Text>
                <ScrollView style={styles.debugScroll} horizontal>
                  <Text style={[styles.debugText, { color: lightAppTheme.colors.onSurfaceVariant }]}>
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </Text>
                </ScrollView>
              </View>
            )}
            
            <View style={styles.actions}>
              <Button
                variant="filled"
                color="primary"
                onPress={this.handleReset}
                icon="refresh"
                size="large"
                fullWidth
              >
                Try Again
              </Button>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
    
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  errorIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  debugContainer: {
    width: '100%',
    maxHeight: 200,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  debugScroll: {
    maxHeight: 150,
  },
  debugText: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  actions: {
    width: '100%',
  },
});

export default ErrorBoundary;