document.addEventListener('DOMContentLoaded', () => {

    // 각 프로젝트에 대한 정보를 객체로 관리
    const projectsData = {
        'portfolio': {
            title: '포트폴리오 월드',
            description: '8비트 레트로 게임 컨셉으로 제작한 인터랙티브 웹 포트폴리오입니다. JavaScript와 CSS 애니메이션을 활용하여 재미있는 사용자 경험을 구현했습니다.',
            githubLink: '#', // 실제 GitHub 주소로 변경
            demoLink: '#'    // 실제 Demo 주소로 변경
        },
        'minigame': {
            title: '던전 미니게임',
            description: '간단한 웹 기반 미니 게임입니다. Canvas를 사용하여 렌더링하고, 기본적인 게임 로직을 구현했습니다.',
            githubLink: '#',
            demoLink: null // Live Demo가 없으면 null로 설정
        },
        'village': {
            title: '새로운 마을',
            description: '이곳은 새롭게 추가된 마을 스테이지입니다. 커뮤니티 기능이나 실용적인 웹 애플리케이션을 구현한 프로젝트를 소개할 수 있습니다.',
            githubLink: '#',
            demoLink: '#'
        }
    };

    const worldMap = document.getElementById('world-map');
    const modal = document.getElementById('project-modal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');

    // 월드맵의 스테이지들을 클릭했을 때의 동작
    worldMap.addEventListener('click', (event) => {
        const stage = event.target.closest('.stage');
        if (stage) {
            const projectId = stage.dataset.project;
            openModal(projectId);
        }
    });

    // 모달창 열기
    function openModal(projectId) {
        const data = projectsData[projectId];
        if (!data) return;

        // 데이터로 모달 내용 채우기
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-desc').textContent = data.description;
        document.getElementById('modal-github-link').href = data.githubLink;
        
        const demoLink = document.getElementById('modal-demo-link');
        if (data.demoLink) {
            demoLink.href = data.demoLink;
            demoLink.style.display = 'inline-block';
        } else {
            demoLink.style.display = 'none';
        }

        modal.classList.remove('hidden');
    }

    // 모달창 닫기
    function closeModal() {
        modal.classList.add('hidden');
    }

    modalCloseBtn.addEventListener('click', closeModal);
    // 모달 바깥의 어두운 영역을 클릭해도 닫히게 설정
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
});