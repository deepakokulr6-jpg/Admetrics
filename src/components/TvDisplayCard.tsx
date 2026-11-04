// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';

// type Props = {
//   title: string;
//   status: 'Online' | 'Offline';
//   displayId: string;
//   uptime: string;
//   revenue: string;
// };

// const TvDisplayCard: React.FC<Props> = ({
//   title,
//   status,
//   displayId,
//   uptime,
//   revenue,
// }) => {
//   const isOnline = status === 'Online';

//   return (
//     <View
//       style={[
//         styles.card,
//         isOnline ? styles.onlineBorder : styles.offlineBorder,
//       ]}
//     >
//       <View style={styles.leftContent}>
//         {/* TV Icon Box */}
//         <View
//           style={[
//             styles.iconBox,
//             isOnline ? styles.onlineIconBg : styles.offlineIconBg,
//           ]}
//         >
//           <Icon
//             name="monitor"
//             size={18}
//             color={isOnline ? '#16A34A' : '#DC2626'}
//           />
//         </View>

//         {/* Display Details */}
//         <View style={styles.details}>
//           <Text style={styles.title}>{title}</Text>
//           <View style={styles.statusRow}>
//             <Text
//               style={[
//                 styles.statusText,
//                 isOnline ? styles.onlineText : styles.offlineText,
//               ]}
//             >
//               {status}
//             </Text>
//             <Text style={styles.dot}> • </Text>
//             <Text style={styles.displayId}>{displayId}</Text>
//           </View>
//           <Text style={styles.uptimeText}>{uptime}</Text>
//         </View>
//       </View>

//       {/* Revenue Value */}
//       <Text style={styles.revenueText}>{revenue}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     width: '100vw',
//     maxWidth: 328,
//     height: 80,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     borderWidth: 1,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.04,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   onlineBorder: {
//     borderColor: '#E2E8F0',
//   },
//   offlineBorder: {
//     borderColor: '#FEE2E2',
//   },
//   leftContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   iconBox: {
//     width: 40,
//     height: 40,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   onlineIconBg: {
//     backgroundColor: '#DCFCE7',
//   },
//   offlineIconBg: {
//     backgroundColor: '#FEE2E2',
//   },
//   details: {
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginBottom: 2,
//   },
//   statusRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 2,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   onlineText: {
//     color: '#16A34A',
//   },
//   offlineText: {
//     color: '#DC2626',
//   },
//   dot: {
//     color: '#9CA3AF',
//     fontSize: 10,
//   },
//   displayId: {
//     fontSize: 12,
//     color: '#4B5563',
//   },
//   uptimeText: {
//     fontSize: 11,
//     color: '#9CA3AF',
//   },
//   revenueText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1F2937',
//   },
// });

// export default TvDisplayCard;

//====================================================updated code for TV display card(1)=========================================================//
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

type Props = {
  title: string;
  status: 'Online' | 'Offline';
  displayId: string;
  uptime: string;
  revenue: string;
};

const TvDisplayCard: React.FC<Props> = ({
  title,
  status,
  displayId,
  uptime,
  revenue,
}) => {
  const isOnline = status === 'Online';

  return (
    <View style={styles.cardContainer}>
      {/* Left Icon Box */}
      <View
        style={[
          styles.iconBox,
          isOnline ? styles.onlineIconBox : styles.offlineIconBox,
        ]}
      >
        <Icon
          name="monitor"
          size={18}
          color={isOnline ? '#16A34A' : '#DC2626'}
        />
      </View>

      {/* Middle Text Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.titleText} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.subtextRow}>
          <Text
            style={[
              styles.statusText,
              isOnline ? styles.onlineText : styles.offlineText,
            ]}
          >
            {status}
          </Text>
          <Text style={styles.dotText}> • </Text>
          <Text style={styles.displayIdText}>{displayId}</Text>
        </View>
        <Text style={styles.uptimeText} numberOfLines={1}>
          {uptime}
        </Text>
      </View>

      {/* Right Revenue Text */}
      <View style={styles.rightContainer}>
        <Text style={styles.revenueText}>{revenue}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 345, // Exact width matching the last banner/card
    height: 80, // Exact Figma height specification
    alignSelf: 'center', // Centers the card perfectly on the screen
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  onlineIconBox: {
    backgroundColor: '#DCFCE7',
  },
  offlineIconBox: {
    backgroundColor: '#FEE2E2',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  subtextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  onlineText: {
    color: '#16A34A',
  },
  offlineText: {
    color: '#DC2626',
  },
  dotText: {
    color: '#9CA3AF',
    fontSize: 10,
  },
  displayIdText: {
    fontSize: 11,
    color: '#6B7280',
  },
  uptimeText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  revenueText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
});

export default TvDisplayCard;
