import axios, { AxiosError } from 'axios';

export const handleError = (error: Error): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    if (!axiosError.response) {
      return 'Network error';
    }

    const statusCode = axiosError.response?.status;

    if (statusCode) {
      if (statusCode >= 500) return 'Server error';
  
      if(statusCode === 404) return "User not found"

      if (statusCode >= 400 && statusCode !== 404 ) return 'Possible invalid credentials';
      
    }
  } else if (error instanceof Error) {
    return 'Unexpected error occured'
  }

  return 'Unexpected error occured';
};

export const handleRegistrationError = (error: Error): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (!axiosError.response) {
      return 'Network error';
    }

    const statusCode = axiosError.response?.status;

    if (statusCode) {
      if (statusCode >= 500) return 'Server error';
  
      if(statusCode === 409) return "User exists please Login "

      if (statusCode === 400) return 'Invalid credentials';
      
    }
  } else if (error instanceof Error) {
    return 'Unexpected error occured'
  }

  return 'Unexpected error occured';
};

export const handleRegistrationOtpError = (error: Error): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (!axiosError.response) {
      return 'Network error';
    }

    const statusCode = axiosError.response?.status;

    if (statusCode) {

      if (statusCode === 400) return 'Some Fields are missing';
      if (statusCode === 401) return 'Invalid OTP';
      if (statusCode === 403) return 'Invalid Credentials';
      if (statusCode >= 500) return 'Server error';
      if(statusCode === 409) return "User creation failed"

      
    }
  } else if (error instanceof Error) {
    return 'Unexpected error occured'
  }

  return 'Unexpected error occured';
};
