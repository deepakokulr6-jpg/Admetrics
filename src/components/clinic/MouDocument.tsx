import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { normalizeFont, verticalScale } from '../../utils/responsive';
import colors from '../../theme/colors';
import { fonts } from '../../theme/typography';
import strings from '../../constants/strings';
import { themedStyles } from '../../theme/themedStyles';

type Props = {
  /** Smaller type for the boxed preview on the MOU step. */
  compact?: boolean;
  /** Only these sections (indexes into strings.mouDocument), e.g. one page. */
  sections?: number[];
};

/** The MOU agreement text (strings.mouDocument). */
const MouDocument: React.FC<Props> = ({ compact = false, sections }) => (
  <View>
    {strings.mouDocument
      .filter((_, index) => !sections || sections.includes(index))
      .map(section => (
        <View key={section.heading} style={styles.section}>
          <Text style={[styles.heading, compact && styles.headingCompact]}>
            {section.heading}
          </Text>
          {section.body.map((line, index) => (
            <Text
              key={index}
              style={[
                styles.body,
                compact && styles.bodyCompact,
                line.startsWith('•') && styles.bullet,
              ]}
            >
              {line}
            </Text>
          ))}
        </View>
      ))}
  </View>
);

const styles = themedStyles(() =>
  StyleSheet.create({
    section: {
      marginBottom: verticalScale(12),
    },
    heading: {
      fontSize: normalizeFont(14),
      lineHeight: normalizeFont(20),
      fontFamily: fonts.bold,
      color: colors.black,
      marginBottom: verticalScale(4),
    },
    headingCompact: {
      fontSize: normalizeFont(10),
      lineHeight: normalizeFont(14),
    },
    body: {
      fontSize: normalizeFont(12),
      lineHeight: normalizeFont(17),
      color: colors.black,
    },
    bodyCompact: {
      fontSize: normalizeFont(7),
      lineHeight: normalizeFont(10),
    },
    bullet: {
      paddingLeft: normalizeFont(8),
    },
  }),
);

export default MouDocument;
