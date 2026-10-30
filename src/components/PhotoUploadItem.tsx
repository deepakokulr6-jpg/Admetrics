
import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface PhotoUploadProps {
  title: string;
  imageUri?: string | null;
  onPress: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  title,
  imageUri,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <Pressable
        onPress={onPress}
        style={styles.uploadBox}
        accessibilityRole="button"
        accessibilityLabel={`Upload ${title} photo`}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="add" size={48} color="#AAAAAA" />
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 148,
  },
  title: {
    fontSize: 14,
    fontWeight: '400',
    color: '#221E25',
    marginBottom: 8,
  },
  uploadBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#EEEEEE',
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
});

export default PhotoUpload;
