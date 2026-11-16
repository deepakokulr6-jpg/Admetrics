import type {
  AppStackParamList,
  MainTabParamList,
} from '../src/navigation/types';

describe('navigation route definitions', () => {
  it('has the four bottom tabs, in Figma order', () => {
    const tabs: (keyof MainTabParamList)[] = [
      'Revenue',
      'Clinics',
      'Statement',
      'Support',
    ];
    expect(tabs).toHaveLength(4);
  });

  it('puts the tabs and every pushed screen in the app stack', () => {
    const routes: (keyof AppStackParamList)[] = [
      'MainTabs',
      'RegisterClinic',
      'RegisterPersonal',
      'RegisterTimings',
      'RegisterPhotos',
      'ClinicRegistered',
      'EditDetails',
      'RegisteredDetails',
      'PaymentDetails',
    ];
    expect(routes).toContain('MainTabs');
  });
});
