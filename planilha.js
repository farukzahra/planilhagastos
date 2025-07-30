/**
 * Processa planilha de gastos - Categoriza e formata dados de transações
 * Remove colunas A e C, move D para A, formata B e aplica categorizações
 */
function processSpreadsheet() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    
    // Validação de dados
    if (!validateData(data)) {
      return;
    }
    
    var newData = processData(data);
    
    // Atualiza a planilha
    updateSpreadsheet(sheet, newData);
    
    Logger.log("Processamento concluído com sucesso!");
    
  } catch (error) {
    Logger.log("Erro durante o processamento: " + error.toString());
  }
}

/**
 * Valida se os dados da planilha são suficientes
 */
function validateData(data) {
  if (!data || data.length < 2) {
    Logger.log("Erro: Planilha deve ter pelo menos 2 linhas (incluindo cabeçalho)");
    return false;
  }
  
  if (data[0].length < 4) {
    Logger.log("Erro: Planilha deve ter pelo menos 4 colunas");
    return false;
  }
  
  return true;
}

/**
 * Mapeamento de categorias padronizadas
 */
function getCategoryMapping() {
  return {
    // P - Previsto
    "P": /previsto|PREVISTO/i,
    
    // A - Alimentação
    "A": /cruz|CRUZ|Cruz|RESTAURANTE|PIZZARIA|ESFIHARIA|SUSHI|TACOS|MEXICANOS|BAHIA|LANCHES|COME COME|GULOSO|ENCANTOS DO JARDIM|VO JOAO|BORTOLAN|CAFE DOCELANDIA|PEDACINHO DA BAHIA|IMIX TACOS MEXICANOS|CASA CHINA|RESTAURANTE VO JOAO|POPEYES|PAO|Casadepaobethelem|PADARIA|Burger King|BURGER|pastel pao|Josiane da Silva Bloc|Jacomar|Festval|FESTVAL|SUPERMERCADO HELLEN|TUCUPI SUPERMERCADOS|armazem|ARMAZEM|Condor|SUPERMERCADO HELLEN/i,
    
    // F - Farmácia (remédio etc.)
    "F": /Raia|farmácia|farmacia|nissei|Nissei|Panvel|CURITIBA|UNIMED|RD SAUDE|SAUDE|SJP COSMETICOS|COSMETICOS/i,
    
    // C - Carteira (saque)
    "C": /Transferência enviada|Transferência recebida|Transferência Recebida|Débito em conta|Pagamento de fatura|Aplicação RDB|Resgate RDB|Reembolso recebido|PIX|Pix/i,
    
    // D - Diversão (passeios)
    "D": /RENNER|EFATA LOJAS DE DEPARTA|LOJAS AMERICANAS|VULCABRAS|ARTIGOS ESPORTIVOS|PET MARC|PET|FLORICULTURA|FLORA VIV|VinhosVoVito|Vinhos|Estacionamento|ALLPARK|CITY PARK/i,
    
    // G - Gasolina
    "G": /posto|Posto|POSTO/i,
    
    // I - Investimento
    "I": /Aplicação RDB|Resgate RDB/i,
    
    // R - Rima Gastos
    "R": /Rima Awada Zahra|RIMA/i
  };
}

/**
 * Categoriza um valor baseado no mapeamento
 */
function categorizeValue(value) {
  if (!value || typeof value !== 'string') {
    return value;
  }
  
  var mapping = getCategoryMapping();
  var categoryNames = {
    "P": "Previsto",
    "A": "Alimentação", 
    "F": "Farmácia",
    "C": "Carteira",
    "D": "Diversão",
    "G": "Gasolina",
    "I": "Investimento",
    "R": "Rima Gastos"
  };
  
  for (var category in mapping) {
    if (mapping[category].test(value)) {
      // Se for carteira (transferência), extrai o nome do destinatário/remetente
      if (category === "C") {
        var transferName = extractTransferName(value);
        return "[" + categoryNames[category] + "] - " + transferName;
      }
      return "[" + categoryNames[category] + "] - " + getSummary(value);
    }
  }
  
  return "[Não Categorizado] - " + getSummary(value); // Retorna categoria não categorizado com resumo
}

/**
 * Cria um resumo do texto original
 */
function getSummary(text) {
  if (!text || text.length <= 50) {
    return text;
  }
  
  // Remove caracteres especiais e números
  var cleanText = text.replace(/[\d\.\/\-]+/g, '').trim();
  
  // Pega as primeiras palavras até 50 caracteres
  var words = cleanText.split(' ').slice(0, 5);
  var summary = words.join(' ').substring(0, 50);
  
  return summary + (summary.length >= 50 ? '...' : '');
}

/**
 * Extrai o nome do destinatário/remetente de transferências
 */
function extractTransferName(transferText) {
  // Padrões para extrair nomes de transferências
  var patterns = [
    // Transferência enviada pelo Pix - NOME - CNPJ/CPF
    /Transferência enviada pelo Pix - ([^-]+) -/i,
    // Transferência recebida pelo Pix - NOME - CNPJ/CPF  
    /Transferência recebida pelo Pix - ([^-]+) -/i,
    // Transferência Recebida - NOME - CNPJ/CPF
    /Transferência Recebida - ([^-]+) -/i,
    // Transferência enviada pelo Pix - NOME
    /Transferência enviada pelo Pix - ([^-]+)$/i,
    // Transferência recebida pelo Pix - NOME
    /Transferência recebida pelo Pix - ([^-]+)$/i
  ];
  
  for (var i = 0; i < patterns.length; i++) {
    var match = transferText.match(patterns[i]);
    if (match && match[1]) {
      var name = match[1].trim();
      // Remove CNPJ/CPF se estiver no nome
      name = name.replace(/[\d\.\/\-]+/g, '').trim();
      return name || "transferencia";
    }
  }
  
  return "transferencia";
}

/**
 * Processa os dados da planilha
 */
function processData(data) {
  var newData = [];
  var mapping = getCategoryMapping();
  
  // Adiciona cabeçalhos
  newData.push(["Categoria", "Valor"]);
  
  // Processa cada linha (pula o cabeçalho se existir)
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    
    // Valida se a linha tem dados suficientes
    if (row.length < 4) {
      Logger.log("Linha " + (i + 1) + " ignorada - dados insuficientes");
      continue;
    }
    
    var colAValue = row[3]; // Coluna D vai para A
    var colBValue = row[1]; // Coluna B original
    
    // Formata o valor da coluna B (substitui . por ,)
    if (colBValue !== null && colBValue !== undefined) {
      colBValue = colBValue.toString().replace(/\./g, ",");
    }
    
    // Categoriza o valor da coluna A
    colAValue = categorizeValue(colAValue);
    
    newData.push([colAValue, colBValue]);
  }
  
  return newData;
}

/**
 * Atualiza a planilha com os novos dados
 */
function updateSpreadsheet(sheet, newData) {
  if (!newData || newData.length === 0) {
    Logger.log("Nenhum dado para processar");
    return;
  }
  
  // Limpa a planilha
  sheet.clear();
  
  // Escreve os novos dados
  var range = sheet.getRange(1, 1, newData.length, newData[0].length);
  range.setValues(newData);
  
  // Formata a planilha
  formatSpreadsheet(sheet, newData.length);
}

/**
 * Formata a planilha
 */
function formatSpreadsheet(sheet, rowCount) {
  if (rowCount <= 1) return;
  
  // Formata cabeçalho
  var headerRange = sheet.getRange(1, 1, 1, 2);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#f0f0f0");
  
  // Alinha coluna A à direita
  var colARange = sheet.getRange(2, 1, rowCount - 1, 1);
  colARange.setHorizontalAlignment("right");
  
  // Formata coluna B (valores)
  var colBRange = sheet.getRange(2, 2, rowCount - 1, 1);
  colBRange.setHorizontalAlignment("right");
  
  // Ajusta largura das colunas
  sheet.autoResizeColumns(1, 2);
}
  