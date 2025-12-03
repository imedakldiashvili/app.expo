import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface BarcodeProps {
  value: string;
  width?: number;
  height?: number;
  barColor?: string;
  showText?: boolean;
}

// Simple Code128-like barcode visualization
export default function Barcode({ 
  value, 
  width = 200, 
  height = 60,
  barColor = '#000000',
  showText = true
}: BarcodeProps) {
  // Generate bar pattern from value
  const generateBars = (text: string): number[] => {
    const bars: number[] = [];
    
    // Start pattern
    bars.push(2);
    bars.push(1);
    
    // Simple encoding: each character creates a pattern
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      // Create alternating bar widths based on character code
      const pattern = (charCode % 3) + 1; // 1, 2, or 3
      bars.push(pattern);
      bars.push(1); // Space between bars
    }
    
    // End pattern
    bars.push(2);
    
    return bars;
  };

  const bars = generateBars(value);
  const totalWidth = bars.reduce((sum, width) => sum + width, 0);
  const scale = width / totalWidth;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { width, height: height - (showText ? 20 : 0) }]}>
        <View style={styles.barcodeContainer}>
          {bars.map((barWidth, index) => {
            const isBar = index % 2 === 0;
            return (
              <View
                key={index}
                style={[
                  styles.bar,
                  {
                    width: Math.max(barWidth * scale, 0.5),
                    backgroundColor: isBar ? barColor : 'transparent',
                  },
                ]}
              />
            );
          })}
        </View>
      </View>
      {showText && (
        <Text style={styles.barcodeText}>{value}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
    borderRadius: 4,
  },
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  bar: {
    height: '100%',
  },
  barcodeText: {
    marginTop: 4,
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#000000',
    letterSpacing: 1,
  },
});

