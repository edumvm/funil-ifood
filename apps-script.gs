/**
 * Ponte segura entre a planilha e o painel "Funil Entregadores iFood".
 *
 * O painel nunca lê a planilha direto: ele envia a senha para este script,
 * que confere e devolve só as colunas liberadas (Telefone e CPF ficam de fora).
 * Assim a planilha pode ficar com acesso "Restrito".
 *
 * Configuração (Projeto > Configurações do projeto > Propriedades do script):
 *   SENHA_PAINEL  senha de acesso. Para dar uma senha por parceiro, separe por vírgula
 *                 (ex.: "senhaDirecional,senhaIfood"). Para revogar, apague a senha da lista.
 *   PLANILHA_ID   opcional. Só é necessário se este script NÃO foi criado dentro da planilha
 *                 (Extensões > Apps Script). É o trecho entre /d/ e /edit no link da planilha.
 *
 * Publicação: Implantar > Nova implantação > Tipo "App da Web",
 *   Executar como: Eu  |  Quem pode acessar: Qualquer pessoa.
 */

const ABA_GID = 0;                        // gid da aba no link da planilha (#gid=0)
const COLUNAS_OCULTAS = ['telefone', 'cpf']; // cabeçalhos que começam com estes termos nunca saem

function doPost(e) {
  let corpo = {};
  try { corpo = JSON.parse(e.postData.contents); } catch (_) {}
  return responder_(corpo.senha);
}

function doGet() {
  return json_({ ok: false, erro: 'metodo' });
}

function responder_(senha) {
  const props = PropertiesService.getScriptProperties();
  const validas = (props.getProperty('SENHA_PAINEL') || '')
    .split(',').map(s => s.trim()).filter(String);
  if (!validas.length) return json_({ ok: false, erro: 'config' });

  if (!senha || validas.indexOf(String(senha)) < 0) {
    Utilities.sleep(1500); // freia tentativas em sequência
    return json_({ ok: false, erro: 'senha' });
  }

  const id = props.getProperty('PLANILHA_ID');
  const ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheets().filter(s => s.getSheetId() === ABA_GID)[0] || ss.getSheets()[0];
  const valores = aba.getDataRange().getDisplayValues();

  const cab = valores[0].map(normalizar_);
  const manter = [];
  cab.forEach((h, i) => {
    if (h && !COLUNAS_OCULTAS.some(c => h.indexOf(c) === 0)) manter.push(i);
  });

  return json_({
    ok: true,
    atualizado: new Date().toISOString(),
    linhas: valores.map(r => manter.map(i => r[i]))
  });
}

function normalizar_(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ').trim().toLowerCase();
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
