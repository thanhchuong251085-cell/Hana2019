// Load YouTube IFrame API linh động
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
if (firstScriptTag && firstScriptTag.parentNode) {
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
} else {
    document.head.appendChild(tag);
}

/* --- TỐI ƯU BẢO MẬT: Hàm chống XSS khi render Text --- */
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

/* --- SCRIPT HIỆU ỨNG SAO RƠI LẤP LÁNH 4 CÁNH --- */
const starCanvas = document.getElementById('shooting-stars');
const starCtx = starCanvas.getContext('2d');
let stars = [];
let isTabActive = true; // Biến kiểm tra tab ẩn/hiện để tiết kiệm CPU

function initStarCanvas() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
}

class FallingStar {
    constructor(isInitial = false) { this.reset(isInitial); }
    reset(isInitial = false) {
        this.x = Math.random() * starCanvas.width;
        this.y = isInitial ? Math.random() * starCanvas.height : -30;
        this.size = Math.random() * 5 + 2; 
        this.speed = Math.random() * 0.5 + 0.2; 
        this.opacity = Math.random();
        this.blinkSpeed = Math.random() * 0.03 + 0.02; 
        this.direction = 1; 
    }
    draw() {
        starCtx.save();
        starCtx.translate(this.x, this.y);
        const gradient = starCtx.createRadialGradient(0, 0, 0, 0, 0, this.size * 5);
        gradient.addColorStop(0, `rgba(255, 220, 240, ${this.opacity * 0.8})`);
        gradient.addColorStop(0.3, `rgba(255, 180, 220, ${this.opacity * 0.4})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        starCtx.fillStyle = gradient;
        starCtx.beginPath();
        starCtx.arc(0, 0, this.size * 5, 0, Math.PI * 2);
        starCtx.fill();
        starCtx.fillStyle = `rgba(255, 250, 250, ${this.opacity})`;
        for (let i = 0; i < 2; i++) {
            starCtx.save();
            starCtx.rotate(i * Math.PI / 2);
            starCtx.beginPath();
            starCtx.moveTo(0, -this.size * 3.5);
            starCtx.lineTo(this.size * 0.25, 0);
            starCtx.lineTo(0, this.size * 3.5);
            starCtx.lineTo(-this.size * 0.25, 0);
            starCtx.closePath();
            starCtx.fill();
            starCtx.restore();
        }
        starCtx.beginPath();
        starCtx.arc(0, 0, this.size * 0.8, 0, Math.PI * 2);
        starCtx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        starCtx.fill();
        starCtx.restore();
    }
    update() {
        this.y += this.speed;
        this.opacity += this.blinkSpeed * this.direction;
        if (this.opacity >= 1 || this.opacity <= 0.05) this.direction *= -1;
        if (this.y > starCanvas.height) this.reset(false);
        this.draw();
    }
}

function createStars() {
    stars = [];
    for (let i = 0; i < 80; i++) stars.push(new FallingStar(true));
}

function animateStars() {
    // TỐI ƯU HIỆU NĂNG: Chỉ vẽ khi tab đang mở, giảm tải GPU/Pin
    if (isTabActive) {
        starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
        stars.forEach(s => s.update());
    }
    requestAnimationFrame(animateStars);
}

// Lắng nghe sự kiện ẩn/hiện tab
document.addEventListener("visibilitychange", () => {
    isTabActive = !document.hidden;
});

// --- LOGIC PLAYER & SERVER SYNC ---
const defaultSongs = [
    { type: 'yt', src: 'VOHwurUo8eY', title: '50 Năm Về Sau - Nhạc Trẻ Ballad Tâm Trạng' },
    { type: 'yt', src: 'y96qCEt9eCk', title: 'CÓ MÌNH VÀ TA - Nhạc Trẻ Ballad Tâm Trạng' },
    { type: 'yt', src: 'VJ6yI22GlRM', title: 'Nhạc Trẻ Ballad Triệu View Hay Nhất' },
    { type: 'yt', src: 'KsTlAT2i3DY', title: 'Mình Là Người Yêu Cũ | BXH Nhạc Ballad Hay Nhất TikTok Hiện Nay' },
    { type: 'yt', src: 'sjjq75YkfNY', title: 'Tình Phai – Bản Ballad Buồn Xé Lòng' },
    { type: 'yt', src: 'g3W_mDXB-jI', title: 'Nhạc Lofi Chill Top Xu Hướng 2025 Triệu View' },
    { type: 'yt', src: 's4v6_thbzUI', title: 'THAO THỨC VÌ EM - LK Nhạc Vàng Xưa' },
    { type: 'yt', src: 'UV9bIYsHpAc', title: 'LK Nhạc Xuân 2026 Remix' },
    { type: 'yt', src: 'vA2IC6Mv2y8', title: 'NHẠC TẾT 2026 REMIX' },
    { type: 'yt', src: 'ozRaHcEmV2s', title: 'Liên Khúc Nhạc Xuân Remix 2026' }
];

const bgImgs = [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80',
    'https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80', 
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80',
    'https://images.unsplash.com/photo-1563089145-599997674d42?q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80', 
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80',   
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80',
    'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80',
    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80'
];

let songs = defaultSongs;
let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; 
let ytPlayer;
let isYtReady = false;
let pendingYtLoad = false;
let sleepTimeout = null;
let sleepInterval = null;

const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const titleDisplay = document.getElementById('current-song-title');
const playlistEl = document.getElementById('playlist');
const disk = document.getElementById('disk');
const ytWrapper = document.getElementById('yt-player-wrapper');
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

document.body.style.backgroundImage = `url('${bgImgs[0]}')`;

function changeBackground() {
    const randomIndex = Math.floor(Math.random() * bgImgs.length);
    document.body.style.backgroundImage = `url('${bgImgs[randomIndex]}')`;
}
setInterval(changeBackground, 60000);

// --- HÀM SYNC SERVER ---
async function loadPlaylistFromServer() {
    try {
        const response = await fetch('save_playlist.php');
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            songs = data;
        } else {
            songs = JSON.parse(localStorage.getItem('retro_playlist')) || defaultSongs;
        }
    } catch (err) {
        songs = JSON.parse(localStorage.getItem('retro_playlist')) || defaultSongs;
    }
    renderPlaylist();
}

async function savePlaylist(songToAdd) {
    localStorage.setItem('retro_playlist', JSON.stringify(songs));
    try {
        const response = await fetch('save_playlist.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'add', song: songToAdd })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
    } catch (err) { console.error("Sync error:", err); }
}

function startExperience() {
    document.getElementById('start-overlay').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('start-overlay').style.display = 'none';
        initVisualizer();
        loadAndPlay(0); 
    }, 500);
}

// --- VISUALIZER & UI ---
let audioCtx, analyser, source, dataArray;
function initVisualizer() {
    if (audioCtx) return;
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 64;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        draw();
    } catch(e) { console.log("Visualizer blocked"); }
}

function draw() {
    requestAnimationFrame(draw);
    if(!isTabActive) return; // Không vẽ visualizer nếu tab đang ẩn

    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    if (analyser && isPlaying) { analyser.getByteFrequencyData(dataArray); } 
    else { if(dataArray) dataArray.fill(0); }
    ctx.clearRect(0, 0, W, H);
    const barWidth = (W / 32);
    let x = 0;
    for (let i = 0; i < 32; i++) {
        let barHeight = dataArray ? (dataArray[i] / 255) * H * 0.8 : 0;
        const hue = 300 + (i * 1); 
        ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${0.5 + (barHeight/H)})`;
        ctx.fillRect(x, H - barHeight, barWidth - 2, barHeight);
        x += barWidth;
    }
}

// --- PLAYER CONTROLS ---
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('youtube-iframe', {
        height: '100%', width: '100%',
        playerVars: { 'autoplay': 1, 'controls': 0, 'rel': 0, 'enablejsapi': 1, 'origin': window.location.origin },
        events: { 
            'onReady': (e) => { 
                isYtReady = true; 
                document.getElementById('status-dot').classList.add('ready'); 
                renderPlaylist(); 
                if (pendingYtLoad) {
                    pendingYtLoad = false;
                    loadAndPlay(currentIndex);
                }
            },
            'onStateChange': (e) => { if(e.data === YT.PlayerState.ENDED) handleSongEnd(); },
            'onError': (e) => { nextSong(false); }
        }
    });
}

function loadAndPlay(index) {
    if(songs.length === 0) return;
    currentIndex = index;
    const song = songs[currentIndex];
    titleDisplay.innerText = escapeHTML(song.title);
    renderPlaylist();
    if (song.type === 'mp3') {
        if(isYtReady && ytPlayer.stopVideo) ytPlayer.stopVideo();
        ytWrapper.style.display = 'none'; disk.style.display = 'block';
        audio.src = song.src; 
        
        // TỐI ƯU UX: Nếu file âm thanh lỗi (404), tự động qua bài mới
        audio.play().catch(e => {
            console.log("Audio error - Skipping");
            setTimeout(() => nextSong(false), 2000); // Đợi 2s rồi nhảy qua bài
        });
        pendingYtLoad = false;
    } else {
        audio.pause(); disk.style.display = 'none'; ytWrapper.style.display = 'block';
        if(isYtReady && ytPlayer.loadVideoById) {
            ytPlayer.loadVideoById(song.src);
            setTimeout(() => ytPlayer.playVideo(), 300);
        } else {
            pendingYtLoad = true;
            titleDisplay.innerText = "Đang kết nối YouTube...";
        }
    }
    isPlaying = true; updatePlayBtn();
}

function togglePlay() {
    if(songs.length === 0) return;
    const s = songs[currentIndex];
    if (s.type === 'mp3') {
        if (audio.paused) { audio.play(); isPlaying = true; } 
        else { audio.pause(); isPlaying = false; }
    } else {
        if(!isYtReady) return;
        const state = ytPlayer.getPlayerState();
        if (state === 1) { ytPlayer.pauseVideo(); isPlaying = false; } 
        else { ytPlayer.playVideo(); isPlaying = true; }
    }
    updatePlayBtn();
}

function updatePlayBtn() {
    playBtn.innerText = isPlaying ? "⏸ Stop" : "▶ Play";
    disk.style.animationPlayState = isPlaying ? "running" : "paused";
}

function nextSong(manual) {
    if (isShuffle && manual) { currentIndex = Math.floor(Math.random() * songs.length); } 
    else { currentIndex = (currentIndex + 1) % songs.length; }
    loadAndPlay(currentIndex);
}

function prevSong() {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadAndPlay(currentIndex);
}

function renderPlaylist() {
    playlistEl.innerHTML = "";
    songs.forEach((s, i) => {
        const li = document.createElement('li');
        li.className = i === currentIndex ? 'active' : '';
        // Áp dụng escapeHTML để chống XSS thông qua DOM
        li.innerHTML = `
            <div onclick="loadAndPlay(${i})" style="flex:1; cursor:pointer;">
                ${i+1}. ${escapeHTML(s.title)} <span class="tag-${s.type}">${s.type.toUpperCase()}</span>
            </div>
        `;
        playlistEl.appendChild(li);
    });
}

async function addSongFromInput() {
    const input = document.getElementById('link-input');
    const url = input.value.trim();
    if (!url) return;
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
    if (ytMatch) {
        const id = ytMatch[1];
        titleDisplay.innerText = "Đang lấy thông tin...";
        
        // TỐI ƯU UX: Bắt lỗi nếu noembed.com sập thì vẫn ép nhận nhạc
        try {
            const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`);
            if(!response.ok) throw new Error("API Lỗi");
            const data = await response.json();
            songs.push({ type: 'yt', src: id, title: data.title || "YouTube Video" });
        } catch (err) {
            console.warn("Lỗi lấy title, dùng title mặc định");
            songs.push({ type: 'yt', src: id, title: "YouTube Video Chờ Cập Nhật" });
        }
        
    } else if (url.match(/\.(mp3|wav|ogg)$/i)) {
        songs.push({ type: 'mp3', src: url, title: "MP3 " + url.split('/').pop() });
    } else { alert("Link không hợp lệ!"); return; }
    input.value = "";
    await savePlaylist(songs[songs.length - 1]);
    renderPlaylist();
    loadAndPlay(songs.length - 1);
}

function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3;
    const btn = document.getElementById('repeat-btn');
    btn.innerText = ["🔁 Off", "🔁 All", "🔂 1"][repeatMode];
    btn.classList.toggle('active', repeatMode > 0);
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    document.getElementById('shuffle-btn').classList.toggle('active', isShuffle);
}

function setSleepTimer() {
    const mins = parseInt(document.getElementById('sleep-timer').value);
    const display = document.getElementById('timer-display');
    if (sleepTimeout) clearTimeout(sleepTimeout);
    if (sleepInterval) clearInterval(sleepInterval);
    if (mins === 0) { display.innerText = ""; return; }
    let timeLeft = mins * 60;
    display.innerText = mins + ":00";
    sleepInterval = setInterval(() => {
        timeLeft--;
        let m = Math.floor(timeLeft / 60);
        let s = timeLeft % 60;
        display.innerText = `${m}:${s < 10 ? '0'+s : s}`;
        if (timeLeft <= 0) { clearInterval(sleepInterval); stopAll(); display.innerText = "Đã tắt"; }
    }, 1000);
}

function stopAll() {
    audio.pause(); if(isYtReady && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
    isPlaying = false; updatePlayBtn();
}

function handleSongEnd() {
    if (repeatMode === 2) loadAndPlay(currentIndex);
    else nextSong(false);
}

// --- NEW YEAR WISHES ---
document.addEventListener('DOMContentLoaded', () => {
    fetch('save_wish.php').then(r => r.json()).then(data => {
        if (Array.isArray(data)) data.reverse().forEach(w => renderWish(w));
    });
});

async function addWish() {
    const input = document.getElementById('wishInput');
    const text = input.value.trim();
    if (!text) return;
    const wishObj = { id: Date.now(), content: text, icon: ['🌸', '🧧', '⭐', '🎈', '🎊'][Math.floor(Math.random() * 5)] };
    try {
        const res = await fetch('save_wish.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(wishObj) });
        if (res.ok) {
            renderWish(wishObj);
            confetti({ particleCount: 100, spread: 70, origin: { x: 0.2, y: 0.3 } });
            input.value = "";
        }
    } catch (e) { console.error(e); }
}

function renderWish(wish) {
    const wall = document.getElementById('wishWall');
    const div = document.createElement('div');
    div.className = 'wish-item';
    // wish.icon và wish.content đã được chống XSS từ Server, nhưng cẩn thận vẫn render an toàn
    div.innerHTML = `<strong>${escapeHTML(wish.icon)}</strong> ${escapeHTML(wish.content)}`;
    wall.prepend(div);
}

// --- KHOI TAO ---
initStarCanvas();
createStars();
animateStars();
loadPlaylistFromServer(); 

window.addEventListener('resize', () => { initStarCanvas(); createStars(); });
setInterval(() => {
    const randomIndex = Math.floor(Math.random() * bgImgs.length);
    document.body.style.backgroundImage = `url('${bgImgs[randomIndex]}')`;
}, 60000);
