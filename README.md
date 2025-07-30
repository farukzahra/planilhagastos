# Planilha de Gastos - Google Apps Script

Script para processamento e categorização automática de dados de gastos em planilhas do Google Sheets.

## 📋 Funcionalidades

- **Processamento de dados**: Remove colunas desnecessárias e reorganiza dados
- **Categorização automática**: Converte descrições de transações em categorias padronizadas
- **Formatação**: Aplica formatação visual na planilha processada
- **Validação**: Verifica integridade dos dados antes do processamento

## 🔧 Como usar

1. Abra sua planilha do Google Sheets
2. Vá em **Extensões > Apps Script**
3. Cole o código do arquivo `planilha.js`
4. Salve o projeto
5. Execute a função `processSpreadsheet()`

## 📊 Estrutura esperada da planilha

A planilha deve ter pelo menos 4 colunas:
- **Coluna A**: (será removida)
- **Coluna B**: Valores monetários (será formatada)
- **Coluna C**: (será removida)  
- **Coluna D**: Descrições das transações (será categorizada)

## 🏷️ Categorias automáticas

O script reconhece e categoriza automaticamente:

| Padrão | Categoria |
|--------|-----------|
| `cruz`, `CRUZ`, `Cruz` | `cruz` |
| `posto`, `Posto`, `POSTO` | `gasolina` |
| `Adriana Aparecida Cardoso` | `diarista` |
| `Raia`, `farmácia`, `farmacia`, `nissei`, `Nissei`, `Panvel` | `farmácia` |
| `Josiane da Silva Bloc` | `pastel pao` |
| `Jacomar` | `mercado jacomar` |
| `POPEYES` | `popeyes pao` |
| `PAO`, `Casadepaobethelem` | `pao` |
| `Burger King`, `BURGER` | `burger pao` |
| `Estacionamento` | `estacionamento` |
| `Festval`, `FESTVAL` | `mercado Festval` |
| `armazem`, `ARMAZEM` | `mercado Armazem` |
| `Condor` | `mercado Condor` |
| `REGIAO ADM SUL`, `Associacao de Pais e Mestres` | `escola` |
| `RESTAURANTE`, `PIZZARIA`, `ESFIHARIA`, `SUSHI`, `TACOS`, `MEXICANOS`, `BAHIA`, `LANCHES`, `COME COME`, `GULOSO`, `ENCANTOS DO JARDIM`, `VO JOAO`, `BORTOLAN`, `CAFE DOCELANDIA`, `PEDACINHO DA BAHIA`, `IMIX TACOS MEXICANOS`, `CASA CHINA`, `RESTAURANTE VO JOAO` | `restaurante` |
| `RENNER`, `EFATA LOJAS DE DEPARTA`, `LOJAS AMERICANAS`, `VULCABRAS`, `ARTIGOS ESPORTIVOS` | `vestuario` |
| `SJP COSMETICOS`, `COSMETICOS` | `cosmeticos` |
| `PET MARC`, `PET` | `pet` |
| `AGROTOPEE`, `AGRO 90`, `PRODUTOS AGR` | `agropecuaria` |
| `CAMPOS MATERIAIS DE CO`, `MATERIAIS` | `materiais` |
| `FLORICULTURA`, `FLORA VIV` | `floricultura` |
| `VinhosVoVito`, `Vinhos` | `vinhos` |
| `UNIMED`, `RD SAUDE`, `SAUDE` | `saude` |
| `Transferência enviada`, `Transferência recebida`, `Transferência Recebida`, `Débito em conta`, `Pagamento de fatura`, `Aplicação RDB`, `Resgate RDB`, `Reembolso recebido` | `transferencias` |
| `PIX`, `Pix` | `pix` |
| `StudioDiMiranda`, `PASSOS DE MOCA`, `LONATTO`, `BORTOLAN`, `CURITIBA CABRAL`, `PARADA PEDRO PELANDA`, `PONTO FILE`, `BANCA AVENIDA`, `NBM PONTO DO REAL`, `MKR`, `CURITIBA`, `PEDACINHO DA BAHIA`, `IMIX TACOS MEXICANOS`, `CASA CHINA`, `BANCA AVENIDA ADQ`, `AGROTOPEE PRODUTOS AGR`, `41950640 LUIS HENRIQUE`, `ENCANTOS DO JARDIM`, `RESTAURANTE VO JOAO`, `VinhosVoVito`, `LeonardoLucasDos`, `CURITIBA CABRAL`, `PARADA PEDRO PELANDA 2`, `AGRO 90`, `JENNIFER DO PRADO COR`, `LOJAS RENNER FL 28`, `CAMPOS MATERIAIS DE CO`, `Guloso`, `KA RU`, `FLORICULTURA FLORA VIV`, `SUSHI CHANG RESTAURA`, `AGROTOPEE PRODUTOS AGR`, `AGRO 90`, `NBM PONTO DO REAL`, `SJP COSMETICOS` | `servicos` |

## 📈 Resultado

Após o processamento, a planilha terá:
- **Coluna A**: Categorias padronizadas
- **Coluna B**: Valores formatados (vírgula como separador decimal)
- **Cabeçalhos**: "Categoria" e "Valor"
- **Formatação**: Cabeçalho em negrito com fundo cinza

## ⚠️ Observações

- O script processa todas as linhas exceto a primeira (assumida como cabeçalho)
- Valores não reconhecidos mantêm a descrição original
- Erros são registrados no log do Apps Script
- A planilha original é substituída pelos dados processados

## 🔄 Melhorias implementadas

- ✅ Código modularizado em funções específicas
- ✅ Tratamento de erros robusto
- ✅ Mapeamento de categorias centralizado
- ✅ Validação de dados aprimorada
- ✅ Formatação visual melhorada
- ✅ Documentação completa
- ✅ Logs informativos

## 📝 Licença

Este projeto é de uso livre para fins educacionais e pessoais. 