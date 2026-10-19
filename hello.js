document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const btnStart = document.getElementById("btn-start");

  if (btnStart && intro) {
    btnStart.addEventListener("click", () => {
      intro.classList.add("hidden");
      playMusic(music);
    });
  }
});

const music = document.getElementById("background-music");
const musicButton = document.getElementById("toggle-music");
const musicStatus = document.getElementById("music-status");

function revealTextByLetter(element) {
    if (!element) return;
    const text = element.textContent.normalize("NFC");
    element.setAttribute("aria-label", text);
    let characterIndex = 0;
    const parts = text.match(/\S+|\s+/gu) || [];
    const segmenter = typeof Intl !== "undefined" && Intl.Segmenter 
        ? new Intl.Segmenter("vi", { granularity: "grapheme" }) 
        : null;

    element.replaceChildren(...parts.map((part) => {
        if (/^\s+$/u.test(part)) {
            characterIndex += part.length;
            return document.createTextNode(part);
        }

        const characters = segmenter 
            ? Array.from(segmenter.segment(part), s => s.segment) 
            : Array.from(part);

        const word = document.createElement("span");
        word.className = "letter-word";
        word.setAttribute("aria-hidden", "true");
        word.replaceChildren(...characters.map((character) => {
            const letter = document.createElement("span");
            letter.className = "letter";
            letter.style.animationDelay = `${characterIndex * (element.id === "message" ? 90 : 35)}ms`;
            letter.textContent = character;
            characterIndex++;
            return letter;
        }));
        return word;
    }));
}

revealTextByLetter(document.getElementById("greeting-title"));
revealTextByLetter(document.getElementById("message"));
revealTextByLetter(document.querySelector(".message-continuation"));

function updateMusicStatus(message) {
    const isPlaying = !music.paused;
    musicButton.setAttribute("aria-label", isPlaying ? "Tắt nhạc" : "Bật nhạc");
    musicButton.setAttribute("aria-pressed", String(isPlaying));
    musicButton.querySelector(".music-disc").classList.toggle("is-playing", isPlaying);
    musicStatus.textContent = message;
}

function playMusic(audio) {
    audio.play().then(() => {
        updateMusicStatus("Đang phát nhạc");
    }).catch(() => {
        if (audio.paused) {
            updateMusicStatus("Không phát được nhạc. Hãy bấm đĩa nhạc để thử lại.");
        }
    });
}

musicButton.addEventListener("click", () => {
    if (music.paused) {
        playMusic(music);
    } else {
        music.pause();
        updateMusicStatus("Nhạc đang tắt");
    }
});

music.addEventListener("error", () => {
    updateMusicStatus("Không tải được file nhạc nhac2.mp3.");
});

music.addEventListener("play", () => updateMusicStatus("Đang phát nhạc"));
music.addEventListener("pause", () => updateMusicStatus("Nhạc đang tạm dừng"));

playMusic(music);

const fallingIcons = ["🌸", "🍬", "🍰", "🥑", "💖"];
const giftOptions = [
    { label: "Tim nè", icon: "💖" },
    { label: "Kẹo nè", icon: "🍬" },
    { label: "Bơ nè", icon: "🥑" },
    { label: "Bánh nè", icon: "🍰" },
    { label: "Hoa nè", icon: "🌸" }
];
const giftButton = document.getElementById("gift-button");
let selectedGift = giftOptions[Math.floor(Math.random() * giftOptions.length)];

function updateGiftButton() {
    giftButton.textContent = selectedGift.label;
    giftButton.setAttribute("aria-label", selectedGift.label);
}

function dropGiantItem(icon) {
    const item = document.createElement("div");
    item.className = "giant-falling-item";
    item.setAttribute("aria-hidden", "true");
    item.textContent = icon;
    item.style.setProperty("--start-x", `${Math.random() * 100}vw`);
    item.style.setProperty("--start-y", `${-Math.random() * 35 - 25}vh`);
    item.style.setProperty("--drift", `${Math.random() * 60 - 30}vw`);
    item.style.setProperty("--rotation", `${Math.random() * 720 - 360}deg`);
    item.style.setProperty("--fall-duration", `${Math.random() * 1.5 + 2.5}s`);
    document.body.appendChild(item);
    item.addEventListener("animationend", () => item.remove(), { once: true });
}

giftButton.addEventListener("click", () => {
    const chosenIcon = selectedGift.icon;
    const itemCount = Math.floor(Math.random() * 3) + 6;
    for (let index = 0; index < itemCount; index++) {
        setTimeout(() => dropGiantItem(chosenIcon), index * 120);
    }
    selectedGift = giftOptions[Math.floor(Math.random() * giftOptions.length)];
    updateGiftButton();
});

updateGiftButton();

function updateClock() {
    const now = new Date();
    const time = document.getElementById("clock-time");
    const date = document.getElementById("clock-date");

    time.textContent = new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).format(now);
    time.dateTime = now.toISOString();

    date.textContent = new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(now);
}

function createFallingItem(icon = fallingIcons[Math.floor(Math.random() * fallingIcons.length)]) {
    const item = document.createElement("div");
    const duration = Math.random() * 0.8 + 1.6;

    item.classList.add("falling-item");
    item.textContent = icon;
    item.style.left = `${Math.random() * 100}vw`;
    item.style.fontSize = `${Math.random() * 20 + 20}px`;
    item.style.animationDuration = `${duration}s`;
    item.style.opacity = `${Math.random() * 0.4 + 0.6}`;

    document.body.appendChild(item);

    setTimeout(() => {
        item.remove();
    }, duration * 1000);
}

updateClock();
setInterval(updateClock, 1000);
setInterval(() => createFallingItem(), 66);
