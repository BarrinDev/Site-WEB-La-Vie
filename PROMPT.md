Você é um desenvolvedor front-end criativo sênior, especialista em scrollytelling e
sites premiados (nível Awwwards). Construa o site do estúdio descrito abaixo, com
experiência de scroll imersiva, usando as fotos reais da pasta ./imagens.

=== REGRA DE PASTA (OBRIGATÓRIA) ===
Este é um projeto NOVO e INDEPENDENTE. Trabalhe SOMENTE dentro da pasta
"studio-la-vie" (a pasta onde este PROMPT.md está). Se você não estiver dentro
dela, crie-a em um local separado de qualquer outro projeto e trabalhe lá.
NÃO leia, reutilize, copie ou modifique arquivos de outros projetos (por exemplo,
Melhor Opção, Produtos da Terra, Studio Salute, Lubelly Boutique, Iniciativa
Contabilidade, Curvas Estética, Pipo Clean ou Stormyz). Todo código, imagem
otimizada e arquivo gerado fica dentro de "studio-la-vie".
====================================

=== O ESTÚDIO ===
Nome: Studio La Vie
Segmento: beleza [CONFIRMAR o foco real, ex.: salão de cabelo, estética,
manicure, sobrancelhas, maquiagem]
Serviços: [PREENCHER com a lista real]
Localização: Taguatinga Sul – Brasília/DF
Endereço completo: [PREENCHER]
WhatsApp: [PREENCHER] → link: https://wa.me/55[NUMERO]
Instagram: [PREENCHER]
Horário: [PREENCHER — atende com hora marcada?]
Tempo de mercado: [PREENCHER, se houver]
Diferenciais: [ex.: equipe especializada, ambiente acolhedor, café, produtos de
qualidade — PREENCHER]
Público: principalmente mulheres de Taguatinga e região que querem cuidar da
beleza num lugar de confiança.
Identidade visual: [descrever a partir do logo e das fotos; se não houver logo,
proponha uma paleta coerente com o ambiente real do estúdio]
Objetivo do site: quem procura serviços de beleza em Taguatinga Sul ou vê o
Instagram conhecer o estúdio, ver os trabalhos e agendar pelo WhatsApp.

Fotos disponíveis em ./imagens:
- [listar os arquivos que eu colocar na pasta]
=================

PASSO 0 — ANTES DE CODAR
1. Confirme em qual pasta você está e que ela é a "studio-la-vie".
2. Liste e abra todas as imagens em ./imagens. Descreva cada uma e decida em qual
   cena ela entra. Se a pasta estiver sem fotos, PARE e me avise antes de seguir.
3. Otimize as imagens: converta para WebP em 3 larguras (640, 1280, 1920), salve
   em ./imagens/otimizadas e use srcset + lazy loading.
4. Apresente o plano e ESPERE minha aprovação:
   - paleta final em hex e 1 ou 2 fontes, com justificativa
   - storyboard cena por cena dizendo o que o scroll faz em cada uma
   Revise o plano e troque tudo que parecer genérico ou "cara de IA".

CLIMA DA EXPERIÊNCIA
"La vie" é "a vida" em francês: leve, elegante e alegre, com um toque de charme
francês sem cair em clichê (nada de Torre Eiffel, boina ou listras de marinheiro).
Movimentos suaves e confiantes, como um cabelo balançando. As fotos dos trabalhos
reais são as protagonistas.

ARQUITETURA DA EXPERIÊNCIA
O site é uma sequência de cenas. Cada cena ocupa de 200vh a 400vh e fica fixa
(pinned) enquanto o scroll controla o que acontece dentro dela, com scrub (a
animação avança e volta junto com a rolagem).

STORYBOARD SUGERIDO (adapte ao que as fotos permitirem)
1. Preloader: o nome "La Vie" escrito à mão em traço contínuo (SVG com
   stroke-dashoffset), acompanhando o carregamento real de 0% a 100%.
2. Abertura: "Studio La Vie" em tipografia grande que se separa com o scroll,
   abrindo espaço para a foto do ambiente revelada por máscara.
3. Serviços: cena pinned em que cada serviço ocupa a tela por vez, com foto de um
   trabalho real, o que é feito e quanto tempo leva, em linguagem simples.
4. Trabalhos (cena principal, só esta com efeito mais forte no site): galeria em
   que as fotos se reorganizam como num mural editorial conforme o scroll; antes e
   depois SOMENTE se houver fotos reais autorizadas.
5. O espaço e a equipe: scroll horizontal pela recepção, cadeiras e salas, com
   apresentação curta de quem atende.
6. Como agendar: passos reais (escolhe o serviço → chama no WhatsApp → confirma
   o horário), pode ser numerado.
7. Localização: endereço, horário, mapa incorporado (iframe do Google Maps) e
   botão "Como chegar".
8. Final: CTA grande "Agendar pelo WhatsApp".

MECÂNICAS FIXAS DE INTERFACE
- Indicador de progresso fixo, clicável para navegar entre as cenas.
- Botão fixo de menu que abre um overlay "mapa do site" marcando "você está aqui".
- Botão flutuante de WhatsApp sempre acessível, discreto.
- Cada transição entre cenas usa um recurso diferente. Nunca repetir o mesmo efeito.
- Textos entrando por palavra; imagens reveladas com clip-path e leve escala.

CUIDADOS DE CONTEÚDO
- Não inventar depoimentos, número de clientes, prêmios ou tempo de mercado.
- Não prometer resultados em procedimentos estéticos.

STACK TÉCNICA
- Projeto estático: index.html, css/style.css, js/main.js.
- GSAP + ScrollTrigger (pin, scrub, uma timeline por cena), Lenis para rolagem
  suave e SplitType para texto, via CDN.
- Animar apenas transform, opacity, clip-path e stroke-dashoffset.

MOBILE
- Experiência redesenhada para o celular (a maioria vai abrir pelo Instagram ou
  WhatsApp): galeria funcionando por scroll, scroll horizontal vira empilhamento
  com scrub, toques no lugar de hover.

SEO LOCAL
- Title e meta description com o serviço principal + "em Taguatinga Sul".
- Schema.org LocalBusiness (BeautySalon) em JSON-LD com nome, endereço, telefone,
  horário e geolocalização.
- Open Graph com a melhor foto do estúdio, para o link ficar bonito no WhatsApp.

ACESSIBILIDADE
- prefers-reduced-motion com versão estática legível, foco visível, contraste AA,
  alt descritivo em todas as fotos.

PARA NÃO PARECER FEITO POR IA
- Proibido: rosa com dourado genérico, gradientes decorativos, cards idênticos
  arredondados com sombra cinza, ícones de tesoura/secador em grade, rótulos em
  caixa alta espaçada acima de títulos, destacar uma única palavra do título em
  outra cor, emojis, Inter/Roboto/Arial, o mesmo fade-up em todas as seções,
  frases genéricas ("realce sua beleza", "você merece"), fotos de banco de imagem.
- Textos curtos e calorosos, como a dona do estúdio falaria com uma cliente.

VERIFICAÇÃO (econômica)
- Rode um servidor local e tire no máximo 4 screenshots (390px e 1440px, no início
  e no meio do site). Faça só uma rodada de correção. Não repita o ciclo.

ENTREGA
- Site funcionando dentro da pasta "studio-la-vie".
- Lista do que ainda preciso preencher ou trocar.
