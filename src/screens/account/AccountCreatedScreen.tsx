import React from 'react';

import SuccessScreenLayout from '../../components/shared/SuccessScreenLayout';
import type { AuthScreenProps } from '../../navigation/types';
import strings from '../../constants/strings';

const AccountCreatedScreen: React.FC<AuthScreenProps<'AccountCreated'>> = ({
  navigation,
}) => (
  <SuccessScreenLayout
    title={strings.accountCreated.accountCreatedSuccessfully}
    description={strings.accountCreated.yourAccountIsReadyYou}
    buttonText={strings.accountCreated.signIn}
    onButtonPress={() =>
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    }
  />
);

export default AccountCreatedScreen;
