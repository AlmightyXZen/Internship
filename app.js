const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

navToggle?.addEventListener("click", () => {
  mainNav?.classList.toggle("open");
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      mainNav?.classList.remove("open");
    }
  });
});

const revealItems = document.querySelectorAll(".scroll-reveal");
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

revealItems.forEach((item) => revealObserver.observe(item));

const projectContainer = document.querySelector(".projects-marquee");
if (projectContainer) {
  projectContainer.style.flexWrap = "nowrap";
  projectContainer.style.overflow = "hidden";
  projectContainer.style.justifyContent = "flex-start";

  const track = document.createElement("div");
  track.style.display = "flex";
  track.style.gap = "40px";
  track.style.width = "max-content";

  const projectCards = Array.from(
    projectContainer.querySelectorAll(".project-card"),
  );

  projectCards.forEach((card) => track.appendChild(card));
  const clonedCards = projectCards.map((card) => card.cloneNode(true));
  clonedCards.forEach((card) => track.appendChild(card));

  projectContainer.appendChild(track);

  const trackWidth = track.scrollWidth / 2;
  track.style.minWidth = `${track.scrollWidth}px`;
  track.style.willChange = "transform";

  track.animate(
    [
      { transform: "translateX(0)" },
      { transform: `translateX(-${trackWidth}px)` },
    ],
    {
      duration: 22000,
      iterations: Infinity,
      easing: "linear",
    },
  );
}
