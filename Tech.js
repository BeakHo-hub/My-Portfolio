/**
 * Tech.js - 최종 완성본 (전환 효과 타이밍 버그 수정)
 */
document.addEventListener('DOMContentLoaded', () => {
  // --- 요소 가져오기 ---
  const coinScreen = document.getElementById('coin-screen');
  const arcadeScreen = document.getElementById('arcade-screen');
  const arcadeMachine = document.getElementById('arcade-machine');
  const coinText = document.querySelector('#arcade-screen .arcade-text');
  const coin = document.getElementById('draggable-coin');
  const coinSlot = document.getElementById('coin-slot');
  const intro = document.getElementById('intro');
  const pressStartText = document.querySelector('#intro p');
  const content = document.getElementById('content');
  const canvas = document.getElementById('sprite-canvas');
  const ctx = canvas.getContext('2d');
  const transitionEffect = document.getElementById('transition-effect');
  const sprite = new Image();
  sprite.src = 'sprite.png';
  let spriteInterval;

  // --- 드래그 앤 드롭 로직 ---
  let isDragging = false;
  let offsetX, offsetY;
  
  coin.addEventListener('mousedown', (e) => {
    isDragging = true;
    coin.classList.add('dragging');
    coin.style.transition = 'none';
    
    offsetX = e.clientX - coin.getBoundingClientRect().left;
    offsetY = e.clientY - coin.getBoundingClientRect().top;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const parentRect = coin.parentElement.getBoundingClientRect();
    let newX = e.clientX - parentRect.left - offsetX;
    let newY = e.clientY - parentRect.top - offsetY;
    coin.style.transform = 'scale(1.1)';
    coin.style.left = `${newX}px`;
    coin.style.top = `${newY}px`;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    coin.classList.remove('dragging');
    coin.style.transition = 'all 0.3s ease';
    coin.style.transform = '';

    const coinRect = coin.getBoundingClientRect();
    const slotRect = coinSlot.getBoundingClientRect();

    if (
      coinRect.left < slotRect.right &&
      coinRect.right > slotRect.left &&
      coinRect.top < slotRect.bottom &&
      coinRect.bottom > slotRect.top
    ) {
      handleCoinInserted();
    } else {
      coin.style.left = '';
      coin.style.top = '';
    }
  });

  // --- 코인 투입 성공 시 연출 함수 ---
  function handleCoinInserted() {
    coin.style.display = 'none';
    coinText.textContent = 'Thank you!';
    coinText.classList.remove('blinking-effect');

    setTimeout(() => {
      arcadeScreen.classList.add('zoom-in');
      arcadeMachine.classList.add('fade-out');
      transitionEffect.classList.add('hyperspace');
    }, 500);

    setTimeout(() => {
      // [수정] 연출 효과 배경을 즉시 투명하게 만들어 다음 화면이 바로 보이도록 수정
      transitionEffect.style.opacity = '0';

      coinScreen.classList.add('hidden');
      intro.classList.remove('hidden');
      setupAnimation();
      document.body.classList.add('sword-cursor');
      window.addEventListener('resize', debouncedSetup);
      
      // 클래스는 잠시 후 제거하여 깜빡임 등 잔여 효과 방지
      setTimeout(() => {
        transitionEffect.classList.remove('hyperspace');
      }, 100);
    }, 2000);
  }

  // --- 기타 유틸 및 애니메이션 함수 ---
  function debounce(func, delay) {let timeout; return function(...args) {clearTimeout(timeout); timeout = setTimeout(() => func.apply(this, args), delay);};}
  function setupAnimation() {clearInterval(spriteInterval); canvas.width = window.innerWidth; canvas.height = window.innerHeight; const totalFrames = 4; const frameWidth = 320 / totalFrames; const frameHeight = 80; let currentFrame = 0; const targetX = (canvas.width - frameWidth) / 2; let currentX = -frameWidth; const groundY = canvas.height * 0.5; const spriteY = groundY - frameHeight; const walkSpeed = (targetX + frameWidth) / (2000 / 100); const animationSpeed = 100; spriteInterval = setInterval(() => {if (currentX < targetX) {currentX += walkSpeed; if (currentX >= targetX) {currentX = targetX; if (pressStartText && !pressStartText.classList.contains('visible')) {pressStartText.classList.add('visible');}}} ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(sprite, currentFrame * frameWidth, 0, frameWidth, frameHeight, currentX, spriteY, frameWidth, frameHeight); currentFrame = (currentFrame + 1) % totalFrames;}, animationSpeed);}
  const debouncedSetup = debounce(setupAnimation, 250);
  
  function startPortfolio() {
    pressStartText.removeEventListener('click', startPortfolio);
    document.removeEventListener('keydown', handleEnterKey);
    document.body.classList.remove('sword-cursor');
    
    const barCount = 12;
    transitionEffect.innerHTML = '';
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('div');
      bar.classList.add('interlace-bar');
      transitionEffect.appendChild(bar);
    }
    const bars = document.querySelectorAll('.interlace-bar');
    bars.forEach((bar, index) => {
      setTimeout(() => {
        bar.classList.add('animate');
      }, index * 40);
    });
    setTimeout(() => {
      clearInterval(spriteInterval);
      intro.classList.add('hidden');
      content.classList.remove('hidden');
      window.removeEventListener('resize', debouncedSetup);
    }, barCount * 40 + 100);
    setTimeout(() => {
      bars.forEach((bar, index) => {
        setTimeout(() => {
          bar.style.transformOrigin = 'left';
          bar.classList.remove('animate');
        }, index * 30);
      });
    }, barCount * 40 + 500);
  }

  function handleEnterKey(e) {if (!intro.classList.contains('hidden') && e.key === 'Enter') {e.preventDefault(); startPortfolio();}}

  // --- 이벤트 리스너 연결 ---
  pressStartText.addEventListener('click', startPortfolio);
  document.addEventListener('keydown', handleEnterKey);
  sprite.onerror = (err) => console.error('sprite.png 로딩 실패', err);
  
  // Skills 목록 동적 생성
  const techs = ['HTML', 'CSS', 'JavaScript', 'React', 'Vue', 'Git', 'GitHub Pages'];
  const skillsSection = document.querySelector('#skills');
  const ul = skillsSection.querySelector('ul');
  techs.forEach(item => {const li = document.createElement('li'); li.textContent = item; ul.appendChild(li); });
});