
<script src="main.js"></script>
console.log("starfield:", document.getElementById("starfield"));

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navList = document.getElementById("navList");

navToggle?.addEventListener("click", () => {
const isOpen = navList.classList.toggle("is-open");
navToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close nav on click (mobile)
navList?.addEventListener("click", (e) => {
target = e.target;
if (target.tagName === "A" && navList.classList.contains("is-open")) {
    navList.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
}
});

// Fake send button (demo)
const fakeSend = document.getElementById("fakeSend");
const sendHint = document.getElementById("sendHint");

fakeSend?.addEventListener("click", () => {
sendHint.textContent = "✅ 데모입니다. 실제 전송은 추후 폼 연동(EmailJS 등)으로 연결할 수 있어요.";
});

/* ===== Interactive: Scroll Progress + Reveal ===== */

// Scroll progress bar
const progressBar = document.getElementById("progressBar");

function updateProgress(){
const scrollTop = window.scrollY || document.documentElement.scrollTop;
const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

if (progressBar) progressBar.style.width = `${progress}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

// Reveal on enter viewport (IntersectionObserver)
const revealEls = document.querySelectorAll(".reveal");

const io = new IntersectionObserver((entries) => {
entries.forEach((entry) => {
    if (entry.isIntersecting){
    entry.target.classList.add("is-visible");
      // once visible, stop observing (깔끔 + 성능 좋음)
    io.unobserve(entry.target);
    }
});
}, {
threshold: 0.14,
rootMargin: "0px 0px -8% 0px"
});

revealEls.forEach(el => io.observe(el));

/* ===== Starfield Background ===== */
const canvas = document.getElementById("starfield");
const ctx = canvas?.getContext("2d");

const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

let stars = [];
let w = 0, h = 0, dpr = 1;

function resizeStarfield(){
if (!canvas || !ctx) return;

dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
w = window.innerWidth;
h = window.innerHeight;

canvas.width = Math.floor(w * dpr);
canvas.height = Math.floor(h * dpr);
canvas.style.width = w + "px";
canvas.style.height = h + "px";

ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // 별 개수: 화면 크기에 맞춰 자동
  const count = Math.floor((w * h) / 22000); // 값 낮출수록 별이 많아짐
stars = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.2 + 0.2,     // 별 크기
    a: Math.random() * 0.35 + 0.10,   // 투명도(은은하게)
    vx: (Math.random() * 0.06 + 0.01) * (Math.random() < 0.5 ? 1 : -1),
    vy: (Math.random() * 0.08 + 0.02)
}));
}

function drawStarfield(){
if (!canvas || !ctx) return;

ctx.clearRect(0, 0, w, h);

  // 별: 흰색 위주 + 아주 약간 노란 톤 섞기
for (const s of stars){
    // 살짝 반짝임(아주 미세하게)
    const twinkle = 0.04 * Math.sin((Date.now() / 1000) + s.x);
    const alpha = Math.max(0.03, Math.min(0.45, s.a + twinkle));

    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();

    s.x += s.vx + mouseX * 0.18;
    s.y += s.vy + mouseY * 0.18;

    // 포인트 옐로우 별(가끔만, 매우 희미)
    if (s.r > 1.1){
    ctx.beginPath();
      ctx.fillStyle = `rgba(255, 214, 0, ${alpha * 0.35})`;
      ctx.arc(s.x + 0.4, s.y + 0.2, s.r * 0.85, 0, Math.PI * 2);
    ctx.fill();
    }

    // 이동
    if (!prefersReduced){
    s.x += s.vx;
    s.y += s.vy;

      // 화면 밖으로 나가면 위로 재배치(별똥별 느낌 없이, 천천히 흐르는 느낌)
      if (s.y > h + 10) { s.y = -10; s.x = Math.random() * w; }
    if (s.x > w + 10) { s.x = -10; }
    if (s.x < -10) { s.x = w + 10; }
    }
}

if (!prefersReduced) requestAnimationFrame(drawStarfield);
}

if (canvas && ctx){
resizeStarfield();
if (!prefersReduced) drawStarfield();
}

window.addEventListener("resize", () => {
resizeStarfield();
if (prefersReduced && canvas && ctx) drawStarfield();
});

document.addEventListener("mousemove", (e) => {
mouseX = (e.clientX / window.innerWidth) - 0.5;
mouseY = (e.clientY / window.innerHeight) - 0.5;
});