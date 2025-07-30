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
 * Mapeamento de categorias para facilitar manutenção
 */
function getCategoryMapping() {
  return {
    // Padrões para "cruz"
    "cruz": /cruz|CRUZ|Cruz/i,
    
    // Padrões para "gasolina" 
    "gasolina": /posto|Posto|POSTO/i,
    
    // Padrões para "diarista"
    "diarista": /Adriana Aparecida Cardoso/i,
    
    // Padrões para "farmácia"
    "farmácia": /Raia|farmácia|farmacia|nissei|Nissei|Panvel/i,
    
    // Padrões para "pastel pao"
    "pastel pao": /Josiane da Silva Bloc/i,
    
    // Padrões para "mercado jacomar"
    "mercado jacomar": /Jacomar/i,
    
    // Padrões para "popeyes pao"
    "popeyes pao": /POPEYES/i,
    
    // Padrões para "pao"
    "pao": /PAO|Casadepaobethelem/i,
    
    // Padrões para "burger pao"
    "burger pao": /Burger King|BURGER/i,
    
    // Padrões para "estacionamento"
    "estacionamento": /Estacionamento/i,
    
    // Padrões para "mercado Festval"
    "mercado Festval": /Festval|FESTVAL/i,
    
    // Padrões para "mercado Armazem"
    "mercado Armazem": /armazem|ARMAZEM/i,
    
    // Padrões para "mercado Condor"
    "mercado Condor": /Condor/i,
    
    // Padrões para "escola"
    "escola": /REGIAO ADM SUL/i
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
  
  for (var category in mapping) {
    if (mapping[category].test(value)) {
      return category;
    }
  }
  
  return value; // Retorna o valor original se não encontrar categoria
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
  