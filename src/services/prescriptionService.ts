
import { STORES, add, getAll, get, update, queryWithFilters } from '@/lib/database';
import { Prescription } from '@/types/models';
import { v4 as uuidv4 } from 'uuid';

// Get all prescriptions
export const getAllPrescriptions = async (): Promise<Prescription[]> => {
  try {
    const prescriptions = await getAll<Prescription>(STORES.PRESCRIPTIONS);
    return prescriptions.sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());
  } catch (error) {
    console.error('Error getting all prescriptions:', error);
    throw error;
  }
};

// Get prescription by order ID
export const getPrescriptionByOrderId = async (orderId: string): Promise<Prescription | null> => {
  try {
    const prescriptions = await queryWithFilters<Prescription>(STORES.PRESCRIPTIONS, { order_id: orderId });
    return prescriptions[0] || null;
  } catch (error) {
    console.error(`Error getting prescription for order ${orderId}:`, error);
    throw error;
  }
};

// Create a new prescription
export const addPrescription = async (prescription: Omit<Prescription, 'id' | 'created_at' | 'updated_at'>): Promise<Prescription> => {
  try {
    const now = new Date().toISOString();
    const newPrescription: Prescription = {
      id: uuidv4(),
      ...prescription,
      upload_date: prescription.upload_date || now,
      validated: false,
      created_at: now,
      updated_at: now
    };
    
    const result = await add<Prescription>(STORES.PRESCRIPTIONS, newPrescription);
    return result;
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw error;
  }
};

// Validate a prescription
export const validatePrescription = async (prescriptionId: string, validatedBy: string): Promise<Prescription | null> => {
  try {
    const prescription = await get<Prescription>(STORES.PRESCRIPTIONS, prescriptionId);
    if (prescription) {
      prescription.validated = true;
      prescription.validated_by = validatedBy;
      prescription.validation_date = new Date().toISOString();
      prescription.updated_at = new Date().toISOString();
      
      await update<Prescription>(STORES.PRESCRIPTIONS, prescription);
      return prescription;
    }
    return null;
  } catch (error) {
    console.error('Error validating prescription:', error);
    throw error;
  }
};

// Get pending prescriptions (not validated)
export const getPendingPrescriptions = async (): Promise<Prescription[]> => {
  try {
    return await queryWithFilters<Prescription>(STORES.PRESCRIPTIONS, { validated: false });
  } catch (error) {
    console.error('Error getting pending prescriptions:', error);
    throw error;
  }
};

// Extract text from prescription image (placeholder for OCR integration)
export const extractTextFromPrescription = async (imageFile: File): Promise<string> => {
  try {
    // This would integrate with OCR service like Google Vision or Tesseract
    // For now, return a placeholder
    console.log('OCR processing for file:', imageFile.name);
    
    // Simulate OCR extraction
    return "Paracetamol 500mg - 2x ao dia\nAmoxicilina 875mg - 3x ao dia por 7 dias";
  } catch (error) {
    console.error('Error extracting text from prescription:', error);
    throw error;
  }
};

// Suggest products based on prescription text
export const suggestProductsFromPrescription = async (prescriptionText: string): Promise<string[]> => {
  try {
    // This would use AI/ML to match prescription text with products
    // For now, return some basic matching
    const productSuggestions: string[] = [];
    
    if (prescriptionText.toLowerCase().includes('paracetamol')) {
      productSuggestions.push('paracetamol-500mg');
    }
    
    if (prescriptionText.toLowerCase().includes('amoxicilina')) {
      productSuggestions.push('amoxicilina-875mg');
    }
    
    return productSuggestions;
  } catch (error) {
    console.error('Error suggesting products from prescription:', error);
    throw error;
  }
};
