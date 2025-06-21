// script.js

document.addEventListener('DOMContentLoaded', () => {
  // ─── 1. AOS (Animate On Scroll) ─────────────────────────────────
  if (window.AOS) AOS.init({ duration: 800, once: true });

  // ─── 2. Scroll-spy for nav links ─────────────────────────────────
  const sections     = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-item');
  const mobileLinks  = document.querySelectorAll('.nav-item-mobile');
  function updateActiveLink() {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    sections.forEach(sec => {
      const top    = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      const id     = sec.id;
      const dLink  = document.querySelector(`.nav-item[href="#${id}"]`);
      const mLink  = document.querySelector(`.nav-item-mobile[href="#${id}"]`);
      if (scrollPos >= top && scrollPos < bottom) {
        dLink?.classList.add('active');
        mLink?.classList.add('active');
      } else {
        dLink?.classList.remove('active');
        mLink?.classList.remove('active');
      }
    });
  }
  updateActiveLink();
  window.addEventListener('scroll', updateActiveLink);

  // ─── 3. Mobile menu toggle ────────────────────────────────────────
  const navToggle  = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    mobileMenu.classList.toggle('hidden');
  });

  // ─── 4. Smooth-scroll for all anchor links ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      // close mobile menu
      navToggle?.classList.remove('open');
      mobileMenu?.classList.add('hidden');
      // scroll smoothly
      const target = document.querySelector(a.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ─── 5. Hero CTA & arrow scrolls ──────────────────────────────────
  document.getElementById('hero-cta')
    ?.addEventListener('click', () => document.getElementById('projects')
      ?.scrollIntoView({ behavior: 'smooth' }));

  document.querySelectorAll('.animate-bounce, #hero-arrow').forEach(el => {
    el.addEventListener('click', () => document.getElementById('about')
      ?.scrollIntoView({ behavior: 'smooth' }));
  });

  // ─── 6. Social-bar fade-in ────────────────────────────────────────
  setTimeout(() => {
    document.getElementById('social-bar')?.classList.add('show');
  }, 3000);

  // ─── 7. Typewriter effect in code editor ─────────────────────────
  const codeContent = document.getElementById('code-content');
  if (codeContent) {
    const pythonCode = `def greet():
    print("👋 Hello, I'm Vedansh")

class AIResearcher:
    def __init__(self, name):
        self.name = name

    def publish(self):
        print(f"{self.name} publishes cutting-edge AI papers.")

if __name__ == "__main__":
    greet()
    researcher = AIResearcher("Vedansh")
    researcher.publish()`;
    let idx = 0;
    function typeCode() {
      codeContent.textContent += pythonCode[idx++];
      codeContent.parentElement.scrollTop = codeContent.parentElement.scrollHeight;
      if (idx < pythonCode.length) setTimeout(typeCode, 50);
    }
    setTimeout(typeCode, 500);
  }

  // ─── 8. Left-panel particles ───────────────────────────────────────
  (function initLeftParticles() {
    const canvas = document.getElementById('left-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      particles = Array.from({ length: 60 }, () => ({
        x: Math.random()*W,
        y: Math.random()*H,
        vx: (Math.random()-0.5)*0.5,
        vy: (Math.random()-0.5)*0.5,
        r: Math.random()*2 + 1
      }));
    }
    window.addEventListener('resize', resize);
    resize();
    function draw() {
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = 'rgba(0,200,255,0.6)';
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x<0) p.x=W; if (p.x>W) p.x=0;
        if (p.y<0) p.y=H; if (p.y>H) p.y=0;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  })();

  // ─── 9. Network-background canvas ─────────────────────────────────
  (function initNetworkCanvas() {
    const canvas = document.getElementById('network-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, nodes = [];
    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      const N = window.innerWidth < 768 ? 60 : 120;
      nodes = Array.from({ length: N }, () => ({
        x: Math.random()*W,
        y: Math.random()*H,
        vx: (Math.random()-0.5)*0.5,
        vy: (Math.random()-0.5)*0.5
      }));
    }
    window.addEventListener('resize', resize);
    resize();
    function draw() {
      ctx.clearRect(0,0,W,H);
      const fade = Math.max(0,1 - window.scrollY/H);
      ctx.globalAlpha = fade;
      nodes.forEach(n=>{
        n.x+=n.vx; n.y+=n.vy;
        if(n.x<0) n.x=W; if(n.x>W) n.x=0;
        if(n.y<0) n.y=H; if(n.y>H) n.y=0;
      });
      // lines
      for (let i=0; i<nodes.length; i++) {
        for (let j=i+1; j<nodes.length; j++) {
          const a=nodes[i], b=nodes[j];
          const dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy);
          if (d<150) {
            ctx.strokeStyle = `rgba(0,200,255,${1-d/150})`;
            ctx.beginPath();
            ctx.moveTo(a.x,a.y);
            ctx.lineTo(b.x,b.y);
            ctx.stroke();
          }
        }
      }
      // dots
      nodes.forEach(n=>{
        ctx.fillStyle='rgba(0,200,255,0.8)';
        ctx.beginPath();
        ctx.arc(n.x,n.y,2,0,Math.PI*2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  })();

  // ─── 10. Three.js Hero background (orb & wires) ───────────────────
  (function initThreeBg(){
    if (!window.THREE) return;
    const container = document.getElementById('hero-canvas');
    if (!container) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    container.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,0.1,1000);
    camera.position.set(0,0,8);
    renderer.setSize(window.innerWidth,window.innerHeight);
    scene.add(new THREE.AmbientLight(0xffffff,0.5));

    // Nebula particles
    const COUNT = window.innerWidth<768?150:600;
    const geo   = new THREE.BufferGeometry();
    const pos   = new Float32Array(COUNT*3);
    const vel   = new Float32Array(COUNT*3);
    function ra(a,s){ let v=(Math.random()*2-1)*s; return Math.abs(v)<a ? ((v<0?-1:1)*(a+Math.random()*(s-a))) : v; }
    for (let i=0;i<COUNT;i++){
      pos[3*i]   = ra(1.5,8);
      pos[3*i+1] = ra(1.0,5);
      pos[3*i+2] = ra(1.5,8);
      vel[3*i]   = (Math.random()-0.5)*0.001;
      vel[3*i+1] = (Math.random()-0.5)*0.001;
      vel[3*i+2] = (Math.random()-0.5)*0.001;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    geo.setAttribute('velocity', new THREE.BufferAttribute(vel,3));
    const nebMat    = new THREE.PointsMaterial({ color:0x0dcaf0, size:0.05, transparent:true,opacity:0.4,depthWrite:false });
    const nebula    = new THREE.Points(geo, nebMat);
    const wireInner = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(1.8,16,16)),
      new THREE.LineBasicMaterial({color:0x0dcaf0,opacity:0.15,transparent:true})
    );
    const wireOuter = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(2.8,24,24)),
      new THREE.LineBasicMaterial({color:0xff6347,opacity:0.15,transparent:true})
    );
    scene.add(nebula, wireInner, wireOuter);

    // Color update on scroll
    const heroH = document.getElementById('hero')?.offsetHeight || 0;
    function updateBgColors(){
      const sc = window.scrollY;
      const c1 = sc>heroH?0xff6347:0x0dcaf0;
      const c2 = sc>heroH?0x00ffcc:0x0dcaf0;
      nebMat.color.setHex(c1);
      wireInner.material.color.setHex(c1);
      wireOuter.material.color.setHex(c2);
    }
    updateBgColors();

    // Animate
    (function animate(){
      requestAnimationFrame(animate);
      const pA = geo.attributes.position.array;
      const vA = geo.attributes.velocity.array;
      for (let i=0;i<COUNT;i++){
        const ix=3*i, iy=ix+1, iz=ix+2;
        pA[ix]+=vA[ix]; pA[iy]+=vA[iy]; pA[iz]+=vA[iz];
        if (Math.abs(pA[ix])>10||Math.abs(pA[iy])>6||Math.abs(pA[iz])>10){
          pA[ix]=ra(1.5,8); pA[iy]=ra(1.0,5); pA[iz]=ra(1.5,8);
        }
      }
      geo.attributes.position.needsUpdate=true;
      nebula.rotation.y += 0.0005;
      nebula.rotation.x += 0.0002;
      wireInner.rotation.y += 0.005;
      wireOuter.rotation.y -= 0.003;
      renderer.render(scene,camera);
    })();

    window.addEventListener('resize', ()=>{
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth,window.innerHeight);
      updateBgColors();
    });
    window.addEventListener('scroll', updateBgColors);
  })();

  // ─── 11. Project filters ───────────────────────────────────────────

document.querySelectorAll('section').forEach(section => {
  const btns  = section.querySelectorAll('.filter-btn');
  // adjust these selectors if your research cards use a different class
  const cards = section.querySelectorAll('.project-slab, .research-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 1) toggle active on only this section’s buttons
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // 2) filter only this section’s cards
      const key = btn.dataset.filter;
      cards.forEach(card => {
        const cats = card.dataset.category.split(' ');
        card.style.display = (key === 'all' || cats.includes(key))
          ? ''   // show
          : 'none';
      });
    });
  });
});

// ─── Black network background for Projects ─────────────────────────
(function initProjectsNetwork() {
  const canvas = document.getElementById('projects-network-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, nodes;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    const N = 60;  // number of particles
    nodes = Array.from({ length: N }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3
    }));
  }
  window.addEventListener('resize', resize);
  resize();

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // update positions
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0) n.x = W;
      if (n.x > W) n.x = 0;
      if (n.y < 0) n.y = H;
      if (n.y > H) n.y = 0;
    });

    // draw connecting lines
    const maxDist = 120;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < maxDist) {
          const alpha = 1 - d / maxDist;
          ctx.strokeStyle = `rgba(0,0,0,${alpha * 0.6})`;
          ctx.lineWidth   = 1.5;  
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // draw nodes as small black dots
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();
// 12.5 . Project View Details Modal
document.querySelectorAll('.project-slab a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const card = link.closest('.project-slab');
    const modal = document.getElementById('project-modal');
    const title = card.querySelector('h3')?.textContent || '';
    const desc  = card.querySelector('p')?.textContent || '';
    const img   = card.querySelector('img')?.src || '';
    const chips = card.querySelectorAll('.chip');
    const techHTML = Array.from(chips).map(c => `<span class="chip">${c.textContent}</span>`).join('');

    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-desc').textContent = desc;
    document.getElementById('modal-image').src = img;
    document.getElementById('modal-tech').innerHTML = techHTML;
    document.getElementById('modal-link').href = '#'; // replace with real link if available

    modal.classList.remove('hidden');
  });
});

document.getElementById('modal-close')?.addEventListener('click', () => {
  document.getElementById('project-modal').classList.add('hidden');
});

  // ─── 12.8 Floating particles for Research section ────────────────────

// Floating particle canvas for Research
(function initResearchParticles() {
  const canvas = document.getElementById('research-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    nodes = Array.from({ length: 50 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2
    }));
  }

  window.addEventListener('resize', resize);
  resize();

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0) n.x = W;
      if (n.x > W) n.x = 0;
      if (n.y < 0) n.y = H;
      if (n.y > H) n.y = 0;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.5, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0,200,255,0.4)';
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();
document.addEventListener('DOMContentLoaded', () => {
  // ── Starfield ─────────────────────────────────────────────────
  (function() {
    const canvas = document.getElementById('research-stars');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, stars = [];
    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      stars = Array.from({ length: 100 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.3,
        tw: Math.random() * Math.PI * 2
      }));
    }
    window.addEventListener('resize', resize);
    resize();
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        s.tw += 0.02;
        const alpha = 0.5 + 0.5 * Math.sin(s.tw);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    })();
  })();

  // ── Drifting Particles ────────────────────────────────────────
  (function() {
    const canvas = document.getElementById('research-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, parts = [];
    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      parts = Array.from({ length: 60 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3,
        r: Math.random()*1.5 + 0.5
      }));
    }
    window.addEventListener('resize', resize);
    resize();
    (function draw() {
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = 'rgba(14,202,233,0.4)';
      parts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x<0) p.x = W; if(p.x>W) p.x = 0;
        if (p.y<0) p.y = H; if(p.y>H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    })();
  })();
});




  // ─── 13.5 Slider nav buttons ───────────────────────────────────────
  const slider = document.getElementById('project-slider');
  const prevBtn= document.getElementById('slider-prev');
  const nextBtn= document.getElementById('slider-next');
  if (slider && prevBtn && nextBtn) {
    window.addEventListener('load', ()=>{
      const gap   = parseInt(getComputedStyle(slider).columnGap)||0;
      const slide = slider.querySelector('.project-slide');
      if (!slide) return;
      const slideW = slide.offsetWidth + gap;
      prevBtn.addEventListener('click', ()=> slider.scrollBy({ left:-slideW, behavior:'smooth' }));
      nextBtn.addEventListener('click', ()=> slider.scrollBy({ left: slideW, behavior:'smooth' }));
    });
  }


  // --------------- 14. Skills Section complete───────────────────────────────
 // Add this at the end of the DOMContentLoaded event listener
initSkillsSection();

// Skills Section Initialization, Sorting, Filtering, and Pagination
function initSkillsSection() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  const grid = skillsSection.querySelector('.skills-grid');
  const orbs = Array.from(grid.children);
  const prevBtn = skillsSection.querySelector('#skills-slider-prev');
  const nextBtn = skillsSection.querySelector('#skills-slider-next');
  const filters = Array.from(skillsSection.querySelectorAll('.skills-filter-btn'));
  const debugInfo = skillsSection.querySelector('.debug-info');

  let currentFilter = 'all';
  let pageIndex = 0;

  // 1️⃣ Sort orbs by star count (descending)
  const sortedOrbs = orbs.slice().sort((a, b) => {
    const starsA = (a.innerText.match(/⭐/g) || []).length;
    const starsB = (b.innerText.match(/⭐/g) || []).length;
    return starsB - starsA;
  });

  // Apply sorted order to the DOM
  sortedOrbs.forEach(orb => grid.appendChild(orb));

  // 2️⃣ Get the number of skills to show per page
  function getPageSize() {
    const width = window.innerWidth;
    if (width >= 1024) return 9;  // 3x3 desktop
    if (width >= 768) return 6;   // 3x2 tablet
    return 3;                     // 3x1 mobile
  }

  // 3️⃣ Filter and paginate
  function updatePager() {
    const pageSize = getPageSize();

    const filteredOrbs = currentFilter === 'all'
      ? sortedOrbs
      : sortedOrbs.filter(orb =>
          orb.dataset.category.split(' ').includes(currentFilter)
        );

    const pageCount = Math.max(1, Math.ceil(filteredOrbs.length / pageSize));
    pageIndex = Math.max(0, Math.min(pageIndex, pageCount - 1));

    // Hide all orbs first
    sortedOrbs.forEach(orb => orb.classList.add('hidden'));

    // Show the current page orbs
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    filteredOrbs.slice(start, end).forEach(orb => orb.classList.remove('hidden'));

    // Button states
    if (prevBtn) {
      prevBtn.disabled = pageIndex === 0;
      prevBtn.style.opacity = pageIndex === 0 ? 0.5 : 1;
    }

    if (nextBtn) {
      nextBtn.disabled = pageIndex >= pageCount - 1;
      nextBtn.style.opacity = pageIndex >= pageCount - 1 ? 0.5 : 1;
    }

    if (debugInfo) {
      debugInfo.textContent = `Showing ${start + 1}-${Math.min(end, filteredOrbs.length)} of ${filteredOrbs.length} skills`;
    }
  }

  // 4️⃣ Filter button events
  filters.forEach(btn => {
    btn.addEventListener('click', function () {
      filters.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.getAttribute('data-category');
      pageIndex = 0;
      updatePager();
    });
  });

  // 5️⃣ Navigation events
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      pageIndex--;
      updatePager();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      pageIndex++;
      updatePager();
    });
  }

  // 6️⃣ Responsive: update on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updatePager, 100);
  });

  // 7️⃣ Initial display
  updatePager();
}
//------ 14.5 Skill animations -───────────────────────────────
// Replace the existing initSkillsCircuitBackground function with this:
(function initSkillsCircuitBackground() {
  const canvas = document.getElementById('skills-bg-circuit');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [];

  function resize() {
    // Get computed style to account for padding
    const parent = canvas.parentElement;
    const style = getComputedStyle(parent);
    
    // Calculate dimensions minus padding
    W = canvas.width = parent.clientWidth;
    H = canvas.height = parent.clientHeight;

    nodes = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    
    // Draw particles
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      
      // Boundary collision
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw connections
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();
// Add this inside the DOMContentLoaded event listener after initSkillsSection()
function initSkillsCircuitBackground() {
  const canvas = document.getElementById('skills-bg-circuit');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [];

  function resize() {
    // Direct canvas dimensions
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;

    // Create more particles
    nodes = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    
    // Draw particles with glow
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      
      // Boundary collision with bounce
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      
      // Draw particle with glow effect
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
      
      // Add glow effect
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(
        n.x, n.y, 0,
        n.x, n.y, n.r * 3
      );
      gradient.addColorStop(0, 'rgba(56, 189, 248, 0.3)');
      gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    });
    
    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
          const alpha = 1 - dist/100;
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.4})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

// Call this after initializing the skills section
initSkillsCircuitBackground(); 

  // ─── 15. Contact form submit ──────────────────────────────────────
  const form     = document.getElementById('contactForm');
  const alertBox = document.getElementById('contactAlert');
  form?.addEventListener('submit', e=>{
    e.preventDefault();
    alertBox?.classList.remove('d-none');
    form.reset();
  });
});
