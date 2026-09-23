// online.js - Đã tối ưu đồng bộ giao diện và chống lỗi Cache
(function() {
    // --- HÀM TRỢ GIÚP: Chống crash script trên Mobile Safari (đặc biệt tab ẩn danh) ---
    function safeGetStorage(key, defaultValue = null) {
        try { return localStorage.getItem(key) || defaultValue; } 
        catch (e) { return defaultValue; }
    }

    function safeSetStorage(key, value) {
        try { localStorage.setItem(key, value); } 
        catch (e) { console.warn("LocalStorage block error trên Mobile:", e); }
    }

    // --- HÀM RENDER GIAO DIỆN ---
    function renderOnlineCount(count) {
        const badgeEl = document.getElementById('websiteOnlineBadge');
        const textEl = document.getElementById('websiteOnlineText');
        
        if (badgeEl && textEl && count !== null && count !== undefined) {
            // Xóa style inline 'display: none' để ăn theo CSS class (.website-online-badge)
            badgeEl.style.display = ''; 
            textEl.innerText = 'Online: ' + count; 
        }
    }

    // --- LOGIC CHÍNH ---
    function updateWebsiteOnlineCount() {
        const now = Date.now();
        const lastPing = parseInt(safeGetStorage('last_online_ping', '0'), 10);
        const cooldown = 30000; // Thời gian chờ giữa 2 lần gọi server: 30 giây

        // FIX LỖI #1: Luôn hiển thị dữ liệu từ Cache ngay lập tức (nếu có) để người dùng không thấy chữ "Đang tải..." quá lâu
        const cachedCount = safeGetStorage('website_online_count');
        if (cachedCount) {
            renderOnlineCount(cachedCount);
        }

        // Cập nhật dữ liệu từ server nếu đã quá 30 giây
        if (now - lastPing >= cooldown) {
            // Set ngay thời gian ping mới để tránh gọi API liên tục nhiều lần
            safeSetStorage('last_online_ping', now.toString());

            // Endpoint được đặt cùng bộ asset trang chủ trong /home.
            // Dùng đường dẫn tuyệt đối để vẫn gọi đúng khi URL hiện tại có path khác.
            fetch(`/home/online_count.php?t=${now}`)
                .then(response => {
                    if (!response.ok) throw new Error('Network response error');
                    return response.json();
                })
                .then(data => {
                    if (data && data.count !== undefined) {
                        safeSetStorage('website_online_count', data.count.toString());
                        renderOnlineCount(data.count); // Cập nhật lại số chuẩn nhất từ server
                    }
                })
                .catch(error => {
                    console.error("Online count error:", error);
                    // Nếu fetch bị lỗi (VD: rớt mạng), reset lại ping để 10 giây sau thử fetch lại.
                    safeSetStorage('last_online_ping', '0'); 
                });
        }
    }

    // --- SỰ KIỆN KÍCH HOẠT ---
    
    // 1. Đồng bộ số lượng tức thời giữa các tab đang mở
    window.addEventListener('storage', function(e) {
        if (e.key === 'website_online_count') {
            renderOnlineCount(e.newValue);
        }
    });

    // 2. Hàm khởi chạy vòng lặp
    function initOnlineSystem() {
        updateWebsiteOnlineCount();
        
        // Dọn dẹp interval cũ nếu có để tránh tình trạng chạy đúp tiến trình
        if (window.onlineInterval) clearInterval(window.onlineInterval);
        
        // Đặt đồng hồ kiểm tra mỗi 10 giây (Nhưng chỉ gửi lên server khi đủ 30 giây cooldown)
        window.onlineInterval = setInterval(updateWebsiteOnlineCount, 10000); 
    }

    // FIX LỖI MOBILE #3: Đảm bảo chạy tốt trên hệ thống Back/Forward Cache của Mobile (iOS/Android)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOnlineSystem);
    } else {
        initOnlineSystem();
    }

    // Kích hoạt lại toàn bộ khi user quay lại tab hoặc mở lại từ background (Cực kỳ quan trọng với iOS)
    window.addEventListener('pageshow', initOnlineSystem);
})();
