
import { getAllProducts } from './productService';
import { Product } from '@/types/models';

interface MedicationSuggestion {
  productId: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  warnings: string[];
}

interface PrescriptionAnalysis {
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration?: string;
  }[];
  recommendations: MedicationSuggestion[];
  warnings: string[];
  allergiesCheck: string[];
}

// Knowledge base for medical conditions and treatments
const MEDICAL_CONDITIONS = {
  'dor de cabeça': {
    medications: ['paracetamol', 'ibuprofeno'],
    dosage: '500mg',
    frequency: 'a cada 6-8 horas',
    maxDaily: '3-4 doses',
    warnings: ['Não exceder a dose recomendada', 'Consulte médico se persistir por mais de 3 dias']
  },
  'febre': {
    medications: ['paracetamol', 'dipirona'],
    dosage: '500mg',
    frequency: 'a cada 6 horas',
    maxDaily: '4 doses',
    warnings: ['Beber bastante líquido', 'Consulte médico se febre persistir']
  },
  'gripe': {
    medications: ['paracetamol', 'vitamina c'],
    dosage: '500mg paracetamol, 1g vitamina C',
    frequency: 'paracetamol a cada 6h, vitamina C 1x ao dia',
    maxDaily: '4 doses paracetamol, 1 dose vitamina C',
    warnings: ['Repouso', 'Hidratação', 'Consulte médico se sintomas piorarem']
  },
  'dor muscular': {
    medications: ['ibuprofeno', 'diclofenaco'],
    dosage: '400mg',
    frequency: 'a cada 8 horas',
    maxDaily: '3 doses',
    warnings: ['Tomar com alimento', 'Evitar se tem problemas estomacais']
  }
};

// Allergy database
const ALLERGIES_DATABASE = {
  'aspirina': ['ácido acetilsalicílico', 'salicilatos'],
  'penicilina': ['amoxicilina', 'ampicilina', 'penicilina G'],
  'sulfa': ['sulfametoxazol', 'sulfadiazina'],
  'dipirona': ['metamizol', 'novalgina']
};

export class AIAssistantService {
  private products: Product[] = [];

  constructor() {
    this.loadProducts();
  }

  private async loadProducts() {
    try {
      this.products = await getAllProducts();
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  // Analyze prescription image/text
  async analyzePrescription(prescriptionText: string): Promise<PrescriptionAnalysis> {
    const medications = this.extractMedicationsFromText(prescriptionText);
    const recommendations = await this.getProductRecommendations(medications);
    const warnings = this.generateWarnings(medications);
    const allergiesCheck = this.checkForCommonAllergies(medications);

    return {
      medications,
      recommendations,
      warnings,
      allergiesCheck
    };
  }

  // Extract medications from prescription text
  private extractMedicationsFromText(text: string): PrescriptionAnalysis['medications'] {
    const medications: PrescriptionAnalysis['medications'] = [];
    const lines = text.split('\n');

    lines.forEach(line => {
      const medicationMatch = line.match(/([A-Za-z\s]+)\s+(\d+\s*mg|mg)\s*[,-]?\s*([\d\sx]+(?:ao dia|vez|vezes|horas?))/i);
      
      if (medicationMatch) {
        medications.push({
          name: medicationMatch[1].trim(),
          dosage: medicationMatch[2],
          frequency: medicationMatch[3],
          duration: this.extractDuration(line)
        });
      }
    });

    return medications;
  }

  private extractDuration(text: string): string | undefined {
    const durationMatch = text.match(/(\d+\s*dias?|\d+\s*semanas?|\d+\s*meses?)/i);
    return durationMatch ? durationMatch[1] : undefined;
  }

  // Get product recommendations based on prescription
  private async getProductRecommendations(medications: PrescriptionAnalysis['medications']): Promise<MedicationSuggestion[]> {
    const recommendations: MedicationSuggestion[] = [];

    for (const med of medications) {
      const matchingProducts = this.products.filter(product => 
        product.name.toLowerCase().includes(med.name.toLowerCase()) ||
        med.name.toLowerCase().includes(product.name.toLowerCase().split(' ')[0])
      );

      matchingProducts.forEach(product => {
        recommendations.push({
          productId: product.id,
          name: product.name,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration || 'Conforme prescrição médica',
          instructions: this.generateInstructions(product.name, med),
          warnings: this.getProductWarnings(product.name)
        });
      });
    }

    return recommendations;
  }

  // Generate treatment suggestions based on symptoms
  async suggestTreatment(symptoms: string, allergies: string[] = []): Promise<MedicationSuggestion[]> {
    const suggestions: MedicationSuggestion[] = [];
    const symptomsLower = symptoms.toLowerCase();

    // Check against medical conditions database
    for (const [condition, treatment] of Object.entries(MEDICAL_CONDITIONS)) {
      if (symptomsLower.includes(condition)) {
        for (const medication of treatment.medications) {
          // Check for allergies
          if (this.hasAllergy(medication, allergies)) {
            continue;
          }

          const matchingProducts = this.products.filter(product =>
            product.name.toLowerCase().includes(medication)
          );

          matchingProducts.forEach(product => {
            suggestions.push({
              productId: product.id,
              name: product.name,
              dosage: treatment.dosage,
              frequency: treatment.frequency,
              duration: treatment.maxDaily,
              instructions: `Para ${condition}: ${treatment.frequency}. ${treatment.maxDaily} por dia.`,
              warnings: treatment.warnings
            });
          });
        }
      }
    }

    return suggestions;
  }

  // Check for medication allergies
  private hasAllergy(medication: string, allergies: string[]): boolean {
    return allergies.some(allergy => {
      const allergyMeds = ALLERGIES_DATABASE[allergy.toLowerCase() as keyof typeof ALLERGIES_DATABASE];
      return allergyMeds?.some(med => medication.toLowerCase().includes(med));
    });
  }

  // Generate medication instructions
  private generateInstructions(productName: string, medication: PrescriptionAnalysis['medications'][0]): string {
    let instructions = `Tomar ${medication.dosage} ${medication.frequency}`;
    
    if (medication.duration) {
      instructions += ` por ${medication.duration}`;
    }

    // Add specific instructions based on medication type
    if (productName.toLowerCase().includes('antibiótico') || productName.toLowerCase().includes('amoxicilina')) {
      instructions += '. IMPORTANTE: Complete todo o tratamento mesmo que se sinta melhor.';
    }

    if (productName.toLowerCase().includes('paracetamol')) {
      instructions += '. Pode ser tomado com ou sem alimentos.';
    }

    if (productName.toLowerCase().includes('ibuprofeno')) {
      instructions += '. Tomar preferencialmente com alimentos para proteger o estômago.';
    }

    return instructions;
  }

  // Get warnings for specific products
  private getProductWarnings(productName: string): string[] {
    const warnings: string[] = [];

    if (productName.toLowerCase().includes('antibiótico')) {
      warnings.push('Não interromper o tratamento antes do prazo indicado');
      warnings.push('Pode causar alterações na flora intestinal');
    }

    if (productName.toLowerCase().includes('anti-inflamatório') || productName.toLowerCase().includes('ibuprofeno')) {
      warnings.push('Evitar se tem problemas gástricos');
      warnings.push('Não usar por período prolongado sem orientação médica');
    }

    if (productName.toLowerCase().includes('paracetamol')) {
      warnings.push('Não exceder 4g por dia');
      warnings.push('Evitar consumo de álcool durante o tratamento');
    }

    return warnings;
  }

  // Generate general warnings
  private generateWarnings(medications: PrescriptionAnalysis['medications']): string[] {
    const warnings = [
      'Sempre siga as instruções do seu médico ou farmacêutico',
      'Não altere as doses sem orientação profissional',
      'Informe seu médico sobre outros medicamentos que esteja tomando'
    ];

    if (medications.some(med => med.name.toLowerCase().includes('antibiótico'))) {
      warnings.push('Complete todo o curso de antibióticos mesmo que se sinta melhor');
    }

    return warnings;
  }

  // Check for common allergies
  private checkForCommonAllergies(medications: PrescriptionAnalysis['medications']): string[] {
    const allergiesFound: string[] = [];

    medications.forEach(med => {
      Object.entries(ALLERGIES_DATABASE).forEach(([allergy, relatedMeds]) => {
        if (relatedMeds.some(relatedMed => 
          med.name.toLowerCase().includes(relatedMed.toLowerCase())
        )) {
          if (!allergiesFound.includes(allergy)) {
            allergiesFound.push(allergy);
          }
        }
      });
    });

    return allergiesFound;
  }

  // Get detailed product information
  async getProductInfo(productId: string): Promise<any> {
    const product = this.products.find(p => p.id === productId);
    
    if (!product) {
      return null;
    }

    return {
      name: product.name,
      manufacturer: product.manufacturer,
      description: product.description,
      composition: this.getComposition(product.name),
      action: this.getAction(product.name),
      expiryInfo: this.getExpiryInfo(product),
      ageRecommendations: this.getAgeRecommendations(product.name),
      contraindications: this.getContraindications(product.name),
      sideEffects: this.getSideEffects(product.name)
    };
  }

  private getComposition(productName: string): string {
    // In a real app, this would come from a comprehensive drug database
    if (productName.toLowerCase().includes('paracetamol')) {
      return 'Paracetamol 500mg, excipientes: amido, celulose microcristalina';
    }
    return 'Consulte a bula para composição completa';
  }

  private getAction(productName: string): string {
    if (productName.toLowerCase().includes('paracetamol')) {
      return 'Analgésico e antipirético. Age reduzindo a dor e a febre.';
    }
    if (productName.toLowerCase().includes('ibuprofeno')) {
      return 'Anti-inflamatório não esteroidal. Reduz dor, inflamação e febre.';
    }
    return 'Consulte a bula para informações sobre mecanismo de ação';
  }

  private getExpiryInfo(product: Product): string {
    if (product.batches && product.batches.length > 0) {
      const nearestExpiry = product.batches
        .sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime())[0];
      return `Validade mais próxima: ${new Date(nearestExpiry.expiry_date).toLocaleDateString('pt-BR')}`;
    }
    return 'Informação de validade não disponível';
  }

  private getAgeRecommendations(productName: string): string {
    if (productName.toLowerCase().includes('paracetamol')) {
      return 'Adultos e crianças acima de 12 anos: 500mg. Crianças: consultar pediatra para dosagem adequada.';
    }
    return 'Consulte profissional de saúde para dosagem por idade';
  }

  private getContraindications(productName: string): string[] {
    const contraindications: string[] = [];
    
    if (productName.toLowerCase().includes('aspirina')) {
      contraindications.push('Alergia ao ácido acetilsalicílico');
      contraindications.push('Úlcera péptica ativa');
      contraindications.push('Crianças com viroses (risco de Síndrome de Reye)');
    }

    if (productName.toLowerCase().includes('ibuprofeno')) {
      contraindications.push('Úlcera péptica ativa');
      contraindications.push('Insuficiência renal grave');
      contraindications.push('Último trimestre de gravidez');
    }

    return contraindications.length > 0 ? contraindications : ['Consulte a bula para contraindicações'];
  }

  private getSideEffects(productName: string): string[] {
    const sideEffects: string[] = [];
    
    if (productName.toLowerCase().includes('paracetamol')) {
      sideEffects.push('Raramente: reações alérgicas, alterações hepáticas em doses elevadas');
    }

    if (productName.toLowerCase().includes('ibuprofeno')) {
      sideEffects.push('Possíveis: dor de estômago, náusea, tontura');
      sideEffects.push('Raros: úlcera gástrica, reações alérgicas');
    }

    return sideEffects.length > 0 ? sideEffects : ['Consulte a bula para efeitos adversos'];
  }
}

// Export singleton instance
export const aiAssistant = new AIAssistantService();
