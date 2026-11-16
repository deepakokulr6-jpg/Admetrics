import React, { useState } from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';

type GradientTextProps = {
  children: string;
  style: TextStyle;
};

// Brand blue → purple gradient text, as used for links in the Figma design.
// An invisible <Text> sizes the element; the SVG paints the gradient over it.
const GradientText: React.FC<GradientTextProps> = ({ children, style }) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const flat = StyleSheet.flatten(style) ?? {};
  const fontSize = flat.fontSize ?? 14;

  return (
    <View>
      <Text
        style={[style, styles.hidden]}
        onLayout={e =>
          setSize({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
          })
        }
      >
        {children}
      </Text>
      {size.width > 0 ? (
        <Svg
          width={size.width}
          height={size.height}
          style={StyleSheet.absoluteFill}
        >
          <Defs>
            <LinearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0.143" stopColor={colors.primary} />
              <Stop offset="0.966" stopColor={colors.secondary} />
            </LinearGradient>
          </Defs>
          <SvgText
            fill="url(#brand)"
            fontFamily={(flat.fontFamily as string) ?? fonts.regular}
            fontSize={fontSize}
            x={0}
            y={size.height / 2 + fontSize * 0.36}
          >
            {children}
          </SvgText>
        </Svg>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  hidden: {
    opacity: 0,
  },
});

export default GradientText;
