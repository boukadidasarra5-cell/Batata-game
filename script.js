(function(){
"use strict";
"use strict";
  const $ = id => document.getElementById(id);
  const home = $('home'), gameWrap = $('gameWrap');
  const batata = $('batata'), knife = $('knife');
  const scoreDisplay = $('score'), highScoreDisplay = $('highScore'), livesDisplay = $('lives');
  const gameOverScreen = $('gameOverScreen'), pauseMenu = $('pauseMenu');
  const hamburgerMenu = $('hamburgerMenu'), modeBadge = $('modeBadge');

  let soundOn = true;
  let audioCtx = null;
  function beep(freq, dur, type){
    if(!soundOn) return;
    try{
      audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = type||'square'; o.frequency.value = freq;
      g.gain.setValueAtTime(0.15, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime+dur);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime+dur);
    }catch(e){}
  }
  function sfxJump(){ beep(500,.12,'square'); }
  function sfxHit(){ beep(180,.25,'sawtooth'); }
  function sfxDeath(){ beep(90,.6,'sawtooth'); }

  function getHigh(){ try{ return parseInt(localStorage.getItem('batataHighScore'))||0; }catch(e){ return 0; } }
  function setHigh(v){ try{ localStorage.setItem('batataHighScore', v); }catch(e){} }
  let highScore = getHigh();
  highScoreDisplay.textContent = "High Score : " + highScore;

  // stars on home
  const starsDiv = $('stars');
  for(let i=0;i<30;i++){
    const s=document.createElement('span');
    s.style.top = Math.random()*100+'%';
    s.style.left = Math.random()*100+'%';
    s.style.opacity = Math.random();
    starsDiv.appendChild(s);
  }

  const MODES = ['Facile','Normal','Difficile'];
  const MODE_SPEED = {Facile:9, Normal:12, Difficile:16};
  let modeIndex = 1;

  let isJumping=false, isPaused=false, score=0, lives=3, knifeSpeed=12, knifeInterval=null;
  const jumpHeight=170, jumpSpeed=9, intervalTime=20;

  function updateLives(){ livesDisplay.textContent = "Vies : " + "❤️".repeat(lives); }

  function jump(){
    if(isJumping || isPaused) return;
    isJumping = true; sfxJump();
    let position = parseInt(batata.style.bottom)||0;
    batata.src = "batatajump.png";
    batata.style.transform = "rotate(-20deg)";
    const up = setInterval(()=>{
      if(position >= jumpHeight){
        clearInterval(up);
        const down = setInterval(()=>{
          if(position <= 0){
            clearInterval(down); isJumping=false;
            batata.style.transform="rotate(0deg)";
            batata.src = "batatarun.png";
          } else {
            position -= jumpSpeed;
            batata.style.bottom = position+"px";
            batata.style.transform = `rotate(${position/jumpHeight*20}deg)`;
          }
        }, intervalTime);
      } else {
        position += jumpSpeed;
        batata.style.bottom = position+"px";
      }
    }, intervalTime);
  }

  function levelClass(s){
    gameWrap.classList.remove('lvl1','lvl2','lvl3');
    if(s>=30) gameWrap.classList.add('lvl3');
    else if(s>=20) gameWrap.classList.add('lvl2');
    else if(s>=10) gameWrap.classList.add('lvl1');
  }

  function moveKnife(){
    let knifePosition = Math.max(window.innerWidth, 800) + 60;
    knife.style.left = knifePosition+"px";
    clearInterval(knifeInterval);
    knifeInterval = setInterval(()=>{
      if(isPaused) return;
      knifePosition -= knifeSpeed;
      knife.style.left = knifePosition+"px";
      const br = batata.getBoundingClientRect(), kr = knife.getBoundingClientRect();
      const bPad = { x: br.width*0.22, top: br.height*0.12, bottom: br.height*0.06 };
      const bBox = { left: br.left+bPad.x, right: br.right-bPad.x, top: br.top+bPad.top, bottom: br.bottom-bPad.bottom };
      const kPad = kr.width*0.15;
      const kBox = { left: kr.left+kPad, right: kr.right-kPad, top: kr.top, bottom: kr.bottom };
      if(kBox.left < bBox.right && kBox.right > bBox.left && kBox.top < bBox.bottom && kBox.bottom > bBox.top){
        if(lives > 1){
          lives--; updateLives(); sfxHit();
          knifePosition = Math.max(window.innerWidth, 800) + 60;
        } else {
          clearInterval(knifeInterval);
          gameOver();
        }
      }
      if(knifePosition < -60){
        knifePosition = Math.max(window.innerWidth, 800) + 60;
        score++; scoreDisplay.textContent = "Score : "+score;
        if(score===10||score===20||score===30) knifeSpeed += 2;
        levelClass(score);
      }
    }, 20);
  }

  function gameOver(){
    sfxDeath();
    batata.src = "batatajump.png";
    gameOverScreen.classList.add('show');
    if(score > highScore){ highScore = score; setHigh(highScore); highScoreDisplay.textContent="High Score : "+highScore; }
  }

  function startGame(){
    home.classList.remove('active');
    gameWrap.classList.add('active');
    resetState();
    moveKnife();
  }
  function resetState(){
    score=0; lives=3; knifeSpeed = MODE_SPEED[MODES[modeIndex]];
    scoreDisplay.textContent="Score : 0";
    batata.style.bottom="0px"; batata.style.transform="rotate(0deg)"; batata.src="batatarun.png";
    gameWrap.classList.remove('lvl1','lvl2','lvl3');
    updateLives();
    gameOverScreen.classList.remove('show');
    isPaused=false; isJumping=false;
  }

  $('startBtn').addEventListener('click', startGame);
  $('settingsBtn').addEventListener('click', function(){
    soundOn = !soundOn;
    this.textContent = soundOn ? "🔊 SON: ON" : "🔇 SON: OFF";
  });

  $('yesBtn').addEventListener('click', ()=>{ resetState(); moveKnife(); });
  $('noBtn').addEventListener('click', ()=>{
    clearInterval(knifeInterval);
    gameWrap.classList.remove('active'); home.classList.add('active');
  });

  document.addEventListener('keydown', e=>{
    if(!gameWrap.classList.contains('active')) return;
    if(e.code==='Space'){ e.preventDefault(); jump(); }
    if(e.code==='Escape'){
      pauseMenu.classList.contains('show') ? resume() : showPause();
    }
  });
  batata.addEventListener('click', jump);
  batata.addEventListener('touchstart', e=>{ e.preventDefault(); jump(); });

  $('hamBtn').addEventListener('click', ()=>{
    const showing = hamburgerMenu.classList.toggle('show');
    isPaused = showing;
  });
  $('homeBtn2').addEventListener('click', ()=>{
    clearInterval(knifeInterval);
    hamburgerMenu.classList.remove('show');
    gameWrap.classList.remove('active'); home.classList.add('active');
  });
  $('modeBtn').addEventListener('click', ()=>{
    modeIndex = (modeIndex+1) % MODES.length;
    modeBadge.textContent = "Mode : " + MODES[modeIndex];
  });

  function showPause(){ isPaused=true; pauseMenu.classList.add('show'); }
  function resume(){ isPaused=false; pauseMenu.classList.remove('show'); }
  $('resumeBtn').addEventListener('click', resume);
  $('restartBtn').addEventListener('click', ()=>{ resume(); resetState(); moveKnife(); });
  $('quitBtn').addEventListener('click', ()=>{
    clearInterval(knifeInterval); resume();
    gameWrap.classList.remove('active'); home.classList.add('active');
  });
})();