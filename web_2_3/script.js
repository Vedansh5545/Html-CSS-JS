// script.js
document.addEventListener('DOMContentLoaded', () => {
  // ───── AOS INIT ─────
  AOS.init({ duration: 800, once: true });

  // ───── Avatar Tilt ─────
  const avatar = document.querySelector('.avatar-img');
  if (avatar) {
    avatar.addEventListener('mousemove', e => {
      const r = avatar.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 2 - 1;
      avatar.style.transform = `scale(1.1) rotateY(${x * 15}deg)`;
    });
    avatar.addEventListener('mouseleave', () => {
      avatar.style.transform = 'scale(1) rotateY(0)';
    });
  }

  // ───── Three.js Hero Background ─────
  const canvas = document.getElementById('hero-canvas');
  if (canvas && window.THREE) {
    // Scene, camera, renderer
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Ambient light
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Particle nebula
    const COUNT = 600;
    const posArr = new Float32Array(COUNT * 3);
    const velArr = new Float32Array(COUNT * 3);
    function randAvoid(avoid, spread) {
      let v = (Math.random() * 2 - 1) * spread;
      if (Math.abs(v) < avoid) {
        const s = v < 0 ? -1 : 1;
        v = s * (avoid + Math.random() * (spread - avoid));
      }
      return v;
    }
    for (let i = 0; i < COUNT; i++) {
      posArr[3*i]     = randAvoid(1.5, 8);
      posArr[3*i + 1] = randAvoid(1.0, 5);
      posArr[3*i + 2] = randAvoid(1.5, 8);
      velArr[3*i]     = (Math.random() - 0.5) * 0.001;
      velArr[3*i + 1] = (Math.random() - 0.5) * 0.001;
      velArr[3*i + 2] = (Math.random() - 0.5) * 0.001;
    }
    const nebGeo = new THREE.BufferGeometry();
    nebGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    nebGeo.setAttribute('velocity', new THREE.BufferAttribute(velArr, 3));
    const nebMat = new THREE.PointsMaterial({
      color: 0x0dcaf0,
      size: 0.05,
      transparent: true,
      opacity: 0.4,
      depthWrite: false
    });
    const nebula = new THREE.Points(nebGeo, nebMat);
    scene.add(nebula);

    // Wireframe spheres
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x0dcaf0,
      opacity: 0.15,
      transparent: true
    });
    const innerWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(1.8, 16, 16)),
      wireMat
    );
    const outerWire = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(2.8, 24, 24)),
      wireMat
    );
    scene.add(innerWire, outerWire);

    // Animate
    (function animate() {
      requestAnimationFrame(animate);

      // Nebula drift
      const p = nebGeo.attributes.position.array;
      const v = nebGeo.attributes.velocity.array;
      for (let i = 0; i < COUNT; i++) {
        p[3*i]     += v[3*i];
        p[3*i+1]   += v[3*i+1];
        p[3*i+2]   += v[3*i+2];
        if (Math.abs(p[3*i])>10||Math.abs(p[3*i+1])>6||Math.abs(p[3*i+2])>10) {
          p[3*i]     = randAvoid(1.5,8);
          p[3*i+1]   = randAvoid(1.0,5);
          p[3*i+2]   = randAvoid(1.5,8);
        }
      }
      nebGeo.attributes.position.needsUpdate = true;
      nebula.rotation.y += 0.0005;
      nebula.rotation.x += 0.0002;

      // Spheres rotation
      innerWire.rotation.y += 0.005;
      outerWire.rotation.y -= 0.003;

      renderer.render(scene, camera);
    })();

    // Resize handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // Project filters
  document.querySelectorAll('.filter-btn:not(.research-filter-btn)').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn:not(.research-filter-btn)')
        .forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        card.closest('.col').style.display =
          (key==='all'||card.dataset.category.includes(key)) ? '' : 'none';
      });
    });
  });

  // Research filters
  document.querySelectorAll('.research-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.research-filter-btn')
        .forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.dataset.filter;
      document.querySelectorAll('.research-card').forEach(card => {
        card.style.display =
          (key==='all'||card.dataset.category.includes(key)) ? '' : 'none';
      });
    });
  });

  // Skill-bar animation
  document.querySelectorAll('.progress-bar').forEach(bar => {
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

  // Contact form
  const form = document.getElementById('contactForm');
  const alertBox = document.getElementById('contactAlert');
  
  
  form?.addEventListener('submit', e => {
    e.preventDefault();
    alertBox?.classList.remove('d-none');
    form.reset();
  });
});
