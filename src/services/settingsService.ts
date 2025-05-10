
import { STORES, get, update, add } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';

const SETTINGS_KEY = 'company_settings';

// Define the company settings type
export interface CompanySettings {
  id?: string;
  name: string;
  slogan: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  website: string;
  logo?: string;
  tax_id: string;
  social_media: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  notification_settings: {
    stock_alerts: boolean;
    order_alerts: boolean;
    expiry_alerts: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

// Get company settings from database
export const getCompanySettings = async (): Promise<CompanySettings | null> => {
  try {
    const settings = await get<CompanySettings>(STORES.SETTINGS, SETTINGS_KEY);
    return settings;
  } catch (error) {
    console.error('Error getting company settings:', error);
    return null;
  }
};

// Update or create company settings
export const updateCompanySettings = async (settings: CompanySettings): Promise<CompanySettings> => {
  try {
    const now = new Date().toISOString();
    const existingSettings = await getCompanySettings();
    
    let updatedSettings: CompanySettings;
    
    if (existingSettings) {
      // Update existing settings
      updatedSettings = {
        ...settings,
        id: existingSettings.id || SETTINGS_KEY,
        created_at: existingSettings.created_at || now,
        updated_at: now
      };
      await update<CompanySettings>(STORES.SETTINGS, updatedSettings);
    } else {
      // Create new settings
      updatedSettings = {
        ...settings,
        id: SETTINGS_KEY,
        created_at: now,
        updated_at: now
      };
      await add<CompanySettings>(STORES.SETTINGS, updatedSettings);
    }
    
    return updatedSettings;
  } catch (error) {
    console.error('Error updating company settings:', error);
    throw error;
  }
};

// Get company name
export const getCompanyName = async (): Promise<string> => {
  try {
    const settings = await getCompanySettings();
    return settings?.name || 'PharmaGest';
  } catch (error) {
    console.error('Error getting company name:', error);
    return 'PharmaGest';
  }
};

// Get company logo
export const getCompanyLogo = async (): Promise<string | undefined> => {
  try {
    const settings = await getCompanySettings();
    return settings?.logo;
  } catch (error) {
    console.error('Error getting company logo:', error);
    return undefined;
  }
};
