
interface PharmacyProduct {
  name: string;
  price: number;
  availability: boolean;
  pharmacy: string;
  address: string;
  phone: string;
  distance?: string;
}

interface PharmacySearchResult {
  found: boolean;
  localStock: PharmacyProduct[];
  externalPharmacies: PharmacyProduct[];
  alternatives: PharmacyProduct[];
}

// Farmácias angolanas conhecidas
const ANGOLA_PHARMACIES = [
  {
    name: 'Farmácia Popular',
    website: 'farmaciapopular.co.ao',
    locations: [
      { address: 'Rua Salvador Allende, Maianga, Luanda', phone: '+244 222 334 455' },
      { address: 'Rua Amílcar Cabral, Ingombota, Luanda', phone: '+244 222 334 456' },
      { address: 'Talatona, Luanda Sul', phone: '+244 222 334 457' }
    ]
  },
  {
    name: 'MonizSilva',
    website: 'monizsilva.co.ao',
    locations: [
      { address: 'Rua Rainha Ginga, Centro, Luanda', phone: '+244 222 445 566' },
      { address: 'Bairro Azul, Benfica, Luanda', phone: '+244 222 445 567' },
      { address: 'Via Expressa, Viana', phone: '+244 222 445 568' }
    ]
  },
  {
    name: 'Mecofarma',
    website: 'mecofarma.co.ao',
    locations: [
      { address: 'Largo do Kinaxixi, Luanda', phone: '+244 222 556 677' },
      { address: 'Rua dos Coqueiros, Alvalade', phone: '+244 222 556 678' }
    ]
  },
  {
    name: 'Appy Saúde',
    website: 'appysaude.co.ao',
    locations: [
      { address: 'Rua Che Guevara, Maianga', phone: '+244 222 667 788' },
      { address: 'Centralidade do Kilamba', phone: '+244 222 667 789' }
    ]
  }
];

// Simular busca em farmácias (em produção seria integração real com APIs)
const simulatePharmacySearch = async (medicationName: string): Promise<PharmacyProduct[]> => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const results: PharmacyProduct[] = [];
  
  // Gerar resultados aleatórios baseados no medicamento
  ANGOLA_PHARMACIES.forEach(pharmacy => {
    pharmacy.locations.forEach(location => {
      // 70% chance de ter o medicamento
      if (Math.random() > 0.3) {
        // Preços típicos em Angola (em Kwanzas)
        const basePrice = getBasePriceForMedication(medicationName);
        const variation = Math.random() * 0.4 - 0.2; // ±20% variation
        const price = Math.round(basePrice * (1 + variation));
        
        results.push({
          name: medicationName,
          price: price,
          availability: true,
          pharmacy: pharmacy.name,
          address: location.address,
          phone: location.phone,
          distance: `${Math.round(Math.random() * 15 + 1)} km`
        });
      }
    });
  });
  
  return results;
};

const getBasePriceForMedication = (medicationName: string): number => {
  const lowerName = medicationName.toLowerCase();
  
  // Preços base em Kwanzas (baseados no mercado angolano)
  if (lowerName.includes('paracetamol')) return 850;
  if (lowerName.includes('ibuprofeno')) return 1200;
  if (lowerName.includes('amoxicilina')) return 2500;
  if (lowerName.includes('omeprazol')) return 3500;
  if (lowerName.includes('dipirona')) return 950;
  if (lowerName.includes('vitamina')) return 1800;
  if (lowerName.includes('antibiótico')) return 3000;
  if (lowerName.includes('anti-inflamatório')) return 1500;
  
  // Preço padrão para medicamentos não catalogados
  return 1500;
};

export class PharmacySearchService {
  async searchMedication(medicationName: string, userLocation?: string): Promise<PharmacySearchResult> {
    console.log(`Procurando ${medicationName} nas farmácias de Angola...`);
    
    try {
      // Buscar em farmácias externas
      const externalResults = await simulatePharmacySearch(medicationName);
      
      // Ordenar por preço
      externalResults.sort((a, b) => a.price - b.price);
      
      // Simular stock local (nossa farmácia)
      const hasLocalStock = Math.random() > 0.4; // 60% chance de ter em stock
      const localStock: PharmacyProduct[] = hasLocalStock ? [{
        name: medicationName,
        price: getBasePriceForMedication(medicationName),
        availability: true,
        pharmacy: 'BegjnpPharma',
        address: 'Loja Online - Entrega em Luanda',
        phone: '+244 900 000 000'
      }] : [];
      
      // Buscar alternativas (medicamentos similares)
      const alternatives = await this.findAlternatives(medicationName);
      
      return {
        found: externalResults.length > 0 || localStock.length > 0,
        localStock,
        externalPharmacies: externalResults,
        alternatives
      };
      
    } catch (error) {
      console.error('Erro na busca de farmácias:', error);
      return {
        found: false,
        localStock: [],
        externalPharmacies: [],
        alternatives: []
      };
    }
  }
  
  private async findAlternatives(medicationName: string): Promise<PharmacyProduct[]> {
    // Mapeamento de alternativas comuns
    const alternatives: { [key: string]: string[] } = {
      'paracetamol': ['Tylenol', 'Acetaminofeno', 'Panadol'],
      'ibuprofeno': ['Brufen', 'Nurofen', 'Advil'],
      'amoxicilina': ['Amoxil', 'Clavamox', 'Augmentin'],
      'omeprazol': ['Losec', 'Prilosec', 'Zegerid'],
      'dipirona': ['Novalgina', 'Metamizol', 'Analgin']
    };
    
    const lowerName = medicationName.toLowerCase();
    let alternativeNames: string[] = [];
    
    // Encontrar alternativas
    for (const [generic, brands] of Object.entries(alternatives)) {
      if (lowerName.includes(generic)) {
        alternativeNames = brands;
        break;
      }
    }
    
    if (alternativeNames.length === 0) return [];
    
    // Simular busca das alternativas
    const alternativeResults: PharmacyProduct[] = [];
    
    for (const altName of alternativeNames.slice(0, 2)) { // Máximo 2 alternativas
      const price = getBasePriceForMedication(altName);
      alternativeResults.push({
        name: altName,
        price: price,
        availability: true,
        pharmacy: 'BegjnpPharma',
        address: 'Disponível na nossa farmácia',
        phone: '+244 900 000 000'
      });
    }
    
    return alternativeResults;
  }
  
  formatSearchResults(results: PharmacySearchResult, medicationName: string): string {
    let message = '';
    
    if (results.localStock.length > 0) {
      message += `✅ **${medicationName}** está disponível na nossa farmácia!\n\n`;
      results.localStock.forEach(item => {
        message += `💊 **${item.name}**\n`;
        message += `💰 Preço: ${item.price.toLocaleString()} Kz\n`;
        message += `🚚 Entrega grátis em Luanda\n`;
        message += `📞 Para comprar: ${item.phone}\n\n`;
      });
      
      message += `Quer que eu te ajude a fazer o pedido agora mesmo?\n\n`;
    }
    
    if (results.externalPharmacies.length > 0) {
      if (results.localStock.length === 0) {
        message += `Não temos ${medicationName} em stock, mas encontrei nas seguintes farmácias:\n\n`;
      } else {
        message += `**Outras opções em Luanda:**\n\n`;
      }
      
      results.externalPharmacies.slice(0, 3).forEach((item, index) => {
        message += `${index + 1}. **${item.pharmacy}**\n`;
        message += `   💰 Preço: ${item.price.toLocaleString()} Kz\n`;
        message += `   📍 ${item.address}\n`;
        message += `   📞 ${item.phone}\n`;
        if (item.distance) message += `   🚗 Distância: ${item.distance}\n`;
        message += `\n`;
      });
    }
    
    if (results.alternatives.length > 0) {
      message += `**💡 Alternativas disponíveis:**\n\n`;
      results.alternatives.forEach(alt => {
        message += `• **${alt.name}** - ${alt.price.toLocaleString()} Kz\n`;
      });
      message += `\n`;
    }
    
    if (!results.found) {
      message = `Desculpa meu irmão, não encontrei ${medicationName} disponível nas farmácias que conheço em Luanda. Posso sugerir alternativas ou podes tentar contactar directamente as farmácias:\n\n`;
      
      message += `📞 **Farmácias para contactar:**\n`;
      ANGOLA_PHARMACIES.slice(0, 2).forEach(pharmacy => {
        message += `• ${pharmacy.name}: ${pharmacy.locations[0].phone}\n`;
      });
    }
    
    return message;
  }
}

export const pharmacySearchService = new PharmacySearchService();
