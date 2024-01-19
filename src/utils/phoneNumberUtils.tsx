import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneNumberUtil = PhoneNumberUtil.getInstance();

export const isValidPhoneNumber = (phoneNumber: string, countryCode: string): boolean => {
  try {
    const parsedPhoneNumber = phoneNumberUtil.parse(phoneNumber, countryCode);
    return phoneNumberUtil.isValidNumber(parsedPhoneNumber);
  } catch (error) {
    // Handle parsing errors (e.g., invalid phone number format)
    return false;
  }
};