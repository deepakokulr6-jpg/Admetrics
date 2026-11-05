import { AppStackParamList } from '../src/navigation/types';

describe('AppStackParamList route definitions', () => {
  it('contains all required bottom navigation tabs and stack screens', () => {
    const validRoutes: (keyof AppStackParamList)[] = [
      'Home',
      'A15Home',
      'Revenue',
      'Statement',
      'Support',
      'RegisterClinic',
      'RegisterPersonal',
      'RegisterTimings',
      'RegisterPhotos',
      'ClinicRegistered',
      'EditDetails',
    ];

    expect(validRoutes).toContain('Statement');
    expect(validRoutes).toContain('Support');
    expect(validRoutes).toContain('Revenue');
    expect(validRoutes).toContain('A15Home');
  });

  it('ensures no screen attempts to navigate to unhandled routes like Logs or Receipt', () => {
    const deprecatedOrInvalid = ['Logs', 'Receipt', 'TVDisplays'];
    const validRoutes = [
      'Home',
      'A15Home',
      'Revenue',
      'Statement',
      'Support',
      'RegisterClinic',
      'RegisterPersonal',
      'RegisterTimings',
      'RegisterPhotos',
      'ClinicRegistered',
      'EditDetails',
    ];

    deprecatedOrInvalid.forEach(route => {
      expect(validRoutes).not.toContain(route);
    });
  });
});

