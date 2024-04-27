import React, { Component } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleModalClose = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;

    if (hasError) {
      return (
        <Modal visible={hasError} animationType="slide">
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '80%', padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
              <Text style={{ fontSize: 20, marginBottom: 10 }}>Error</Text>
              <Text style={{ marginBottom: 20 }}>{error.message}</Text>
              <TouchableOpacity
                style={{ backgroundColor: 'gray', padding: 10, borderRadius: 5 }}
                onPress={this.handleModalClose}
              >
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
