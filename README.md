# Funil Entregadores iFood

Painel do funil de vendas do programa Direcional para entregadores iFood.

- `index.html`: o painel, publicado pelo GitHub Pages. Pede uma senha e só então busca os dados.
- `apps-script.gs`: a ponte entre a planilha e o painel. Confere a senha e devolve os dados sem Telefone e CPF.

Nenhum dado de cliente fica neste repositório. Tudo chega da planilha depois do login.

## Como ligar o painel à planilha

1. Na planilha, abra **Extensões > Apps Script**, apague o conteúdo e cole o `apps-script.gs`.
2. Em **Configurações do projeto > Propriedades do script**, crie `SENHA_PAINEL` com a senha. Para dar uma senha a cada parceiro, separe por vírgula. Para revogar um acesso, tire a senha da lista.
3. **Implantar > Nova implantação > App da Web**. Executar como: **Eu**. Quem pode acessar: **Qualquer pessoa**. Autorize e copie a URL que termina em `/exec`.
4. Coloque essa URL em `CONFIG.apiUrl` no `index.html`.
5. Na planilha, mude o compartilhamento para **Restrito**. O painel continua funcionando porque o script roda com a sua conta.

Se mudar o código do script depois, use **Implantar > Gerenciar implantações > Editar > Nova versão** para manter a mesma URL.
