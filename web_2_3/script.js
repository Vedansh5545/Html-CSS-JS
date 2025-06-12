// script.js
document.addEventListener('DOMContentLoaded', () => {
  // AOS init
  AOS.init({ duration: 800, once: true });

  // Avatar tilt
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

  // Three.js full-page background
  const canvas = document.getElementById('bg-canvas');
  if (canvas && window.THREE) {
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(0,0,8);
    camera.lookAt(0,0,0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene.add(new THREE.AmbientLight(0xffffff,0.5));

    // Nebula particles
    const COUNT=600;
    const pos=new Float32Array(COUNT*3), vel=new Float32Array(COUNT*3);
    function randAvoid(a,s){let v=(Math.random()*2-1)*s; if(Math.abs(v)<a){const sign=v<0?-1:1;v=sign*(a+Math.random()*(s-a));}return v;}
    for(let i=0;i<COUNT;i++){
      pos[3*i]=randAvoid(1.5,8);
      pos[3*i+1]=randAvoid(1.0,5);
      pos[3*i+2]=randAvoid(1.5,8);
      vel[3*i]=(Math.random()-0.5)*0.001;
      vel[3*i+1]=(Math.random()-0.5)*0.001;
      vel[3*i+2]=(Math.random()-0.5)*0.001;
    }
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    geo.setAttribute('velocity',new THREE.BufferAttribute(vel,3));
    const nebMat=new THREE.PointsMaterial({color:0x0dcaf0,size:0.05,transparent:true,opacity:0.4,depthWrite:false});
    const nebula=new THREE.Points(geo,nebMat);
    scene.add(nebula);

    // Wireframe spheres
    const wireMatInner=new THREE.LineBasicMaterial({color:0x0dcaf0,opacity:0.15,transparent:true});
    const wireMatOuter=new THREE.LineBasicMaterial({color:0xff6347,opacity:0.15,transparent:true});
    const innerWire=new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(1.8,16,16)),wireMatInner);
    const outerWire=new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(2.8,24,24)),wireMatOuter);
    scene.add(innerWire,outerWire);

    // Scroll-based color shift
    const threshold = document.getElementById('hero').offsetHeight + document.getElementById('about').offsetHeight;
    function updateColors() {
      const color1 = window.scrollY > threshold ? 0xff6347 : 0x0dcaf0;
      const color2 = window.scrollY > threshold ? 0x00ffcc : 0x0dcaf0;
      nebMat.color.setHex(color1);
      wireMatInner.color.setHex(color1);
      wireMatOuter.color.setHex(color2);
    }
    window.addEventListener('scroll', updateColors);
    updateColors();

    // Animate
    (function animate(){
      requestAnimationFrame(animate);
      // nebula drift
      const p=geo.attributes.position.array, v=geo.attributes.velocity.array;
      for(let i=0;i<COUNT;i++){
        p[3*i]+=v[3*i];p[3*i+1]+=v[3*i+1];p[3*i+2]+=v[3*i+2];
        if(Math.abs(p[3*i])>10||Math.abs(p[3*i+1])>6||Math.abs(p[3*i+2])>10){
          p[3*i]=randAvoid(1.5,8);
          p[3*i+1]=randAvoid(1.0,5);
          p[3*i+2]=randAvoid(1.5,8);
        }
      }
      geo.attributes.position.needsUpdate=true;
      nebula.rotation.y+=0.0005;nebula.rotation.x+=0.0002;

      innerWire.rotation.y+=0.005;
      outerWire.rotation.y-=0.003;

      renderer.render(scene,camera);
    })();

    window.addEventListener('resize',()=>{
      camera.aspect=window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth,window.innerHeight);
    });
  }

  // Project filters
  document.querySelectorAll('.filter-btn:not(.research-filter-btn)').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.filter-btn:not(.research-filter-btn)').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const key=btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card=>{
        card.closest('.col').style.display=(key==='all'||card.dataset.category.includes(key))?'':'none';
      });
    });
  });

  // Research filters
  document.querySelectorAll('.research-filter-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.research-filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const key=btn.dataset.filter;
      document.querySelectorAll('.research-card').forEach(card=>{
        card.style.display=(key==='all'||card.dataset.category.includes(key))?'':'none';
      });
    });
  });

  // Skill bars
  document.querySelectorAll('.progress-bar').forEach(bar=>{
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){bar.style.width=bar.dataset.progress+'%';obs.disconnect();}
      });
    },{threshold:0.5});
    obs.observe(bar);
  });

  // Contact form
  const form=document.getElementById('contactForm'),
        alertBox=document.getElementById('contactAlert');
  form?.addEventListener('submit',e=>{
    e.preventDefault();alertBox?.classList.remove('d-none');form.reset();
  });
});
