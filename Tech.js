/**
 * Tech.js
 * Skills & Tools 렌더링, Intro 전환 및 Sprite 애니메이션 로직을 처리합니다.
 */

document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro');
  const content = document.getElementById('content');

  // 스프라이트 애니메이션 설정
  const canvas = document.getElementById('sprite-canvas');
  const ctx = canvas.getContext('2d');
  const sprite = new Image();
  sprite.src = 'sprite.png'; // 프로젝트 폴더에 sprite.png 파일을 위치시켜 주세요

  sprite.onload = () => {
    console.log('Sprite loaded');
    const frameWidth = 32;
    const frameHeight = 32;
    const totalFrames = 4;
    let currentFrame = 0;
    const spriteX = (canvas.width - frameWidth) / 2;
    const spriteY = canvas.height - frameHeight - 10;

    // 0.2초마다 프레임 전환
    const spriteInterval = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        sprite,
        currentFrame * frameWidth, 0,
        frameWidth, frameHeight,
        spriteX, spriteY,
        frameWidth, frameHeight
      );
      currentFrame = (currentFrame + 1) % totalFrames;
    }, 200);

    // 전역으로 저장해두면 startPortfolio에서 clearInterval 가능
    window.__spriteInterval = spriteInterval;
  };

  sprite.onerror = (err) => {
    console.error('Failed to load sprite.png', err);
  };

  // 포트폴리오 시작 함수
  function startPortfolio() {
    if (window.__spriteInterval) clearInterval(window.__spriteInterval);
    intro.classList.add('hidden');
    content.classList.remove('hidden');
  }

  intro.addEventListener('click', startPortfolio);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') startPortfolio();
  });

  // Skills & Tools 렌더링
  const techs = ['HTML', 'CSS', 'JavaScript', 'React', 'Vue', 'Git', 'GitHub Pages'];
  const skillsSection = document.querySelector('#skills');
  const ul = skillsSection.querySelector('ul');

  techs.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });
});