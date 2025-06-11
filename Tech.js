document.addEventListener('DOMContentLoaded', () => {
    // 필요한 요소들을 모두 변수로 지정합니다.
    const coin = document.getElementById('draggable-coin');
    const coinSlot = document.getElementById('coin-slot');
    const coinScreen = document.getElementById('coin-screen');
    const arcadeScreen = document.getElementById('arcade-screen');
    const arcadeMachine = document.getElementById('arcade-machine');
    const intro = document.getElementById('intro');
    const content = document.getElementById('content');
    const pressStart = document.querySelector('#intro p');
    const transitionEffect = document.getElementById('transition-effect');
    const arcadeText = document.querySelector('.arcade-text');

    let isDragging = false;
    let offsetX, offsetY;

    coin.addEventListener('mousedown', (e) => {
        isDragging = true;
        coin.classList.add('dragging');
        offsetX = e.clientX - coin.getBoundingClientRect().left;
        offsetY = e.clientY - coin.getBoundingClientRect().top;
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (!isDragging) return;
        const parentRect = coin.parentElement.getBoundingClientRect();
        let x = e.clientX - parentRect.left - offsetX;
        let y = e.clientY - parentRect.top - offsetY;
        coin.style.left = `${x}px`;
        coin.style.top = `${y}px`;
        coin.style.transform = '';
    }

    function onMouseUp() {
        if (!isDragging) return;
        isDragging = false;
        coin.classList.remove('dragging');
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

        const coinRect = coin.getBoundingClientRect();
        const slotRect = coinSlot.getBoundingClientRect();
        
        const isCoinOverSlot = !(coinRect.right < slotRect.left || coinRect.left > slotRect.right || coinRect.bottom < slotRect.top || coinRect.top > slotRect.bottom);

        if (isCoinOverSlot) {
            handleCoinInserted();
        } else {
            coin.style.left = '5%';
            coin.style.top = 'calc(50% - 25px)';
        }
    }
    
    function handleCoinInserted() {
        coin.style.pointerEvents = 'none';
        coin.style.display = 'none';
        arcadeText.textContent = 'Thank You!';
        arcadeText.classList.remove('blinking-effect');
        
        setTimeout(() => {
            arcadeScreen.classList.add('zoom-in');
            arcadeMachine.classList.add('fade-out');
            
            setTimeout(() => {
                coinScreen.classList.add('hidden');
                intro.classList.remove('hidden');
                document.body.classList.add('sword-cursor');
                initIntroAnimation();
            }, 1000);
        }, 500);
    }

    let animationFrameId;

    function initIntroAnimation() {
        const canvas = document.getElementById('sprite-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        let sprite = {
            image: new Image(),
            x: -80,
            // [수정] 기사의 발이 땅(화면 높이의 50%)에 닿도록 Y좌표 계산 방식 변경
            y: window.innerHeight / 2 - 80, // sprite.height 값(80)을 빼서 발끝을 맞춤
            width: 80,
            height: 80,
            dx: 2,

            // --- ⚙️ 애니메이션 설정 (자연스러운 값을 추천하지만, 취향에 맞게 조절하세요!) ---
            totalFrames: 4,
            animationSpeed: 8, // 추천값
            // --------------------------------------------------------------------
            
            currentFrame: 0,
            frameWidth: 0,
            frameHeight: 0,
            tickCounter: 0
        };
        
        function drawSprite() {
            ctx.drawImage(
                sprite.image,
                sprite.currentFrame * sprite.frameWidth, 0,
                sprite.frameWidth, sprite.frameHeight,
                sprite.x, sprite.y,
                sprite.width, sprite.height
            );
        }
        
        // [수정] updateSprite 로직을 '이동'과 '애니메이션'으로 분리
        function updateSprite() {
            // 1. 위치 이동 로직 (화면 중앙에 도착하면 멈춤)
            if (sprite.x < canvas.width / 2 - sprite.width / 2) {
                sprite.x += sprite.dx;
            } else {
                sprite.x = canvas.width / 2 - sprite.width / 2;
            }

            // 2. 애니메이션 프레임 로직 (계속 실행됨)
            sprite.tickCounter++;
            if (sprite.tickCounter > sprite.animationSpeed) {
                sprite.tickCounter = 0;
                sprite.currentFrame = (sprite.currentFrame + 1) % sprite.totalFrames;
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            updateSprite();
            drawSprite();
            animationFrameId = requestAnimationFrame(animate);
        }

        sprite.image.onload = () => {
            sprite.frameWidth = sprite.image.width / sprite.totalFrames;
            sprite.frameHeight = sprite.image.height;
            // [수정] 기사의 y 좌표를 이미지 로드 후 설정하여 정확도 향상
            sprite.y = window.innerHeight / 2 - sprite.frameHeight;
            animationFrameId = requestAnimationFrame(animate);
        };
        sprite.image.onerror = () => console.error("'sprite.png' 이미지를 불러올 수 없습니다.");
        sprite.image.src = 'sprite.png';

        setTimeout(() => {
            pressStart.classList.add('visible');
        }, 2000);
    }

    pressStart.addEventListener('click', () => {
        if(animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        transitionEffect.classList.add('hyperspace');
        setTimeout(() => {
            intro.classList.add('hidden');
            content.classList.remove('hidden');
            document.body.classList.remove('sword-cursor');
            transitionEffect.style.display = 'none';
        }, 1500);
    });
});