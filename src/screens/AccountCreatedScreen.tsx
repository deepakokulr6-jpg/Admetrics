import React from 'react';

import SuccessScreenLayout from '../components/SuccessScreenLayout';
import type { AuthScreenProps } from '../navigation/types';

const AccountCreatedScreen: React.FC<AuthScreenProps<'AccountCreated'>> = ({
  navigation,
}) => {
  return (
    <SuccessScreenLayout
      title="Account Created Successfully!"
      description={
        'Your account is ready. You can now Sign In using your email address and password.'
      }
      buttonText="Sign In"
      onButtonPress={() =>
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      }
    />
  );
};

export default AccountCreatedScreen;
