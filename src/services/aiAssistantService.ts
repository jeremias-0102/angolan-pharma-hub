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

// Base de conhecimento médico adaptada para Angola
const MEDICAL_CONDITIONS = {
  'dor de cabeça': {
    medications: ['paracetamol', 'ibuprofeno'],
    dosage: '500mg',
    frequency: 'de 6 em 6 horas',
    maxDaily: '3-4 doses',
    warnings: ['Não exceder a dose recomendada, meu irmão', 'Se a dor persistir mais de 3 dias, procura um médico']
  },
  'febre': {
    medications: ['paracetamol', 'dipirona'],
    dosage: '500mg',
    frequency: 'de 6 em 6 horas',
    maxDaily: '4 doses',
    warnings: ['Bebe bastante água, é importante', 'Se a febre não baixar, vai ao hospital']
  },
  'gripe': {
    medications: ['paracetamol', 'vitamina c'],
    dosage: '500mg paracetamol, 1g vitamina C',
    frequency: 'paracetamol de 6h em 6h, vitamina C uma vez por dia',
    maxDaily: '4 doses paracetamol, 1 dose vitamina C',
    warnings: ['Descansa bem, mano', 'Bebe muita água e sumos naturais', 'Se piorar, não hesites em ir ao médico']
  },
  'dor muscular': {
    medications: ['ibuprofeno', 'diclofenaco'],
    dosage: '400mg',
    frequency: 'de 8 em 8 horas',
    maxDaily: '3 doses',
    warnings: ['Toma com comida para proteger o estômago', 'Se tens problemas de estômago, não uses']
  },
  'malária': {
    medications: ['artesunato', 'coartem'],
    dosage: 'Conforme prescrição médica',
    frequency: 'Seguir estritamente o protocolo médico',
    maxDaily: 'Conforme prescrição',
    warnings: ['URGENTE: Vai ao hospital imediatamente', 'Malária é grave, não brinques com isso', 'Completa todo o tratamento mesmo que te sintas melhor']
  }
};

// Base de alergias comum em Angola
const ALLERGIES_DATABASE = {
  'aspirina': ['ácido acetilsalicílico', 'salicilatos'],
  'penicilina': ['amoxicilina', 'ampicilina', 'penicilina G'],
  'sulfa': ['sulfametoxazol', 'sulfadiazina'],
  'dipirona': ['metamizol', 'novalgina']
};

export class AIAssistantService {
  private products: Product[] = [];
  private conversationContext: string[] = [];

  constructor() {
    this.loadProducts();
  }

  private async loadProducts() {
    try {
      this.products = await getAllProducts();
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  }

  // Analisar receita médica com melhor IA
  async analyzePrescription(prescriptionText: string): Promise<PrescriptionAnalysis> {
    console.log('Analisando receita médica...');
    
    const medications = this.extractMedicationsFromText(prescriptionText);
    const recommendations = await this.getProductRecommendations(medications);
    const warnings = this.generateWarnings(medications);
    const allergiesCheck = this.checkForCommonAllergies(medications);

    // Adicionar ao contexto da conversa
    this.conversationContext.push(`Analisou receita com medicamentos: ${medications.map(m => m.name).join(', ')}`);

    return {
      medications,
      recommendations,
      warnings,
      allergiesCheck
    };
  }

  // Extrair medicamentos do texto com melhor precisão
  private extractMedicationsFromText(text: string): PrescriptionAnalysis['medications'] {
    const medications: PrescriptionAnalysis['medications'] = [];
    const lines = text.split('\n');

    lines.forEach(line => {
      // Padrões mais robustos para reconhecer medicamentos
      const patterns = [
        /([A-Za-zÀ-ÿ\s]+)\s+(\d+\s*mg|mg)\s*[,-]?\s*([\d\sx]+(?:ao dia|vez|vezes|horas?|manhã|tarde|noite))/i,
        /([A-Za-zÀ-ÿ\s]+)\s+(\d+\s*ml|ml)\s*[,-]?\s*([\d\sx]+(?:ao dia|vez|vezes|horas?|manhã|tarde|noite))/i,
        /([A-Za-zÀ-ÿ\s]+)\s+(\d+\s*comprimidos?|comp\.?)\s*[,-]?\s*([\d\sx]+(?:ao dia|vez|vezes|horas?|manhã|tarde|noite))/i
      ];

      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          medications.push({
            name: match[1].trim(),
            dosage: match[2],
            frequency: match[3],
            duration: this.extractDuration(line)
          });
          break;
        }
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

    // Adicionar ao contexto
    this.conversationContext.push(`Consultou sobre sintomas: ${symptoms}`);

    console.log(`Analisando sintomas: ${symptoms}`);

    // Verificar condições médicas
    for (const [condition, treatment] of Object.entries(MEDICAL_CONDITIONS)) {
      if (symptomsLower.includes(condition)) {
        console.log(`Condição identificada: ${condition}`);
        
        for (const medication of treatment.medications) {
          // Verificar alergias
          if (this.hasAllergy(medication, allergies)) {
            console.log(`Medicamento ${medication} evitado devido a alergias`);
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
              instructions: this.generateAngolanInstructions(condition, treatment, medication),
              warnings: treatment.warnings
            });
          });
        }
      }
    }

    // Se não encontrou nada específico, dar sugestões gerais
    if (suggestions.length === 0) {
      suggestions.push({
        productId: '',
        name: 'Consulta Médica',
        dosage: 'Não aplicável',
        frequency: 'O mais rápido possível',
        duration: 'Conforme necessário',
        instructions: 'Mano, esses sintomas que me contaste não consigo identificar bem. É melhor ires ao médico para uma consulta adequada. A saúde não é brincadeira!',
        warnings: ['Não te automediques', 'Procura ajuda médica profissional', 'Se for urgente, vai ao hospital']
      });
    }

    return suggestions;
  }

  // Gerar instruções em português angolano
  private generateAngolanInstructions(condition: string, treatment: any, medication: string): string {
    let instructions = `Para ${condition}: toma ${treatment.dosage} ${treatment.frequency}`;
    
    if (treatment.maxDaily) {
      instructions += `, máximo ${treatment.maxDaily} por dia`;
    }

    // Instruções específicas em linguagem angolana
    if (medication.includes('antibiótico') || medication.includes('amoxicilina')) {
      instructions += '. ATENÇÃO meu irmão: completa todo o tratamento mesmo que te sintas melhor, senão a doença pode voltar mais forte!';
    }

    if (medication.includes('paracetamol')) {
      instructions += '. Podes tomar com ou sem comida, não há problema.';
    }

    if (medication.includes('ibuprofeno')) {
      instructions += '. É melhor tomares com comida para proteger o estômago, está bem?';
    }

    return instructions;
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

  // Gerar avisos em português angolano
  private generateWarnings(medications: PrescriptionAnalysis['medications']): string[] {
    const warnings = [
      'Segue sempre as instruções do médico ou farmacêutico, mano',
      'Não alteres as doses por tua conta',
      'Informa o médico sobre outros medicamentos que estás a tomar'
    ];

    if (medications.some(med => med.name.toLowerCase().includes('antibiótico'))) {
      warnings.push('Completa todo o curso de antibióticos mesmo que te sintas melhor - é muito importante!');
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

  // Chat conversacional melhorado
  async chatResponse(message: string): Promise<string> {
    const messageLower = message.toLowerCase();
    
    // Adicionar mensagem ao contexto
    this.conversationContext.push(`Utilizador: ${message}`);
    
    // Manter apenas as últimas 10 interações para não sobrecarregar
    if (this.conversationContext.length > 10) {
      this.conversationContext = this.conversationContext.slice(-10);
    }

    // Respostas contextuais em português angolano
    if (messageLower.includes('olá') || messageLower.includes('oi') || messageLower.includes('bom dia')) {
      return 'Olá meu irmão! Tudo bem? Sou o teu assistente farmacêutico. Como posso ajudar-te hoje?';
    }

    if (messageLower.includes('dor') && messageLower.includes('cabeça')) {
      return 'Eish, dor de cabeça é chato mesmo! Posso sugerir paracetamol 500mg, tomas de 6 em 6 horas. Mas se a dor persistir mais de 3 dias, é melhor ires ao médico, está bem?';
    }

    if (messageLower.includes('febre')) {
      return 'Febre pode ser sinal de várias coisas. Paracetamol ou dipirona podem ajudar a baixar. Importante: bebe muita água e descansa. Se a febre não baixar ou subir muito, vai ao hospital urgente!';
    }

    if (messageLower.includes('gripe') || messageLower.includes('constipação')) {
      return 'Gripe é comum, mano. Recomendo paracetamol para a dor e febre, vitamina C para fortalecer as defesas. Descansa bem, bebe muita água e sumos naturais. Se piorar, não hesites em procurar o médico.';
    }

    if (messageLower.includes('malária')) {
      return 'ATENÇÃO! Malária é muito séria em Angola. Se suspeitás que é malária, vai ao hospital IMEDIATAMENTE para fazer o teste. Não brinques com isso, pode ser fatal se não for tratada a tempo!';
    }

    if (messageLower.includes('obrigado') || messageLower.includes('obrigada')) {
      return 'De nada, meu irmão! Estou aqui para ajudar sempre que precisares. Cuida-te bem e não hesites em voltar se tiveres dúvidas!';
    }

    // Resposta padrão mais humanizada
    return 'Desculpa, não entendi bem a tua pergunta. Podes ser mais específico sobre os sintomas ou medicamento que procuras? Estou aqui para ajudar com informações sobre saúde e medicamentos. Se for urgente, procura um médico imediatamente!';
  }
}

// Exportar instância singleton
export const aiAssistant = new AIAssistantService();
