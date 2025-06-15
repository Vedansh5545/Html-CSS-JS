// script.js
document.addEventListener('DOMContentLoaded', () => {
  // 1. AOS (Animate On Scroll)
  if (window.AOS) AOS.init({ duration: 800, once: true });

  // 2. Scroll-spy: highlight nav links
  const sections      = document.querySelectorAll('section[id]');
  const desktopLinks  = document.querySelectorAll('.nav-item');
  const mobileLinks   = document.querySelectorAll('.nav-item-mobile');
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

  // 3. Mobile menu toggle
  const navToggle  = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    mobileMenu.classList.toggle('hidden');
  });

  // 4. Smooth-scroll for any anchor
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      navToggle?.classList.remove('open');
      mobileMenu?.classList.add('hidden');
      const target = document.querySelector(a.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 5. Hero CTA & Arrow smooth scroll
  document.getElementById('hero-cta')
    ?.addEventListener('click', () => document.querySelector('#projects')
      ?.scrollIntoView({ behavior: 'smooth' }));

  document.querySelector('.animate-bounce')
    ?.addEventListener('click', () => document.querySelector('#about')
      ?.scrollIntoView({ behavior: 'smooth' }));

  // 6. Social bar fade-in
  setTimeout(() => {
    document.getElementById('social-bar')?.classList.add('show');
  }, 3000);

  // 7. Typewriter for code editor
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
      // keep scroll at bottom
      codeContent.parentElement.scrollTop = codeContent.parentElement.scrollHeight;
      if (idx < pythonCode.length) setTimeout(typeCode, 50);
    }
    setTimeout(typeCode, 500);
  }

  // 8. Left-panel particles
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
        r: Math.random()*2+1
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

  // 9. Network-background canvas
  (function initNetworkCanvas() {
    const canvas = document.getElementById('network-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, nodes = [];
    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      const N = window.innerWidth<768?60:120;
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
      for (let i=0;i<nodes.length;i++){
        for (let j=i+1;j<nodes.length;j++){
          const a=nodes[i], b=nodes[j];
          const dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy);
          if (d<150){
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

  // 10. Three.js Hero background (orb + wires)
  let updateBgColors;
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

    // nebula
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
    const nebMat      = new THREE.PointsMaterial({ color:0x0dcaf0, size:0.05, transparent:true,opacity:0.4,depthWrite:false });
    const nebula      = new THREE.Points(geo, nebMat);
    const wireInner   = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(1.8,16,16)), new THREE.LineBasicMaterial({color:0x0dcaf0,opacity:0.15,transparent:true}));
    const wireOuter   = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(2.8,24,24)), new THREE.LineBasicMaterial({color:0xff6347,opacity:0.15,transparent:true}));
    scene.add(nebula, wireInner, wireOuter);

    const heroH = document.getElementById('hero')?.offsetHeight || 0;
    updateBgColors = () => {
      const sc = window.scrollY;
      const c1 = sc>heroH?0xff6347:0x0dcaf0;
      const c2 = sc>heroH?0x00ffcc:0x0dcaf0;
      nebMat.color.setHex(c1);
      wireInner.material.color.setHex(c1);
      wireOuter.material.color.setHex(c2);
    };
    updateBgColors();

    (function animate(){
      requestAnimationFrame(animate);
      const pA = geo.attributes.position.array, vA = geo.attributes.velocity.array;
      for (let i=0;i<COUNT;i++){
        const ix=3*i, iy=ix+1, iz=ix+2;
        pA[ix]+=vA[ix]; pA[iy]+=vA[iy]; pA[iz]+=vA[iz];
        if (Math.abs(pA[ix])>10||Math.abs(pA[iy])>6||Math.abs(pA[iz])>10){
          pA[ix]=ra(1.5,8);
          pA[iy]=ra(1.0,5);
          pA[iz]=ra(1.5,8);
        }
      }
      geo.attributes.position.needsUpdate=true;
      nebula.rotation.y += 0.0005;
      nebula.rotation.x += 0.0002;
      wireInner.rotation.y += 0.005;
      wireOuter.rotation.y -= 0.003;
      renderer.render(scene,camera);
    })();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth,window.innerHeight);
      updateBgColors();
    });
  })();

  // 11. Project & Research filters
  document.querySelectorAll('.filter-btn:not(.research-filter-btn)')
    .forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn:not(.research-filter-btn)')
        .forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      const key = b.dataset.filter;
      document.querySelectorAll('.project-card')
        .forEach(card => {
          card.closest('.col').style.display = (key==='all'||card.dataset.category.includes(key))?'':'none';
        });
    }));
  document.querySelectorAll('.research-filter-btn')
    .forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll('.research-filter-btn')
        .forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      const key = b.dataset.filter;
      document.querySelectorAll('.research-card')
        .forEach(card => {
          card.style.display = (key==='all'||card.dataset.category.includes(key))?'':'none';
        });
    }));
    // Slider nav buttons
const slider = document.getElementById('project-slider');
const prevBtn = document.getElementById('slider-prev');
const nextBtn = document.getElementById('slider-next');
if (slider && prevBtn && nextBtn) {
  const slideWidth = slider.querySelector('.project-slide').offsetWidth + 24; // gap = 6rem (24px)
  prevBtn.addEventListener('click', () => {
    slider.scrollBy({ left: -slideWidth, behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    slider.scrollBy({ left:  slideWidth, behavior: 'smooth' });
  });
  // Slider nav buttons
const slider = document.getElementById('project-slider');
const prevBtn = document.getElementById('slider-prev');
const nextBtn = document.getElementById('slider-next');
if (slider && prevBtn && nextBtn) {
  // calculate slide width once images are loaded
  window.addEventListener('load', () => {
    const gap = parseInt(getComputedStyle(slider).columnGap) || 0;
    const slide = slider.querySelector('.project-slide');
    const slideWidth = slide.offsetWidth + gap;
    prevBtn.addEventListener('click', () => {
      slider.scrollBy({ left: -slideWidth, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      slider.scrollBy({ left:  slideWidth, behavior: 'smooth' });
    });
  });
}

}



  // 12. Skill-bar animation
  document.querySelectorAll('.progress-bar')
    .forEach(bar => {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            bar.style.width = bar.dataset.progress + '%';
            obs.disconnect();
          }
        });
      }, { threshold: 0.5 });
      obs.observe(bar);
    });

  // 13. Contact form submit
  const form = document.getElementById('contactForm');
  const alertBox = document.getElementById('contactAlert');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    alertBox?.classList.remove('d-none');
    form.reset();
  });
});

// Scroll‐down arrow click handler
document.getElementById('hero-arrow')?.addEventListener('click', () => {
  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
});
