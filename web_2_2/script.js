// ───── Initialize AOS ─────
AOS.init({ duration: 800, once: true });

// ───── Avatar Wave & Tilt ─────
window.addEventListener('load', () => {
  const avatar = document.querySelector('.avatar-img');
  avatar.classList.add('wave-animation');
});
const avatarEl = document.querySelector('.avatar-img');
avatarEl.addEventListener('mousemove', e => {
  const r = e.target.getBoundingClientRect();
  const x = e.clientX - r.left, cx = r.width/2;
  e.target.style.transform = `rotateZ(${(x-cx)/cx*10}deg) scale(1.05)`;
});
avatarEl.addEventListener('mouseleave', e => {
  e.target.style.transform = 'rotateZ(0deg)';
});

// ───── Project Filtering ─────
document.addEventListener('DOMContentLoaded', () => {
  // existing project & research filters…
  const projectBtns = document.querySelectorAll('.filter-btn:not(.research-filter-btn)');
  const projectCards = document.querySelectorAll('.project-card');
  projectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.dataset.filter;
      projectCards.forEach(c => {
        const col = c.closest('.col');
        col.style.display = (key === 'all' || c.dataset.category.includes(key)) ? '' : 'none';
      });
    });
  });
  const researchBtns = document.querySelectorAll('.research-filter-btn');
  const researchCards = document.querySelectorAll('.research-card');
  researchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      researchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.dataset.filter;
      researchCards.forEach(c => {
        c.style.display = (key === 'all' || c.dataset.category.includes(key)) ? '' : 'none';
      });
    });
  });

  // ───── Skill Bar Animation ─────
  const skillBars = document.querySelectorAll('.progress-bar');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.progress + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });
  skillBars.forEach(bar => observer.observe(bar));




  // ───── Contact Form Handler ─────
  const contactForm = document.getElementById('contactForm');
  const contactAlert = document.getElementById('contactAlert');
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    contactAlert.classList.remove('d-none');
    contactForm.reset();
  });
});