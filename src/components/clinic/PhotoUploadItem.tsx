import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { normalizeFont, scale, verticalScale } from '../../utils/responsive';

interface PhotoUploadProps {
  title: string;
  imageUri?: string | null;
  onPress: () => void;
  onRemove?: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  title,
  imageUri,
  onPress,
  onRemove,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.uploadWrapper}>
        <Pressable
          onPress={onPress}
          style={styles.uploadBox}
          accessibilityRole="button"
          accessibilityLabel={
            imageUri ? `Replace ${title} photo` : `Upload ${title} photo`
          }
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="add" size={scale(44)} color="#AAAAAA" />
            </View>
          )}
        </Pressable>

        {imageUri && onRemove ? (
          <Pressable
            onPress={onRemove}
            style={styles.removeButton}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${title} photo`}
          >
            <Ionicons name="close" size={scale(14)} color="#FFFFFF" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
  },

  title: {
    fontSize: normalizeFont(12),
    lineHeight: normalizeFont(16),
    fontWeight: '400',
    color: '#221E25',
    marginBottom: verticalScale(8),
  },

  uploadWrapper: {
    width: '100%',
    position: 'relative',
  },

  uploadBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: scale(10),
    overflow: 'hidden',
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },

  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  removeButton: {
    position: 'absolute',
    top: scale(6),
    right: scale(6),
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PhotoUpload;
