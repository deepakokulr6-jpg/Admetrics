/**
 * All user-facing text in the app, grouped by screen / component.
 * Edit copy here – components read it as strings.<group>.<key>.
 * Text that includes a value is a function: strings.auth.otpSentTo(email).
 * Sample/demo data lives in constants/mockData.ts, not here.
 */
const strings = {
  common: {
    registerYourClinic: 'Register Your Clinic',
    createYourAccount: 'Create Your Account',
    enterYourEmailAddressTo: 'Enter your email address to get started',
    emailId: 'Email ID',
    enterYourEmail: 'Enter your email',
    clinicInformation: 'Clinic Information',
    contactInformation: 'Contact Information',
    photos: 'Photos',
    next: 'Next',
    cancel: 'Cancel',
    notProvided: '—',
    close: 'Close',
    /** Appended to the label of a required field. */
    requiredMark: ' *',
    verify: 'Verify',
    viewAll: 'View All',
    online: 'Online',
    offline: 'Offline',
    notPaid: 'Not Paid',
    monthlyPayoutStatement: 'Monthly Payout Statement',
  },
  /** Bottom navigation tab labels. */
  tabs: {
    Revenue: 'Revenue',
    Clinics: 'Clinics',
    Statement: 'Statement',
    Support: 'Support',
  },
  auth: {
    pleaseEnterAValidEmail: 'Please enter a valid email address.',
    pleaseEnterAllSixOtp: 'Please enter all six OTP digits.',
    otp: 'OTP',
    resendOtp: 'Resend OTP',
    getOtp: 'Get OTP',
    alreadyHaveAnAccount: 'Already have an account?',
    logIn: 'Log In',
    enterYourPassword: 'Enter your Password',
    hidePassword: 'Hide password',
    showPassword: 'Show password',
    forgotPassword: 'Forgot Password?',
    otpSentTo: (email: string) =>
      `OTP sent to ${email}. Enter the 6-digit code to continue.`,
    testCode: (code: string) => ` (Test code: ${code})`,
    devOtpNotEmailed: (code: string) =>
      `This is a development build, so no email was sent. Use ${code} to reset your password.`,
    devIncorrectOtp: (code: string) =>
      `Incorrect OTP. Use ${code} in this development build.`,
    otpCode: (length: number) => `${length}-digit OTP`,
    otpMask: '*',
    resendOtpIn: (time: string) => `Resend OTP in ${time}`,
  },
  clinicForm: {
    clinicNameIsRequired: 'Clinic name is required.',
    medicalRegistrationNumberIsRequired:
      'Medical registration number is required.',
    checkClinicDetails: 'Check clinic details',
    pleaseCompleteTheRequiredClinic:
      'Please complete the required clinic information before continuing.',
    clinicName: 'Clinic Name',
    enterClinicName: 'Enter clinic name',
    medicalRegistrationNumber: 'Medical Registration Number',
    enterMedicalRegistrationNumber: 'Enter medical registration number',
    establishmentYear: 'Establishment Year',
    eG2023: 'e.g. 2023',
    registrationLicenceNumber: 'Registration/Licence Number',
    enterRegistrationOrLicenceNumber: 'Enter registration or licence number',
    gstNumber: 'GST Number',
    enterGstNumber: 'Enter GST number',
    panNumber: 'PAN Number',
    enterPanNumber: 'Enter PAN number',
    address: 'Address',
    enterClinicAddress: 'Enter clinic address',
    street: 'Street *',
    enterStreet: 'Enter street',
    city: 'City',
    enterCity: 'Enter city',
    state: 'State',
    enterState: 'Enter state',
    pincode: 'Pincode *',
    enterPincode: 'Enter pincode',
  },
  mapPreview: {
    locateOnMap: 'Locate on Map *',
    openClinicAddressInGoogle: 'Open clinic address in Google Maps',
  },
  dashboardHeader: {
    openProfile: 'Open profile',
    goodMorning: 'Good Morning!',
    admetricsHome: 'Admetrics home',
    admetricsLogo: 'Admetrics logo',
  },
  profileDrawer: {
    mouAgreement: 'MOU Agreement',
    notification: 'Notification',
    settings: 'Settings',
    logOut: 'Log out',
    closeMenu: 'Close menu',
  },
  settings: {
    title: 'Settings',
    appearance: 'Appearance',
    changePassword: 'Change Password',
    addDevice: 'Add Device',
    bankAccountDetails: 'Bank Account Details',
    privacyPolicy: 'Privacy Policy',
    aboutAdmetrics: 'About AdMetrics',
  },
  revenueSummaryCard: {
    totalRevenue: 'Total revenue',
    vsPreviousMonth: 'vs. previous month',
    thisMonth: 'This Month',
    pendingPayout: 'Pending Payout',
    growthArrow: '↗',
  },
  tvDisplaysSection: {
    yourTvDisplays: 'Your TV displays',
    topPerformingDisplay: 'Top performing display',
    generatesHighestRevenue: (name: string) =>
      `${name} generates the highest revenue`,
  },
  screenHeader: {
    goBack: 'Go back',
  },
  workingHoursRow: {
    startPlaceholder: '09:30AM',
    endPlaceholder: '09:30PM',
    startTime: (day: string) => `${day} start time`,
    endTime: (day: string) => `${day} end time`,
  },
  photoUploadItem: {
    uploadPhoto: (title: string) => `Upload ${title} photo`,
    replacePhoto: (title: string) => `Replace ${title} photo`,
  },
  accountCreated: {
    accountCreatedSuccessfully: 'Account Created Successfully!',
    yourAccountIsReadyYou:
      'Your account is ready. You can now Sign In\nusing your email address and password.',
    signIn: 'Sign In',
  },
  confirmPassword: {
    pleaseFillInBothPassword: 'Please fill in both password fields.',
    useAtLeast8Characters: 'Use at least 8 characters for your password.',
    bothPasswordsMustMatch: 'Both passwords must match.',
    yourPasswordResetSessionHas:
      'Your password reset session has expired. Please start the reset flow again.',
    passwordUpdated: 'Password Updated',
    yourPasswordHasBeenChanged:
      'Your password has been changed. Please sign in with your new password.',
    unableToResetYourPassword:
      'Unable to reset your password right now. Please try again.',
    unableToCreateYourAccount:
      'Unable to create your account right now. Please try again.',
    resetYourPassword: 'Reset Your Password',
    chooseANewPasswordFor: 'Choose a new password for your account',
    createPassword: 'Create Password',
    confirmPassword: 'Confirm Password',
    reEnterYourPassword: 'Re-enter your Password',
    hideConfirmPassword: 'Hide confirm password',
    showConfirmPassword: 'Show confirm password',
    confirm: 'Confirm',
  },
  createAccount: {
    anAccountWithThisEmail:
      'An account with this email already exists. Please log in instead.',
    unableToCheckThisEmail:
      'Unable to check this email right now. Please try again in a moment.',
    incorrectOtpPleaseCheckThe:
      'Incorrect OTP. Please check the code and try again.',
  },
  verifyOtp: {
    otpSent: 'OTP Sent',
    unableToSendTheOtp: 'Unable to send the OTP right now. Please try again.',
    unableToVerifyTheOtp:
      'Unable to verify the OTP right now. Please try again.',
    forgotPassword: 'Forgot Password',
    enterYourRegisteredEmailTo:
      'Enter your registered email to reset your password',
    rememberYourPassword: 'Remember your password?',
  },
  welcomeBack: {
    pleaseEnterYourEmailAnd: 'Please enter your email and password.',
    unableToSignInRight: 'Unable to sign in right now. Please try again.',
    welcomeBack: 'Welcome Back!',
    signInToContinueTo: 'Sign in to continue to',
    admetrics: 'Admetrics',
    password: 'Password',
    signIn: 'Sign In',
    newUser: 'New User?',
  },
  clinicRegistered: {
    clinicRegisteredSuccessfully: 'Clinic Registered Successfully!',
    yourClinicIsRegisteredWith:
      'Your clinic is registered with Admetrics.\nPlease wait for our approval',
    okay: 'Okay',
  },
  editDetails: {
    editDetails: 'Edit Details',
  },
  registerClinic: {
    enterAValidFourDigit: 'Enter a valid four-digit year.',
    registrationLicenceNumberIsRequired:
      'Registration/licence number is required.',
    gstNumberIsRequired: 'GST number is required.',
    enterAValid15Character: 'Enter a valid 15-character GST number.',
    enterAValid10Character: 'Enter a valid 10-character PAN.',
    streetIsRequired: 'Street is required.',
    pincodeIsRequired: 'Pincode is required.',
    enterAValidSixDigit: 'Enter a valid six-digit pincode.',
    addressRequired: 'Address required',
    enterTheClinicAddressBefore:
      'Enter the clinic address before opening it on the map.',
    mapUnavailable: 'Map unavailable',
    noMapApplicationCouldBe:
      'No map application could be opened on this device.',
  },
  registerPersonal: {
    contactPersonIsRequired: 'Contact person name is required.',
    enterAValidName: 'Enter a valid name (letters only, at least 2).',
    enterAValid10Digit: 'Enter a valid 10-digit mobile number.',
    emailIdIsRequired: 'Email ID is required.',
    enterAValidEmailAddress: 'Enter a valid email address.',
    checkPersonalDetails: 'Check personal details',
    pleaseCompleteTheRequiredPersonal:
      'Please complete the required personal information before continuing.',
    contactPersonName: 'Contact Person Name',
    enterContactPersonName: 'Enter contact person name',
    designation: 'Designation',
    enterDesignation: 'Enter designation',
    mobileNumber: 'Mobile Number',
    enterMobileNumber: 'Enter mobile number',
    emailId: 'Email ID',
    enterEmailAddress: 'Enter email address',
  },
  registerPhoto: {
    unableToOpenGallery: 'Unable to open gallery',
    pleaseTryChoosingAPhoto: 'Please try choosing a photo again.',
    noPhotoSelected: 'No photo selected',
    pleaseChooseAPhotoTo: 'Please choose a photo to upload.',
    unsupportedFile: 'Unsupported file',
    onlyJpgJpegAndPng: 'Only .jpg, .jpeg and .png images can be uploaded.',
    fileTooLarge: 'File too large',
    pleaseChooseAnImageSmaller: 'Please choose an image smaller than 5 MB.',
    photosCannotBeSelectedRight:
      'Photos cannot be selected right now. Please try again.',
    whatWouldYouLikeTo: 'What would you like to do?',
    sessionExpired: 'Session expired',
    pleaseSignInAgainBefore:
      'Please sign in again before registering your clinic.',
    registrationFailed: 'Registration failed',
    theClinicDetailsCouldNot:
      'The clinic details could not be saved on this device. Please try again.',
    photos: 'Photos',
    onlyJpgPngFilesWith: 'Only .jpg/.png files with 5mb max.',
    n1Entrance: '1. Entrance',
    entrancePhoto: 'Entrance Photo',
    n2Reception: '2. Reception',
    receptionPhoto: 'Reception Photo',
    register: 'Register',
    replace: 'Replace',
    remove: 'Remove',
  },
  registerTimings: {
    startAndEndTimeAre: 'Start and end time are required.',
    useATimeLike09: 'Use a time like 09:30AM or 06:30PM.',
    startAndEndTimeCannot: 'Start and end time cannot be the same.',
    checkWorkingHours: 'Check working hours',
    pleaseCorrectTheHighlightedWorking:
      'Please correct the highlighted working hours before continuing.',
    workingHours: 'Working Hours',
  },
  steps: {
    clinic: 'Clinic',
    contact: 'Contact',
    photos: 'Photos',
    mou: 'MOU',
  },
  mou: {
    memorandumOfUnderstanding: 'Memorandum of Understanding',
    signature: 'Signature',
    submit: 'Submit',
    yourSignature: 'Your signature',
    clear: 'Clear',
    signatureArea: 'Signature area. Draw your signature with one finger.',
    preview: 'Preview',
    pageCount: (page: number, total: number) => `${page}/${total}`,
    register: 'Register',
    signatureRequired: 'Signature required',
    pleaseSignTheMou: 'Please sign the MOU before registering your clinic.',
    signingUnavailable: 'Signing unavailable',
    checkConnection:
      'The signing page could not be loaded. Check your internet connection and try again.',
  },
  /**
   * MOU text shown on the MOU step and in the side menu.
   * Placeholder copy from the design – replace with the real agreement.
   */
  mouDocument: [
    {
      heading: '1. Description of the System Requirements',
      body: [
        'The Didactic Coordinator orders a software system that supports the didactic activity and it includes a web app and a mobile app.',
        'The web app provides specific functionalities based on the user that is logged in the system as Professor or as Secretary. Its main purpose is handling the reports sent by the professors and taken care of by the Secretary.',
        'The mobile app provides further functionalities for the user that is logged in as Student or as Professor. These functionalities include the possibility of exchanging messages, receiving notifications, downloading documents and sending feedback.',
      ],
    },
    {
      heading: '2. Requirements Analysis',
      body: [
        'The actors that interact with the software requested by the didactic Coordinator are:',
        '• Secretary',
        '• Professor',
        '• Student',
        'Using the web app, the Secretary is able to insert:',
        '• New courses of study',
        '• New subjects for the existing study courses',
        '• New classrooms, with information regarding the geolocation',
        '• New activities, choosing between Lesson or Exam',
        '• New Users, choosing between Student or Professor',
        'Furthermore, it can handle the reports sent by the professors. When the reporting is taken care of, the Secretary add a note or motivation if the issue has been resolved or refused. Anyway, in both cases, the state of the reporting is notified to the professors by the mobile app.',
        'Using the web app, the Professor can:',
        '• Upload the teaching material',
        '• Send to the Secretary the reporting about the issues concerning one specific classroom',
        '• View the state of his reports',
        '• View the state of the reports regarding a certain classroom, even if they are sent by different professors',
        'Instead, using the mobile app, the Professor can:',
        '• View the activities of the day, including the map of the classrooms',
        '• Receive the notification regarding his reports or classrooms',
        '• Receive the notification when a student send a message to him',
        '• Receive the notification when a student send a feedback regarding the lessons or the teaching material',
        'Using the mobile app, the Student can:',
        '• Write messages in the channel chats of the subjects that he studies and the message can be public or private',
        '• Download the teaching material',
        '• Provide anonymously feedback about the lessons or the teaching material',
        '• View the activities of the day, including the map of the classrooms',
        '• Receive the notification when there has been a change of classroom for a lesson he has to attend',
        '• Receive the notification when a professor send messages to him or when the professor uploads the teaching material',
      ],
    },
  ],
  registeredDetails: {
    registeredDetails: 'Registered Details',
    editDetails: 'Edit details',
    photos: 'Photos',
    displays: 'Displays',
    displayId: (id: string) => ` · ${id}`,
  },
  home: {
    logOut: 'Log Out',
    areYouSureYouWant: 'Are you sure you want to log out of Admetrics?',
    logOutFailed: 'Log Out Failed',
    unableToClearYourSession: 'Unable to clear your session. Please try again.',
  },
  a15Home: {
    unnamedClinic: 'Clinic',
    waitingForApproval: 'Waiting for Approval',
  },
  clinicCard: {
    displaysCount: (count: number) => `${count} Displays`,
  },
  paymentDetails: {
    paymentPeriod: (month: string) => `PAYMENT PERIOD: ${month.toUpperCase()}`,
    paidBy: 'Paid By',
    paidTo: 'Paid To',
    payoutPeriod: 'Payout Period',
    paymentDate: 'Payment Date',
    transactionId: 'Transaction ID',
    paymentMethod: 'Payment Method',
    paymentDetails: 'Payment Details',
    paymentProcessed: 'Payment Processed',
    totalPayoutAmount: 'TOTAL PAYOUT AMOUNT',
    total: 'TOTAL',
  },
  revenue: {
    revenueOverview: 'Revenue overview',
  },
  statement: {
    paidOn: (date: string) => `Paid on ${date}`,
  },
  support: {
    howCanWeHelpYou: 'How can we help you?',
    getAssistanceWithYourAdmetrics:
      'Get assistance with your AdMetrics devices, installation and technical issues.',
    raiseAComplaint: 'Raise a Complaint',
    reportDeviceIssuesTvOffline:
      'Report device issues, TV offline status or technical problems.',
    createComplaint: 'Create Complaint',
    installationRequest: 'Installation Request',
    requestNewDeviceInstallationOr:
      'Request new device installation or relocation.',
    requestInstallation: 'Request Installation',
    recentRequests: 'Recent Requests',
    inProgress: 'In Progress',
    resolved: 'Resolved',
    ticketLine: (ticket: string, date: string) => `Ticket #${ticket} · ${date}`,
    needImmediateAssistance: 'Need immediate assistance?',
    contactOurSupportTeamFor: 'Contact our support team for additional help.',
    contactSupport: 'Contact Support',
  },
  authService: {
    unableToAccessLocalStorage:
      'Unable to access local storage. Please restart the app and try again.',
    unableToSaveYourAccount: 'Unable to save your account on this device.',
    anAccountWithThisEmail:
      'An account with this email already exists. Please sign in instead.',
    noAccountFoundForThis:
      'No account found for this email. Please create an account first.',
    incorrectOtpPleaseTryAgain: 'Incorrect OTP. Please try again.',
    yourPasswordResetSessionHas:
      'Your password reset session has expired. Please start again.',
    incorrectPasswordPleaseTryAgain: 'Incorrect password. Please try again.',
  },
} as const;

export default strings;
