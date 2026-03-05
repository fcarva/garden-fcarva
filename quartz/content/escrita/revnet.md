---
title: Revnets
description: Introdução e formalização de revnets, com foco em emissão, resgate, empréstimos e dinâmica de preços.
socialImage: og-image.jpg
date: 2026-03-05
tags:
  - escrita
  - sistemas
  - economia
  - bens-publicos
  - democracia-participatoria
---
Revnets são estruturas financeiras tokenizadas e autônomas que roteiam fluxos de receita e resgates através de regras imutáveis de contratos inteligentes. Elas são implantadas usando o protocolo Juicebox V5 e governadas inteiramente por código, em vez de votações no estilo DAO.

***Uma revnet é uma máquina de vendas digital para receitas: dinheiro entra, tokens saem; tokens podem ser posteriormente resgatados por uma parcela programática do tesouro.*** 

Todas as regras principais são fixadas na implantação e definem emissão, resgate e distribuição determinísticos, com integração opcional de AMM e operação em várias redes compatíveis com EVM.

**As Revnets são:**

- Livres de governança
- Determinísticas
- Transparentes/auditáveis
- Com escopo de gestão definido
- Alinhando contribuidores, construtores e clientes em torno de uma lógica financeira resistente a adulterações.

---
## Como funciona uma revnet?

1. **Pagamento / Entrada (emissão)**
   
- Qualquer pessoa pode pagar à revnet no(s) ativo(s) base aceito(s) \$RES.
- O contrato cunha (mints) \$TOK ao preço de emissão atual; um *split* (divisão) opcional roteia uma porcentagem fixa de novos tokens para destinatários predefinidos.
- Os fundos permanecem no tesouro.
1. **Cash out (resgate)**
   
- O detentor queima \$TOK para reivindicar fundos do tesouro.
- Uma taxa de cash-out definida por estágio mantém parte do valor resgatável no tesouro, o que eleva o preço piso futuro para os detentores restantes.
1. **Empréstimo (loans)**
   
- Em vez de fazer o cash-out, um detentor pode tomar emprestado do tesouro contra seus \$TOK.
- O montante disponível para empréstimo é limitado pelo valor de cash-out desse colateral.
---
## Revnets: Operação em Estágios

### Definição de Estágio

Revnets operam em **estágios** (_stages_). Um _stage_ $k$ é uma janela de tempo durante a qual o revnet segue uma configuração fixa de parâmetros. Cada estágio codifica exatamente sete parâmetros que são as únicas alavancas ajustáveis de um revnet:

$$S_k = (t_k, P_{\text{issue},k,0}, \gamma_{\text{cut},k}, \Delta t_k, \sigma_k, r_k, \mathcal{A}_k)$$

---
## Parâmetros do Estágio

1. **Stage start time** $(t_k)$: Momento em que este estágio entra em vigor.
2. **Initial issuance rate** $(P_{\text{issue},k,0})$: \$TOK por \$RES unit pago no início do estágio (define o preço inicial).
3. **Issuance cut percent** $(\gamma_{\text{cut},k})$: A redução fracionária na emissão a cada período (equivalentemente, o fator de aumento de preço por período $1/(1 - \gamma_{\text{cut},k})$).
4. **Issuance cut frequency** $(\Delta t_k)$: Frequência com que o corte de emissão se aplica (por exemplo, diário, mensal).
5. **Split percentage** $(\sigma_k)$: Fração de cada novo mint roteado para destinatários predefinidos (o restante vai para o pagador).
6. **Cash-out tax rate** $(r_k)$: Parcela do valor de cash-out retida no tesouro (impulsiona o floor e seu crescimento).
7. **Auto-issuances** $(\mathcal{A}_k)$: Mints únicos pré-autorizados no início do estágio (chain, quantidade, beneficiário).
## Imutabilidade e Dinâmica dos Estágios

Uma vez definida, a tupla $S_k$ é **imutável**. As transições de estágio ocorrem automaticamente por timestamp, de modo que o estágio atual é determinado unicamente por $t$. Dentro de um estágio, emissões, resgates e distribuições seguem as regras determinísticas implícitas nesses sete parâmetros.

## Intuição

Intuitivamente:

- As alavancas de emissão (2–4) definem um **preço de emissão** (_issuance price_) crescente ao longo do tempo;
- A alavanca de cash-out/tax (6) define um **preço floor** (_price floor_) impulsionado por atividade;
- As alavancas de split/auto-emissão (5,7) alocam deterministicamente a nova oferta.
  
## 2. Modelo Matemático da Economia Revnet

Na seção seguinte, modelamos um Revnet matematicamente, formalizando:

- Suas variáveis de estado e sua evolução no tempo;
- Seus mecanismos como emissão, cash-out e empréstimo.

## 2.1 Parâmetros e Variáveis de Estado

O comportamento econômico de um Revnet é determinado conjuntamente por:

1. Os **parâmetros de estágio** imutáveis $S_k$ (cf. Sec. 1.3), fixados no deployment para cada estágio $k$;
2. As **variáveis de estado** em evolução, que rastreiam saldos do tesouro, oferta de tokens e posições de empréstimo ao longo do tempo.

## Parâmetros de estágio

Para referência, a tupla de parâmetros para o estágio $k$ é:

$$S_k = (t_k, P_{\text{issue},k,0}, \gamma_{\text{cut},k}, \Delta t_k, \sigma_k, r_k, \mathcal{A}_k)$$
## Variáveis de estado

As variáveis dinâmicas centrais estão listadas na Tabela 1.

| **Variável**               | **Descrição**                                                    |
| -------------------------- | ---------------------------------------------------------------- |
| $B(t)$                     | Saldo do tesouro no tempo $t$                                    |
| $S(t)$                     | Oferta total de tokens em circulação no tempo $t$                |
| $S_{\text{collateral}}(t)$ | Tokens queimados como colateral de empréstimo no tempo $t$       |
| $B_{\text{borrowed}}(t)$   | Quantidade atualmente emprestada contra o colateral no tempo $t$ |
| $P_{\text{issue},k}(t)$    | Função de preço de emissão sob o estágio $k$ no tempo $t$        |

**Tabela 1:** Variáveis de estado centrais de um protocolo Revnet

A qualquer momento $t$, o estado do protocolo é completamente determinado pelo par:

$$\Big(S_k, {B(t), S(t), S_{\text{collateral}}(t), B_{\text{borrowed}}(t)}\Big),$$

onde $S_k$ é o estágio ativo (selecionado deterministicamente por $t$) e o segundo componente evolve endogenamente conforme usuários interagem com o Revnet. As próximas subseções formalizam como cada mecanismo (emissão, resgate, empréstimos) atualiza essas variáveis

## 2.2 Pay in – Emissão (Issuance)

A qualquer momento $t$ dentro do estágio $k$ (definido pela tupla de parâmetros $S_k$), participantes podem pagar ao contrato Revnet no ativo base aceito \$RES.Em retorno, o contrato mint novos \$TOK ao preço de emissão $P_{\text{issue},k}(t)$. Uma fração $\sigma_k$ dos tokens mintados é roteada para destinatários split predefinidos, enquanto o restante é acumulado pelo pagador. O pagamento permanece no tesouro, aumentando o backing de todos os tokens em circulação.

----
## Preço de emissão (discreto)

Dentro do estágio $k$ iniciando no tempo $t_k$, o preço de emissão evolui por saltos multiplicativos discretos a cada $\Delta t_k$ segundos:

$$P_{\text{issue},k}(t) = P_{\text{issue},k,0} \cdot \gamma_k^{\left\lfloor \frac{t - t_k}{\Delta t_k} \right\rfloor}, \quad t \in [t_k, t_{k+1}),\tag{2}$$
onde:

$$\gamma_k = \frac{1}{1 - \gamma_{\text{cut},k}} \quad \text{(fator de crescimento de preco por intervalo)},$$

$$P_{\text{issue},k,0} = \text{preco de emissao inicial em } t = t_k,$$

$$\Delta t_k = \text{frequencia de corte de emissao para o estagio } k.$$

Aqui $\lfloor x \rfloor$ denota a **função floor** (maior inteiro $\leq x$), o que torna $P_{\text{issue},k}(t)$ uma função em degrau: o preço é constante dentro de cada intervalo e salta por um fator $\gamma_k$ precisamente nos tempos $t = t_k + m,\Delta t_k$ que estão em $[t_k, t_{k+1})$.

A variável $t$ varia sobre a janela do estágio $[t_k, t_{k+1})$, onde $t_{k+1}$ é o tempo de início do próximo estágio. A **duração** do estágio $k$ é, portanto:

$$\text{duration}_k = t_{k+1} - t_k,$$

com a convenção de que o estágio final tem $t_{k+1} = +\infty$ (duração infinita). O número de saltos programados de emissão dentro do estágio $k$ é:

$$N_k = \left\lfloor \frac{t_{k+1} - t_k}{\Delta t_k} \right\rfloor,$$

e os saltos ocorrem em $t = t_k + m,\Delta t_k$ para todos os inteiros $m$ tais que $t_k + m,\Delta t_k \in [t_k, t_{k+1})$.

## Quantidade mintada

Para um pagamento de valor $x$ em \$RES tokens no tempo $t$ no estágio $k$, o contrato emite $q_{\text{issued}}$ \$TOK de acordo com:

$$q_{\text{issued}}(t) = \frac{x}{P_{\text{issue},k}(t)}\tag{3}$$

## Alocação de tokens

Os tokens mintados são divididos de acordo com a fração de split $\sigma_k \in [0,1]$:

$$q_{\text{payer}}(t) = (1 - \sigma_k),q_{\text{issued}}(t), \quad \text{(Tokens alocados ao pagador)}$$

$$q_{\text{split}}(t) = \sigma_k,q_{\text{issued}}(t). \quad \text{(Tokens alocados aos splits)}$$

O **preço efetivo de emissão para o usuário** é, portanto:

$$P_{\text{issue}}^{\text{user}}(t) = \frac{P_{\text{issue},k}(t)}{1 - \sigma_k}\tag{4}$$

![[Pasted image 20251126182912.png]]
## Evolução discreta do preço de emissão

**Figura 1:** Evolução discreta do preço de emissão $P_{\text{issue},k}(t)$ dentro de um único estágio $k$. O preço aumenta em saltos stepwise/fashion a cada $\Delta t_k$ de acordo com $P_{\text{issue},k}(t) = P_{\text{issue},k,0},\gamma_k^{\lfloor (t-t_k)/\Delta t_k \rfloor}$, com parâmetros $P_0$, $\gamma_{\text{cut}}$, $\gamma = 1/(1 - \gamma_{\text{cut}})$ e duração do estágio $(t_{k+1} - t_k)$ = duration. As marcas vermelhas indicam os limites do estágio em $t_k$ e $t_{k+1}$.

---

## Atualizações de estado

Seja $B(t)$ o saldo do tesouro, $S(t)$ a oferta em circulação, e $U_i^{\text{ASSET}}(t)$ o saldo do usuário $i$ em um dado ativo. No instante de um evento de emissão, as atualizações são:

$$B(t^+) = B(t^-) + x, \quad \text{(Saldo do tesouro)}$$
$$S(t^+) = S(t^-) + q_{\text{issued}}(t), \quad \text{(Oferta de tokens)}$$
$$U_i^{\text{\$RES}}(t^+) = U_i^{\text{\$RES}}(t^-) - x, \quad \text{(Saldo em ativo base do pagador)}$$
$$U_i^{\text{\$TOK}}(t^+) = U_i^{\text{\$TOK}}(t^-) + q_{\text{payer}}(t), \quad \text{(Saldo em tokens do pagador)}$$
Essas regras de atualização definem um sistema dinâmico de tempo discreto para ${B, S, {U_i}}$.

## 2.3 Cash-out – Resgate (Redemption)

A qualquer momento $t$ dentro do estágio $k$, um detentor de \$TOK pode queimar tokens para reclamar uma parcela do tesouro no ativo base. O mecanismo de cash-out (também referido como "resgate") é governado por uma curva de bonding convexa, que garante que cash-outs parciais retenham valor no tesouro e aumentem gradualmente o preço floor para os detentores remanescentes.

## Curva de resgate

Suponha que um detentor resgata $q$ tokens no tempo $t$ com oferta circulante $S(t)$ e tesouro $B(t)$. O valor reclamável (antes das taxas) é:

$$C_k(q; S, B) = \frac{q}{S},B\left[(1 - r_k) + r_k,\frac{q}{S}\right],\tag{5}$$

onde $r_k$ é a taxa de cash-out (cash-out tax) para o estágio $k$.

Para qualquer $r_k > 0$, a curva é estritamente convexa:

$$\frac{d^2C_k}{dq^2} = \frac{2Br_k}{S^2} > 0,$$

de modo que:

- pequenos resgates recebem preços efetivos piores (maior impacto de taxa),
- grandes resgates recebem preços efetivos melhores (menor impacto relativo de taxa).

## Taxas de cash-out

Taxas REV e NANA são aplicadas em dois estágios:

**Stage 1 - REV fee:** Antes de aplicar a curva de resgate, a taxa REV é deduzida do montante de tokens:

$$q_{ef} = (1 - \phi_{\text{REV}}),q = 0.975q \quad, \text{ onde } \phi_{\text{REV}} = 0.025\tag{6}$$

**Stage 2 - NANA fee:** Após calcular o valor de resgate, a taxa NANA é deduzida:

$$C_{\text{gross}} = C_k(q_{ef}; S, B)\tag{7}$$

$$C_{\text{user}} = (1 - \phi_{\text{NANA}}),C_{\text{gross}} = 0.975,C_{\text{gross}} \quad \text{ onde } \phi_{\text{NANA}} = 0.025\tag{8}$$

Ambas as taxas são redistribuídas como pagamentos aos seus respectivos revnets, o que significa que:

- REV fee → Pago ao \$REV revnet → Issues \$REV tokens para a pessoa fazendo cash-out;
- NANA fee → Pago ao \$NANA revnet → Issues \$NANA tokens para a pessoa fazendo cash-out.

## Preço de resgate do usuário

O preço efetivo experimentado por um usuário fazendo cash-out de $q$ \$TOK tokens:

$$P_{\text{redeem}}^{\text{user}}(q) = (0.975)^2 \cdot \frac{B}{S}\left[(1 - r_k) + r_k,\frac{0.975q}{S}\right]\tag{9}$$

## Reciclagem de taxas

Após o usuário resgatar $C_{\text{user}}$, a oferta e tesouro atualizados são:

$$S' = S - q_{ef},$$

$$B' = B - C_{\text{gross}}.$$

Nesse estado atualizado $(S', B')$, as taxas da rede são tratadas como resgates separados:

$$C_{\text{fee}}^{\text{REV}} = C_k(q_{\text{fee}}^{\text{REV}}; S', B'),$$

$$C_{\text{fee}}^{\text{NANA}} = \phi_{\text{NANA}},C_{\text{gross}}.$$

Esses valores são encaminhados como pagamentos de entrada (inbound payments) para os Revnets REV e NANA, de modo que o resgatador também recebe $X^{\text{REV}}$ \$REV tokens de $C_{\text{fee}}^{\text{REV}}$ e $X^{\text{NANA}}$ \$NANA tokens de $C_{\text{fee}}^{\text{NANA}}$.

![[Pasted image 20251126184105.png]]

$$U_i^{$\text{TOK}}(t^+) = U_i^{$\text{TOK}}(t^-) - q, \quad \text{(Saldo em \$TOK do usuario)}$$
$$U_i^{$\text{RES}}(t^+) = U_i^{$\text{RES}}(t^-) + C_{\text{user}}, \quad \text{(Saldo em ativo base do usuario)}$$
$$U_i^{$\text{REV}}(t^+) = U_i^{$\text{REV}}(t^-) + X^{\text{REV}}, \quad \text{(Saldo em REV do usuario)}$$
$$U_i^{$\text{NANA}}(t^+) = U_i^{$\text{NANA}}(t^-) + X^{\text{NANA}}, \quad \text{(Saldo em NANA do usuario)}$$
---
$^1$ Que são computados como:

$$X^{\text{REV}} = (1 - \sigma_k^{\text{REV}}),\frac{C_{\text{fee}}^{\text{REV}}}{P_{\text{issue},k}^{\text{REV}}(t)} \quad \text{(in REV tokens)}$$

$$X^{\text{NANA}} = (1 - \sigma_k^{\text{NANA}}),\frac{C_{\text{fee}}^{\text{NANA}}}{P_{\text{issue},k}^{\text{NANA}}(t)} \quad \text{(in NANA tokens)}$$

Enquanto as variáveis de sistema agregadas atualizam como:

$$S(t^+) = S(t^-) - q, \quad \text{(Oferta total)}$$

$$B(t^+) = B(t^-) - C_{\text{user}} - C_{\text{fee}}^{\text{REV}} - C_{\text{fee}}^{\text{NANA}}, \quad \text{(Saldo do tesouro)}$$

# 2.4 Borrow – Empréstimo

Em vez de fazer cash-out, um detentor pode tomar emprestado \$RES do tesouro usando seus \$TOK como colateral. O valor de cash-out do colateral limita o montante que pode ser emprestado. Tokens colaterais são _burned_ na originação (não locked) e são _reminted_ pro rata conforme o empréstimo é repagado. O sistema mantém supercolateralização vinculando montantes emprestáveis a valores de cash-out, garantindo que o revnet permaneça solvente mesmo se todos os empréstimos entrarem em default.

## 2.4.1 Taking the loan

### Capacidade de empréstimo

O montante máximo emprestável com colateral $q_c$ é determinado pela função de cash-out:

$$L_{\text{gross}}(q_c) = C_k(q_c; S_{\text{eff}}, B_{\text{eff}}),\tag{10}$$

com valores efetivos que incluem empréstimos em aberto:

$$S_{\text{eff}} = S(t) + S_{\text{collateral}}(t),\tag{11}$$

$$B_{\text{eff}} = B(t) + B_{\text{borrowed}}(t).\tag{12}$$

Aqui $S(t)$ e $B(t)$ representam a oferta circulante atual e o saldo do tesouro (após o empréstimo ter sido emitido).$^2$ Essas fórmulas tratam o colateral queimado como se ainda estivesse em oferta, e tratam empréstimos em aberto como se fossem retidos no tesouro. Esse mecanismo de precificação garante solvência:

- **No sequencing advantages:** emprestadores posteriores obtêm quase os mesmos termos que os primeiros contra o próximo valor de cash-out.$^3$
    
- O sistema mantém solvência: emprestadores não podem extrair mais valor do que um cash-out direto forneceria (Ver Sec. 4 para a análise detalhada de solvência).
    

### Taxas de empréstimo

Ao tomar empréstimo, as taxas são deduzidas de $L_{\text{gross}}$ e são calculadas como:

$$F = \frac{f \cdot L_{\text{gross}}}{1000 + f}, \quad f \in [10, 500].\tag{13}$$

Em particular, três taxas são aplicadas:

1. **Protocol fee** $(F_{\text{NANA}})$: $f_{\text{NANA}} = 25$ cobrado pelo protocolo subjacente NANA Juicebox.
2. **REV fee** $(F_{\text{REV}})$: $f_{\text{REV}} = 10$ cobrado pelo ecossistema revnet REV.
3. **Prepay fee** $(F_{\text{prepaid}})$: Taxa de prepay variável escolhida pelo emprestador, variando de $f_{\text{prepaid}} \in [25, 500]$. Isso adquire uma janela de repagamento sem juros.

---

$^2$Equivalentemente, se $S_0$, $B_0$ são o estado pré-loan:

$$S(t) = S_0 - S_{\text{collateral}}(t), \quad B(t) = B_0 - B_{\text{borrowed}}(t).$$

$^3$Na verdade, emprestadores posteriores obtêm uma leve vantagem. A Prepay Fee é de fato usada para comprar tokens via o mecanismo de emissão. Isso aumenta ligeiramente a razão $B/S$ (Ver Sec. 3.2), aumentando assim o capital acessível para o mesmo montante emprestado.

Assim, o emprestador recebe:

$$L_{\text{net}} = L_{\text{gross}}(1 - F_{\text{NANA}} - F_{\text{REV}} - F_{\text{prepaid}}).\tag{14}$$

As taxas são encaminhadas como pagamentos de entrada para os respectivos Revnets, de modo que o emprestador também recebe $X^{\text{NANA}}$ \$NANA tokens de $F_{\text{NANA}}$, $X^{\text{REV}}$ \$REV tokens de $F_{\text{REV}}$, e $X^{\text{TOK}}$ \$TOK tokens de $F_{\text{prepay}}$$^4$.

## Duração do prepay

A taxa fonte compra um período de repagamento "free-free" proporcional ao montante prepago:

$$T_{\text{prepaid}} = \frac{f_{\text{prepaid}}}{500} \cdot T_{\text{liquidation}}\tag{15}$$

Onde $T_{\text{liquidation}} = 3650$ dias (10 anos).

Durante $T_{\text{prepaid}}$, o empréstimo pode ser repagado sem taxas adicionais. Por exemplo, se $f_{\text{prepaid}} = 25$ (∼ 2.5%) então o período de repagamento "free-free" será de 182.5 dias (∼6 meses).

## Atualizações de estado

Seja $U_i^{\text{ASSET}}(t)$ o saldo do usuário $i$ em um dado ativo, após tomar um empréstimo com $q_c$ tokens:

$$U_i^{$\text{TOK}}(t^+) = U_i^{$\text{TOK}}(t^-) - q_c + X^{\text{TOK}}, \quad \text{(Borrower's TOK balance)}$$

$$U_i^{$\text{RES}}(t^+) = U_i^{$\text{RES}}(t^-) + L_{\text{net}}, \quad \text{(Borrower's RES balance)}$$

$$U_i^{$\text{REV}}(t^+) = U_i^{$\text{REV}}(t^-) + X^{\text{REV}}, \quad \text{(Borrower's REV balance)}$$

$$U_i^{$\text{NANA}}(t^+) = U_i^{$\text{NANA}}(t^-) + X^{\text{NANA}}, \quad \text{(Borrower's NANA balance)}$$

Enquanto as variáveis de sistema agregadas atualizam como:

$$S(t^+) = S(t^-) - q_c, \quad \text{(Circulating supply (collateral burned))}$$

$$S_{\text{collateral}}(t^+) = S_{\text{collateral}}(t^-) + q_c, \quad \text{(Tracked collateral)}$$

$$B(t^+) = B(t^-) - (1 - F_{\text{prepaid}})L_{\text{gross}}, \quad \text{(Treasury balance)}$$

$$B_{\text{borrowed}}(t^+) = B_{\text{borrowed}}(t^-) + (1 - F_{\text{prepaid}})L_{\text{gross}}. \quad \text{(Loan obligation)}$$

---

$^4$ Onde: 
$$X^{\text{NANA}} = (1 - \sigma_k^{\text{NANA}}),\frac{F_{\text{NANA}} L^{\text{gross}}}{P_{\text{issue},k}^{\text{NANA}}(t)},$$

$$X^{\text{REV}} = (1 - \sigma_k^{\text{REV}}),\frac{F_{\text{REV}} L^{\text{gross}}}{P_{\text{issue},k}^{\text{REV}}(t)},$$

$$X^{\text{TOK}} = (1 - \sigma_k),\frac{F_{\text{source}} L^{\text{gross}}}{P_{\text{issue},k}(t)}.$$
# 2.4.2 Repaying the loan

Ao repagar um empréstimo, o emprestador especifica quanto colateral recuperar ($q_{\text{return}}$) e um montante máximo de repagamento ($R_{\text{max}}$). O sistema calcula o repagamento necessário e o tempo decorrido da seguinte forma.

Seja o emprestador com:

- Depositado $q_c$ tokens como colateral no tempo $t_{\text{created}}$
- Borrowed gross amount $L_{\text{gross}}$
- Paid prepaid fee with parameter $f_{\text{prepaid}}$
- Current time $t$ with elapsed time $\Delta t = t - t_{\text{created}}$

Ao repagar, o emprestador deseja recuperar $q_{\text{return}}$ collateral, deixando:

$$C_{\text{new}} = q_c - q_{\text{return}}.\tag{16}$$

O sistema calcula o novo montante emprestável baseado no colateral remanescente:

$$L_{\text{new}} = C_k(C_{\text{new}}; S_{\text{eff}}, B_{\text{eff}}).\tag{17}$$

O principal que deve ser repago para suportar essa redução de colateral é:

$$P_{\text{repay}} = L_{\text{gross}} - L_{\text{new}}.\tag{18}$$

Isso garante que o empréstimo permaneça supercolateralizado após o repagamento parcial.

## Total repayment

O montante total devido é:

$$R(t) = P_{\text{repay}} + F_{\text{time}}(t),\tag{19}$$

onde $F_{\text{time}}(t)$ é uma taxa dependente do tempo.

O montante de repagamento é dividido em duas operações:

1. **Principal** $(P_{\text{repay}})$: Retornado ao revnet, restaurando o saldo do tesouro sem mintar tokens.
    
2. **Source fee** $(F_{\text{time}})$: Pago ao revnet como um pagamento padrão, que minta \$TOK para o beneficiário e aumenta o saldo do revnet.
    

## Time-dependent fee

A taxa adicional dependente do tempo depende de quando o repagamento ocorre:

**Case 1: Within prepaid period** $(\Delta t \leq T_{\text{prepaid}})$

$$F_{\text{time}}(t) = 0.\tag{20}$$

**Case 2: After prepaid period but before liquidation** $(T_{\text{prepaid}} < \Delta t \leq T_{\text{liquidation}})$

Primeiro, calcule o montante originalmente prepago:

$$F_{\text{prepaid}} = \frac{f_{\text{prepaid}} \cdot L_{\text{gross}}}{1000 + f_{\text{prepaid}}}\tag{21}$$

A porção não paga do empréstimo é:

$$L_{\text{unpaid}} = L_{\text{gross}} - F_{\text{prepaid}}.\tag{22}$$

Uma taxa baseada no tempo aumenta linearmente de 0 a 1000 ao longo do período de empréstimo remanescente:

$$\phi(t) = \frac{t - t_{\text{created}} - T_{\text{prepaid}}}{T_{\text{liquidation}} - T_{\text{prepaid}}} \cdot 1000.\tag{23}$$

A taxa fonte completa (se o empréstimo inteiro fosse repago no tempo $t$) é:

$$F_{\text{full}}(t) = \frac{\phi(t) \cdot L_{\text{unpaid}}}{1000 + \phi(t)}.\tag{24}$$

Para repagamento parcial, a taxa fonte é proporcional ao principal sendo repago:

$$F_{\text{time}}(t) = \frac{P_{\text{repay}}}{L_{\text{gross}}} \cdot F_{\text{full}}(t).\tag{25}$$

**Case 3: After liquidation period** $(\Delta t > T_{\text{liquidation}})$

O empréstimo não pode mais ser repago; ele deve ser liquidado (veja abaixo).

## State updates

Seja $U_i^{\text{ASSET}}(t)$ o saldo do usuário $i$ em um dado ativo, após repagar um empréstimo com $q_c$ tokens:

$$U_i^{$\text{RES}}(t^+) = U_i^{$\text{RES}}(t^-) - R(t), \quad \text{(Borrower's base asset balance)}$$

$$U_i^{$\text{TOK}}(t^+) = U_i^{$\text{TOK}}(t^-) + q_{\text{return}}, \quad \text{(Borrower's TOK balance)}$$

Enquanto as variáveis de sistema agregadas atualizam como:

$$B(t^+) = B(t^-) + R(t), \quad \text{(Treasury balance)}$$

$$S(t^+) = S(t^-) + q_{\text{return}}, \quad \text{(Circulating supply)}$$

$$S_{\text{collateral}}(t^+) = S_{\text{collateral}}(t^-) - q_{\text{return}}, \quad \text{(Tracked collateral)}$$

$$B_{\text{borrowed}}(t^+) = B_{\text{borrowed}}(t^-) - P_{\text{repay}}. \quad \text{(Loan obligation)}$$

O colateral retornado é remintado para o emprestador, e a obrigação do empréstimo é reduzida pelo principal repago.

# 2.4.3 Liquidation

Se um empréstimo permanece não pago além do período de liquidação, ele se torna liquidável por qualquer pessoa. Um empréstimo pode ser liquidado se:

$$\Delta t = t - t_{\text{created}} > T_{\text{liquidation}} = 3650 \text{ days}.\tag{26}$$

Para cada empréstimo liquidado:

1. O loan NFT é queimado
2. A contabilidade é atualizada:
$$S_{\text{collateral}}(t^+) = S_{\text{collateral}}(t^-) - q_c,\tag{27}$$

$$B_{\text{borrowed}}(t^+) = B_{\text{borrowed}}(t^-) - L_{\text{gross}}.\tag{28}$$

3. A oferta de tokens atual $S(t)$ e o saldo do tesouro $B(t)$ permanecem inalterados

# 3 Price Dynamics and Arbitrage Mechanisms

O preço de emissão do usuário (Eq. 4) e os preços de cash-out (Eq. 9) definem os preços de teto e piso de \$TOK, respectivamente. Para mostrar isso, vamos assumir que no tempo $t^*$ uma AMM emerge com preço $P^{\text{AMM}}$.

## 3.1 Definition of the Price Corridor

### Price Ceiling

Se $P^{\text{AMM}} > P_{\text{issue}}^{\text{user}}$, um arbitrador iria:

1. Comprar $q$ \$TOK no revnet ao preço de emissão atual em troca de $x^{\text{in}}$ \$RES, i.e. $q = \frac{x^{\text{in}}}{P_{\text{issue}}^{\text{user}}}$;
    
2. Vender todos os $q$ tokens por $x^{\text{AMM}}$ base tokens ao preço atual da AMM, i.e. $x^{\text{out}} = P^{\text{AMM}}q$
    
3. Como $P^{\text{AMM}} > P_{\text{issue}}^{\text{user}}$, então $x^{\text{out}} > x^{\text{in}}$.
    

Assim, se $P^{\text{AMM}} > P_{\text{issue}}^{\text{user}}$, um arbitrador compra \$TOK através do Revnet, vendendo-os na AMM por \$RES.

Isso demonstra que $P_{\text{issue}}^{\text{user}}$ define o _price ceiling_ de \$TOK:

$$\boxed{P^{\text{ceil}}(t) = P_{\text{issue}}^{\text{user}}(t) = \frac{P_{\text{issue},k}(t)}{1 - \sigma_k}}\tag{29}$$

### Price Floor

Se $P^{\text{AMM}} < P_{\text{cash-out}}^{\text{user}}$, um arbitrador iria:

1. Comprar $q$ \$TOKS em troca de $x^{\text{in}}$ \$RES na AMM ao preço atual da AMM, i.e. $q = \frac{x^{\text{in}}}{P^{\text{AMM}}}$

2. Cash-out os $q$ \$TOKs por $x^{\text{out}}$ ao preço atual de cash-out do revnet, i.e. $x^{\text{out}} = P_{\text{cash-out}}^{\text{user}}q$ 
3. Como $P^{\text{AMM}} < P_{\text{cash-out}}^{\text{user}}$, então $x^{\text{out}} > x^{\text{in}}$

Assim, se $P^{\text{AMM}} < P_{\text{cash-out}}^{\text{user}}$ um arbitrador compra \$TOK através da AMM, fazendo cash-out deles no Revnet por \$RES.

Assim, o preço de cash-out do usuário para resgatar $q$ tokens $P_{\text{cash-out}}^{\text{user}}(q)$ define o piso de preço efetivo de \$TOK para um tamanho de resgate $q$, i.e. o _redemption-dependent price floor_:

$$\boxed{\tilde{P}_{\text{floor}}(q) = (0.975)^2\frac{B}{S}\left[(1-r_k) + r_k\frac{(0.975)q}{S}\right] = P_{\text{cash-out}}^{\text{user}}(q)}\tag{30}$$

No entanto, como $P_{\text{cash-out}}^{\text{user}}$ é uma função crescente da quantidade resgatada $q$, resgates maiores produzem pagamentos por token progressivamente mais altos. Para obter um piso absoluto que seja independente do tamanho do cash-out, consideramos o preço de resgate marginal no $q$ infinitesimal, que define o _redemption-independent price floor_ efetivo:

$$\boxed{P_{\text{floor}} = \lim_{q \to 0} \tilde{P}_{\text{floor}}(q) = (1-r_k)(0.975)^2\frac{B}{S} \approx (1-r_k) \cdot 0.951 \cdot \frac{B}{S}}\tag{31}$$

Esse valor marginal representa o menor preço de resgate alcançável e, portanto, constitui um limite inferior estrito para o preço racional de mercado secundário de \$TOK.

## Price Corridor

As oportunidades de arbitragem definem um corredor de preço para o preço de \$TOK, i.e. a qualquer momento $t$, isso mantém:

$$P^{\text{floor}} \leq P^{\text{AMM}} \leq P^{\text{ceil}}\tag{32}$$

Esta é a janela para a emergência de um preço de mercado $P^{\text{AMM}}$.

# 3.2 Price Corridor Dynamics

O **price ceiling** $P^{\text{ceil}}$ aumenta automaticamente ao longo do tempo, já que os cronogramas de preço de emissão são hard-coded para subir independentemente da atividade da rede (Ver Eq. 2).

O **price floor** $P^{\text{floor}}$ é proporcional à razão entre o estado atual do tesouro $B$ e os tokens em circulação atuais $S$, i.e. $P^{\text{floor}} \propto \frac{B}{S}$. Por essa razão, $P^{\text{floor}}$ evolui como uma função da atividade da rede.

Para analisar como o price floor muda, tomamos a diferencial de $P^{\text{floor}} = k \cdot d \cdot \frac{B}{S}$:

$$dP^{\text{floor}} = k \cdot d\left(\frac{B}{S}\right) = k\frac{S,dB - B,dS}{S^2} = P^{\text{floor}} \cdot \frac{S,dB - B,dS}{BS}\tag{33}$$

O floor price aumenta quando $dP^{\text{floor}} > 0$, o que requer:

$$S,dB - B,dS > 0 \quad \Leftrightarrow \quad \frac{dB}{dS} \begin{cases} > \frac{B}{S}, & \text{if } dS > 0, \ < \frac{B}{S}, & \text{if } dS < 0. \end{cases}$$

Equivalentemente, para eventos discretos no tempo $t^+$ causando mudanças $\Delta b$ e $\Delta s$:

$$\frac{\Delta b}{\Delta s} \begin{cases} > \frac{B(t)}{S(t)}, & \text{if } \Delta s > 0, \ < \frac{B(t)}{S(t)}, & \text{if } \Delta s < 0. \end{cases}\tag{34}$$

## Price floor during issuance

Durante uma emissão, o revnet recebe $x$ base assets, mintando novos tokens ao preço de teto:

$$\Delta b = x > 0$$

$$\Delta s = \frac{x}{P^{\text{ceil}}} > 0$$

Portanto:

$$\frac{\Delta b}{\Delta s} = P^{\text{ceil}}$$

A condição na Eq. 34 vale se:

$$P^{\text{ceil}} > \frac{B}{S} \approx P^{\text{floor}}$$

Assim, se o price ceiling excede o price floor, um evento de emissão aumenta o price floor. Caso contrário, o price floor diminui.

## Price floor during a cash-out

Durante um cash-out, o revnet queima $q$ circulating tokens, resgatando $C_{\text{tot}}(q)$ base assets para o usuário:

$$\Delta b = -C_{\text{tot}}(q) < 0$$

$$\Delta s = -q < 0$$
O price floor aumenta se a condição na Eq. 34 vale, requerendo:

$$\frac{\Delta b}{\Delta s} = \frac{C_{\text{tot}}(q)}{q} < \frac{B}{S}$$

Por definição da função de cash-out (Ver Eq. 5), essa condição é sempre satisfeita:

$$\frac{C_{\text{tot}}(q)}{q} = \frac{B}{S}\left[(1-r_k) + r_k\frac{q}{S}\right] < \frac{B}{S}$$

onde a desigualdade vale já que $(1-r_k) + r_k\frac{q}{S} < 1$ para $q < S$. Assim, cash-outs sempre aumentam o price floor.

## Price floor during a loan

Durante a **issuance of a loan**, o usuário queima $q_c$ circulating tokens, tomando emprestado $L_{\text{gross}}$ base assets do revnet:

$$\Delta b = -L_{\text{gross}}(1 - F_{\text{prepaid}}) < 0$$

$$\Delta s = -q_c < 0$$

Por construção (Ver Eq. 10), emprestadores não podem extrair mais do que poderiam através de resgate direto:

$$L_{\text{gross}}(q_c) = C_{\text{tot}}(q_c, S_{\text{eff}}, B_{\text{eff}}) \leq C_{\text{tot}}(q_c, B, S)$$

Portanto, a condição na Eq. 34 vale:

$$\frac{L_{\text{gross}}(1 - F_{\text{prepaid}})}{q_c} < \frac{L_{\text{gross}}}{q_c} \leq \frac{C_{\text{tot}}(q_c)}{q_c} < \frac{B}{S}$$

Assim, emissões de empréstimo sempre aumentam o price floor.

Durante o **repayment of a loan**, o usuário paga $P_{\text{repay}}$ base assets para reclamar $q_c$ tokens. Para repagamento completo:

$$\Delta b = L_{\text{gross}} > 0$$

$$\Delta s = q_c > 0$$

Como:

$$\frac{\Delta b}{\Delta s} = \frac{L_{\text{gross}}}{q_c} \leq \frac{C_{\text{tot}}(q_c)}{q_c} < \frac{B}{S}$$

a condição na Eq. 34 não é satisfeita, e o price floor diminui.

Durante a **liquidation of a loan**:

$$\Delta b = 0$$

$$\Delta s = 0$$

Portanto, $\Delta P^{\text{floor}} = 0$.

## Price floor during auto-issuance

Durante um evento de auto-issuance:

$$\Delta b = 0$$

$$\Delta s = \mathcal{A}_k > 0$$

Como $\Delta b = 0$ enquanto $\Delta s > 0$, temos $\frac{\Delta b}{\Delta s} = 0 < \frac{B}{S}$, então a condição na Eq. 34 nunca é satisfeita. Assim, auto-issuances sempre diminuem o price floor.

## 3.3 Summary

Os mecanismos de arbitragem entre o Revnet e AMMs externas estabelecem propriedades fundamentais do preço de \$TOK ao longo do tempo:

• **Price Corridor**: Oportunidades de arbitragem criam um corredor de preço bem definido onde $P^{\text{floor}} \leq P^{\text{AMM}} \leq P^{\text{ceil}}$ a qualquer momento $t$. Isso delimita o preço de mercado entre o valor de cash-out (floor) e o preço de emissão do usuário (ceiling).

• **Ceiling Dynamics**: O price ceiling $P^{\text{ceil}}$ aumenta monotonicamente ao longo do tempo de acordo com o cronograma de emissão hard-coded, independente da atividade da rede.

• **Floor Dynamics**: O price floor $P^{\text{floor}} \propto \frac{B}{S}$ evolui com base na atividade da rede conforme detalhado na Tabela 2.

• **Value Accrual**: O mecanismo crescente de price floor garante que o valor se acumula aos detentores de \$TOK através da maioria das interações dos usuários com o Revnet, criando um loop de feedback positivo entre atividade de rede e valor do token.

• **Loan**: O ciclo completo de empréstimo (originação seguida por repagamento completo dentro do período prepaid) tem um efeito não-zero no price floor, com o aumento no floor price causado pela prepaid fee.

• **Autoissuance**: Eventos de auto-issuance têm um efeito negativo no price floor, já que aumentam a oferta sem um aumento correspondente no saldo do tesouro.

---

**Tabela 2: Efeito dos Eventos de Rede no Price Floor**

| **Event**        | **Δb** | **Δs** | **Price Floor Effect** | **Condition**                           |
| ---------------- | ------ | ------ | ---------------------- | --------------------------------------- |
| Token Issuance   | > 0    | > 0    | ==**📈Increases**==    | if $P^{\text{ceil}} > P^{\text{floor}}$ |
| Cash-out         | < 0    | < 0    | ==**📈Increases**==    | Always                                  |
| Loan Issuance    | < 0    | < 0    | ==**📈Increases**==    | Always                                  |
| Loan Repayment   | > 0    | > 0    | ==**📉Decreases**==    | Always                                  |
| Loan Liquidation | 0      | 0      | **No Change**          | -                                       |
| Auto-issuance    | 0      | > 0    | ==**📉Decreases**==    | Always                                  |

---

Essas dinâmicas criam um sistema onde o preço do token tem tanto pressão ascendente do ceiling crescente quanto suporte de um floor orientado por atividade, estabelecendo uma apreciação de valor sustentável.

# 4 Loan Solvency Analysis

Nesta seção, provamos que o sistema de empréstimo Revnet é _always_ solvente, significando que o sistema pode honrar todas as obrigações tanto para os detentores de empréstimos quanto para os detentores de tokens circulantes, independentemente da atividade de empréstimo ou defaults.

## 4.1 The Solvency Guarantee

Um sistema de empréstimo é **solvent**: _if all circulating token holders can redeem their proportional share of the treasury at any time, regardless of outstanding loan activity or defaults._

No contexto do Revnets, solvência requer que a oferta de tokens circulantes $S(t)$ possa resgatar totalmente o saldo do tesouro $B(t)$ em todos os momentos.

**Theorem 4.1** (Loan Solvency). _The Revnet loan system maintains solvency for any number of loans, any loan sizes, and any sequence of operations, including defaults._

_Proof._ Pela forma funcional da curva de resgate (Eq. 5), para qualquer estado $(S, B)$:

$$C_k(S; S, B) = B.\tag{35}$$

Considere emitir $n$ empréstimos sequencialmente:

$$S(t) = S(t_0) - \sum_{i=1}^{n} q_i,$$

$$B(t) = B(t_0) - \sum_{i=1}^{n} L_i.$$

onde $L_i = C_k(q_i; S_{\text{eff}}(t_i), B_{\text{eff}}(t_i))$ é determinado pelo estado efetivo na emissão do empréstimo.

Aplicando Eq. 35 ao estado atual:

$$C_k(S(t); S(t), B(t)) = B(t).$$

Portanto, a oferta circulante remanescente pode sempre resgatar totalmente o tesouro remanescente. Isso garante que cada detentor de token pode sempre acessar o capital de backing de seus tokens, mantendo a solvência independentemente da atividade de empréstimo em aberto.

## 4.2 Overcollateralization

O sistema de empréstimo não apenas mantém solvência, mas é _overcollateralized_: emprestadores recebem estritamente menos que sua parcela proporcional do tesouro. De fato, como:

$$C_k(q; S, B) \leq \frac{q}{S} \cdot B, \quad \forall r_k \in [0,1]$$

Então podemos definir a margem de supercolateralização como:

$$\text{Margin} = \frac{q}{S}B - C_k(q; S, B) = \frac{q}{S}B \cdot r_k\left(1 - \frac{q}{S}\right).\tag{36}$$

Como uma porcentagem da parcela justa (fair share):

$$ \text{Margin\%} = r_k\left(1 - \frac{q}{S}\right) \times 100\% \tag{37} $$
# 4.3 Solvency Under Default

Em empréstimos Revnet, "liquidation" é puramente administrativa: o colateral é queimado na criação do empréstimo (não na liquidação), e a liquidação após $T_{\text{liquidation}} = 3650$ dias apenas atualiza os contadores $S_{\text{collateral}}$ e $B_{\text{borrowed}}$ sem mudar o estado real $(S, B)$.

**Corollary 4.2** (Solvency Under Default). If all outstanding loans default, the system remains solvent.

**Proof**. Após default, o estado real $(S(t), B(t))$ permanece inalterado já que o colateral já foi queimado e os fundos do tesouro já foram subtraídos do tesouro na criação do empréstimo. Portanto:
$$C_k(S(t); S(t), B(t)) = B(t),$$

A solvência é mantida, ao contrário dos sistemas de empréstimo tradicionais onde a liquidação envolve vender colateral para recuperar fundos, os empréstimos Revnet são "pré-liquidados" na emissão: o colateral é imediatamente queimado, e \$RES tokens são emprestados ao emprestador em um montante que sempre garante solvência do sistema. O que é chamado de "liquidation" no Revnet é meramente uma atualização contábil que reconhece que um empréstimo expirou, sem qualquer mudança real de ativos. 

Além disso, defaults melhoram a razão de backing: conforme provado no piso de preço dinâmico (Sec. 3.2), a emissão de empréstimo aumenta $B/S$ enquanto o repagamento a diminui. Quando um empréstimo entra em default, o aumento $B/S$ da emissão se torna permanente, melhorando para sempre o backing para os detentores de tokens remanescentes.

## 4.4 Summary

O sistema de empréstimo Revnet alcança solvência garantida através de sua construção matemática:

1. **Total redemption property:** A curva de resgate satisfaz $C_k(S; S, B) = B$ para qualquer estado, garantindo que os tokens remanescentes podem sempre resgatar o tesouro remanescente independentemente da atividade de empréstimo.
2. **Effective values accounting:** As variáveis de estado $S_{\text{eff}}$ e $B_{\text{eff}}$ garantem que todos os empréstimos sejam precificados contra um estado de referência consistente, prevenindo vantagens de sequenciamento.
3. **Pre-liquidation at issuance:** Ao queimar colateral e emprestar fundos supercolateralizados na criação do empréstimo, o sistema elimina os riscos tradicionais de liquidação e garante que defaults não comprometem a solvência.
    

Além disso:

• **Unconditional solvency:** O sistema permanece solvente para qualquer número de empréstimos, qualquer tamanho de empréstimo, e qualquer cenário de default.
• **Overcollateralization:** Cada empréstimo é automaticamente supercolateralizado por margem $r_k(1-q/S)$, fornecendo segurança adicional.
• **Defaults improve backing:** Quando empréstimos entram em default, os detentores de tokens remanescentes se beneficiam. De fato, tanto o tesouro quanto a oferta permanecem reduzidos, mas já que o
• **No liquidation risk:** O design de pré-liquidação elimina risco de misliquidation, dependência de oráculos e cascatas de liquidação.

This solvency guarantee emerges directly from the mathematical properties of the redemption curve, without requiring external oracles, active liquidation mechanisms, or governance intervention.

# 5 Rational Actor Analysis: Cash-out vs Hold vs Loan Decision

Um detentor de token com $q$ tokens no tempo $t$ pode vender esses tokens através de:

• **Direct cash-out:** $P^{\text{sell}}(t_0, q) = P^{\text{floor}}(t_0, q)$ (Ver Eq. 30) descontando taxas de rede (REV e NANA).

• **AMM sale:** $P^{\text{sell}}(t_0, q) = P^{\text{AMM}}(t_0, q)$

O detentor assim enfrenta três estratégias fundamentais:

## Strategy A: Exit immediately

Resgatar tokens no tempo $t_0$ para liquidez imediata:

$$X(t_0) = q P^{\text{sell}}(t_0, q)\tag{38}$$

## Strategy B: Hold

Manter a posição de token até o tempo futuro $t_1$ e sair:

$$X(t_1) = q P^{\text{sell}}(t_1, q)\tag{39}$$

## Strategy C: Loan

Tomar emprestado contra tokens no tempo $t_0$, repagar em $t_1$, então sair:

$$\text{Borrow at } t_0: X_l = aC_k(q; S_{\text{eff}}(t_0), B_{\text{eff}}(t_0))$$

$$\text{Repay at } t_1: L_{\text{gross}} = C_k(q; S_{\text{eff}}(t_0), B_{\text{eff}}(t_0))$$

$$\text{Exit at } t_1: L_{\text{gross}} = q P^{\text{sell}}(t_1, q)$$

$$\text{Cost}: L_{\text{gross}} - X_l = (1-a)C_k(q; S_{\text{eff}}(t_0), B_{\text{eff}}(t_0))$$

onde $a$ representa os proceeds líquidos do empréstimo após taxas:$^5$

$$a = \begin{cases} 0.945, & \text{if } f_{\text{prepaid}} = 25 \text{ (6-month window)} \ 0.625, & \text{if } f_{\text{prepaid}} = 500 \text{ (10-year window)} \end{cases}\tag{40}$$

Nesta seção, analisamos essas estratégias de duas perspectivas:

1. **Non-forward-looking investors**: Comparar apenas payoffs imediatos (Exit vs loan em $t_0$), tratando holding como não sendo uma opção
    
2. **Forward-looking investors**: Comparar todas as três estratégias sobre o horizonte de tempo $[t_0, t_1]$, considerando oportunidades de apreciação de preço futuro
    

---

$^5$ $L_{\text{gross}} = C_k(q; S_{\text{eff}}, B_{\text{eff}})$ e $L_{\text{net}} = L_{\text{gross}}(1 - F_{\text{NANA}} - F_{\text{REV}} - F_{\text{prepaid}}) = C_k(q)a$, onde $F^{\text{NANA}} = \frac{25}{1025} \approx 0.025$, $F^{\text{REV}} = \frac{10}{1010} \approx 0.01$, e $F^{\text{prepaid}} = \frac{f_{\text{prepaid}}}{1000+f_{\text{prepaid}}}$ com $f_{\text{prepaid}} \in [25, 500]$, dando $a \approx 1-0.035-F^{\text{prepaid}}$. Em particular $a \in [0.632, 0.941]$.

# 5.1 Non-Forward-Looking Investor: Loan vs Cash-out

Um investidor non-forward-looking prioriza acesso imediato à liquidez no tempo $t_0$, desconsiderando potencial de apreciação futura do token. Para tal investidor, **holding is not considered**. A decisão se reduz a comparar os payoffs imediatos de cash-out versus um empréstimo.

Consideramos $S_{\text{eff}} = S$ e $B_{\text{eff}} = B$ i.e., não há empréstimos em aberto. Então, cash-out domina se:

$$X_{\text{exit}} > X_{\text{loan}} \quad \Rightarrow \quad 0.975C_k(0.975q; S, B) > aC_k(q; S, B)$$

Substituindo a curva de resgate (Eq. 5) e definindo $x = q/S$ como a fração da oferta total:

$$(0.975)^2[(1 - r_k) + r_k \cdot 0.975 \cdot x] > a \cdot [(1 - r_k) + r_k x]$$

Rearranjando dá a condição limiar:

$$\boxed{a < a^*(x, r_k) = (0.975)^2 \frac{(1 - r_k) + r_k \cdot 0.975 \cdot x}{(1 - r_k) + r_k \cdot x}}\tag{41}$$

Aqui está a versão completamente corrigida:

**For $a < a^*$, cash-out dominates; for $a > a^*$, loan dominates.**

O limiar $a^*$ depende de:

• **Position size** $x = q/S$: Posições maiores se beneficiam mais da curva de resgate convexa

• **Cash-out tax** $r_k$: Taxas mais altas favorecem empréstimos sobre cash-outs

• **Prepaid-fee** $f_{\text{prepaid}}$: Increasing the prepaid fee rapidly reduces the immediate payoff of loans of any size. For $f_{\text{prepaid}} > 4\%$, cash-outs always access more liquidity than loans.


A Figura 3 mostra as regiões de decisão. Principais descobertas:

- Se $r_k < 39.16\%$ : Mesmo com taxas de empréstimo mínimas ($a = 0.945$, janela de pagamento mais curta), o cash-out sempre fornece mais liquidez imediata. O cash-out domina para todos os usuários míopes.
- Se $r_k > 39.16\%$: Empréstimos tornam-se competitivos para posições maiores ($x$ alto) com janelas de pagamento curtas ($f_{\text{prepaid}}$ baixo, $a$ alto). A região onde os empréstimos dominam encolhe à medida que as janelas de pagamento aumentam.
![[Pasted image 20251126195628.png]]
### Figura 3:

Regiões de decisão para investidores não-prospectivos (que não olham para o futuro) comparando retornos imediatos. Azul: cash-out domina; verde: empréstimo domina. Os painéis mostram diferentes níveis de taxa pré-paga: $f_{\text{prepaid}} = 2.5\%$ (6 meses), 3% (7 meses), e 3.5% (8 meses). A linha tracejada vermelha no primeiro painel marca a taxa de imposto crítica $r_k^* \approx 39.16\%$ , acima da qual os empréstimos se tornam competitivos mesmo para janelas de pagamento curtas.

---

## Confirmação analítica:

Diferenciando a Eq. 41 mostra-se que

$$
\frac{\partial a^*}{\partial r_k}
= 0.975^2 \, \frac{-0.025x}{\left[ 1 + r_k (x - 1) \right]^2}
\le 0 \quad \forall x, r_k,
$$

portanto, um $r_k$ maior reduz $a^*$ , expandindo a região onde os empréstimos dominam.

Para investidores míopes focados apenas em liquidez imediata:

1. **Regimes de baixa taxa de cash-out** ( $r_k < 39\%$ ) favorecem o resgate direto.
2. **Regimes de alta taxa de cash-out** ( $r_k > 39\%$ ) podem tornar os empréstimos atraentes, especialmente para grandes detentores com janelas de pagamento curtas.
3. **Períodos de pré-pagamento mais longos** (taxas mais altas) favorecem progressivamente os cash-outs em detrimento dos empréstimos.

Nesta análise assumimos $S_{\text{eff}} = S$ e $B_{\text{eff}} = B$ (nenhum empréstimo pendente). Quando existem empréstimos, $S_{\text{eff}} > S$ e $B_{\text{eff}} > B$ , caso em que$$C(q, S, B) > C(q, S_{\text{eff}}, B_{\text{eff}}),$$estreitando o espaço de parâmetros onde os empréstimos são preferidos.

### 5.2 Investidor Prospectivo (Forward-Looking): Sair vs Manter vs Emprestar

Um investidor prospectivo avalia estratégias ao longo do horizonte de tempo $[t_{0},t_{1}]$, contabilizando a valorização esperada do preço e as oportunidades de investimento. Agora **manter (holding) torna-se uma opção viável**, expandindo o espaço de decisão para três estratégias.
Seja $R$ a taxa de retorno em investimentos alternativos (ex: rendimentos DeFi, empréstimos de stablecoin, ...) entre $t_{0}$ e $t_{1}$.

**Estratégia A: Sair agora** Vender imediatamente e investir os proventos:
$$W_{A}(t_{1}) = P^{\text{sell}}(t_{0}, q) \cdot q \cdot (1 + R)\tag{42}$$
**Estratégia B: Manter** Manter a posição e vender em $t_{1}$:
$$W_{B}(t_{1}) = P^{\text{sell}}(t_{1}, q) \cdot q\tag{43}$$
**Estratégia C: Empréstimo** Tomar emprestado, investir os proventos, pagar, então vender:
$$W_{C}(t_{1}) = aC_{k}(q)(1 + R) - C_{k}(q) + P^{\text{sell}}(t_{1}, q) \cdot q\tag{44}$$

onde $C_{k}(q) = C_{k}(q; S(t_{0}), B(t_{0}))$ abrevia o montante passível de empréstimo.

#### 5.2.1 Sair vs Manter

Sair domina quando $W_{A} > W_{B}$:
$$(1 + R) > \frac{P^{\text{sell}}(t_{1}, q)}{P^{\text{sell}}(t_{0}, q)}\tag{45}$$

Saia se os retornos de investimento excederem a valorização esperada do token. Isso classifica naturalmente por convicção: pessimistas saem, otimistas mantêm.

#### 5.2.2 Empréstimo vs Manter

Empréstimo domina quando $W_{C} > W_{B}$:
$$aC_{k}(q)(1 + R) - C_{k}(q) + P^{\text{sell}}(t_{1}, q) \cdot q > P^{\text{sell}}(t_{1}, q) \cdot q$$
$$C_{k}(q)[a(1 + R) - 1] > 0$$

Assim:
$$R > R^{*} = \frac{1 - a}{a}\tag{46}$$

**Limiares Críticos:**
* Empréstimo de 6 meses ($a = 0.941$): $R^{*} = 5.8\%$ ($11.6\%$ anualizado)
* Empréstimo de 10 anos ($a = 0.632$): $R^{*} = 60\%$ ($6\%$ anualizado)

Quando existem oportunidades de investimento produtivo ($R > R^{*}$), manter tokens ociosos é subótimo. Empréstimos permitem a implantação de capital enquanto mantêm a exposição, dominando estritamente a estratégia de manter.

#### 5.2.3 Empréstimo vs Sair (Base: $R=0$)

Considere o caso sem oportunidades de investimento. Empréstimo domina sair quando $W_{C} > W_{A}$ com $R=0$:
$$P^{\text{sell}}(t_{1}, q) \cdot q - (1 - a)C_{k}(q) > P^{\text{sell}}(t_{0}, q) \cdot q$$

Reorganizando:
$$\Delta P^{\text{sell}} > (1 - a)\tilde{P}^{\text{floor}}(t_{0}, q)\tag{47}$$

onde $\tilde{P}^{\text{floor}}(t_{0}, q) = C_{k}(q, S(t_{0}), B(t_{0}))/q$ é o preço piso dependente do tamanho do resgate (Eq. 30).
Assim, sem oportunidades de investimento, empréstimos são justificados apenas pela valorização de preço esperada excedendo o custo do empréstimo $(1 - a)$. Para empréstimos de 6 meses, isso requer $5.5\%$ de valorização ($\sim 11\%$ de crescimento anual); para empréstimos de 10 anos, $37.5\%$ ($\sim 3.7\%$ de crescimento anual).

**Sem AMM (apenas cash-out direto).** Quando nenhum AMM está presente, então o usuário pode sair apenas através do mecanismo de cash-out, portanto $P^{\text{sell}}(t, q) = P^{\text{floor}}(t, q)$, e a condição na Eq. 47 torna-se:
$$q\tilde{P}^{\text{floor}}(t_{1}, q) - q\tilde{P}^{\text{floor}}(t_{0}, q) > (1 - a)q\tilde{P}^{\text{floor}}(t_{0}, q)$$

Substituindo:
$$0.975C_{k}(0.975q; S(t_{1}), B(t_{1})) - 0.975C_{k}(0.975q; S(t_{0}), B(t_{0})) > (1 - a)C_{k}(q; S_{\text{eff}}(t_{0}), B_{\text{eff}}(t_{0}))$$

Assumindo nenhum empréstimo pendente inicialmente ($S_{\text{eff}} = S, B_{\text{eff}} = B$), isso se torna:
$$0.975C_{k}(0.975q; S(t_{1}), B(t_{1})) > (1 - a)C_{k}(q; S(t_{0}), B(t_{0})) + 0.975C_{k}(0.975q; S(t_{0}), B(t_{0}))$$

Expandindo as curvas de resgate, chegamos à condição:
$$0.975^{2}\frac{B(t_{1})}{S(t_{1})}\left[(1 - r_{k}) + r_{k}\frac{0.975q}{S(t_{1})}\right] > (1 - a)\frac{B(t_{0})}{S(t_{0})}\left[(1 - r_{k}) + r_{k}\frac{q}{S(t_{0})}\right] + 0.975^{2}\frac{B(t_{0})}{S(t_{0})}\left[(1 - r_{k}) + r_{k}\frac{0.975q}{S(t_{0})}\right]$$

**Caso 1: Sem taxa de cash-out ($r_{k} = 0$)**
Quando $r_{k} = 0$, a Eq. 5.2.3 simplifica para:
$$\frac{B(t_{1})}{S(t_{1})} > \frac{1 - a + 0.975^{2}}{0.975^{2}}\frac{B(t_{0})}{S(t_{0})} \Rightarrow P^{\text{floor}}(t_{1}) > \gamma^{*}P^{\text{floor}}(t_{0})$$

O fator de crescimento do preço piso necessário é:
$$\gamma = \frac{P^{\text{floor}}(t_{1})}{P^{\text{floor}}(t_{0})} > \gamma^{*}\tag{48}$$
Para um empréstimo de 10 anos, $a = 0.632$, $\gamma^{*} \approx 1.368$, significando uma valorização de $36.8\%$ do preço piso ao longo do período do empréstimo é necessária para justificar a tomada de um empréstimo. Isso se traduz em aproximadamente $3.07\%$ de crescimento anual. Para um empréstimo de 6 meses $a = 0.941$, assim $\gamma^{*} \approx 1.06$. Neste caso, $6\%$ de valorização do preço piso é necessária, o que é cerca de $12\%$ anualmente.

![[Pasted image 20251126201821.png]]

**Figura 4:** Taxa anual de valorização do preço piso (em %) necessária para a estratégia de empréstimo superar o cash-out imediato, como função do tamanho da posição ($x_{0}$, fração da oferta total) e taxa de cash-out ($r$). Os três painéis correspondem a diferentes níveis de taxa pré-paga: $f_{\text{prepaid}} = 2.5\%$ (janela de 6 meses sem juros, $a = 0.941$), $f_{\text{prepaid}} = 10\%$ (janela de 2 anos, $a = 0.875$), e $f_{\text{prepaid}} = 50\%$ (janela de 10 anos, $a = 0.632$). Contornos mais altos indicam regiões de parâmetros que exigem um crescimento mais forte do preço piso para justificar empréstimos em detrimento do cash-out imediato. Os gráficos mostram que taxas de cash-out mais altas *aumentam* o limite de crescimento necessário, e que janelas de pagamento mais curtas ($f_{\text{prepaid}}$ mais baixo) aumentam o requisito da taxa anualizada.

### Caso 2: Com taxa de cash-out ($r_{k} > 0$)

Para posições pequenas onde $q/S \to 0$, a condição se aproxima de:

$$\gamma^{*} \approx 1 + \frac{1 - a}{0.975^{2}}$$

Isso é idêntico ao caso $r_{k} = 0$, mostrando que a taxa de cash-out tem impacto mínimo em posições pequenas.

Para posições maiores, definindo $x_{0} = q/S(t_{0})$ e assumindo $x_{1} \approx x_{0}$ (o tamanho da posição permanece pequeno em relação às mudanças totais da oferta), a condição completa da Eq. 5.2.3 fornece:

$$\gamma^{*} = \frac{(1 - a)[(1 - r_{k}) + r_{k}x_{0}] + 0.975^{2}[(1 - r_{k}) + 0.975r_{k}x_{0}]}{0.975^{2}[(1 - r_{k}) + 0.975r_{k}x_{0}]}\tag{49}$$
Simplificando:

$$\gamma^{*} = 1 + \frac{(1 - a)[(1 - r_{k}) + r_{k}x_{0}]}{0.975^{2}[(1 - r_{k}) + 0.975r_{k}x_{0}]}\tag{50}$$
Como é mostrado na Fig. 4, à medida que $r_{k}$ aumenta, a valorização do preço piso $\gamma^{*}$ *aumenta*, tornando os empréstimos *menos atraentes* em relação ao cash-out imediato.$^{6}$ Economicamente, taxas de cash-out mais altas criam dois efeitos opostos: elas penalizam o resgate imediato, mas também reduzem o valor efetivo obtido dos empréstimos (visto que os empréstimos são precificados contra a curva de resgate completa). O resultado líquido é que taxas mais altas exigem *mais* crescimento futuro de preço para justificar a estratégia de empréstimo em detrimento da saída imediata.

---
$^{6}$ Isso ocorre porque:
* O numerador $(1 - a)[1 - r_{k}(1 - x_{0})]$ diminui a uma taxa $(1 - x_{0})$
* O denominador $b[1 - r_{k}(1 - bx_{0})]$ diminui a uma taxa $(1 - bx_{0})$
* Visto que $b < 1$ e $x_{0} > 0$, temos $(1 - bx_{0}) > (1 - x_{0})$
* Portanto, o denominador encolhe mais rápido, fazendo com que a fração aumente
### 6 Disparada do Teto de Preço (Price Ceiling Runaway)

Os cronogramas de emissão da Revnet codificam um preço teto monotonicamente crescente $P^{\text{ceil}}(t)$, independente da atividade de mercado. Quando o preço do mercado secundário $P^{\text{AMM}}$ permanece persistentemente abaixo do teto ($P^{\text{AMM}} \ll P^{\text{ceil}}$), os pagamentos de entrada são roteados para o AMM em vez de cunhar novos tokens.

Neste *regime de disparada* (runaway regime), novas emissões param: fluxos de entrada em \$RES não aumentam mais diretamente o tesouro $B$, e a oferta circulante $S(t)$ muda apenas através de resgates (redemptions), atividades de empréstimo e auto-cunhagens (automints). Visto que o preço piso $P^{\text{floor}} \propto B/S$, esse efeito de roteamento pode temporariamente estagnar o crescimento do piso proveniente da emissão.

### 6.1 O Regime de Disparada (The Runaway Regime)

Durante uma disparada, o comportamento do sistema depende criticamente do tipo de demanda que sustenta a atividade do token.

**Demanda acoplada a serviços.** Quando as compras de tokens estão atreladas ao consumo de um serviço real (ex: créditos de API, taxas de acesso, ...), os pagamentos continuam independentemente do preço de mercado de curto prazo. Esses fluxos de entrada são roteados para o AMM, comprando tokens e reduzindo a oferta no lado do AMM, o que gradualmente empurra o $P^{\text{AMM}}$ para cima.

À medida que o preço secundário se aproxima do teto de emissão, a lógica de roteamento se inverte: novos compradores voltam a cunhar através da emissão em vez do AMM, aumentando $B$ e expandindo o tesouro. Essa transição restaura o regime normal de emissão, um *caminho de recuperação* endógena no qual pagamentos de serviço sustentados realinham os preços de mercado e de emissão e retomam o crescimento do piso.

No entanto, se o cronograma do teto subir muito rapidamente em relação aos fluxos de serviço, $P^{\text{ceil}}(t)$ pode continuar escapando para cima mais rápido do que o mercado consegue acompanhar. Nesse caso, o sistema permanece preso no roteamento via AMM: os fluxos compram continuamente da pool, reduzindo suas reservas de tokens e aumentando o *slippage* de preço. Eventualmente, a emissão será retomada uma vez que as negociações se tornem grandes o suficiente para tornar a execução no AMM menos favorável do que a cunhagem direta, mas, a essa altura, a liquidez secundária pode ter se deteriorado: spreads aumentam, a volatilidade sobe e a experiência do usuário piora.

A pressão de preço ascendente também torna os empréstimos mais atraentes. À medida que $P^{\text{AMM}}$ se valoriza em direção a $P^{\text{ceil}}$, a valorização de preço esperada $\Delta P^{\text{sell}}$ aumenta em relação à linha de base de resgate, melhorando a condição para tomar um empréstimo (Eq. 47). A taxa de empréstimo pré-paga $F_{\text{prepaid}}$ é tratada como um pagamento de entrada para a Revnet de origem e, sob roteamento de disparada, é usada para comprar tokens do AMM. Essas compras de taxas sustentam o preço do AMM, enquanto ciclos de empréstimo concluídos preservam a liquidez circulante, uma vez que o colateral é recunhado mediante o pagamento.

Em sistemas impulsionados por serviços, mesmo durante a disparada, a atividade contínua reforça a si mesma: pagamentos de serviços e taxas de empréstimo fornecem pressão de compra que eleva o preço de mercado, restaura a emissão quando viável e fortalece o preço piso. No entanto, se o crescimento do teto for excessivo, essa recuperação pode ocorrer ao custo de uma qualidade de mercado secundário degradada.

**Demanda puramente especulativa.** Quando a demanda é primariamente especulativa, o roteamento para o AMM durante a disparada apenas desloca onde os traders adquirem tokens, e não garante pressão de compra persistente. Sem fluxos de entrada vinculados a serviços, os movimentos de preço dependem exclusivamente das expectativas dos traders.

Nesse contexto, o ciclo de feedback pode se tornar instável. À medida que a confiança enfraquece, detentores racionais podem preferir fazer o cash-out (resgate) em vez de emprestar ou manter (hold). Os cash-outs *elevam o piso* ao reduzir $S$ mais rápido do que $B$, aumentando o valor resgatável por token remanescente. No entanto, eles simultaneamente esgotam a oferta circulante e possivelmente a liquidez no AMM, levando a maior *slippage* e volatilidade. A liquidez escassa desencoraja novos entrantes e amplifica as oscilações de preço, reforçando as saídas.

Além disso, um piso mais alto eleva a referência para novos empréstimos: visto que cada token agora representa um valor de resgate maior, o custo de oportunidade de usá-lo como colateral aumenta. A menos que os usuários esperem uma valorização ou rendimento significativo, os empréstimos tornam-se menos atraentes em relação ao resgate imediato. Essa mudança nos incentivos pode estender a cascata até que a oferta circulante se estabilize em um nível muito mais baixo ou o preço de mercado reconvirja para a emissão.

### 6.2 Implicações de Design

As dinâmicas de disparada (runaway) não são uma falha, mas um regime estrutural. Sua persistência e impacto podem ser ajustados através de alavancas de design:

* **Calibração da inclinação do teto.** A taxa de aumento de $P^{\text{ceil}}(t)$ deve corresponder aproximadamente à taxa de fluxo de entrada orgânica esperada da demanda de serviço. Se o crescimento do teto for muito íngreme em relação à atividade, a emissão permanece inativa por longos períodos, drenando a liquidez do AMM e piorando a qualidade do mercado. Uma inclinação mais lenta mantém a proximidade entre os preços de mercado e de emissão, mantendo os caminhos de arbitragem ativos e a negociação secundária saudável.
* **Implantação e profundidade do AMM.** A liquidez profunda do AMM deve ser iniciada (*bootstrapped*) apenas após o estabelecimento de uma base de fluxos recorrentes de serviço. AMMs prematuramente profundos podem prender o sistema em uma fase de disparada onde a emissão nunca é reativada, enquanto pouca liquidez amplifica a volatilidade.
* **Taxa de cash-out e política de resgate.** Uma taxa de resgate que retém parte do pagamento dentro do tesouro (como em $r_{k} > 0$) garante que cada saída fortaleça o piso, proporcionando estabilidade mesmo durante resgates pesados.
* **Comunicação e design de interface.** Exibir tanto $P^{\text{ceil}}(t)$ quanto o $P^{\text{floor}}(t)$ realizado pode ajudar os usuários a entender que o crescimento do piso é impulsionado pela atividade, não pela especulação. Isso desencoraja a venda em pânico e reforça a percepção de acumulação de valor estrutural ao longo do tempo.

## 6.3 Resumo

A disparada do teto de preço é um regime natural que ocorre quando o preço de emissão ultrapassa a demanda efetiva. Suas consequências dependem da composição da demanda e das condições de liquidez:

* **Sistemas acoplados a serviços:** A disparada é tipicamente temporária e autocorretiva. Fluxos contínuos e roteamento de taxas elevam o preço do AMM, acionam a arbitragem e restauram o crescimento do tesouro impulsionado pela emissão. Se o cronograma do teto subir muito rapidamente, a recuperação ainda ocorre, mas ao custo de liquidez secundária e qualidade de negociação reduzidas.
* **Sistemas especulativos:** A disparada pode evoluir para uma cascata de degradação da qualidade, com redução da liquidez e aumento do piso. O processo permanece limitado pela solvência e para naturalmente à medida que a oferta se contrai ou os preços reconvergem para a emissão.

Do ponto de vista sistêmico, os empréstimos superam os cash-outs ao preservar a liquidez e reciclar taxas para o suporte do AMM. No entanto, a racionalidade individual durante uma disparada especulativa pode favorecer resgates imediatos. Equilibrar essa tensão através de dinâmicas de teto calibradas, estagiamento do AMM e parâmetros de resgate é central para sustentar a evolução saudável da Revnet e a qualidade do mercado a longo prazo.

## 7. Conclusões e Implicações Práticas

Este artigo formalizou os mecanismos criptoeconômicos das Revnets: estruturas financeiras autônomas e tokenizadas governadas por contratos inteligentes imutáveis. Através da análise matemática das operações de emissão, resgate e empréstimo, derivamos dinâmicas de preços, provamos garantias de solvência e caracterizamos o comportamento do ator racional sob configurações variadas de parâmetros. Esta seção sintetiza essas descobertas com implicações práticas para investidores e projetistas de protocolos.

## Mecanismos de Acúmulo de Valor

As Revnets operam através de um sistema de preço duplo consistindo em um teto determinístico e um piso impulsionado pela atividade. O preço teto $P^{\text{ceil}}(t) = P_{\text{issue},k}(t)/(1 - \sigma_{k})$ aumenta de acordo com cronogramas predeterminados, subindo pelo fator $\gamma_{k} = 1/(1 - \gamma_{\text{cut},k})$ em intervalos $\Delta t_{k}$, independentemente da atividade da rede. O preço piso $P^{\text{floor}}(t) \approx 0.951(1 - r_{k})B(t)/S(t)$ responde às interações do usuário através de mudanças no índice de lastro (*backing ratio*) $B(t)/S(t)$.

A Seção 3.2 demonstra que o preço piso aumenta através de três mecanismos primários. Primeiro, as emissões de tokens aumentam o piso quando o preço teto excede o índice de lastro ($P^{\text{ceil}} > B/S$), uma condição tipicamente satisfeita durante a operação normal. Segundo, os resgates aumentam incondicionalmente o piso, visto que a taxa de cash-out $r_{k}$ garante que a depleção do tesouro ocorra mais lentamente do que a redução da oferta. Terceiro, as originações de empréstimos aumentam o piso através de margens de supercolateralização obrigatórias de $r_{k}(1 - q/S)$ e pagamento de taxas. Inversamente, as auto-emissões diminuem o piso ao aumentar a oferta sem contribuições correspondentes ao tesouro, enquanto os pagamentos de empréstimos revertem o efeito de colateralização inicial.

#### Framework de Análise de Investimento

A análise do ator racional na Seção 5 estabelece limites quantitativos para decisões ótimas de investimento. Um investidor detendo $q$ tokens no tempo $t_{0}$ deve sair imediatamente quando os retornos de investimentos externos ($R$) excederem a valorização esperada do token: $(1 + R) > P^{\text{sell}}(t_{1})/P^{\text{sell}}(t_{0})$. Para investidores mantendo exposição, os empréstimos tornam-se preferíveis a manter (*holding*) quando $R > (1 - a)/a$, onde $a$ representa os rendimentos líquidos após taxas. Com $a = 0.941$ (janela de pagamento de seis meses), esse limite é igual a $6.3\%$ durante o período do empréstimo, significando $\sim 12.6\%$ anualmente. Com $a = 0.632$ (janela de dez anos), o limite sobe para $58.2\%$, significando $\sim 5.82\%$ anualmente.

O parâmetro de taxa de cash-out $r_{k}$ influencia criticamente o comportamento do investidor. Quando $r_{k} \le 39.16\%$, o resgate direto fornece liquidez imediata superior em comparação aos empréstimos para todos os tamanhos de posição. Acima desse limite, os empréstimos tornam-se cada vez mais atraentes para grandes posições, particularmente com janelas de pagamento mais curtas. Essa mudança comportamental afeta a dinâmica de liquidez do sistema durante o estresse do mercado.

A Seção 4 prova que o sistema de empréstimos mantém solvência incondicional. A propriedade da curva de resgate $C_{k}(S; S, B) = B$ garante que os tokens circulantes sempre podem resgatar o tesouro completo, independentemente de empréstimos pendentes. A inadimplência (*default*) de empréstimos fortalece o índice de lastro para os detentores restantes, pois os fundos emprestados permanecem no tesouro enquanto os tokens de colateral são permanentemente queimados. Essa solvência emerge da estrutura matemática e não de seguros externos ou mecanismos de governança.

#### Parâmetros de Design do Protocolo

A análise revela restrições específicas de parâmetros e seus efeitos sistêmicos. A taxa de cash-out $r_{k}$ determina a fronteira entre regimes dominados por saída e dominados por empréstimo em aproximadamente $19\%$. Abaixo desse limite, os resgates dominam durante eventos de liquidez; acima dele, os empréstimos podem se tornar viáveis, mas exigem expectativas de crescimento mais fortes. Valores mais altos de $r_{k}$ aumentam a valorização do piso por resgate, mas também elevam a valorização de preço necessária para que os empréstimos dominem as saídas, conforme mostrado na Seção 5.2.3.

A taxa de crescimento do teto requer calibração em relação à demanda esperada. Taxas de crescimento excessivas em relação à demanda orgânica criam condições de "disparada" (runaway) onde $P^{\text{AMM}} \ll P^{\text{ceil}}$, roteando as compras através de mercados secundários em vez da emissão primária. A Seção 6 demonstra que a demanda acoplada a serviços fornece mecanismos naturais de recuperação através de pressão de compra sustentada, enquanto sistemas puramente especulativos arriscam cascatas de degradação de liquidez.

As auto-emissões criam diluição imediata do piso proporcional à razão de tokens cunhados para a oferta existente. A condição de salto $S(t^{+}) = S(t^{-}) + a$ com tesouro inalterado $B(t^{+}) = B(t^{-})$ reduz mecanicamente o índice de lastro. O agendamento ótimo requer períodos precedentes de valorização orgânica do piso suficientes para absorver essa diluição.

### Propriedades e Fronteiras do Sistema (System Properties and Boundaries)

O arcabouço matemático estabelece várias propriedades invariantes. O Teorema 4.1 prova que a solvência se mantém para qualquer sequência de operações, tamanhos de empréstimo e cenários de inadimplência. A margem de supercolateralização mantém-se através da estrutura da curva de bonding sem intervenção externa. A descoberta de preço opera inteiramente através de variáveis de estado internas ($B, S$), eliminando dependências de oráculos e vetores de manipulação associados.

O sistema exibe fronteiras operacionais claras. Durante as fases de disparada analisadas na Seção 6, a qualidade do mercado secundário depende criticamente da composição da demanda. Sistemas acoplados a serviços experimentam interrupção temporária com eventual recuperação à medida que o uso impulsiona a convergência de preços. Sistemas puramente especulativos enfrentam potenciais espirais de liquidez onde cascatas de resgate reduzem tanto a oferta quanto a profundidade do AMM, aumentando a volatilidade e desencorajando novos entrantes.

A imutabilidade dos parâmetros, embora garanta previsibilidade e eliminação do risco de governança, impede respostas adaptativas a condições em mudança. Os fundadores devem codificar parâmetros apropriados na implantação com base em projeções realistas em vez de ajustes posteriores.

### Síntese (Synthesis)

As Revnets implementam uma abordagem determinística para a coordenação de valor tokenizado através de regras imutáveis em vez de processos de governança. A análise matemática confirma que esses sistemas mantêm a solvência, acumulam valor através de mecanismos quantificáveis e fornecem proteção calculável contra perdas (downside). A estrutura do corredor de preço limita o preço para os mercados secundários.

A implantação bem-sucedida requer alinhamento entre a seleção de parâmetros e projeções de demanda realistas. A trajetória de crescimento do teto deve se aproximar do crescimento orgânico esperado para evitar fases estendidas de disparada. A taxa de cash-out deve equilibrar o incentivo à retenção ($r_{k}$ alto) e a manutenção de opções de liquidez ($r_{k}$ baixo). As auto-emissões devem ser minimizadas e cronometradas estrategicamente. Mais criticamente, o acúmulo de valor sustentável requer atividade econômica genuína (ex: receitas de serviços, taxas de produtos ou outras fontes de demanda não especulativas) para impulsionar os processos mecânicos de valorização identificados nesta análise.

Para investidores, as Revnets oferecem propostas de valor quantificáveis com fronteiras matemáticas explícitas sobre risco e retorno. Para fundadores, elas fornecem frameworks para criar sistemas econômicos autônomos, contingentes a uma calibração cuidadosa de parâmetros alinhada com as restrições aqui derivadas. A elegância do modelo reside em sua simplicidade mecânica: regras predeterminadas que geram dinâmicas complexas, porém analisáveis, criando sistemas que operam independentemente de intervenção humana uma vez implantados.
