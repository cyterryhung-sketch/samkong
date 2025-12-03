// 音频播放器共享代码
(function() {
    // 根据页面路径确定音频文件路径
    function getAudioPath() {
        const path = window.location.pathname;
        if (path.includes('/resources/')) {
            return '002.mp3';
        } else if (path.includes('/projects/') || path.includes('/workshops/') || path.includes('/study-visits/') || path.includes('/contact/')) {
            return '../resources/002.mp3';
        } else {
            return 'resources/002.mp3';
        }
    }
    
    // 在 DOM 加载完成后初始化
    function initAudioPlayer() {
        // 检查是否已经存在音频播放器
        if (document.getElementById('audioToggleBtn')) {
            // 如果已存在，只更新路径和恢复状态
            setupAudioPlayer();
            return;
        }
        
        // 创建切换按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'audioToggleBtn';
        toggleBtn.className = 'audio-toggle-btn paused';
        toggleBtn.title = '显示/隐藏音频播放器';
        
        // 创建CD外观
        const cdAlbumArt = document.createElement('div');
        cdAlbumArt.className = 'cd-album-art';
        cdAlbumArt.style.backgroundImage = 'url(https://placehold.co/60x60/FFD700/0F172A?text=♪)'; // 默认专辑封面
        
        const cdCenter = document.createElement('div');
        cdCenter.className = 'cd-center';
        
        const cdIcon = document.createElement('span');
        cdIcon.className = 'cd-icon';
        cdIcon.textContent = '🎵';
        
        toggleBtn.appendChild(cdAlbumArt);
        toggleBtn.appendChild(cdCenter);
        toggleBtn.appendChild(cdIcon);
        
        document.body.appendChild(toggleBtn);
        
        
        
        // 设置音频播放器
        setupAudioPlayer();
    }
    
    function setupAudioPlayer() {
        const audioToggleBtn = document.getElementById('audioToggleBtn');
        const audioPlayer = document.getElementById('audioPlayer');
        const audio = document.getElementById('backgroundAudio');
        
        if (!audioToggleBtn || !audioPlayer || !audio) {
            return;
        }
        
        // 从 localStorage 恢复播放状态
        const savedTime = localStorage.getItem('audioTime');
        const wasPlaying = localStorage.getItem('audioPlaying') === 'true';
        const isVisible = localStorage.getItem('audioVisible') !== 'false'; // 默认显示
        
        if (savedTime) {
            audio.currentTime = parseFloat(savedTime);
        }
        
        // 恢复播放器可见性
        if (isVisible) {
            audioPlayer.classList.remove('hidden');
        } else {
            audioPlayer.classList.add('hidden');
        }
        
        // 如果之前正在播放，继续播放
        if (wasPlaying) {
            audio.play().catch(e => console.log('自动播放被阻止:', e));
            toggleBtn.classList.remove('paused');
            toggleBtn.classList.add('playing');
        } else {
            toggleBtn.classList.remove('playing');
            toggleBtn.classList.add('paused');
        }
        
        // 切换显示/隐藏播放器
        audioToggleBtn.addEventListener('click', function() {
            audioPlayer.classList.toggle('hidden');
            localStorage.setItem('audioVisible', !audioPlayer.classList.contains('hidden'));
        });
        
        // 保存播放进度（每1秒保存一次）
        audio.addEventListener('timeupdate', function() {
            localStorage.setItem('audioTime', audio.currentTime);
            localStorage.setItem('audioPlaying', !audio.paused);
        });
        
        // 播放状态改变时保存
        audio.addEventListener('play', function() {
            localStorage.setItem('audioPlaying', 'true');
            toggleBtn.classList.remove('paused');
            toggleBtn.classList.add('playing');
        });
        
        audio.addEventListener('pause', function() {
            localStorage.setItem('audioPlaying', 'false');
            localStorage.setItem('audioTime', audio.currentTime);
            toggleBtn.classList.remove('playing');
            toggleBtn.classList.add('paused');
        });
        
        // 音频结束时重置
        audio.addEventListener('ended', function() {
            localStorage.setItem('audioPlaying', 'false');
            localStorage.setItem('audioTime', '0');
            toggleBtn.classList.remove('playing');
            toggleBtn.classList.add('paused');
        });
    }
    
    // 当 DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAudioPlayer);
    } else {
        // DOM 已经加载完成
        initAudioPlayer();
    }
})();

