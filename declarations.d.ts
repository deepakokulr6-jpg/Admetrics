
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';

  const content: React.FC<SvgProps>;
  export default content;
}

declare module 'react-native-vector-icons/Feather' {
  const content: any;
  export default content;
}

declare module 'react-native-vector-icons/Ionicons' {
  const content: any;
  export default content;
}
