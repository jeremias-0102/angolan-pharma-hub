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

interface MedicalConsultationResult {
  message: string;
  sessionUpdate?: Partial<UserSession>;
  data?: {
    medications?: MedicationSuggestion[];
    searchResults?: any;
    nextQuestions?: string[];
  };
}

interface UserSession {
  symptoms: string[];
  allergies: string[];
  currentMedications: string[];
  age: number | null;
  consultationStage: 'initial' | 'symptoms' | 'details' | 'recommendations' | 'pharmacy_search';
  patientInfo: {
    gender?: 'M' | 'F';
    weight?: number;
    chronicConditions?: string[];
    lastSymptomOnset?: string;
  };
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

  // Nova função principal para consulta médica estruturada
  async conductMedicalConsultation(userMessage: string, session: UserSession): Promise<MedicalConsultationResult> {
    const messageLower = userMessage.toLowerCase();
    
    console.log(`Consulta médica - Estágio: ${session.consultationStage}`);
    console.log(`Mensagem: ${userMessage}`);
    
    switch (session.consultationStage) {
      case 'initial':
        return this.handleInitialContact(userMessage, session);
      
      case 'symptoms':
        return this.handleSymptomsCollection(userMessage, session);
      
      case 'details':
        return this.handleDetailsCollection(userMessage, session);
      
      case 'recommendations':
        return this.handleRecommendations(userMessage, session);
      
      case 'pharmacy_search':
        return this.handlePharmacySearch(userMessage, session);
      
      default:
        return this.handleGeneralQuery(userMessage, session);
    }
  }

  private async handleInitialContact(userMessage: string, session: UserSession): Promise<MedicalConsultationResult> {
    const messageLower = userMessage.toLowerCase();
    
    // Detectar se já mencionou sintomas
    const symptomsDetected = this.detectSymptoms(userMessage);
    
    if (symptomsDetected.length > 0) {
      const updatedSession = {
        ...session,
        symptoms: [...session.symptoms, ...symptomsDetected],
        consultationStage: 'details' as const
      };
      
      let response = `Entendi meu irmão, tens ${symptomsDetected.join(', ')}. `;
      response += `Para te ajudar melhor, preciso de mais algumas informações:\n\n`;
      response += `1. Há quanto tempo sentes esses sintomas?\n`;
      response += `2. Qual é a tua idade aproximada?\n`;
      response += `3. Tens alguma alergia a medicamentos?\n`;
      response += `4. Estás a tomar algum medicamento actualmente?\n\n`;
      response += `Podes responder uma de cada vez ou tudo junto.`;
      
      return {
        message: response,
        sessionUpdate: updatedSession
      };
    }
    
    // Cumprimentos gerais
    if (messageLower.includes('olá') || messageLower.includes('oi') || messageLower.includes('bom dia')) {
      return {
        message: `Olá meu irmão! Como farmacêutico, posso ajudar-te com várias coisas:\n\n💊 Identificar medicamentos para sintomas\n🔍 Procurar preços em farmácias\n📋 Analisar receitas médicas\n⚠️ Verificar interações e alergias\n\nComo te sentes hoje? Tens algum sintoma ou precisas de algum medicamento específico?`,
        sessionUpdate: { consultationStage: 'symptoms' }
      };
    }
    
    return {
      message: `Olá! Sou o teu farmacêutico virtual. Podes contar-me:\n- Que sintomas sentes\n- Que medicamento procuras\n- Mostrar-me uma receita médica\n\nComo posso ajudar-te hoje?`,
      sessionUpdate: { consultationStage: 'symptoms' }
    };
  }

  private async handleSymptomsCollection(userMessage: string, session: UserSession): Promise<MedicalConsultationResult> {
    const symptoms = this.detectSymptoms(userMessage);
    
    if (symptoms.length > 0) {
      const updatedSymptoms = [...new Set([...session.symptoms, ...symptoms])];
      
      const response = `Anotei que tens: ${updatedSymptoms.join(', ')}.\n\nPara te dar o melhor conselho, preciso saber:\n1. Há quanto tempo começaram esses sintomas?\n2. Qual é a tua idade?\n3. Tens alergias a medicamentos?\n\nPodes responder?`;
      
      return {
        message: response,
        sessionUpdate: {
          symptoms: updatedSymptoms,
          consultationStage: 'details'
        }
      };
    }
    
    return {
      message: `Não consegui identificar sintomas específicos. Podes descrever melhor como te sentes? Por exemplo:\n- "Tenho dor de cabeça"\n- "Estou com febre"\n- "Sinto dores no estômago"\n\nOu podes dizer-me que medicamento procuras.`,
    };
  }

  private async handleDetailsCollection(userMessage: string, session: UserSession): Promise<MedicalConsultationResult> {
    const messageLower = userMessage.toLowerCase();
    const updatedSession = { ...session };
    
    // Extrair idade
    const ageMatch = userMessage.match(/(\d+)\s*anos?/i);
    if (ageMatch) {
      updatedSession.age = parseInt(ageMatch[1]);
    }
    
    // Extrair alergias
    if (messageLower.includes('alérgico') || messageLower.includes('alergia')) {
      const allergyMatch = userMessage.match(/alérgico?\s+a?\s*([^.!?]+)/i);
      if (allergyMatch) {
        updatedSession.allergies = [...session.allergies, allergyMatch[1].trim()];
      }
    }
    
    // Extrair duração dos sintomas
    if (messageLower.includes('dia') || messageLower.includes('semana') || messageLower.includes('hora')) {
      updatedSession.patientInfo = {
        ...session.patientInfo,
        lastSymptomOnset: userMessage
      };
    }
    
    // Se temos informação suficiente, passar para recomendações
    if (session.symptoms.length > 0 && (updatedSession.age || session.age)) {
      updatedSession.consultationStage = 'recommendations';
      
      const recommendations = await this.generateRecommendations(updatedSession);
      return {
        message: recommendations.message,
        sessionUpdate: updatedSession,
        data: recommendations.data
      };
    }
    
    // Ainda precisamos de mais informações
    let response = `Obrigado pelas informações! `;
    if (!updatedSession.age && !session.age) {
      response += `Ainda preciso saber a tua idade. `;
    }
    if (session.symptoms.length === 0) {
      response += `Podes descrever melhor os sintomas? `;
    }
    
    return {
      message: response + `Estas informações ajudam-me a sugerir o tratamento mais seguro para ti.`,
      sessionUpdate: updatedSession
    };
  }

  private async generateRecommendations(session: UserSession): Promise<MedicalConsultationResult> {
    const suggestions = await this.suggestTreatment(
      session.symptoms.join(', '),
      session.allergies
    );
    
    let response = `Com base nos sintomas que descreveste (${session.symptoms.join(', ')}), `;
    
    if (session.age) {
      response += `e na tua idade (${session.age} anos), `;
    }
    
    response += `recomendo:\n\n`;
    
    if (suggestions.length > 0) {
      suggestions.forEach((suggestion, index) => {
        response += `${index + 1}. **${suggestion.name}**\n`;
        response += `   • Dosagem: ${suggestion.dosage}\n`;
        response += `   • Como tomar: ${suggestion.frequency}\n`;
        response += `   • Duração: ${suggestion.duration}\n`;
        response += `   • Instruções: ${suggestion.instructions}\n`;
        
        if (suggestion.warnings.length > 0) {
          response += `   ⚠️ Atenção: ${suggestion.warnings.join(', ')}\n`;
        }
        response += `\n`;
      });
      
      response += `Queres que eu procure esses medicamentos nas farmácias de Luanda e te diga os preços? Posso também ajudar-te a fazer o pedido.`;
      
      return {
        message: response,
        sessionUpdate: { consultationStage: 'pharmacy_search' },
        data: { medications: suggestions }
      };
    } else {
      response += `Para os sintomas que descreveste, recomendo que consultes um médico pessoalmente. `;
      response += `Entretanto, posso procurar medicamentos básicos como paracetamol para alívio temporário.\n\n`;
      response += `Queres que procure nas farmácias de Luanda?`;
      
      return {
        message: response,
        sessionUpdate: { consultationStage: 'pharmacy_search' }
      };
    }
  }

  private async handlePharmacySearch(userMessage: string, session: UserSession): Promise<MedicalConsultationResult> {
    const { pharmacySearchService } = await import('./pharmacySearchService');
    
    const messageLower = userMessage.toLowerCase();
    
    if (messageLower.includes('sim') || messageLower.includes('procura') || messageLower.includes('preço')) {
      // Procurar o primeiro medicamento das recomendações
      const medicationToSearch = session.symptoms.includes('dor de cabeça') ? 'Paracetamol' :
                                session.symptoms.includes('febre') ? 'Paracetamol' :
                                session.symptoms.includes('gripe') ? 'Paracetamol' : 'Paracetamol';
      
      const searchResults = await pharmacySearchService.searchMedication(medicationToSearch);
      const formattedResults = pharmacySearchService.formatSearchResults(searchResults, medicationToSearch);
      
      return {
        message: `🔍 Procurei ${medicationToSearch} nas farmácias de Luanda...\n\n${formattedResults}`,
        data: { searchResults }
      };
    }
    
    // Procura por medicamento específico
    const medicationMatch = userMessage.match(/(?:procura|quero|preciso)\s+(?:de\s+)?([a-záéíóúâêîôûãõç\s]+)/i);
    if (medicationMatch) {
      const medicationName = medicationMatch[1].trim();
      const searchResults = await pharmacySearchService.searchMedication(medicationName);
      const formattedResults = pharmacySearchService.formatSearchResults(searchResults, medicationName);
      
      return {
        message: formattedResults,
        data: { searchResults }
      };
    }
    
    return {
      message: `Que medicamento queres que procure nas farmácias? Ou preferes que procure os medicamentos que recomendei baseado nos teus sintomas?`
    };
  }

  private handleGeneralQuery(userMessage: string, session: UserSession): Promise<MedicalConsultationResult> {
    return Promise.resolve({
      message: `Como farmacêutico, posso ajudar-te com medicamentos e sintomas. Queres fazer uma consulta sobre como te sentes ou procurar um medicamento específico?`
    });
  }

  private detectSymptoms(message: string): string[] {
    const messageLower = message.toLowerCase();
    const symptoms: string[] = [];
    
    // Dores
    if (messageLower.includes('dor de cabeça') || messageLower.includes('cefaleia')) symptoms.push('dor de cabeça');
    if (messageLower.includes('dor de estômago') || messageLower.includes('dor abdominal')) symptoms.push('dor de estômago');
    if (messageLower.includes('dor muscular') || messageLower.includes('dores no corpo')) symptoms.push('dor muscular');
    if (messageLower.includes('dor de garganta')) symptoms.push('dor de garganta');
    if (messageLower.includes('dor nas costas')) symptoms.push('dor nas costas');
    
    // Sintomas gerais
    if (messageLower.includes('febre') || messageLower.includes('febril')) symptoms.push('febre');
    if (messageLower.includes('tosse')) symptoms.push('tosse');
    if (messageLower.includes('gripe') || messageLower.includes('constipação')) symptoms.push('gripe');
    if (messageLower.includes('náusea') || messageLower.includes('enjoo')) symptoms.push('náusea');
    if (messageLower.includes('diarreia')) symptoms.push('diarreia');
    if (messageLower.includes('vómito') || messageLower.includes('vomito')) symptoms.push('vómito');
    if (messageLower.includes('tontura') || messageLower.includes('vertigem')) symptoms.push('tontura');
    if (messageLower.includes('cansaço') || messageLower.includes('fadiga')) symptoms.push('cansaço');
    
    // Condições específicas
    if (messageLower.includes('malária') || messageLower.includes('paludismo')) symptoms.push('malária');
    if (messageLower.includes('hipertensão') || messageLower.includes('pressão alta')) symptoms.push('hipertensão');
    if (messageLower.includes('diabetes')) symptoms.push('diabetes');
    if (messageLower.includes('asma')) symptoms.push('asma');
    
    return symptoms;
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
      return 'Febre pode ser sinal de várias coisas. Paracetamol ou dipirona podem ajudar a baixar. Importante: bebe bastante água e descansa. Se a febre não baixar ou subir muito, vai ao hospital urgente!';
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
