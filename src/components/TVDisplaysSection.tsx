import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type Props = {
  onViewAll?: () => void;
};

const TVDisplaysSection: React.FC<Props> = ({ onViewAll }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your TV displays</Text>

      <Pressable onPress={onViewAll} hitSlop={8}>
        <Text style={styles.viewAll}>View All</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 10,
  },
  title: {
    color: '#221E25',
    fontSize: 12,
    fontWeight: '700',
  },
  viewAll: {
    color: '#0265FB',
    fontSize: 11,
    textDecorationLine: 'underline',
  },
});

export default TVDisplaysSection;
