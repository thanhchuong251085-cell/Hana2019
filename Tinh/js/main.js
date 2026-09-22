// Fix lỗi kẹt cache khi bấm F5/Back
window.addEventListener('pageshow', function(event) {
    document.body.classList.remove('jumping');
});

document.addEventListener("DOMContentLoaded", function() {
    // 1. Tạo hiệu ứng Mưa Sao Băng
    const meteorContainer = document.getElementById('meteor-container');
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 10; i++) {
        let meteor = document.createElement('div');
        meteor.className = 'meteor';
        meteor.style.left = Math.random() * 150 + 'vw';
        meteor.style.top = Math.random() * -50 + 'vh';
        meteor.style.animationDelay = Math.random() * 5 + 's';
        meteor.style.animationDuration = (Math.random() * 1.5 + 1) + 's';
        fragment.appendChild(meteor);
    }
    meteorContainer.appendChild(fragment);

    // 2. XỬ LÝ ÂM NHẠC TRUNG TÂM
    const bgMusic = document.getElementById('bg-music');
    const musicControl = document.getElementById('music-control');
    const musicStatus = document.getElementById('music-status');
    let isMusicPlaying = false;

    // Thiết lập âm lượng mặc định
    bgMusic.volume = 0.6;

    // Hàm Play
    function playMusic() {
        // Cố gắng phát nhạc
        let playPromise = bgMusic.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Nhạc phát thành công
                isMusicPlaying = true;
                musicStatus.innerText = "Bật";
                musicControl.classList.add('music-playing');
            })
            .catch(error => {
                console.log("Trình duyệt chặn autoplay hoặc có lỗi khi phát.");
                isMusicPlaying = false;
                musicStatus.innerText = "Tắt";
                musicControl.classList.remove('music-playing');
            });
        }
    }

    // Hàm Pause
    function pauseMusic() {
        bgMusic.pause();
        isMusicPlaying = false;
        musicStatus.innerText = "Tắt";
        musicControl.classList.remove('music-playing');
    }

    // Xử lý sự kiện click vào nút bật/tắt nhạc
    musicControl.addEventListener('click', function(e) {
        e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài body
        if (isMusicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });
});

// Xử lý hiệu ứng Hyperspace Jump (Mở sang tab mới)
function hyperspaceJump(event, targetUrl) {
    // Ngăn trình duyệt chuyển trang ngay lập tức để xem hiệu ứng
    event.preventDefault(); 
    document.body.classList.add('jumping');
    
    // Vì mở tab mới, trang chủ vẫn hiển thị nên ta KHÔNG tắt nhạc nữa.
    
    setTimeout(function() {
        // 1. Gỡ hiệu ứng nhảy để trang chủ trở lại bình thường (user có thể tiếp tục xem)
        document.body.classList.remove('jumping');
        
        // 2. Mở URL ở tab mới
        let newTab = window.open(targetUrl, '_blank');
        
        // 3. Dự phòng: Một số trình duyệt (như Safari trên iPhone) có chế độ chặn Popup gắt gao. 
        // Nếu trình duyệt chặn mở tab mới do có độ trễ 1.2s, ta bắt buộc phải chuyển trang ở tab hiện tại.
        if (!newTab || newTab.closed || typeof newTab.closed == 'undefined') {
            window.location.href = targetUrl;
        }
    }, 1200);
}