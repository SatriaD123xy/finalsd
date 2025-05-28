document.addEventListener("DOMContentLoaded", () => {
  // ================== Zoom dan Drag Peta ==================
  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');
  const mapContent = document.getElementById('map-content');
  let zoomLevel = 1, isDragging = false;
  let startX = 0, startY = 0, currentX = 0, currentY = 0, originX = 0, originY = 0;

  function updateTransform() {
    mapContent.style.transform = `scale(${zoomLevel}) translate(${currentX}px, ${currentY}px)`;
  }

  zoomInBtn.addEventListener("click", () => {
    if (zoomLevel < 2) {
      zoomLevel = Math.round((zoomLevel + 0.1) * 10) / 10;
      updateTransform();
    }
  });

  zoomOutBtn.addEventListener("click", () => {
    if (zoomLevel > 1.01) {
      zoomLevel = Math.round((zoomLevel - 0.1) * 10) / 10;
    } else {
      zoomLevel = 1;
      currentX = currentY = 0;
    }
    updateTransform();
  });

  mapContent.addEventListener("mousedown", (e) => {
    if (zoomLevel <= 1) return;
    isDragging = true;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;
    originX = currentX;
    originY = currentY;
    mapContent.style.cursor = "grabbing";
    e.preventDefault();
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    mapContent.style.cursor = "grab";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging || zoomLevel <= 1) return;

    const moveX = e.clientX - startX;
    const moveY = e.clientY - startY;
    const simulatedX = originX + moveX;
    const simulatedY = originY + moveY;

    const containerRect = document.getElementById('map-container').getBoundingClientRect();
    const contentWidth = mapContent.offsetWidth * zoomLevel;
    const contentHeight = mapContent.offsetHeight * zoomLevel;

    const maxX = (contentWidth - containerRect.width) / 2;
    const maxY = (contentHeight - containerRect.height) / 2;

    currentX = Math.max(-maxX, Math.min(maxX, simulatedX));
    currentY = Math.max(-maxY, Math.min(maxY, simulatedY));

    updateTransform();
  });

  // ================== Marker dan Info Window ==================
  const markers = document.querySelectorAll('.marker');
  const infoWindow = document.getElementById('info-window');
  const infoTitle = document.getElementById('info-title');
  const infoDesc = document.getElementById('info-desc');
  const infoImg = document.getElementById('info-img');

  markers.forEach(marker => {
    marker.addEventListener('click', () => {
      infoTitle.textContent = marker.dataset.title || '';
      infoDesc.textContent = marker.dataset.desc || '';
      if (marker.dataset.img) {
        infoImg.src = marker.dataset.img;
        infoImg.style.display = 'block';
      } else {
        infoImg.style.display = 'none';
      }

      infoWindow.style.top = `${marker.offsetTop + 340}px`;
      infoWindow.style.left = `${marker.offsetLeft + 10}px`;
      infoWindow.classList.add('active');
    });
  });

  window.closeInfo = () => {
    infoWindow.classList.remove('active');
  };

  document.addEventListener('click', (e) => {
    const isInside = infoWindow.contains(e.target);
    const isMarker = e.target.closest('.marker');
    const isFasilitas = e.target.closest('.fasilitas-item');
    if (!isInside && !isMarker && !isFasilitas) {
      infoWindow.classList.remove('active');
    }
  });

  // ================== Tombol Toggle Mini Map ==================
  const toggleMapBtn = document.getElementById('toggle-map');
  const miniMap = document.getElementById('mini-map');
  toggleMapBtn.addEventListener('click', () => {
    miniMap.style.display = miniMap.style.display === 'block' ? 'none' : 'block';
  });

  // ================== Tombol Toggle Info Sekolah ==================
  const toggleSchoolBtn = document.getElementById('toggle-school');
  const schoolInfo = document.getElementById('school-info-window');
  const logoImg = toggleSchoolBtn.querySelector('img');

  toggleSchoolBtn.addEventListener('click', () => {
    schoolInfo.style.display = schoolInfo.style.display === 'block' ? 'none' : 'block';
    logoImg.classList.add('logo-animate');
    setTimeout(() => logoImg.classList.remove('logo-animate'), 600);
  });

  window.closeSchoolInfo = () => {
    schoolInfo.style.display = 'none';
  };

  // ================== Klik Fasilitas ==================
  const fasilitasItems = document.querySelectorAll('.fasilitas-item');
  fasilitasItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.dataset.target;
      const targetMarker = document.getElementById(targetId);
      if (targetMarker) {
        targetMarker.click();
        targetMarker.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        targetMarker.style.animation = 'highlight 0.6s ease';
        setTimeout(() => targetMarker.style.animation = '', 600);
      }
    });
  });

  // ================== Dark Mode ==================
  const toggle = document.getElementById('dark-mode-toggle');
  const body = document.body;

  const setDarkMode = (enabled) => {
    body.classList.toggle('dark-mode', enabled);
    toggle.textContent = enabled ? 'Light Mode' : 'Dark Mode';
    toggle.style.background = enabled ? '#f3f4f6' : '#111';
    toggle.style.color = enabled ? '#111' : '#fff';
    localStorage.setItem('darkMode', enabled ? 'enabled' : 'disabled');
  };

  const isDarkSaved = localStorage.getItem('darkMode') === 'enabled';
  setDarkMode(isDarkSaved);

  toggle.addEventListener('click', () => {
    setDarkMode(!body.classList.contains('dark-mode'));
  });

  // ================== Teks ke Suara ==================
  const playAudioBtn = document.getElementById("play-audio-btn");
  if (playAudioBtn && infoDesc) {
    playAudioBtn.addEventListener("click", () => {
      const text = infoDesc.textContent.trim();
      if (!text) return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID";
      speechSynthesis.speak(utterance);
    });
  }

  // ================== Slider Swiper ==================
  new Swiper(".swiper", {
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
});