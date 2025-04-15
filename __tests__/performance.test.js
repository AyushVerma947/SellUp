import React from 'react';
import { performance } from 'perf_hooks';
import renderer from 'react-test-renderer';
import LoginScreen from '../src/screens/LoginScreen';

jest.mock('@react-native-firebase/auth');
jest.mock('@react-native-firebase/firestore');
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn().mockResolvedValue(true),
    signIn: jest.fn().mockResolvedValue({ idToken: 'mock-id-token' }),
  },
  statusCodes: {},
}));

describe('📱 SellUp App - Performance Test Suite', () => {
  it('🕒 Measures startup time, response time, and memory usage', async () => {
    const startTime = performance.now();

    const testRenderer = renderer.create(<LoginScreen navigation={{ navigate: jest.fn() }} />);
    const endTime = performance.now();
    const startupTime = endTime - startTime;

    // Simulate a user interaction delay
    const responseStart = performance.now();
    const button = testRenderer.root.findByProps({ testID: 'login-button' });

    // Simulate button press
    if (button && button.props.onPress) {
      button.props.onPress();
    }

    const responseEnd = performance.now();
    const responseTime = responseEnd - responseStart;

    // Measure memory usage (Node.js way)
    const memoryUsage = process.memoryUsage();
    const memoryInMB = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);

    // Print all metrics
    console.log(`✅ Startup Time: ${startupTime.toFixed(2)}ms`);
    console.log(`✅ Response Time: ${responseTime.toFixed(2)}ms`);
    console.log(`✅ Memory Usage: ${memoryInMB} MB`);

    // Basic expectations (adjust thresholds as needed)
    expect(startupTime).toBeLessThan(1000);
    expect(responseTime).toBeLessThan(300);
    expect(parseFloat(memoryInMB)).toBeLessThan(150);
  });
});
