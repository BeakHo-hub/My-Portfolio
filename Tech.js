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
    const flashOverlay = document.getElementById('flash-overlay');
    const pixelOverlay = document.getElementById('pixel-overlay');
    const pixelateFilter = document.querySelector("#pixelate-filter feMorphology");
    const arcadeText = document.querySelector('.arcade-text'); // 수정된 부분

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
        arcadeMachine.classList.add('fade-out');

        setTimeout(() => {
            const animationDuration = 800;
            const maxPixelation = 15;
            const maxScale = 2.5;
            let startTime = null;

            coinScreen.classList.add('pixelating');

            function animationLoop(currentTime) {
                if (!startTime) startTime = currentTime;
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / animationDuration, 1);

                const currentPixelation = progress * maxPixelation;
                pixelateFilter.setAttribute('radius', currentPixelation);

                const currentScale = 1 + (progress * (maxScale - 1));
                const currentOpacity = 1 - progress;
                coinScreen.style.transform = `scale(${currentScale})`;
                coinScreen.style.opacity = currentOpacity;
                
                if (progress < 1) {
                    requestAnimationFrame(animationLoop);
                } else {
                    coinScreen.classList.add('hidden');
                    intro.classList.remove('hidden');
                    document.body.classList.add('sword-cursor');
                    initIntroAnimation();

                    coinScreen.classList.remove('pixelating');
                    coinScreen.style.transform = '';
                    coinScreen.style.opacity = '';
                    pixelateFilter.setAttribute('radius', 0);
                }
            }
            
            setTimeout(() => {
                flashOverlay.classList.add('flash');
                setTimeout(() => flashOverlay.classList.remove('flash'), 100);
            }, animationDuration / 2);

            requestAnimationFrame(animationLoop);

        }, 800);
    }

    let animationFrameId;
    let isIntroAnimationRunning = false;

    function initIntroAnimation() {
        isIntroAnimationRunning = true;
        const canvas = document.getElementById('sprite-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        let sprite = {
            image: new Image(),
            x: -80,
            y: window.innerHeight / 2 - 80,
            width: 80,
            height: 80,
            dx: 2,
            totalFrames: 4,
            animationSpeed: 8,
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
        
        function updateSprite() {
            if (sprite.x < canvas.width / 2 - sprite.width / 2) {
                sprite.x += sprite.dx;
            } else {
                sprite.x = canvas.width / 2 - sprite.width / 2;
            }
            sprite.tickCounter++;
            if (sprite.tickCounter > sprite.animationSpeed) {
                sprite.tickCounter = 0;
                sprite.currentFrame = (sprite.currentFrame + 1) % sprite.totalFrames;
            }
        }

        function animate() {
            if (!isIntroAnimationRunning) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            updateSprite();
            drawSprite();
            animationFrameId = requestAnimationFrame(animate);
        }

        sprite.image.onload = () => {
            sprite.frameWidth = sprite.image.width / sprite.totalFrames;
            sprite.frameHeight = sprite.image.height;
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
        isIntroAnimationRunning = false;
        if(animationFrameId) cancelAnimationFrame(animationFrameId);
        document.querySelectorAll('#intro .scenery, #intro #stars-far, #intro #stars-mid').forEach(el => {
            el.style.animationPlayState = 'paused';
        });

        pressStart.innerHTML = 'READY?';
        pressStart.classList.add('blinking-effect');
        
        setTimeout(() => {
            flashOverlay.classList.add('flash');
            setTimeout(() => flashOverlay.classList.remove('flash'), 150);

            intro.classList.add('hidden');
            content.classList.remove('hidden');
            document.body.classList.remove('sword-cursor');

            pixelOverlay.innerHTML = '';
            pixelOverlay.style.display = 'grid';

            const pixelCount = 400;
            const fragments = document.createDocumentFragment();
            for (let i = 0; i < pixelCount; i++) {
                const pixel = document.createElement('div');
                pixel.style.animationDelay = `${Math.random() * 0.5}s`;
                pixel.style.animationPlayState = 'running';
                fragments.appendChild(pixel);
            }
            pixelOverlay.appendChild(fragments);
            
            setTimeout(() => {
                pixelOverlay.style.display = 'none';
                pixelOverlay.innerHTML = '';
            }, 1000);

        }, 1500);
    });
});