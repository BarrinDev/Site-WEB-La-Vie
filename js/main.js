/* Studio La Vie — cenas por scroll (GSAP + ScrollTrigger + Lenis + SplitType) */
(() => {
  const html = document.documentElement;
  const el = (s, c = document) => c.querySelector(s);
  const els = (s, c = document) => [...c.querySelectorAll(s)];
  const cenas = els('.cena');
  let marcos = [];
  let deslizar = (y) => window.scrollTo({ top: y });
  let pausa = () => {};
  let segue = () => {};

  els('.frame img').forEach((img) => {
    const f = img.closest('.frame');
    img.addEventListener('error', () => f.classList.add('vazio'));
    img.addEventListener('load', () => f.classList.remove('vazio'));
    if (img.complete && img.naturalWidth === 0) f.classList.add('vazio');
  });

  montarMenu();

  if (!html.classList.contains('motion') || !(window.gsap && window.ScrollTrigger && window.Lenis)) {
    html.classList.remove('motion');
    html.classList.add('quieto');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  const lenis = new Lenis({ lerp: 0.075 });
  lenis.stop();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  deslizar = (y) => lenis.scrollTo(y, { duration: 2, easing: (t) => 1 - Math.pow(1 - t, 3) });
  pausa = () => lenis.stop();
  segue = () => lenis.start();
  window.__deslizar = deslizar;

  /* ---------- Preloader: "La Vie" escrito à mão no ritmo do carregamento ---------- */
  const traco = el('.pre-traco');
  const T = traco.getTotalLength();
  gsap.set(traco, { strokeDasharray: T, strokeDashoffset: T });
  const pct = el('.pre-num span');
  const est = { p: 0 };
  const escreve = () => {
    traco.style.strokeDashoffset = T * (1 - est.p);
    pct.textContent = Math.round(est.p * 100);
  };
  const ate7s = (p) => Promise.race([p, new Promise((ok) => setTimeout(ok, 7000))]);
  const carrega = (img) => new Promise((ok) => {
    if (!img || img.complete) return ok();
    img.addEventListener('load', ok, { once: true });
    img.addEventListener('error', ok, { once: true });
  });
  const fontes = document.fonts ? document.fonts.ready : Promise.resolve();
  const tarefas = [
    fontes,
    carrega(el('.ab-foto img')),
    new Promise((ok) => (document.readyState === 'complete' ? ok() : addEventListener('load', ok, { once: true }))),
  ].map(ate7s);
  let ok = 0;
  let tw = gsap.to(est, { p: 0.1, duration: 0.8, onUpdate: escreve });
  tarefas.forEach((t) => t.then(() => {
    ok++;
    tw.kill();
    tw = gsap.to(est, { p: ok / tarefas.length, duration: 1.1, ease: 'sine.inOut', onUpdate: escreve });
  }));

  fontes.then(() => {
    if (window.SplitType) els('[data-split]').forEach((n) => new SplitType(n, { types: 'lines,words' }));
    montarCenas();
  });
  Promise.all(tarefas).then(() => gsap.delayedCall(1.1, abrir));

  function abrir() {
    ScrollTrigger.refresh();
    gsap.timeline({ onComplete: () => { el('.pre').remove(); segue(); } })
      .to(est, { p: 1, duration: 0.4, onUpdate: escreve })
      .to('.pre-num', { opacity: 0, duration: 0.3 })
      .to('.pre', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '+=0.3')
      .from(['.ab-studio', '.ab-la', '.ab-vie'], { yPercent: 40, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out' }, '-=0.55')
      .from('.ab-linha .word', { opacity: 0, stagger: 0.03, duration: 0.5 }, '-=0.5')
      .to(['.topo', '.prog', '.zap'], { opacity: 1, duration: 0.6 }, '-=0.5');
  }

  /* ---------- Cenas ---------- */
  function montarCenas() {
    gsap.set('.ab-studio', { xPercent: -50 });
    gsap.matchMedia().add({ desk: '(min-width: 769px)', mob: '(max-width: 768px)' }, (ctx) => {
      const { desk } = ctx.conditions;
      abertura(desk);
      servicos();
      mural(desk);
      espaco(desk);
      agendar();
      localEFinal();
    });
    progresso();
  }

  const fixa = (alvo, fim) => ({ trigger: alvo, start: 'top top', end: fim, scrub: 1.1, pin: true, invalidateOnRefresh: true });

  // 1 · "Studio La Vie" se separa e o espelho (em arco) se abre com a foto do salão.
  // Saída: uma página cor de linho entra pela direita.
  function abertura(desk) {
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: fixa('#abertura', '+=260%') })
      .fromTo('.ab-foto', { clipPath: 'inset(46% 46% 46% 46% round 999px 999px 999px 999px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0px 0px)', duration: 1.2, ease: 'power2.inOut' }, 0)
      .fromTo('.ab-foto img', { scale: 1.3 }, { scale: 1, duration: 1.5 }, 0)
      .to('.ab-studio', { y: () => -innerHeight * 0.3, duration: 1.2, ease: 'power2.inOut' }, 0)
      .to('.ab-la', { x: () => -innerWidth * (desk ? 0.24 : 0.3), duration: 1.2, ease: 'power2.inOut' }, 0)
      .to('.ab-vie', { x: () => innerWidth * (desk ? 0.24 : 0.3), duration: 1.2, ease: 'power2.inOut' }, 0)
      .to({}, { duration: 0.4 })
      .fromTo('.folha', { xPercent: 101 }, { xPercent: 0, duration: 0.7, ease: 'power3.inOut' });
  }

  // 2 · Um serviço por vez; a foto do trabalho entra limpando da direita.
  // Saída: zoom — a cena cresce e some, como quem chega perto do espelho.
  function servicos() {
    const itens = els('.serv');
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: fixa('#servicos', `+=${itens.length * 110 + 70}%`) });
    tl.fromTo('.serv-tit', { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0);
    itens.forEach((it, i) => {
      const t = 0.1 + i * 1.8;
      const foto = el('.serv-foto', it);
      const palavras = els('.serv-nome .word', it);
      const resto = [el('.serv-n', it), ...els('.serv-txt p', it)];
      tl.fromTo(foto, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'power3.inOut' }, t)
        .fromTo(el('img', foto), { scale: 1.2 }, { scale: 1, duration: 1.2 }, t)
        .fromTo(palavras, { yPercent: 110, opacity: 1 }, { yPercent: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out' }, t + 0.2)
        .fromTo(resto, { opacity: 0 }, { opacity: 1, stagger: 0.1, duration: 0.35 }, t + 0.45);
      if (i < itens.length - 1) {
        tl.to(foto, { opacity: 0, scale: 0.96, duration: 0.4 }, t + 1.35)
          .to(palavras, { yPercent: -110, opacity: 0, stagger: 0.04, duration: 0.4 }, t + 1.35)
          .to(resto, { opacity: 0, duration: 0.3 }, t + 1.35);
      }
    });
    tl.to({}, { duration: 0.3 })
      .to('.cena-serv .palco > *', { scale: 1.35, opacity: 0, duration: 0.7, ease: 'power2.in', transformOrigin: '50% 50%' });
  }

  // 3 · Cena principal: as fotos saem de uma pilha e se organizam num mural;
  // depois uma ganha destaque. Saída: o fundo escurece para café.
  function mural(desk) {
    const pecas = els('.peca').filter((p) => getComputedStyle(p).display !== 'none');
    const palco = el('.cena-mural .palco');
    const centro = (p) => ({
      x: palco.offsetWidth / 2 - (p.offsetLeft + p.offsetWidth / 2),
      y: palco.offsetHeight * 0.56 - (p.offsetTop + p.offsetHeight / 2),
    });
    const giros = [-14, 9, -22, 16, -6, 24, -11];
    const outras = pecas.filter((p) => !p.classList.contains('destaque'));
    const destaque = el('.peca.destaque');

    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: fixa('#trabalhos', '+=440%') })
      .fromTo('.mural-tit .word', { yPercent: 110 }, { yPercent: 0, duration: 0.4 }, 0)
      .fromTo('.mural-sub', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.2)
      .fromTo(pecas,
        { x: (i, p) => centro(p).x, y: (i, p) => centro(p).y, rotation: (i) => giros[i % giros.length], scale: desk ? 0.55 : 0.6 },
        { x: 0, y: 0, rotation: 0, scale: 1, duration: 1.3, stagger: { each: 0.07, from: 'end' }, ease: 'power3.inOut' }, 0.2)
      .to(outras, { opacity: 0.18, scale: 0.94, duration: 0.5 }, 2)
      .to(destaque, { x: () => centro(destaque).x, y: () => centro(destaque).y - innerHeight * 0.04, scale: desk ? 1.35 : 1.15, zIndex: 4, duration: 0.6, ease: 'power2.inOut' }, 2)
      .to('.peca-leg', { opacity: 1, duration: 0.3 }, 2.45)
      .to({}, { duration: 0.5 })
      .to('.peca-leg', { opacity: 0, duration: 0.2 })
      .to(destaque, { x: 0, y: 0, scale: 1, duration: 0.6, ease: 'power2.inOut' })
      .to(outras, { opacity: 1, scale: 1, duration: 0.5 }, '<')
      .to({}, { duration: 0.2 })
      .to('.cafe', { opacity: 1, duration: 0.7 });
  }

  // 4 · Espaço e equipe: horizontal no desktop, empilhado no celular.
  // Saída (desktop): "Como agendar" sobe por cima enquanto esta cena segura.
  function espaco(desk) {
    const trilho = el('.trilho');
    const molduras = els('.sala .frame');
    if (desk) {
      const dist = trilho.scrollWidth - innerWidth;
      const H = innerHeight;
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: '#espaco', start: 'top top', end: `+=${dist + H}`, scrub: 1, pin: true },
      });
      tl.to(trilho, { x: -dist, duration: dist }, 0);
      molduras.forEach((m) => {
        const chega = Math.max(0, m.closest('.sala').offsetLeft - innerWidth * 0.85);
        tl.fromTo(m, { clipPath: 'inset(12% 12% 12% 12%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: innerWidth * 0.45 }, chega);
      });
      tl.fromTo('.esp-abre > *', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: innerWidth * 0.04, duration: innerWidth * 0.15 }, 0)
        .to({}, { duration: H }, dist);
    } else {
      molduras.forEach((m) => {
        gsap.fromTo(m, { clipPath: 'inset(10% 14% 10% 14%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
          scrollTrigger: { trigger: m, start: 'top 95%', end: 'top 35%', scrub: 1 },
        });
      });
    }
  }

  // 5 · A conversa de agendamento aparece mensagem por mensagem.
  function agendar() {
    const msgs = els('.msg');
    const passos = els('.ag-passos li');
    const qualPasso = [0, 1, 1, 2];
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: fixa('#como-agendar', '+=240%') });
    tl.fromTo('.ag-tit .word', { yPercent: 110 }, { yPercent: 0, stagger: 0.07, duration: 0.4 }, 0)
      .to(passos[0], { opacity: 1, duration: 0.2 }, 0.3);
    msgs.forEach((m, i) => {
      const t = 0.5 + i * 0.55;
      tl.fromTo(m, { opacity: 0, y: 24, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.6)' }, t);
      const p = qualPasso[i];
      if (p && (i === 0 || qualPasso[i - 1] !== p)) {
        tl.to(passos[p], { opacity: 1, duration: 0.2 }, t)
          .to(passos[p - 1], { opacity: 0.55, duration: 0.2 }, t);
      }
    });
    tl.to({}, { duration: 0.6 });
  }

  // 6 · O endereço desce como uma persiana. 7 · A caixa final cresce até a tela inteira.
  function localEFinal() {
    gsap.fromTo('.cena-local', { clipPath: 'inset(0% 0% 100% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
      scrollTrigger: { trigger: '.cena-local', start: 'top bottom', end: 'top 25%', scrub: 1 },
    });
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '#final', start: 'top 90%', end: 'top top', scrub: 1 } })
      .fromTo('.final-caixa', { clipPath: 'inset(9% 7% 9% 7% round 48px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1 }, 0)
      .fromTo('.final-tit .word', { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.3 }, 0.4);
  }

  /* ---------- Progresso ---------- */
  function topoDe(sec) {
    const alvo = sec.parentElement.classList.contains('pin-spacer') ? sec.parentElement : sec;
    return alvo.getBoundingClientRect().top + window.scrollY;
  }

  function progresso() {
    const pontos = els('.prog-pontos li');
    const cheio = el('.prog-cheio');
    const mob = () => innerWidth <= 768;
    const medir = () => {
      const max = ScrollTrigger.maxScroll(window) || 1;
      marcos = cenas.map(topoDe);
      pontos.forEach((li, i) => { li.style.top = `${Math.min(marcos[i] / max, 1) * 100}%`; });
    };
    ScrollTrigger.addEventListener('refresh', medir);
    medir();
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (s) => {
        cheio.style.transform = mob() ? `scaleX(${s.progress})` : `scaleY(${s.progress})`;
        const y = window.scrollY + innerHeight * 0.45;
        let atual = 0;
        marcos.forEach((m, i) => { if (y >= m) atual = i; });
        marcar(atual);
      },
    });
  }

  /* ---------- Menu ---------- */
  function marcar(i) {
    els('.prog-pontos li').forEach((li, j) => li.classList.toggle('atual', j === i));
    els('.mapa-lista li').forEach((li, j) => {
      el('.aqui', li).hidden = j !== i;
      el('a', li).toggleAttribute('aria-current', j === i);
    });
  }

  function irPara(i) {
    deslizar(marcos[i] ?? topoDe(cenas[i]));
  }

  function montarMenu() {
    const lista = el('.mapa-lista');
    const pontos = el('.prog-pontos');
    cenas.forEach((sec, i) => {
      const nome = sec.dataset.nome;
      lista.insertAdjacentHTML('beforeend',
        `<li><a href="#${sec.id}"><span class="mapa-n">${i + 1}</span><span class="mapa-nome">${nome}</span><span class="aqui"${i ? ' hidden' : ''}>você está aqui</span></a></li>`);
      pontos.insertAdjacentHTML('beforeend',
        `<li${i ? '' : ' class="atual"'}><button type="button" aria-label="Ir para ${nome}"><span class="rotulo">${nome}</span></button></li>`);
    });
    const mapa = el('#mapa');
    const btn = el('.menu-btn');
    const anima = () => html.classList.contains('motion');
    const abrirMapa = () => {
      mapa.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      pausa();
      if (window.gsap && anima()) gsap.fromTo('.mapa-lista li', { opacity: 0, x: -14 }, { opacity: 1, x: 0, stagger: 0.05, duration: 0.5, ease: 'power2.out' });
      el('.mapa-fechar').focus();
    };
    const fecharMapa = (foco = true) => {
      mapa.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      segue();
      if (foco) btn.focus();
    };
    btn.addEventListener('click', abrirMapa);
    el('.mapa-fechar').addEventListener('click', () => fecharMapa());
    mapa.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') fecharMapa();
      if (e.key !== 'Tab') return;
      const f = els('button, a', mapa);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    els('.mapa-lista a').forEach((a, i) => a.addEventListener('click', (e) => {
      fecharMapa(false);
      if (!anima()) return;
      e.preventDefault();
      irPara(i);
    }));
    els('.prog-pontos button').forEach((b, i) => b.addEventListener('click', () => irPara(i)));
    el('.marca').addEventListener('click', (e) => {
      if (!anima()) return;
      e.preventDefault();
      irPara(0);
    });
  }
})();
