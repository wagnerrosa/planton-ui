# 1. Visão Geral do Produto

## O que é

O Planton Academy será relançado como produto independente — sem co-brand exclusivo —, aberto a todos os clientes da Planton e ao mercado em geral. É um sistema de educação com vídeos, podcasts, artigos e guias sobre sustentabilidade, inventário de emissões de GEE, ESG e temas correlatos. 

O acesso é **contratado por empresa**, o pagamento ocorre **fora da plataforma**, e o acesso é liberado via **voucher** gerado pelo time interno.

## Base existente

A Planton já opera uma plataforma educacional em co-branding com a Faber-Castell, com vídeos, podcasts e artigos organizados em trilhas temáticas (resíduos e circularidade, gestão de emissões de GEE, governança, etc.). A base de conteúdo existe e está em uso. O banco de dados e de usuários do novo produto será **apartado** do da Faber-Castell, embora as regras de negócio sejam as mesmas.

## Posicionamento estratégico (ordem de prioridade)

1. 🎓 **Capacitação dos usuários dos clientes** — Profissionais mais preparados aumentam o valor entregue e a satisfação com o ecossistema Planton.
2. 🚀 **Aceleração comercial** — O Academy funciona como ferramenta de atração e nutrição de novos clientes.
3. 📣 **Fortalecimento de marca** — Repositório de referência sobre sustentabilidade e GEE no Brasil.
4. 🔒 **Retenção dos clientes do Genius** — Integração nativa com o Planton Genius reduz churn.
5. 💰 **Receita recorrente** — Modelo de assinatura por empresa, com possibilidade de licença patrocinada.

## Referências de UX

- **Netflix** — hover preview de conteúdo, card "Continue assistindo"
- **Coursera** — trilhas certificadoras com progresso estruturado
- **Hotmart** — área de membros como referência de navegação administrativa

---

# 2. Perfis de Acesso

Existem 3 perfis com acessos e responsabilidades distintos.

| Perfil | Quem é | O que faz |
| --- | --- | --- |
| **Aluno** | Colaborador da empresa-cliente | Acessa trilhas, assiste conteúdos, faz quizes, obtém certificados, usa o Tutor de IA |
| **Gestor Master (GM)** | Administrador indicado pela empresa-cliente (opcional) | Convida colaboradores, acompanha KPIs da empresa, acessa a plataforma também como aluno |
| **Super Admin** | Time interno da Planton | Acesso total: gerencia clientes, conteúdo, vouchers e KPIs globais |

**Regras sobre o GM:**

- GM **não é obrigatório** — uma empresa pode existir sem GM
- Uma empresa pode ter **múltiplos GMs** com as mesmas permissões (sem hierarquia entre eles)
- O GM **também é aluno** — acessa e consome conteúdo normalmente; o painel gerencial é um acesso adicional
- O GM **aparece nas métricas** de consumo da empresa como qualquer outro usuário
- O papel de GM é atribuído manualmente pelo **Super Admin** via Área de Membros (dropdown `Aluno` / `Gestor Master` por usuário)

---

# 3. Modelo de Acesso e Voucher

## Princípio geral

O acesso é **sempre vinculado ao domínio de e-mail corporativo**. E-mails de domínios genéricos são bloqueados por padrão.

**Domínios bloqueados:** [gmail.com](http://gmail.com), [hotmail.com](http://hotmail.com), [outlook.com](http://outlook.com), [yahoo.com.br](http://yahoo.com.br), [yahoo.com](http://yahoo.com), [live.com](http://live.com), [bol.com.br](http://bol.com.br), [uol.com.br](http://uol.com.br), [terra.com.br](http://terra.com.br), [ig.com.br](http://ig.com.br), [icloud.com](http://icloud.com), [mac.com](http://mac.com), [zoho.com](http://zoho.com)

> Exceção: o Super Admin pode cadastrar manualmente e-mails específicos de domínios genéricos.
> 

## Regras de domínio

| ID | Regra | Descrição |
| --- | --- | --- |
| RN-01 | Validação por domínio | O sistema valida o domínio do e-mail no cadastro e vincula o usuário à empresa automaticamente |
| RN-02 | Domínios múltiplos | Uma empresa pode ter mais de um domínio cadastrado (ex: [empresa.com.br](http://empresa.com.br) e [empresa.com](http://empresa.com)) |
| RN-03 | E-mails pessoais | NÃO aceitos, salvo e-mails específicos cadastrados manualmente pelo Super Admin |

Para emails específicos (gmail, hotmail…) não vinculados a uma empresa: criar uma empresa com o email “único” e vincular um voucher a ela. 

## O que é o Voucher (= Licença Patrocinada)

> Os termos **"Voucher"** e **"Licença Patrocinada"** se referem ao **mesmo objeto**. "Licença Patrocinada" é apenas nomenclatura comercial.
> 

O voucher é um **código alfanumérico único** (formato sugerido: `NOMEDAEMPRESA-ANO-XXXX`) gerado pelo time interno após a formalização comercial. Todo voucher é vinculado a **uma empresa específica** — não existem vouchers sem cliente, nem vouchers de acesso público ou free trial.

| Campo | Descrição |
| --- | --- |
| Código | Alfanumérico único |
| Empresa vinculada | A empresa-cliente associada |
| Domínio(s) permitido(s) | Ex: [empresa.com.br](http://empresa.com.br) — apenas e-mails desse domínio podem usar o voucher |
| Prazo de ativação | Janela para o primeiro uso (ex: 30 dias após emissão) |
| Duração do plano | Meses de acesso **a partir da ativação** (ex: 12 meses) |

## Regras de negócio do voucher

| ID | Regra | Descrição |
| --- | --- | --- |
| VC-01 | Unicidade | Cada voucher é gerado uma única vez para uma única empresa. Não pode ser reutilizado |
| VC-02 | Prazo de ativação | O voucher tem uma janela para ser usado (ex: 30 dias). Após esse prazo, expira e precisa ser regenerado |
| VC-03 | Duração do plano | **Separada** do prazo de ativação. O plano tem vigência X meses contados a partir da data de ativação |
| VC-04 | Primeiro acesso ativa | Qualquer usuário com e-mail do domínio correto que use o voucher **pela primeira vez** ativa a empresa. Normalmente é o GM (o time interno repassa para uma pessoa responsável), mas não é obrigatório |
| VC-05 | Domínio vinculado | O voucher já sai com os domínios configurados. E-mail de domínio diferente não consegue ativar |
| VC-06 | Suspensão automática | Ao vencer o plano, acesso é suspenso automaticamente. Dados históricos são preservados |
| VC-07 | Renovação | Tratada comercialmente por fora. Time interno gera novo voucher ou reativa diretamente no painel |
| VC-08 | Regeneração | Time interno pode invalidar um voucher e gerar novo. Voucher antigo é revogado imediatamente |

---

# 4. Fluxo de Autenticação e Onboarding

## 4.1 Tela de Login

- Campos: e-mail corporativo + senha
- Link "Esqueci minha senha" → fluxo de recuperação
- Botão "Criar novo cadastro" → abre modal de e-mail

## 4.2 Novo Cadastro — Etapa 1: Modal de e-mail

Um modal minimalista com um único campo (e-mail corporativo).

- Após submissão, o backend identifica o cenário e define o próximo passo
- Validação imediata de domínios genéricos (lista acima)
    - Mensagem de erro: *"Acesso exclusivo com e-mail corporativo. Utilize o e-mail da sua empresa."*

## 4.3 Novo Cadastro — Etapa 2: Verificação de domínio (3 cenários)

### 🟢 Cenário A — Domínio ativo

**Condição:** domínio existe no sistema e a empresa está ativa.

**Fluxo:**

1. Preenche formulário de perfil (ver seção 4.4)
2. Define senha
3. **Verifica e-mail** — código de 6 dígitos enviado para o e-mail (válido por 15 min; pode solicitar reenvio)
4. Acesso liberado → vídeo de onboarding

### 🟡 Cenário B — Domínio inativo

**Condição:** domínio existe no sistema, mas a empresa ainda não está ativa (nunca usou um voucher).

**Fluxo:**

1. Sistema exibe: *"Sua empresa ainda não tem acesso ativo ao Planton Academy."*
2. Formulário com campo de voucher em destaque (primeiro campo) + link *"Não tem um voucher? Entre em contato com nosso time comercial"*
3. Preenche formulário de perfil (ver seção 4.4)
4. Define senha
5. **Verifica e-mail** — código de 6 dígitos enviado para o e-mail (válido por 15 min; pode solicitar reenvio)
6. Acesso liberado → vídeo de onboarding

**Validação do voucher no Cenário B:**

| Resultado | Mensagem exibida |
| --- | --- |
| Válido + domínio compatível | Ativa empresa, cria conta do usuário e libera acesso |
| Inválido, expirado ou já utilizado | *"Código inválido ou expirado. Verifique o código ou entre em contato com nosso time."*  
• link obrigatório para contato |
| Domínio incompatível | *"Este código não está associado ao domínio do seu e-mail. Verifique o código ou entre em contato com nosso time."*  
• link obrigatório para contato |

### 🔴 Cenário C — Domínio desconhecido

**Condição:** domínio nunca foi cadastrado no sistema.

**Fluxo:**

1. Sistema exibe: *"Não encontramos sua empresa em nossa plataforma."*
2. Botão: *"Quero conhecer o Planton Academy"* → redirect para landing page / contato comercial

## 4.4 Formulário de Perfil

Coletado no primeiro acesso (Cenários A e B):

| Campo | Obrigatoriedade | Observação |
| --- | --- | --- |
| Nome completo | Obrigatório | — |
| Cargo / Função | Obrigatório | — |
| Telefone | Opcional | Necessário para ativar Tutor via WhatsApp |
| Gênero | Opcional, autodeclarado | Aviso LGPD obrigatório |
| Data de nascimento | Opcional, autodeclarado | Aviso LGPD obrigatório (GRI usa faixa etária) |

> ⚠️ **LGPD — Gênero e data de nascimento:** exibir o texto: *"Esta informação é opcional e será usada exclusivamente para relatórios de diversidade no formato GRI 404. Você pode alterar ou remover a qualquer momento nas configurações."*
> 

## 4.5 Convite do GM para colaboradores

- O GM informa o e-mail do colaborador e o sistema envia um e-mail com um **link genérico para o Planton Academy**
- O link **não tem token de validação** — funciona apenas como um "empurrão" para acessar a plataforma
- O colaborador realiza o cadastro normalmente, igual a qualquer novo usuário
- Como o domínio já está ativo, o colaborador cairá no **Cenário A**
- ⚠️ **Não há validação** de que quem se cadastrou é o mesmo e-mail que foi convidado — qualquer pessoa do domínio pode se cadastrar

**Template do e-mail de convite:**

“*Olá, [Nome]!*

*[Nome do GM] te convidou para acessar o Planton Academy — nossa plataforma de capacitação em sustentabilidade, ESG e gestão de emissões de GEE.*

*Aqui você encontra trilhas de aprendizado com vídeos, artigos, podcasts e guias sobre os temas  que impactam o seu trabalho — (e pode emitir certificados ao concluir cada trilha!).*

*Para criar sua conta, acesse com o e-mail corporativo que recebeu este e-mail:*

*→ Acessar o Planton Academy [LINK]*

*Boas trilhas,*

*Equipe Planton Academy*”

## 4.6 Onboarding — "Comece por aqui"

- Na primeira sessão: tela de boas-vindas com vídeo introdutório (~1 min) sobre como navegar, o que são trilhas e como funciona a certificação
- O vídeo de onboarding **não conta** para progressão de nenhuma trilha
- Botão "Pular" disponível (design discreto para incentivar a visualização)
- Ao retornar à plataforma: o "Comece por aqui" sai do destaque e fica acessível em menu secundário

## 4.7 Recuperação de senha

1. Usuário clica em "Esqueci minha senha" na tela de login
2. Sistema envia e-mail com link de redefinição
3. Usuário redefine a senha e é redirecionado ao login

---

# 5. Catálogo de Conteúdo e Trilhas

## 5.1 Tipos de conteúdo suportados

| ID | Formato | Critério de Conclusão |
| --- | --- | --- |
| CN-01 | Vídeo | ≥ 90% da duração total assistida |
| CN-02 | Podcast | ≥ 90% da duração total ouvida |
| CN-03 | Artigo | Scroll position ≥ 90% do comprimento total da página |
| CN-04 | Guia / PDF | Abrir = Visualizado; atingir última página ou scroll ≥ 90% = Concluído |
| CN-05 | Webinar | Tratado como vídeo (≥ 90% assistido) |

O Super admin também pode criar novas trilhas e alocar vídeos, artigos, padcasts e etc para elas. É possível ter o mesmo vídeo (conteúdos de uma forma geral) em duas trilhas diferentes.

## 5.2 Status de conteúdo

| Status | Quando ocorre | Validade |
| --- | --- | --- |
| **Não iniciado** | Estado inicial | — |
| **Visualizado** | A partir de 1 segundo de play/abertura | **90 dias** |
| **Concluído** | Atingiu o critério da tabela acima | 90 dias |

**Regra de expiração do status Visualizado (90 dias):**

- Se o conteúdo não for concluído em 90 dias, o status "Visualizado" **expira automaticamente**
- O conteúdo volta para "Não iniciado"
- A trilha **regride**: se o quiz estava desbloqueado, é **bloqueado novamente**
- Para retomar, o usuário precisa dar play novamente

## 5.3 Regras de progresso

- **Progresso salvo:** se o usuário sair no meio do conteúdo, o progresso é salvo e retomado no mesmo ponto
- **Trilha certificadora:** o quiz precisa ser completado para finalizar a trilha — visualizar todos os conteúdos não é suficiente para obter o certificado

## 5.4 Estrutura das trilhas

Uma trilha é um conjunto de conteúdos em sequência lógica com um tema central.

**Card da trilha exibe:** título, descrição, lista de conteúdos com ícone de tipo, duração total estimada e progresso pessoal.

- O Super admin também pode criar novas trilhas e alocar vídeos para elas. É possível ter o mesmo vídeo (conteúdos de uma forma geral) em duas trilhas diferentes.

Exemplo: *"Gestão de Emissões de GEE · 4 vídeos · 2 podcasts · ~2h20min"*

**Tipos de trilha:**

- **Trilha global:** visível para todos os clientes
- **Trilha exclusiva por cliente:** visível apenas para empresa(s) específica(s)

**Sem classificação por nível** — todas as trilhas são lineares, sem hierarquia de dificuldade.

## 5.5 Regra de novos conteúdos em trilha em andamento

- Novo conteúdo adicionado a uma trilha **em andamento** → é incorporado na jornada do usuário (precisa ser visualizado para desbloquear o quiz)
- Novo conteúdo adicionado a uma trilha **já concluída** → não afeta o status de conclusão; a trilha permanece concluída, mas exibe um indicador de atualização (ver seção 6.3)

## 5.6 Dinamismo visual — Hover Preview (desktop)

Ao passar o cursor sobre um card, exibe prévia do conteúdo. Para vídeos: reproduz os 15–30 segundos de pico do vídeo sem som.

- **Performance:** lazy loading — o vídeo só carrega no hover
- **Mobile:** sem hover preview. Tap abre a página de detalhes
- **Ao clicar no conteúdo:** abre um modal e exibe o o player + tag(s) com a(s) trilha(s) às quais pertence

## 5.7 Home — Card "Continue assistindo"

Card fixo no topo da home exibindo o último conteúdo em andamento do usuário, com indicador de progresso e botão de retomada.

---

# 6. Quiz e Certificação

## 6.1 Regras do quiz

| ID | Regra | Descrição |
| --- | --- | --- |
| QZ-01 | Quando aparece | Ao final de cada trilha certificadora. Conteúdos vistos isoladamente não têm quiz |
| QZ-02 | Formato | Perguntas objetivas com 4 alternativas cada |
| QZ-03 | Aprovação | Nota mínima de 80% |
| QZ-04 | Reprovação | 3 tentativas no total. Após esgotar as 3 tentativas sem aprovação: todos os conteúdos da trilha voltam ao status inicial e a trilha precisa ser reiniciada do zero |
| QZ-05 | Desbloqueio | O quiz só é desbloqueado quando 100% dos conteúdos da trilha estão com status **Visualizado** (não exige Concluído — basta ter dado play em todos) |
| QZ-06 | Certificado | Gerado apenas após aprovação no quiz |
| QZ-07 | Config. por cliente | O quiz pode ser desabilitado para um cliente específico no painel do Super Admin. Quando desabilitado: usuários concluem trilhas e recebem certificado sem fazer quiz |
| QZ-08 | Edição pelo SA | O Super Admin pode editar perguntas/respostas a qualquer momento (ver impacto abaixo) |

**Bloqueio do quiz pela expiração dos 60 dias:** se algum status Visualizado expirar após 60 dias, o quiz é **bloqueado novamente** até que o usuário visualize o conteúdo de novo.

**Mensagens de status do quiz:**

- Bloqueado: *"Seu certificado ainda não está disponível. Conclua todas as etapas da trilha para obter sua certificação."*
- Desbloqueado após conclusão: *"Parabéns! Você concluiu a Trilha de [Nome]. Seu certificado já está disponível. Clique aqui para gerá-lo."*

**Histórico de tentativas após reset de trilha:**

- O contador de tentativas volta a 0 **visualmente** para o usuário
- O registro interno é **mantido para KPIs** (métrica: "trilhas reiniciadas por exaustão de tentativas")

## 6.2 Impacto da edição do quiz em usuários existentes

| Situação do usuário | O que acontece |
| --- | --- |
| Trilha **concluída** (certificado emitido) | Certificado **continua válido**. Trilha aparece como concluída, mas com indicador visual de atualização |
| Em andamento (tentativas já realizadas) | Tentativas anteriores não são afetadas. Próximas tentativas usam as **novas perguntas** |

**Mensagem exibida para usuários com trilha já concluída após edição do quiz:**

*"Houve uma atualização nesta trilha. Seu certificado continua válido, mas você pode refazer para se manter atualizado."*

## 6.3 Modelo de certificação

| ID | Regra | Descrição |
| --- | --- | --- |
| CT-01 | Emissão | Ao completar 100% dos conteúdos + aprovação no quiz (se habilitado) |
| CT-02 | Formato | PDF gerado automaticamente com: nome do usuário, nome da trilha, data de conclusão e assinatura digital da Planton |
| CT-03 | URL verificável | Cada certificado tem uma URL única pública verificável por terceiros |
| CT-04 | LinkedIn | Botão "Adicionar ao LinkedIn" via URL parametrizada nativa. Dados pré-preenchidos: nome do certificado, organização = Planton, data. |

---

# 7. Tutor de IA

## 7.1 Conceito

Assistente conversacional (LLM + RAG sobre o conteúdo da plataforma). Acessível em **todas as telas**, fixo no canto inferior direito.

**Funções:** responder dúvidas sobre conteúdos, explicar conceitos de sustentabilidade e GEE, recomendar conteúdos da plataforma, apresentar serviços da Planton quando pertinente.

**Memória:** **sem memória entre sessões** — cada conversa começa do zero. O sistema conhece o perfil do usuário (empresa, trilhas em andamento, conteúdos assistidos) via **contexto injetado no prompt do sistema**, mas não o histórico de conversas anteriores.

## 7.2 Regras de escopo

| ID | Regra | Descrição |
| --- | --- | --- |
| IA-01 | Escopo temático | Responde apenas sobre: conteúdos da plataforma, sustentabilidade, ESG, GEE, GHG Protocol, normas ISO relacionadas, pegada de carbono e serviços da Planton |
| IA-02 | Fora de escopo | Declina educadamente: *"Esse assunto está fora da minha área. Posso te ajudar com dúvidas sobre os conteúdos do Academy ou gestão de emissões!"* |
| IA-03 | Recomendação | Sempre que pertinente, cita e linka conteúdos específicos da plataforma |
| IA-04 | Menção comercial | Pode mencionar serviços da Planton de forma consultiva. Máximo 1 menção por conversa, salvo se o usuário perguntar diretamente |

> ⚠️ **Para o prompt do sistema:** incluir os serviços da Planton e guardrails para tentativas de uso fora do escopo.
> 

## 7.3 Tutor via WhatsApp

O Tutor também estará disponível via WhatsApp Business API.

**Fluxo de ativação:**

1. Usuário acessa o Tutor na plataforma e clica no botão "WhatsApp"
2. Sistema verifica se há número de telefone cadastrado no perfil
    - **Se sim:** oferece enviar link/mensagem direta para o WhatsApp
    - **Se não:** solicita cadastro do número antes de prosseguir
3. Usuário vincula número ao perfil → recebe mensagem de boas-vindas no WhatsApp

**Capacidades proativas do Tutor via WhatsApp:**

- Alertas de novos conteúdos disponíveis
- Lembretes de trilhas incompletas
- Convites para retornar à plataforma

**Contexto do usuário:** a conversa no WhatsApp conhece a empresa, progresso nas trilhas e conteúdos assistidos (via contexto injetado), mas não o histórico de conversas anteriores.

---

# 8. Painel do Gestor Master

> Lembrete: o GM **também acessa a plataforma como aluno** — o painel gerencial é um acesso adicional.
> 

## Dashboard — KPIs da empresa

- Total de usuários cadastrados
- Usuários ativos (últimos 30 dias)
- Total de horas consumidas (conta a partir de 1s de play)
- Trilhas mais acessadas
- Lista de certificados emitidos
- **Linha do tempo do plano:** indicador visual do vencimento, com destaque quando restam ≤ 30 dias

## Gestão de funcionários

- **Convidar colaborador:** GM informa o e-mail; sistema envia e-mail com link genérico (ver seção 4.5)
- **Indicadores individuais por usuário:** trilhas realizadas, tempo de vídeo assistido, certificados obtidos, data do último acesso
- **Filtros:** por funcionário ou por trilha

## Relatórios

- GRI 404 (Treinamento e Educação): exportar participação por gênero/faixa etária, apenas com consentimento LGPD coletado.
    - Implementar em versão futura

## Configurações

- Visualizar data de vencimento do plano
- Contatar Super Admin (via link, formulário ou e-mail)

---

# 9. Painel do Super Admin

## 9.1 Gestão de clientes

| ID | Ação | Descrição |
| --- | --- | --- |
| PM-01 | Cadastrar cliente | Registrar nova empresa com: nome, CNPJ e domínio(s) |
| PM-02 | Desativar cliente | Suspender acesso de todos os usuários sem deletar dados históricos. Ocorre automaticamente ao vencer o plano |
| PM-03 | Reativar cliente | Reabilitar acesso com todo o histórico preservado |
| PM-04 | Gerenciar usuários | Ver todos os usuários vinculados à empresa (e-mail, papel) e alterar papel via dropdown `Aluno` / `Gestor Master` |

## 9.2 Gestão de Vouchers

**Criar voucher:** campos obrigatórios — código, empresa vinculada, prazo de ativação (janela para o primeiro uso), duração do plano (meses a partir da ativação).

**Listar vouchers:** filtrar por status (Ativo / Usado / Expirado), empresa e período.

**Ações por voucher:**

- **Revogar:** invalida manualmente antes do uso
- **Regenerar:** cria novo código para empresa com voucher expirado/revogado (voucher antigo é revogado imediatamente)
- **Reativar empresa:** para renovações sem necessidade de novo voucher

## 9.3 Gestão de conteúdo

| ID | Regra | Descrição |
| --- | --- | --- |
| GC-01 | Upload global | Conteúdo visível para todos os clientes |
| GC-02 | Upload por cliente | Conteúdo visível apenas para empresa(s) específica(s) |
| GC-03 | Agendamento | Publicação imediata ou agendada para data/hora futura |
| GC-04 | Exclusão | Possibilidade de excluir conteúdos do catálogo |
| GC-05 | Reordenação | Alterar a ordem dos conteúdos dentro de uma trilha (drag and drop) |

**Gestão de trilhas:** o Super Admin pode criar, editar e configurar trilhas. O fluxo completo está detalhado na seção 9.4 abaixo.

## 9.4 Criação e configuração de trilhas

### Visão geral do fluxo

A criação de uma trilha segue **4 etapas em sequência**. As etapas 2 e 3 podem ser feitas em qualquer ordem após a criação inicial.

| Etapa | O que acontece |
| --- | --- |
| **1. Criar** | Preenche dados básicos da trilha e salva como Rascunho |
| **2. Adicionar conteúdos** | Vincula conteúdos já existentes no catálogo à trilha |
| **3. Configurar quiz** | Cadastra perguntas e respostas (se quiz habilitado) |
| **4. Publicar** | Muda o status para Ativa (imediato ou agendado) |

> ⚠️ Não é possível fazer upload de conteúdo novo dentro da criação de trilha. Conteúdos precisam existir previamente no catálogo para serem vinculados.
> 

---

### Etapa 1 — Criar a trilha

Ao clicar em **"+ Nova trilha"**, o SA preenche o formulário:

| Campo | Obrigatoriedade | Detalhe |
| --- | --- | --- |
| **Título** | Obrigatório | Nome exibido para o aluno. Ex: *Gestão de Emissões de GEE* |
| **Descrição** | Obrigatório | Texto curto exibido no card (~2 linhas). Deve deixar claro o que o aluno vai aprender |
| **Imagem de capa** | Opcional | Upload JPG/PNG. Se não enviada, usa capa padrão da Planton Academy |
| **Visibilidade** | Obrigatório | `Global` (todos os clientes) ou `Exclusiva` (selecionar clientes específicos) |
| **Clientes** | Condicional | Aparece apenas se Visibilidade = Exclusiva. Multi-select dos clientes cadastrados |
| **Quiz** | Obrigatório | `Habilitado` ou `Desabilitado`. Define se a trilha exige quiz para emitir certificado |
| **Quiz por cliente** | Opcional | Permite sobrescrever a configuração de quiz para clientes específicos. Ex: desabilitar quiz só para empresa X |
| **Status inicial** | Obrigatório | Padrão: `Rascunho` (invisível para alunos). Opção alternativa: `Em breve` (visível mas bloqueada) |

> ⚠️ A trilha é sempre **salva como Rascunho** ao ser criada. Ela só fica acessível para alunos quando o Super Admin muda o status para **Ativa**.
> 

---

### Etapa 2 — Adicionar conteúdos à trilha

Após criar a trilha, o Super Admin acessa a página de edição e associa conteúdos:

- **Busca:** SA busca pelo título do conteúdo no catálogo e adiciona à trilha
- **Ordem:** os conteúdos são exibidos na sequência em que foram adicionados. Reordenação via **drag and drop** a qualquer momento
- **Remoção:** qualquer conteúdo pode ser desvinculado da trilha individualmente. Isso **não exclui** o conteúdo do catálogo
- **Sem mínimo obrigatório:** a trilha pode ser publicada com qualquer quantidade de conteúdos, inclusive nenhum
- **Mesmo conteúdo em múltiplas trilhas:** um vídeo, podcast ou artigo pode estar em mais de uma trilha ao mesmo tempo. O progresso do aluno é **calculado por trilha** — assistir o mesmo vídeo em duas trilhas distintas conta separadamente em cada uma

---

### Etapa 3 — Configurar o quiz

Disponível apenas se o quiz estiver habilitado. O Super Admin acessa a seção de quiz dentro da trilha e cadastra as perguntas:

| Campo por pergunta | Detalhe |
| --- | --- |
| **Enunciado** | Texto da pergunta |
| **Alternativa A / B / C / D** | Textos das 4 opções |
| **Resposta correta** | Marcação de qual alternativa é a correta |
- O SA pode adicionar quantas perguntas quiser
- Não há embaralhamento automático de alternativas no MVP — a ordem exibida ao aluno é a mesma cadastrada
- O quiz pode ser editado a qualquer momento após a publicação. Ver impacto em usuários existentes na seção 6.2

---

### Etapa 4 — Publicar a trilha

Quando a trilha estiver pronta, o SA altera o status:

| Status | Visível para alunos? | Conteúdo acessível? |
| --- | --- | --- |
| **Rascunho** | Não | Não |
| **Em breve** | Sim (aparece no catálogo com selo) | Não (bloqueada) |
| **Ativa** | Sim | Sim |

**Publicação imediata:** SA muda o status para Ativa manualmente.

**Publicação agendada:** SA define data e hora futuras. A trilha permanece em Rascunho ou Em breve até a data definida, quando passa automaticamente para Ativa.

---

### Regras de negócio — criação e edição de trilhas

| ID | Regra | Descrição |
| --- | --- | --- |
| TR-01 | Conteúdo independente da trilha | Excluir uma trilha não exclui os conteúdos do catálogo |
| TR-02 | Conteúdo em múltiplas trilhas | Um mesmo conteúdo pode estar em mais de uma trilha simultaneamente |
| TR-03 | Progresso por trilha | O progresso é calculado por trilha — o mesmo vídeo em duas trilhas distintas conta separadamente em cada uma |
| TR-04 | Exclusividade real | Trilha exclusiva por cliente é invisível para todos os outros clientes |
| TR-05 | Edição não retroativa | Editar título, descrição ou capa não afeta progresso nem certificados já emitidos |
| TR-06 | Novo conteúdo em trilha ativa | Se a trilha já tiver alunos em andamento, o novo conteúdo entra na sequência da posição definida e passa a ser exigido para desbloquear o quiz. Ver seção 5.5 |
| TR-07 | Exclusão de trilha com alunos | Trilha com progresso registrado pode ser desativada (vira Rascunho) mas não pode ser excluída. Dados históricos são preservados |

## 9.5 Aviso de plano a vencer

Quando o plano de uma empresa está a ≤ 30 dias do vencimento:

| Canal | Quem recebe | Quando |
| --- | --- | --- |
| E-mail automático | Todos os GMs da empresa | 30 dias antes do vencimento |
| Banner na plataforma | GM (ao fazer login) | A partir de 30 dias antes |
| Indicador no Dashboard | GM (visível continuamente) | A partir de 30 dias antes |

## 9.6 KPIs globais

- Total de empresas ativas
- Total de usuários cadastrados vs. ativos (últimos 30 dias)
- Total de horas consumidas na plataforma
- Top 3 conteúdos mais assistidos
- Total de certificados emitidos
- Clique em qualquer empresa → KPIs específicos daquela empresa

---

# 10. KPIs — Definições de Métricas

| Métrica | Como é calculada |
| --- | --- |
| **Horas consumidas** | Tempo efetivamente assistido/ouvido/lido, a partir de 1s de interação |
| **Status Visualizado** | Ativado a partir de 1s de play — conta como "visualizado" nos KPIs |
| **Status Concluído** | Vídeo/podcast ≥ 90%, Artigo scroll ≥ 90% |
| **Usuário ativo** | Acessou a plataforma nos últimos 30 dias |
| **Quizzes refeitos** | Número de tentativas de quiz por usuário/trilha |
| **Trilhas reiniciadas** | Quantas vezes uma trilha foi resetada após 3 reprovações no quiz |

---

# 11. Comunicações Automáticas

| Gatilho | Destinatário | Conteúdo |
| --- | --- | --- |
| Cadastro realizado | Aluno | Confirmação de acesso + link para a plataforma |
| Convite do GM | Colaborador convidado | *"Olá [Nome], seu gestor [Nome do GM] está te convidando a acessar o Planton Academy..."*  • link genérico |
| Certificado emitido | Aluno | Certificado em PDF + link verificável + botão LinkedIn |
| Novos conteúdos disponíveis | Usuários ativos da empresa | Disparo mensal automático (ou manual pelo time de Marketing) |
| Plano a vencer em 30 dias | Todos os GMs da empresa | Aviso de vencimento + link para contato |

---

# 12. Integrações

| Integração | Descrição | Complexidade |
| --- | --- | --- |
| **LinkedIn** | URL parametrizada nativa. Botão "Adicionar ao LinkedIn" com dados pré-preenchidos (nome do certificado, organização = Planton, data). **Não requer OAuth.** | Baixa |
| **WhatsApp Business API** | Para o Tutor de IA via WhatsApp | Alta |
| **Site da Planton** | Landing page pública com CTA de contratação. Acesso à plataforma requer cadastro/login | — |

---

# 14. Itens para uma próxima versão (Backlog)

> Registrados para não se perderem. **Não implementar na V1.**
> 

| ID | Item | Descrição |
| --- | --- | --- |
| F-01 | **Relatório GRI 404** | Download do relatório de treinamento por gênero/faixa etária. Deixar espaço na UI do GM, mas desabilitado ou oculto no MVP |
| F-02 | **Limite de seats por empresa** | Controle de número máximo de usuários por contrato. Exige lógica de bloqueio no cadastro quando o limite for atingido |
| F-03 | **Classificação de nível nas trilhas** | Básico / Intermediário / Avançado — útil para onboarding direcionado |
| F-04 | **Histórico visual de trilhas reiniciadas** | Exibir para o GM quantas vezes um usuário específico resetou uma trilha |
| F-05 | Notificações In-app | Implementar um **sino de notificações na navbar**:
• Novo conteúdo adicionado a uma trilha em andamento
• Certificado disponível para download
• Aviso de plano a vencer (apenas para GM)
• Atualização de quiz em trilha já concluída |

---

# 15. Referências e Documentos Relacionados

- [Planton Academy V2 — Rascunho Original](https://www.notion.so/Planton-Academy-Especifica-o-Inicial-30240385b87380d1b475d6d4799c38a0?pvs=21)
- [Regras de Negócio — Voucher & Acesso](https://www.notion.so/32140385b8738177a4a0de49fbbdebe9?pvs=21)
- [Fluxogramas Miro V2](https://miro.com/app/board/uXjVG066oXo=/)
- Wireframe: @Wagner Rosa
    
    https://wireframes-mocha.vercel.app/