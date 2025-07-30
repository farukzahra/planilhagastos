function processSpreadsheet() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
  
    // Verifica se há dados suficientes
    if (data.length < 2 || data[0].length < 4) {
      Logger.log("Dados insuficientes na planilha.");
      return;
    }
  
    var newData = [];
    
    // Processa os dados removendo colunas A e C, movendo D para A e formatando B
    for (var i = 0; i < data.length; i++) {
      var newRow = [];
      var colAValue = data[i][3]; // Coluna D vai para A
      var colBValue = data[i][1].toString().replace(/\./g, ","); // Coluna B com replace de . para ,
  
      // Substituições específicas
      if (/cruz|CRUZ|Cruz/.test(colAValue)) {
        colAValue = "cruz";
      }
      if (/posto|Posto|POSTO/.test(colAValue)) {
        colAValue = "gasolina";
      }
      if (/Adriana Aparecida Cardoso /.test(colAValue)) {
        colAValue = "diarista";
      }
      if (/Raia|farmácia|farmacia|nissei|Nissei|Panvel/.test(colAValue)) {
        colAValue = "farmácia";
      }
      if (/Josiane da Silva Bloc/.test(colAValue)) {
        colAValue = "pastel pao";
      }
      if (/Jacomar/.test(colAValue)) {
        colAValue = "mercado jacomar";
      }
      if (/POPEYES/.test(colAValue)) {
        colAValue = "popeyes pao";
      }
      if (/PAO/.test(colAValue)) {
        colAValue = "pao";
      }
      if (/Burger King/.test(colAValue)) {
        colAValue = "burger pao";
      }
      if (/BURGER/.test(colAValue)) {
        colAValue = "burger pao";
      }
      if (/Estacionamento/.test(colAValue)) {
        colAValue = "estacionamento";
      }
      if (/Festval|FESTVAL/.test(colAValue)) {
        colAValue = "mercado Festval";
      }
      if (/armazem|ARMAZEM/.test(colAValue)) {
        colAValue = "mercado Armazem";
      }    
      if (/Casadepaobethelem/.test(colAValue)) {
        colAValue = "pao";
      }
      if (/Condor/.test(colAValue)) {
        colAValue = "mercado Condor";
      }
      if (/REGIAO ADM SUL/.test(colAValue)) {
        colAValue = "escola";
      }
       
      
  
  
      newRow.push(colAValue);
      newRow.push(colBValue);
      newData.push(newRow);
    }
  
    // Limpa a planilha e escreve os novos dados
    sheet.clear();
    sheet.getRange(1, 1, newData.length, newData[0].length).setValues(newData);
  
    // Formata a coluna A para alinhamento à direita
    sheet.getRange(1, 1, newData.length, 1).setHorizontalAlignment("right");
  }
  