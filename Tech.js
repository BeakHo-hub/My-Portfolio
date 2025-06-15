/* ───────────────────────────────────────────────
    Tech.js   —   김지원 포트폴리오
    (최종 완성본)
───────────────────────────────────────────────*/
document.addEventListener('DOMContentLoaded', () => {

  /* ───── 1. DOM 요소 캐싱 ───── */
  const coin            = document.getElementById('draggable-coin');
  const coinSlot        = document.getElementById('coin-slot');
  const coinScreen      = document.getElementById('coin-screen');
  const intro           = document.getElementById('intro');
  const content         = document.getElementById('content');
  const pressStart      = document.querySelector('#intro p');
  const flash           = document.getElementById('flash-overlay');
  const pixelOv         = document.getElementById('pixel-overlay');
  const pxFilter        = document.querySelector('#pixelate-filter feMorphology');
  const arcadeText      = document.querySelector('.arcade-text');
  const selectBtn       = document.getElementById('select-button');
  const avatarBox       = document.querySelector('.avatar-box');
  const statsBox        = document.querySelector('.stats-box');
  const playerInd       = document.querySelector('.player-indicator');
  const walkCanvas      = document.getElementById('walk-canvas');
  const projects        = document.getElementById('projects');

  /* ───── 2. 전역 변수 ───── */
  let introRAF          = 0;
  let introRun          = false;
  let scaleFromXform    = 1;

  /* ───── 3. 프로필 데이터 ───── */
  const profileData = {
    name    : '김지원',
    class   : 'SYSTEMS GAME DESIGNER',
    avatar  : 'avatar.png',
    sprite  : 'character-sprite.png',
    stats   : [
      { label:'시스템 기획',   value:85 },
      { label:'데이터 밸런싱', value:90 },
      { label:'Unity / C#',   value:75 },
      { label:'Unreal / C++', value:60 }
    ],
    contacts: [
      { type:'email',  link:'mailto:you@example.com',        icon:'icon-email.png'  },
      { type:'github', link:'https://github.com/BeakHo-hub', icon:'icon-github.png' }
    ]
  };

  /* ───────────────────────────────────────────
      4. 코인 드래그 & 삽입
  ─────────────────────────────────────────── */
  let dragging = false, offX = 0, offY = 0;
  coin.addEventListener('mousedown', e => { dragging = true; coin.classList.add('dragging'); offX = e.clientX - coin.getBoundingClientRect().left; offY = e.clientY - coin.getBoundingClientRect().top; window.addEventListener('mousemove', dragCoin); window.addEventListener('mouseup',   dropCoin); });
  function dragCoin (e) { if (!dragging) return; const p = coin.parentElement.getBoundingClientRect(); coin.style.left = `${e.clientX - p.left - offX}px`; coin.style.top  = `${e.clientY - p.top  - offY}px`; }
  function dropCoin () { if (!dragging) return; dragging = false; coin.classList.remove('dragging'); window.removeEventListener('mousemove', dragCoin); window.removeEventListener('mouseup',   dropCoin); const c = coin.getBoundingClientRect(), s = coinSlot.getBoundingClientRect(); const hit = !(c.right < s.left || c.left > s.right || c.bottom < s.top || c.top > s.bottom); if (hit) insertCoin(); else { coin.style.left = '5%'; coin.style.top = 'calc(50% - 25px)'; } }
  function insertCoin () { coin.style.display = 'none'; arcadeText.textContent = 'Thank You!'; arcadeText.classList.remove('blinking-effect'); document.getElementById('arcade-machine').classList.add('fade-out'); setTimeout(() => { pixelateScene(800, () => { coinScreen.classList.add('hidden'); intro.classList.remove('hidden'); document.body.classList.add('sword-cursor'); initIntro(); }); }, 800); }

  /* ───────────────────────────────────────────
      5. 픽셀 분해 전환 효과
  ─────────────────────────────────────────── */
  function pixelateScene (duration, cb) { const maxR = 15, maxS = 2.5, start = performance.now(); coinScreen.classList.add('pixelating'); requestAnimationFrame(function frame (now) { const p = Math.min((now - start) / duration, 1); pxFilter.setAttribute('radius', p * maxR); coinScreen.style.transform = `scale(${1 + p * (maxS - 1)})`; coinScreen.style.opacity   = 1 - p; if (p < 1) requestAnimationFrame(frame); else { coinScreen.classList.remove('pixelating'); coinScreen.style.cssText = ''; pxFilter.setAttribute('radius', 0); if(cb) cb(); } }); setTimeout(() => { flash.classList.add('flash'); setTimeout(() => flash.classList.remove('flash'), 100); }, duration / 2); }

  /* ───────────────────────────────────────────
      6. 인트로(우주) 애니메이션
  ─────────────────────────────────────────── */
  function initIntro () {
    introRun = true;
    const canvas = document.getElementById('sprite-canvas');
    const ctx    = canvas.getContext('2d');
    canvas.width  = innerWidth;
    canvas.height = innerHeight;
    const sp = { img:new Image(), tot:4, frm:0, tick:0, spd:8, x:-80, y:innerHeight/2-80, w:80, h:80, dx:4, fw:0, fh:0 };
    sp.img.src = 'sprite.png';
    sp.img.onload = () => { sp.fw = sp.img.width / sp.tot; sp.fh = sp.img.height; animate(); };
    function animate () {
      if (!introRun) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (sp.x < canvas.width / 2 - sp.w / 2) sp.x += sp.dx;
      if (++sp.tick > sp.spd) { sp.tick = 0; sp.frm = (sp.frm + 1) % sp.tot; }
      ctx.drawImage(sp.img, sp.frm * sp.fw, 0, sp.fw, sp.fh, sp.x, sp.y, sp.w, sp.h);
      introRAF = requestAnimationFrame(animate);
    }
    setTimeout(() => pressStart.classList.add('visible'), 2000);
  }

  /* ───────────────────────────────────────────
      7. 프로필 카드 내용 채우기
  ─────────────────────────────────────────── */
  function populateProfile () {
    const nameEl   = document.querySelector('.profile-name');
    const classEl  = document.querySelector('.profile-class');
    const avatar   = document.getElementById('profile-avatar');
    const statsG   = document.querySelector('.stats-grid');
    const contacts = document.querySelector('.contact-icons');
    avatar.src = profileData.avatar;
    statsG.innerHTML = '';
    contacts.innerHTML = '';
    const typeWriter = (el, txt, spd = 50) => { let i = 0; const cur = document.createElement('span'); cur.className = 'profile-name-cursor'; el.textContent = ''; el.appendChild(cur); const t = setInterval(() => { if (i < txt.length) el.insertBefore(document.createTextNode(txt[i++]), cur); else clearInterval(t); }, spd); };
    profileData.stats.forEach(s => { statsG.insertAdjacentHTML( 'beforeend', `<div class="stat-item"><span class="label">${s.label}</span><div class="stat-bar"><div class="stat-bar-fill" data-val="${s.value}%"></div></div></div>` ); });
    profileData.contacts.forEach(c => { contacts.insertAdjacentHTML( 'beforeend', `<a href="${c.link}" target="_blank"><img src="${c.icon}" alt="${c.type}"></a>` ); });
    setTimeout(() => {
      typeWriter(nameEl , profileData.name , 100);
      typeWriter(classEl, profileData.class,  75);
      document.querySelectorAll('.stat-bar-fill').forEach(f => f.style.width = f.dataset.val);
    }, 1500);
  }

  /* ───────────────────────────────────────────
      8. PRESS START 클릭 → 프로필 화면
  ─────────────────────────────────────────── */
  pressStart.addEventListener('click', () => {
    introRun = false;
    cancelAnimationFrame(introRAF);
    document.querySelectorAll('#intro .scenery, #intro #stars-far, #intro #stars-mid').forEach(el => el.style.animationPlayState = 'paused');
    pressStart.textContent = 'READY?';
    pressStart.classList.add('blinking-effect');
    setTimeout(() => {
      pixelOv.style.display = 'grid';
      if (!pixelOv.children.length) for (let i = 0; i < 400; i++) pixelOv.appendChild(document.createElement('div'));
      Array.from(pixelOv.children).forEach(p => { p.style.animationName = 'none'; p.style.animationPlayState = 'paused'; });
      requestAnimationFrame(() => {
        intro.classList.add('hidden');
        content.classList.remove('hidden');
        populateProfile();
        Array.from(pixelOv.children).forEach(p => {
          p.style.animationName = 'shrink-and-fade';
          setTimeout(() => p.style.animationPlayState = 'running', Math.random() * 500);
        });
      });
      setTimeout(() => pixelOv.style.display = 'none', 1000);
    }, 1500);
  });
  
  /* ───────────────────────────────────────────
      9. SELECT  클릭 → 중앙 슬라이드
  ─────────────────────────────────────────── */
  selectBtn.addEventListener('click', () => {
    if(playerInd) playerInd.remove();
    statsBox.classList.add('is-hiding');
    selectBtn.style.display = 'none';
    const r = avatarBox.getBoundingClientRect();
    avatarBox.style.position = 'fixed';
    avatarBox.style.top  = `${r.top}px`;
    avatarBox.style.left = `${r.left}px`;
    const dx = innerWidth  / 2 - (r.left + r.width  / 2);
    const dy = innerHeight / 2 - (r.top  + r.height / 2);
    requestAnimationFrame(() => {
        avatarBox.style.transition = 'transform .8s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
        avatarBox.style.transform  = `translate(${dx}px, ${dy}px)`;
    });
    avatarBox.addEventListener('transitionend', beginTransform, { once: true });
  });

  /* ───────────────────────────────────────────
      10. 프로필 사진 → 스프라이트 변신
  ─────────────────────────────────────────── */
  function beginTransform () {
    const photo = document.getElementById('profile-avatar');
    const spriteImg = new Image();
    spriteImg.src = profileData.sprite;
    const holder = document.createElement('canvas');
    const ctx = holder.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    holder.style.position = 'absolute';
    holder.style.top = 0;
    holder.style.left = 0;
    holder.style.width = '100%';
    holder.style.height = '100%';
    holder.style.opacity = 0;
    avatarBox.appendChild(holder);
    spriteImg.onload = () => {
      const cw = avatarBox.clientWidth, ch = avatarBox.clientHeight;
      holder.width  = cw;
      holder.height = ch;
      const fw = spriteImg.width / 4, fh = spriteImg.height;
      scaleFromXform = Math.min(cw / fw, ch / fh) * 0.8;
      ctx.drawImage(spriteImg, 0, 0, fw, fh, cw / 2 - fw * scaleFromXform / 2, ch / 2 - fh * scaleFromXform / 2, fw * scaleFromXform, fh * scaleFromXform);
      photo.style.transition = 'opacity .6s';
      holder.style.transition = 'opacity .6s';
      requestAnimationFrame(() => {
        photo.style.opacity = 0;
        holder.style.opacity = 1;
      });
      setTimeout(() => {
        avatarBox.style.display = 'none';
        startWalking(scaleFromXform);
      }, 1000);
    };
  }

  /* ───────────────────────────────────────────
      11. 걷기 애니메이션
  ─────────────────────────────────────────── */
  function startWalking(scale) {
    const sprite = new Image();
    sprite.src = profileData.sprite;
    sprite.onload  = () => walk(sprite);
    
    function walk(src) {
      const fw = src.width / 4, fh = src.height;
      const w = fw * scale, h = fh * scale;
      walkCanvas.width  = w;
      walkCanvas.height = h;
      walkCanvas.style.width = `${w}px`;
      walkCanvas.style.height = `${h}px`;
      walkCanvas.style.position = 'fixed';
      let x = innerWidth  / 2 - w / 2;
      const y = innerHeight / 2 - h / 2;
      walkCanvas.style.left = `${x}px`;
      walkCanvas.style.top  = `${y}px`;
      walkCanvas.classList.remove('hidden');
      const ctx = walkCanvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      let frame = 0, tick = 0;
      const spd = 10, dx  = 2;

      function step() {
        if (++tick > spd) { tick = 0; frame = (frame + 1) % 4; }
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(src, frame * fw, 0, fw, fh, 0, 0, w, h);
        x += dx;
        walkCanvas.style.left = `${x}px`;
        if (x < innerWidth + w) {
          requestAnimationFrame(step);
        } else {
          finish();
        }
      }
      requestAnimationFrame(step);
    }
  }

  /* ───────────────────────────────────────────
      12. 최종 전환
  ─────────────────────────────────────────── */
  function finish() {
    walkCanvas.classList.add('hidden');
    content.classList.add('hidden');
    projects.classList.remove('hidden');
    projects.scrollIntoView({ behavior:'smooth' });
  }
});