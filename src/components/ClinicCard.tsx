import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

type Props = {
  status?: string;
  clinicName: string;
  contactName: string;
  designation: string;
  phone: string;
  email: string;
  photoOneColor?: string;
  photoTwoColor?: string;
  photoOneUri?: string | null;
  photoTwoUri?: string | null;
  displayCount?: number;
};

const ClinicCard: React.FC<Props> = ({
  status,
  clinicName,
  contactName,
  designation,
  phone,
  email,
  photoOneColor = '#B8C8D4',
  photoTwoColor = '#C8C3B8',
  photoOneUri,
  photoTwoUri,
  displayCount,
}) => (
  <View style={styles.card}>
    <View style={styles.photos}>
      <View style={[styles.circle, { backgroundColor: photoOneColor }]}>
        {photoOneUri ? (
          <Image source={{ uri: photoOneUri }} style={styles.photo} />
        ) : null}
      </View>

      <View style={[styles.circle, { backgroundColor: photoTwoColor }]}>
        {photoTwoUri ? (
          <Image source={{ uri: photoTwoUri }} style={styles.photo} />
        ) : null}
      </View>

      {displayCount ? (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>+{displayCount}</Text>
        </View>
      ) : null}
    </View>

    <View style={styles.info}>
      <Text style={styles.clinicName}>{clinicName}</Text>

      <Text style={styles.contact}>
        {contactName} · {designation}
      </Text>

      <Text style={styles.detail}>{phone}</Text>
      <Text style={styles.detail}>{email}</Text>

      {status ? <Text style={styles.status}>{status}</Text> : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  photos: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginLeft: -12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  photo: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },

  countBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#221E25',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },

  countText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  info: {
    flex: 1,
  },

  clinicName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#221E25',
  },

  contact: {
    fontSize: 13,
    color: '#777777',
    marginTop: 2,
  },

  detail: {
    fontSize: 12,
    color: '#555555',
    marginTop: 1,
  },

  status: {
    marginTop: 6,
    fontSize: 12,
    color: '#B43AFC',
    fontWeight: '600',
  },
});

export default ClinicCard;
