/**
 * Tech.js - 최종 완성본
 * 기사가 걸어 들어온 뒤, 배경만 계속 스크롤되는 최종 버전입니다.
 */
document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro');
  const content = document.getElementById('content');
  const canvas = document.getElementById('sprite-canvas');

  // 캔버스 크기를 브라우저 화면 전체 크기로 설정합니다.
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext('2d');
  const sprite = new Image();
  sprite.src = 'sprite.png'; // B타입(320x80, 4프레임) 기사 이미지

  sprite.onload = () => {
    const totalFrames = 4;
    const frameWidth = 320 / totalFrames; // 80
    const frameHeight = 80;
    
    let currentFrame = 0;
    
    // 등장 애니메이션 관련 변수
    const targetX = (canvas.width - frameWidth) / 2;
    let currentX = -frameWidth;
    
    // 기사의 발이 땅(top: 50%) 위에 오도록 Y좌표를 정확히 계산합니다.
    const groundY = canvas.height * 0.5;
    const spriteY = groundY - frameHeight;

    const walkSpeed = (targetX + frameWidth) / (2000 / 100);
    const animationSpeed = 100;

    const spriteInterval = setInterval(() => {
      if (currentX < targetX) {
        currentX += walkSpeed;
        if (currentX >= targetX) {
          currentX = targetX;
          const p = document.querySelector('#intro p');
          if (p && !p.classList.contains('visible')) {
            p.classList.add('visible');
          }
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        sprite,
        currentFrame * frameWidth, 0, frameWidth, frameHeight,
        currentX, spriteY,
        frameWidth, frameHeight
      );
      currentFrame = (currentFrame + 1) % totalFrames;
    }, animationSpeed);

    window.__spriteInterval = spriteInterval;
  };

  sprite.onerror = (err) => console.error('sprite.png 로딩 실패', err);

  function startPortfolio() {
    // 이 부분은 비워두거나, 나중에 다른 전환 효과를 위해 남겨둘 수 있습니다.
    // 지금은 즉시 전환됩니다.
    if (window.__spriteInterval) clearInterval(window.__spriteInterval);
    intro.classList.add('hidden');
    content.classList.remove('hidden');
  }

  intro.addEventListener('click', startPortfolio);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') startPortfolio();
  });

  const techs = ['HTML', 'CSS', 'JavaScript', 'React', 'Vue', 'Git', 'GitHub Pages'];
  const skillsSection = document.querySelector('#skills');
  const ul = skillsSection.querySelector('ul');
  techs.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });
});