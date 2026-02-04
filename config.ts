import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export const config = {
  appUrl: process.env.APP_URL || 'https://devpvpm.practicevelocity.com/26_3/loginpage.aspx',
  loginUsername: process.env.LOGIN_USERNAME || '',
  loginPassword: process.env.LOGIN_PASSWORD || '',
};
