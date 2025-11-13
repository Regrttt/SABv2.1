// game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const pauseButton = document.getElementById('pauseButton');
const mainWrapper = document.getElementById('main-wrapper');

// --- CONSTANTES ---
const GRAVITY = 2500; 
const JUMP_FORCE = 1000;
const PLAYER_SPEED = 430;
const COYOTE_TIME_DURATION = 0.1; 
const PLAYER_SLOW_FALL_SPEED = 15;
const PLAYER_INITIAL_HEALTH = 3, PLAYER_MAX_JUMPS = 2;
const INVINCIBILITY_DURATION = 1.8;
const CAPTURE_REACH_DURATION = 0.25; 
const CAPTURE_PULL_DURATION = 0.4;
const FALLING_PLATFORM_CHANCE = 0.30; 
const FALLING_PLATFORM_ACCELERATION = 8;
const TALL_WALL_CHANCE = 0.3, TALL_WALL_HEIGHT = 180, NORMAL_WALL_HEIGHT = 60;
const WALL_SPIKE_CHANCE = 0.4;
const WALL_WITH_TOP_SPIKES_CHANCE = 0.3;
const ENEMY_SPEED_BASE = 100;
const PATROL_ENEMY_SPAWN_CHANCE = 0.2; 
const ENEMY_SPAWN_CHANCE = 0.02; 
const ENEMY_SPAWN_COOLDOWN = 1.0;  
const ENEMY_SPEED = 200; 
const HOMING_ENEMY_CHANCE = 0.40; 
const CHARGER_ENEMY_CHANCE = 0.25; 
const REBOUND_ENEMY_CHANCE = 0.25; 
const HOMING_ENEMY_ATTRACTION = 60; 
const LONG_PLATFORM_CHANCE = 0.4, LONG_PLATFORM_MIN_WIDTH = 300, LONG_PLATFORM_MAX_WIDTH = 450;
const OBSTACLE_CHANCE = 0.65, WALL_CHANCE = 0.5, BUSH_SPAWN_CHANCE = 0.4; 
const PLATFORM_MAX_JUMP_HEIGHT = 120, PLATFORM_MAX_DROP_HEIGHT = 200;
const PLATFORM_MIN_GAP = 80, PLATFORM_MAX_GAP = 250;
const PLATFORM_MIN_WIDTH = 100, PLATFORM_MAX_WIDTH = 200; 
const COIN_SPAWN_CHANCE = 0.5, COIN_VALUE = 10;
const PLAYER_TRAIL_COLOR = '#a4281b', 
      ENEMY_STRAIGHT_TRAIL_COLOR = '#6a3381', 
      ENEMY_HOMING_TRAIL_COLOR = '#b8930b', 
      ENEMY_CHARGER_TRAIL_COLOR = '#2E8B57',
      REBOUND_PROJECTILE_COLOR = '#5DADE2';
const BOSS_BATTLE_MAX_HEALTH_PACKS = 6; 
const HEALTH_PACK_SPAWN_CHANCE_BOSS = 0.03; 
const BASE_HEALTH_PACK_CHANCE = 0.07; 
const HEALTH_PACK_CHANCE_MULTIPLIER = 1.5; 
const BOSS_MINION_STRAIGHT_SPEED = 580; 
const BOSS_MINION_HOMING_SPEED = 300;
const BOSS_MINION_REBOUND_SPEED = 420;
const BOSS_DAMAGE_FROM_REBOUND = 10;
const BOSS_DASH_SPEED = 1200;
const REBOUND_PROJECTILE_AIMED_SPEED = 850;
const PROJECTILE_INDICATOR_DURATION = 0.7; 
const BOSS_TRIGGER_SCORE = 3000; 
const BOSS_DASH_COOLDOWN = 3; 
const MUSIC_VOLUME_TRANSITION_SPEED = 1.5; 
const BRICK_WIDTH = 60;
const BRICK_HEIGHT = 30; 
const CLOUD_PLATFORM_CHANCE = 0.15;
const CLOUD_REPLACES_STONE_CHANCE = 0.5;
const BOTTOM_SPIKE_CHANCE = 0.15; 
const BOTTOM_SPIKE_HEIGHT = 15;
const WINDOW_TRAP_CHANCE = 0.1; 
const MIN_WINDOW_SPACING = 300; 
const WINDOW_REWARD_CHANCE = 0.5;
const WINDOW_REWARD_COIN_COUNT = 10;
const COIN_ANIM_SPAWN_INTERVAL = 0.06; 
const COIN_ANIM_LIFESPAN = 0.7; 
const COIN_ANIM_START_VELOCITY_Y = -600; 
const COIN_ANIM_GRAVITY = 1800; 
const CRACK_CHANCE = 0.03; 
const MOSS_CHANCE = 0.02;
const HILL_DETAIL_CHANCE = 0.9;
const TREE_HAS_BRANCHES_CHANCE = 0.35;
const BRANCH_PROBABILITIES = [0.60, 0.40, 0.20];
const MAX_BRANCHES_PER_SIDE = 3;
const MIN_BRANCH_SPACING = 40;
const CHEST_SPAWN_CHANCE = 0.15;
const CHEST_LUCK_CHANCE = 0.7;
const CHEST_REWARD_COIN_COUNT = 15;
const CHEST_PROMPT_DISTANCE = 100;
const CHEST_PROMPT_Y_OFFSET = 40;
const FALLING_ROCK_GRAVITY = 900;
const FALLING_ROCK_BOUNCE_VELOCITY_Y = -300;
const FALLING_ROCK_BOUNCE_VELOCITY_X = 200;
const FALLING_ROCK_SPAWN_INTERVAL = 2.5; 

const WINDOW_PROMPT_DISTANCE = 150; 
const WINDOW_PROMPT_Y_OFFSET = 40; 
const DEBRIS_PICKUP_PROMPT_Y_OFFSET = 30;

const DAY_TO_AFTERNOON_TRIGGER_SCORE = 1000;
const AFTERNOON_TO_NIGHT_TRIGGER_SCORE = 2000;
const TRANSITION_DURATION_SCROLL = 5000;

const FINAL_BOSS_TRIGGER_SCORE = 4000;
const FINAL_BOSS_HEALTH = 20; 
const FINAL_BOSS_RISE_SPEED = 20;
const FINAL_BOSS_VERTICAL_OFFSET = 50; 
const FINAL_BOSS_SHAKE_ATTACK_COOLDOWN = 5.0;
const FINAL_BOSS_SHAKE_DURATION = 1.0; 
const BOSS_DEBRIS_GRAVITY = 1200;
const SCREEN_SHAKE_MAGNITUDE = 10;
const DEBRIS_PICKUP_DISTANCE = 60;
const FINAL_BOSS_BATTLE_MAX_HEALTH_PACKS = 10;
const DEBRIS_PHASE_CHANCE = 0.3; 

const FINAL_BOSS_SLASH_TELEGRAPH_TIME = 0.5;
const FINAL_BOSS_SLASH_EXTEND_TIME = 0.2;
const FINAL_BOSS_SLASH_RETRACT_TIME = 0.8;
const FINAL_BOSS_SLASH_COOLDOWN = 1.5;

const FINAL_BOSS_COMBO_COOLDOWN = 0.15;
const FINAL_BOSS_POST_COMBO_COOLDOWN = 2.0;

const FINAL_BOSS_LASER_CHARGE_TIME = 1.0;
const FINAL_BOSS_LASER_ACTIVE_TIME = 1.0; 
const FINAL_BOSS_LASER_ROTATION_SPEED = 1.5;
const FINAL_BOSS_LASER_WIDTH_TELEGRAPH = 4;
const FINAL_BOSS_LASER_WIDTH_ACTIVE = 18;

const TRIPLE_JUMP_FORCE = 1300; 
const JUMP_COMBO_WINDOW = 0.15;


const SKY_PALETTES = {
    day:       ['#80d0ff', '#4da6ff', '#1a5fab'],
    afternoon: ['#ffaf40', '#ff7e5f', '#c74b50'],
    night:     ['#0c0a1a', '#2a0f4a', '#4a1c6b']
};

// --- SISTEMA DE ÁUDIO ---
const sounds = { music: { audio: new Audio('music.mp3'), loop: true, baseVolume: 0.4 }, jump: { audio: new Audio('jump.mp3'), baseVolume: 0.05 }, coin: { audio: new Audio('coin.mp3'), baseVolume: 0.15 }, land: { audio: new Audio('falling.mp3'), baseVolume: 0.15 }, damage: { audio: new Audio('damage.mp3'), baseVolume: 0.5 }, gameOver: { audio: new Audio('gameOver.mp3'), baseVolume: 0.5 }, victory: { audio: new Audio('victory.mp3'), baseVolume: 0.5 } };
const sfxSoundKeys = ['jump', 'coin', 'land', 'damage', 'gameOver', 'victory'];
let musicVolume = parseFloat(localStorage.getItem('musicVolume')) || 0.4;
let sfxVolume = parseFloat(localStorage.getItem('sfxVolume')) || 0.5;
let currentMusicVolumeFactor = 1.0; 
let targetMusicVolumeFactor = 1.0; 

function applyVolumes() { 
    sfxSoundKeys.forEach(key => { 
        if(sounds[key].audio) sounds[key].audio.volume = sounds[key].baseVolume * sfxVolume; 
    }); 
    if(sounds.music.audio) {
        sounds.music.audio.volume = sounds.music.baseVolume * musicVolume * currentMusicVolumeFactor;
    }
}

function playSound(soundObj) { if (soundObj && soundObj.audio && soundObj.audio.src) { if (soundObj.audio.loop || soundObj === sounds.gameOver || soundObj === sounds.victory) { soundObj.audio.currentTime = 0; soundObj.audio.play().catch(e => {}); } else { const tempAudio = new Audio(soundObj.audio.src); tempAudio.volume = soundObj.audio.volume; tempAudio.play().catch(e => {}); } } }

function setTargetMusicVolumeFactor(gameState) { 
    if (musicStarted) { 
        sounds.music.audio.loop = true; 
        sounds.music.audio.play().catch(e => {}); 
    } 
    if (gameState === 'paused') { 
        if (musicVolume <= 0.2) {
            targetMusicVolumeFactor = 1.0;
        } else {
            targetMusicVolumeFactor = 0.2;
        }
    } else if (gameState === 'playing' || gameState === 'options' || gameState === 'start' || gameState === 'bossBattle' || gameState === 'phaseTwo' || gameState === 'finalBoss') { 
        targetMusicVolumeFactor = 1.0; 
    } else { 
        targetMusicVolumeFactor = 0.2; 
    } 
}

// --- CANVAS OFFSREEN ---
let offscreenCanvas;
let offscreenCtx;

// --- VARIÁVEIS GLOBAIS ---
let player, platforms, keys, scrollOffset, gameOver, gameWon, enemies, coins, enemySpawnCooldown, score, particles, musicStarted, lastWindowY; 
let verticalScrollOffset = 0;
let sceneryManager;
let boss, finalBoss, healthPacks;
let projectileIndicators;
let bossDebris;
let screenShakeTimer = 0;
let gameState;
let phaseOneComplete = false;
let selectedPauseOption = 0;
let selectedOptionSetting = 0;
let lastTime = 0;
let screenMessage = null;
let draggingSlider = null;
let currentTransitionState;
let dayTransitionStartOffset;
let nightTransitionStartOffset;
let phaseTwoStartScrollY = 0;
let phaseTwoHealthPacks;
let fallingRockSpawnTimer;

let coinAnimations = []; 
let coinRewardState = { active: false, toSpawn: 0, spawnTimer: 0, spawnPosition: null };
let interactionPrompts = [];
let hasBeatenGame = false;
let chestToOpen = null;

// --- VARIÁVEIS DE CHEAT ---
let cheatsEnabled = false;
const cheatCode = 'kcah';
let cheatCodeProgress = 0;
let debugMode = false;
let infiniteInvincibilityCheat = false;
let scoreLockCheat = false;

// --- FUNÇÕES AUXILIARES ---
function drawGradientText(text, x, y, size, align = 'center', shadow = true, targetCtx = ctx) { targetCtx.font = `${size}px "Press Start 2P", cursive`; targetCtx.textAlign = align; const shadowOffset = Math.ceil(size / 16); if (shadow) { targetCtx.fillStyle = 'rgba(0, 0, 0, 0.25)'; targetCtx.fillText(text, x + shadowOffset, y + shadowOffset); } const gradient = targetCtx.createLinearGradient(0, y - size, 0, y); gradient.addColorStop(0, '#ffffff'); gradient.addColorStop(1, '#d0d0d0'); targetCtx.fillStyle = gradient; targetCtx.fillText(text, x, y); }
function getMousePos(canvas, event) { const rect = canvas.getBoundingClientRect(); return { x: event.clientX - rect.left, y: event.clientY - rect.top }; }
function isMouseOverRect(mousePos, x, y, width, height) { return mousePos.x >= x && mousePos.x <= x + width && mousePos.y >= y && mousePos.y <= y + height; }
function isCollidingWithDiamond(rect, diamond) { if (!rect || !diamond || typeof rect.x === 'undefined' || typeof diamond.x === 'undefined' || isNaN(rect.x) || isNaN(rect.y) || isNaN(rect.width) || isNaN(rect.height) || isNaN(diamond.x) || isNaN(diamond.y) || isNaN(diamond.width) || isNaN(diamond.height) ) { return false; } const diamondCenterX = diamond.x + diamond.width / 2; const diamondCenterY = diamond.y + diamond.height / 2; const diamondHalfWidth = diamond.width / 2; const diamondHalfHeight = diamond.height / 2; const rectCorners = [ { x: rect.x, y: rect.y }, { x: rect.x + rect.width, y: rect.y }, { x: rect.x, y: rect.y + rect.height }, { x: rect.x + rect.width, y: rect.y + rect.height } ]; for (const corner of rectCorners) { const dx = Math.abs(corner.x - diamondCenterX); const dy = Math.abs(corner.y - diamondCenterY); if (dx / diamondHalfWidth + dy / diamondHalfHeight <= 1) { return true; } } return false; }
function isColliding(rect1, rect2) {
    if (!rect1 || !rect2) return false;
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}
function isCollidingCircleRect(circle, rect) {
    if (!circle || !rect) return false;
    const circleX = circle.x;
    const circleY = circle.y;
    
    const closestX = Math.max(rect.x, Math.min(circleX, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circleY, rect.y + rect.height));

    const distanceX = circleX - closestX;
    const distanceY = circleY - closestY;
    const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

    return distanceSquared < (circle.radius * circle.radius);
}
function isCollidingLineRect(line, rect) {
    const left = isCollidingLineLine(line.x1, line.y1, line.x2, line.y2, rect.x, rect.y, rect.x, rect.y + rect.height);
    const right = isCollidingLineLine(line.x1, line.y1, line.x2, line.y2, rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + rect.height);
    const top = isCollidingLineLine(line.x1, line.y1, line.x2, line.y2, rect.x, rect.y, rect.x + rect.width, rect.y);
    const bottom = isCollidingLineLine(line.x1, line.y1, line.x2, line.y2, rect.x, rect.y + rect.height, rect.x + rect.width, rect.y + rect.height);
    if (left || right || top || bottom) return true;
    const cx = line.x1;
    const cy = line.y1;
    if (cx > rect.x && cx < rect.x + rect.width && cy > rect.y && cy < rect.y + rect.height) {
        return true;
    }
    return false;
}
function isCollidingLineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
    const uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    const uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1);
}
function isCollidingRectPolygon(rect, polygon) {
    const rectPoly = [
        {x: rect.x, y: rect.y},
        {x: rect.x + rect.width, y: rect.y},
        {x: rect.x + rect.width, y: rect.y + rect.height},
        {x: rect.x, y: rect.y + rect.height}
    ];

    const polygons = [rectPoly, polygon];
    for (let i = 0; i < polygons.length; i++) {
        const poly = polygons[i];
        for (let j1 = 0; j1 < poly.length; j1++) {
            const j2 = (j1 + 1) % poly.length;
            const p1 = poly[j1];
            const p2 = poly[j2];

            const normal = { x: p2.y - p1.y, y: p1.x - p2.x };
            let minA = null, maxA = null;
            for (const p of rectPoly) {
                const projected = normal.x * p.x + normal.y * p.y;
                if (minA === null || projected < minA) minA = projected;
                if (maxA === null || projected > maxA) maxA = projected;
            }

            let minB = null, maxB = null;
            for (const p of polygon) {
                const projected = normal.x * p.x + normal.y * p.y;
                if (minB === null || projected < minB) minB = projected;
                if (maxB === null || projected > maxB) maxB = projected;
            }

            if (maxA < minB || maxB < minA) {
                return false; 
            }
        }
    }
    return true; 
}


function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}
function rgbToString(rgb) { return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`; }
function lerpColor(color1, color2, factor) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    if (!rgb1 || !rgb2) return 'rgb(0,0,0)';
    const result = { r: rgb1.r + factor * (rgb2.r - rgb1.r), g: rgb1.g + factor * (rgb2.g - rgb1.g), b: rgb1.b + factor * (rgb2.b - rgb1.b) };
    return result;
}

function isVerticalPhase() {
    return gameState === 'phaseTwo' || gameState === 'finalBoss';
}

// --- FUNÇÕES DE INICIALIZAÇÃO E CONTROLE ---
function init(keepCheckpoint = false) { 
    offscreenCanvas = document.createElement('canvas'); offscreenCanvas.width = canvas.width; offscreenCanvas.height = canvas.height; offscreenCtx = offscreenCanvas.getContext('2d'); 
    platforms = [new Platform(0, 550, 600, 'stable', 'grass')]; 
    player = new Player(100, platforms[0].y - 40); 
    enemies = []; coins = []; particles = []; healthPacks = []; 
    projectileIndicators = [];
    coinAnimations = [];
    interactionPrompts = [];
    bossDebris = []; 
    coinRewardState = { active: false, toSpawn: 0, spawnTimer: 0, spawnPosition: null };
    keys = { right: false, left: false, down: false, up: false, space: false };
    scrollOffset = 0; 
    verticalScrollOffset = 0;
    gameOver = false; gameWon = false; enemySpawnCooldown = 0; score = 0;
    boss = null;
    finalBoss = null;
    if (!keepCheckpoint) {
        phaseOneComplete = false;
    }
    phaseTwoHealthPacks = {};
    musicStarted = false; 
    sceneryManager = new SceneryManager(canvas.width, canvas.height); 
    gameState = 'start';
    currentTransitionState = 'day';
    dayTransitionStartOffset = null;
    nightTransitionStartOffset = null;
    selectedPauseOption = 0;
    selectedOptionSetting = 0;
    currentMusicVolumeFactor = 1.0;
    targetMusicVolumeFactor = 1.0; 
    debugMode = false;
    infiniteInvincibilityCheat = false;
    scoreLockCheat = false;
    lastWindowY = Infinity; 
    phaseTwoStartScrollY = 0;
    fallingRockSpawnTimer = 2.0;
    if(sounds.music.audio) sounds.music.audio.volume = sounds.music.baseVolume * musicVolume * currentMusicVolumeFactor;
    if(sounds.gameOver.audio && sounds.gameOver.audio.src) { sounds.gameOver.audio.currentTime = 0; sounds.gameOver.audio.pause(); }
    if(sounds.victory.audio && sounds.victory.audio.src) { sounds.victory.audio.currentTime = 0; sounds.victory.audio.pause(); }
    applyVolumes(); 
    setTargetMusicVolumeFactor(gameState); 
    gerenciarPlataformas(); 
    showPointingArrow();
    hasBeatenGame = localStorage.getItem('gameBeaten') === 'true';
}

// <<< INÍCIO DA ALTERAÇÃO >>>
function initBossBattle() { 
    platforms.forEach(platform => { 
        if (platform.x > scrollOffset - platform.width) { 
            platform.obstacles = []; 
            platform.hasChest = false; 
        } 
    }); 
    enemies = []; 
    coins = []; 
    healthPacks = []; 
    projectileIndicators = []; 
    boss = new Boss(); 
    if (boss) boss.lastScrollOffsetForDash = scrollOffset; 
    setTargetMusicVolumeFactor('bossBattle'); 
}
// <<< FIM DA ALTERAÇÃO >>>

function initPhaseTwo() {
    init(true);
    phaseOneComplete = true;

    gameState = 'phaseTwo';
    boss = null;
    finalBoss = null; 
    
    player = new Player(canvas.width / 2, canvas.height - 100);
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - 100;
    player.velocityX = 0;
    player.velocityY = 0;
    
    verticalScrollOffset = player.y - canvas.height * 0.7; 
    phaseTwoStartScrollY = verticalScrollOffset;
    
    const towerWidth = canvas.width * 0.6;
    const towerX = (canvas.width - towerWidth) / 2;
    
    const baseWidth = (towerWidth * 0.5) + (Math.random() * towerWidth * 0.3);
    const baseX = towerX + (towerWidth - baseWidth) / 2;
    platforms = [new Platform(baseX, canvas.height - 40, baseWidth, 'stable', 'stone')];
    
    lastWindowY = canvas.height;
    fallingRockSpawnTimer = 2.0;
    gerenciarPlataformasFase2();

    currentTransitionState = 'night';
    setTargetMusicVolumeFactor(gameState);
}

function initFinalBoss() {
    gameState = 'finalBoss';

    enemies = []; 
    coins = [];
    healthPacks = [];
    bossDebris = []; 
    platforms.forEach(p => {
        p.obstacles = [];
        p.terrestrialSpawnPoint = null;
        p.hasWindowTrap = false;
    });
    
    const startY = verticalScrollOffset + canvas.height + 150;
    
    finalBoss = new FinalBoss(startY);
    setTargetMusicVolumeFactor(gameState); 
    screenMessage = { text: "A BATALHA FINAL!", lifespan: 4 };
}


function triggerCoinReward(player, spawnPosition, coinCount) {
    if (coinRewardState.active) return;

    coinRewardState.active = true;
    coinRewardState.toSpawn = coinCount;
    coinRewardState.spawnTimer = 0;
    coinRewardState.spawnPosition = spawnPosition;

    player.rewardCooldown = COIN_ANIM_SPAWN_INTERVAL * coinRewardState.toSpawn + 0.2;
    player.velocityX = 0;
    player.velocityY = 0;
}

// --- FUNÇÕES DE INPUT (EVENT HANDLING) ---
function handleStartInput(event) { gameState = 'playing'; musicStarted = true; setTargetMusicVolumeFactor(gameState); }
function handlePlayingInput(event) { 
    if (patchNotesContainer.classList.contains('visible')) return; 

    if (event.key === cheatCode[cheatCodeProgress]) {
        cheatCodeProgress++;
        if (cheatCodeProgress === cheatCode.length) {
            cheatsEnabled = !cheatsEnabled;
            const cheatMenuBtn = document.getElementById('cheatMenuButton');
            screenMessage = { text: cheatsEnabled ? "CHEATS ATIVADOS!" : "CHEATS DESATIVADOS!", lifespan: 2 };
            if (cheatsEnabled) {
                cheatMenuBtn.style.display = 'flex';
                cheatMenuBtn.classList.add('activated');
            } else {
                cheatMenuBtn.style.display = 'none';
                document.getElementById('cheatInfoBox').style.display = 'none';
                debugMode = false;
                infiniteInvincibilityCheat = false;
                if (player) player.isInvincible = false;
                scoreLockCheat = false;
            }
            cheatCodeProgress = 0;
        }
    } else {
        cheatCodeProgress = 0;
        if (cheatsEnabled) { 
            if (event.code === 'KeyC') { 
                cheatInfoBox.style.display = cheatInfoBox.style.display === 'block' ? 'none' : 'block'; 
                cheatMenuButton.classList.remove('activated'); 
                return; 
            } 
            switch(event.code) { 
                case 'KeyT': 
                    phaseOneComplete = true;
                    initPhaseTwo(); 
                    return;
                case 'Numpad7':
                    score += 100;
                    return;
                case 'Numpad8': scoreLockCheat = !scoreLockCheat; return; 
                case 'Numpad9': if (player.health < player.maxHealth) { player.health++; playSound(sounds.coin); } return; 
                case 'Numpad4': debugMode = !debugMode; return; 
                case 'Numpad5': infiniteInvincibilityCheat = !infiniteInvincibilityCheat; if (!infiniteInvincibilityCheat) { player.isInvincible = false; } return; 
                case 'Numpad6': 
                    if (gameState === 'bossBattle' && boss) { boss.health -= BOSS_DAMAGE_FROM_REBOUND; playSound(sounds.damage); for (let i = 0; i < 20; i++) { particles.push({ x: boss.x + (boss.width / 2), y: boss.y + boss.height / 2, size: Math.random() * 4 + 2, color: '#f1c40f', lifespan: 1, initialLifespan: 1, vx: (Math.random() - 0.5) * 500, vy: (Math.random() - 0.5) * 500, isScreenSpace: true }); } }
                    if (gameState === 'finalBoss' && finalBoss) { finalBoss.takeDamage(1); }
                    return; 
            }
        } 
    }
    
    if (event.code === 'KeyP') { let previousState = gameState; gameState = 'paused'; pauseButton.setAttribute('data-previous-state', previousState); setTargetMusicVolumeFactor(gameState); keys.left = false; keys.right = false; return; } if (event.code === 'ArrowLeft') keys.left = true; if (event.code === 'ArrowRight') keys.right = true; 
    
    if (event.code === 'ArrowDown' && player.onPassableSurface) { player.y += 10; player.velocityY = 180; player.onPassableSurface = false; } 
    
    if (event.code === 'Space') {
        if (event.repeat) return;
        keys.space = true;
        
        if (player.canJump()) {
            player.jump();
        }
    }
}
function handlePausedInput(event) { if (event.code === 'ArrowUp') { selectedPauseOption = Math.max(0, selectedPauseOption - 1); } else if (event.code === 'ArrowDown') { selectedPauseOption = Math.min(1, selectedPauseOption + 1); } else if (event.code === 'Enter') { if (selectedPauseOption === 0) { gameState = pauseButton.getAttribute('data-previous-state') || 'playing'; setTargetMusicVolumeFactor(gameState); } else if (selectedPauseOption === 1) { gameState = 'options'; setTargetMusicVolumeFactor(gameState); } } else if (event.code === 'KeyP') { gameState = pauseButton.getAttribute('data-previous-state') || 'playing'; setTargetMusicVolumeFactor(gameState); } }
function handleOptionsInput(event) { if (event.code === 'Escape') { gameState = 'paused'; setTargetMusicVolumeFactor(gameState); selectedOptionSetting = 0; return; } let sfxVolumeChanged = false; if (event.code === 'ArrowUp') { selectedOptionSetting = Math.max(0, selectedOptionSetting - 1); } else if (event.code === 'ArrowDown') { selectedOptionSetting = Math.min(1, selectedOptionSetting + 1); } else if (event.code === 'ArrowLeft') { if (selectedOptionSetting === 0) { musicVolume = Math.max(0, musicVolume - 0.05); } else if (selectedOptionSetting === 1) { let oldSfxVolume = sfxVolume; sfxVolume = Math.max(0, sfxVolume - 0.05); if (sfxVolume !== oldSfxVolume) sfxVolumeChanged = true; } applyAndSaveVolumes(); if (sfxVolumeChanged) playSound(sounds.coin); } else if (event.code === 'ArrowRight') { if (selectedOptionSetting === 0) { musicVolume = Math.min(1, musicVolume + 0.05); } else if (selectedOptionSetting === 1) { let oldSfxVolume = sfxVolume; sfxVolume = Math.min(1, sfxVolume + 0.05); if (sfxVolume !== oldSfxVolume) sfxVolumeChanged = true; } applyAndSaveVolumes(); if (sfxVolumeChanged) playSound(sounds.coin); } }
function handleEndScreenInput(event) {
    if (event.code === 'Enter') {
        sounds.music.audio.currentTime = 0;

        if (!gameWon && phaseOneComplete) {
            initPhaseTwo();
        } 
        else if (gameWon && phaseOneComplete && !finalBoss) {
            initPhaseTwo();
        } 
        else {
            init();
        }
    }
}
function handleKeyDown(event) { 
    if (event.code === 'ArrowUp') {
        keys.up = true;
        if ((gameState === 'playing' || gameState === 'bossBattle') && player.canInteractWithChest) {
            chestToOpen = player.canInteractWithChest;
            player.canInteractWithChest = null;
        }
        if (gameState === 'finalBoss' && player.captureState === 'none') {
            if (player.heldDebris) {
                const weakPoints = finalBoss.getBodyHitboxes(verticalScrollOffset);
                const headWeakPoint = weakPoints.find(h => h.type === 'circle');
                if (headWeakPoint) {
                    const target = headWeakPoint;
                    player.heldDebris.throwAt(target.x, target.y + verticalScrollOffset); 
                    bossDebris.push(player.heldDebris);
                    player.heldDebris = null;
                    playSound(sounds.jump);
                }
            } else if (player.canPickUpDebris) {
                player.heldDebris = player.canPickUpDebris;
                const index = bossDebris.indexOf(player.canPickUpDebris);
                if (index > -1) {
                    bossDebris.splice(index, 1);
                }
                player.canPickUpDebris = null;
                playSound(sounds.coin);
            }
        }
    }
    if (event.code === 'KeyR') { init(); return; } 
    switch (gameState) { case 'start': handleStartInput(event); break; case 'playing': case 'bossBattle': case 'phaseTwo': case 'finalBoss': handlePlayingInput(event); break; case 'paused': handlePausedInput(event); break; case 'options': handleOptionsInput(event); break; case 'gameOver': case 'gameWon': handleEndScreenInput(event); break; } 
}
function handleKeyUp(event) { 
    if (event.code === 'ArrowUp') keys.up = false;
    if (event.code === 'Space') keys.space = false;
    if (gameState === 'playing' || gameState === 'bossBattle' || gameState === 'phaseTwo' || gameState === 'finalBoss') { 
        if (event.code === 'ArrowLeft') keys.left = false; 
        if (event.code === 'ArrowRight') keys.right = false; 
    } 
}
function handleMouseDown(event) { const mousePos = getMousePos(canvas, event); if (gameState === 'options') { const sliderWidth = 300; const sliderHeight = 20; const sliderStartX = (canvas.width / 2 - sliderWidth / 2) + 10; const musicSliderY = canvas.height / 2 - 30; const sfxSliderY = canvas.height / 2 + 20; if (isMouseOverRect(mousePos, sliderStartX, musicSliderY - 10, sliderWidth, sliderHeight + 20)) { draggingSlider = 'music'; handleMouseMove(event); } else if (isMouseOverRect(mousePos, sliderStartX, sfxSliderY - 10, sliderWidth, sliderHeight + 20)) { draggingSlider = 'sfx'; handleMouseMove(event); } } }
function handleMouseUp(event) { if (draggingSlider === 'sfx') playSound(sounds.coin); draggingSlider = null; }
function handleMouseMove(event) { const mousePos = getMousePos(canvas, event); if (gameState === 'paused') { const menuXCenter = canvas.width / 2; const optionYStart = canvas.height / 2; const lineHeight = 50; const hoverWidth = 250; const hoverHeight = 40; const textBaselineOffset = 25; const contX = menuXCenter - hoverWidth / 2; const contY = optionYStart - textBaselineOffset; if (isMouseOverRect(mousePos, contX, contY, hoverWidth, hoverHeight)) { selectedPauseOption = 0; } const optX = menuXCenter - hoverWidth / 2; const optY = optionYStart + lineHeight - textBaselineOffset; if (isMouseOverRect(mousePos, optX, optY, hoverWidth, hoverHeight)) { selectedPauseOption = 1; } } else if (gameState === 'options') { const sliderWidth = 300; const sliderStartX = (canvas.width / 2 - sliderWidth / 2) + 10; if (draggingSlider) { let newValue = (mousePos.x - sliderStartX) / sliderWidth; newValue = Math.max(0, Math.min(1, newValue)); if (draggingSlider === 'music') { musicVolume = newValue; } else if (draggingSlider === 'sfx') { sfxVolume = newValue; } applyAndSaveVolumes(); } else { const musicSliderY = canvas.height / 2 - 30; if (isMouseOverRect(mousePos, sliderStartX, musicSliderY - 10, sliderWidth, 20 + 20)) { selectedOptionSetting = 0; } const sfxSliderY = canvas.height / 2 + 20; if (isMouseOverRect(mousePos, sliderStartX, sfxSliderY - 10, sliderWidth, 20 + 20)) { selectedOptionSetting = 1; } } } }
function handleClick(event) { if (gameState === 'start') { gameState = 'playing'; musicStarted = true; setTargetMusicVolumeFactor(gameState); return; } const mousePos = getMousePos(canvas, event); if (gameState === 'options' && !draggingSlider) { const sliderWidth = 300; const sliderStartX = (canvas.width / 2 - sliderWidth / 2) + 10; const musicSliderY = canvas.height / 2 - 30; const sfxSliderY = canvas.height / 2 + 20; if (isMouseOverRect(mousePos, sliderStartX, musicSliderY - 10, sliderWidth, 20 + 20)) { musicVolume = (mousePos.x - sliderStartX) / sliderWidth; musicVolume = Math.max(0, Math.min(1, musicVolume)); applyAndSaveVolumes(); } else if (isMouseOverRect(mousePos, sliderStartX, sfxSliderY - 10, sliderWidth, 20 + 20)) { let oldSfxVolume = sfxVolume; sfxVolume = (mousePos.x - sliderStartX) / sliderWidth; sfxVolume = Math.max(0, Math.min(1, sfxVolume)); if (sfxVolume !== oldSfxVolume) playSound(sounds.coin); applyAndSaveVolumes(); } } else if (gameState === 'paused') { const menuXCenter = canvas.width / 2; const optionYStart = canvas.height / 2; const lineHeight = 50; const hoverWidth = 250; const hoverHeight = 40; const textBaselineOffset = 25; const contX = menuXCenter - hoverWidth / 2; const contY = optionYStart - textBaselineOffset; if (isMouseOverRect(mousePos, contX, contY, hoverWidth, hoverHeight)) { gameState = pauseButton.getAttribute('data-previous-state') || 'playing'; setTargetMusicVolumeFactor(gameState); } else { const optX = menuXCenter - hoverWidth / 2; const optY = optionYStart + lineHeight - textBaselineOffset; if (isMouseOverRect(mousePos, optX, optY, hoverWidth, hoverHeight)) { gameState = 'options'; setTargetMusicVolumeFactor(gameState); } } } }
function applyAndSaveVolumes(){ applyVolumes(); localStorage.setItem('musicVolume', musicVolume); localStorage.setItem('sfxVolume', sfxVolume); }
function handlePauseButtonClick() { if (gameState === 'playing' || gameState === 'bossBattle' || gameState === 'phaseTwo' || gameState === 'finalBoss') { let previousState = gameState; gameState = 'paused'; pauseButton.setAttribute('data-previous-state', previousState); setTargetMusicVolumeFactor(gameState); keys.left = false; keys.right = false; } else if (gameState === 'paused') { gameState = pauseButton.getAttribute('data-previous-state') || 'playing'; setTargetMusicVolumeFactor(gameState); } }
function handleBodyClick(event) { if (event.target === document.body || event.target === mainWrapper) { if (gameState === 'playing' || gameState === 'bossBattle' || gameState === 'phaseTwo' || gameState === 'finalBoss') { let previousState = gameState; gameState = 'paused'; pauseButton.setAttribute('data-previous-state', previousState); setTargetMusicVolumeFactor(gameState); keys.left = false; keys.right = false; } } }

// --- FUNÇÕES DE DESENHO (DRAW) ---
function drawParticles(isVertical = false) { 
    offscreenCtx.save(); 
    for (let i = particles.length - 1; i >= 0; i--) { 
        const p = particles[i]; 
        if (!p || typeof p.x === 'undefined' || typeof p.y === 'undefined' || isNaN(p.x) || isNaN(p.y)) { 
            particles.splice(i,1); continue; 
        } 
        
        let particleXToDraw = p.isScreenSpace ? p.x : p.x - (isVertical ? 0 : scrollOffset);
        let particleYToDraw = p.isScreenSpace ? p.y : p.y - (isVertical ? verticalScrollOffset : 0);

        if (isNaN(particleXToDraw) || isNaN(particleYToDraw)) { 
            particles.splice(i,1); continue; 
        } 
        offscreenCtx.globalAlpha = p.lifespan / p.initialLifespan; 
        offscreenCtx.fillStyle = p.color; 
        offscreenCtx.fillRect(particleXToDraw, particleYToDraw, p.size, p.size); 
    } 
    offscreenCtx.restore(); 
}

function drawTowerLightingOverlay(targetCtx) {
    if (!finalBoss || !finalBoss.isInRageMode) return;
    
    targetCtx.globalAlpha = finalBoss.rageLightingAlpha;
    const lightingOverlay = targetCtx.createLinearGradient(0, 0, targetCtx.canvas.width, 0);
    lightingOverlay.addColorStop(0.2, 'rgba(0, 0, 0, 0.5)');
    lightingOverlay.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
    lightingOverlay.addColorStop(0.8, 'rgba(0, 0, 0, 0.5)');
    
    targetCtx.fillStyle = lightingOverlay;
    targetCtx.fillRect(0, 0, targetCtx.canvas.width, targetCtx.canvas.height);
    targetCtx.globalAlpha = 1.0;
}

function drawFogOverlay(isVertical = false) {
    platforms.forEach(p => {
        if (p.visualType === 'cloud') {
            const platformX = p.x - (isVertical ? 0 : scrollOffset);
            const platformY = p.y - (isVertical ? verticalScrollOffset : 0);
            
            if (platformX + p.width > 0 && platformX < canvas.width && platformY + p.height > 0 && platformY < canvas.height) {
                 p.drawFog(offscreenCtx, platformX, platformY);
            }
        }
    });
}

function drawProjectileIndicators() { projectileIndicators.forEach(p => { if (!p || isNaN(p.x) || isNaN(p.y) || isNaN(p.lifespan) || isNaN(p.initialLifespan) || p.initialLifespan <= 0) { return; } let indicatorColor; if (p.projectileType === 'homing') { indicatorColor = 'rgba(184, 147, 11, 0.7)'; } else if (p.projectileType === 'rebound') { indicatorColor = 'rgba(93, 173, 226, 0.7)'; } else { indicatorColor = 'rgba(106, 51, 129, 0.7)'; } const progress = Math.max(0, 1 - (p.lifespan / p.initialLifespan)); const radius = 25 * progress; const alpha = Math.max(0, 1 - progress); if (isNaN(radius) || isNaN(alpha) || radius < 0) { return; } offscreenCtx.save(); offscreenCtx.globalAlpha = alpha; offscreenCtx.beginPath(); offscreenCtx.arc(p.x + 17.5, p.y + 17.5, radius, 0, Math.PI * 2); offscreenCtx.fillStyle = indicatorColor; offscreenCtx.fill(); offscreenCtx.restore(); }); }

function drawCoinAnimations(isVertical = false) {
    for (const coin of coinAnimations) {
        const coinX = coin.x - (isVertical ? 0 : scrollOffset);
        const coinY = coin.y - (isVertical ? verticalScrollOffset : 0);
        const radius = 8;
        const grad = offscreenCtx.createRadialGradient(coinX, coinY, radius * 0.2, coinX, coinY, radius);
        grad.addColorStop(0, '#feca57');
        grad.addColorStop(1, '#f39c12');
        
        offscreenCtx.fillStyle = grad;
        offscreenCtx.beginPath();
        offscreenCtx.arc(coinX, coinY, radius, 0, Math.PI * 2);
        offscreenCtx.fill();
        
        offscreenCtx.strokeStyle = '#b8930b';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function drawInteractionPrompts(ctx, isVertical = false) {
    ctx.save();
    const pulse = Math.sin(Date.now() / 200);
    const alpha = 0.7 + pulse * 0.3;
    
    interactionPrompts.forEach(prompt => {
        const promptX = prompt.x - (isVertical ? 0 : scrollOffset);
        const promptY = prompt.y - (isVertical ? verticalScrollOffset : 0);
        const keyWidth = 24;
        const keyHeight = 24;
        const arrowHeight = 8;
        const arrowWidth = 10;
        
        ctx.globalAlpha = alpha;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.strokeStyle = 'rgba(50, 50, 50, 0.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(promptX - keyWidth / 2, promptY - keyHeight / 2, keyWidth, keyHeight, [4]);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'rgba(50, 50, 50, 0.9)';
        ctx.beginPath();
        ctx.moveTo(promptX, promptY - arrowHeight / 2);
        ctx.lineTo(promptX + arrowWidth / 2, promptY + arrowHeight / 2);
        ctx.lineTo(promptX - arrowWidth / 2, promptY + arrowHeight / 2);
        ctx.closePath();
        ctx.fill();
    });
    ctx.restore();
}


// --- FUNÇÕES DE UI (DESENHADAS NO CONTEXTO PRINCIPAL) ---
function drawGameStats() { 
    drawGradientText(`Pontos: ${score}`, 20, 40, 24, 'left', true, ctx); 
    
    let distanceText = '';
    if (isVerticalPhase()) {
        const height = Math.floor((phaseTwoStartScrollY - verticalScrollOffset) / 10);
        distanceText = `Altura: ${Math.max(0, height)}m`;
    } else {
        const distance = Math.floor(scrollOffset / 50);
        distanceText = `Distancia: ${distance}m`;
    }
    drawGradientText(distanceText, 20, 65, 18, 'left', true, ctx);
    
    const heartSize = 28; 
    const heartSpacing = 38; 
    const startX = 20; 
    const startY = 85; 
    for (let i = 0; i < player.maxHealth; i++) { const x = startX + i * heartSpacing; ctx.fillStyle = '#555'; ctx.beginPath(); ctx.moveTo(x + heartSize / 2, startY + heartSize * 0.4); ctx.bezierCurveTo(x, startY, x, startY + heartSize * 0.7, x + heartSize / 2, startY + heartSize); ctx.bezierCurveTo(x + heartSize, startY + heartSize * 0.7, x + heartSize, startY, x + heartSize / 2, startY + heartSize * 0.4); ctx.closePath(); ctx.fill(); } 
    for (let i = 0; i < player.health; i++) { const x = startX + i * heartSpacing; const heartGrad = ctx.createLinearGradient(x, startY, x, startY + heartSize); heartGrad.addColorStop(0, '#ff8b8b');
        heartGrad.addColorStop(1, '#d13423'); ctx.fillStyle = heartGrad; ctx.beginPath(); ctx.moveTo(x + heartSize / 2, startY + heartSize * 0.4); ctx.bezierCurveTo(x, startY, x, startY + heartSize * 0.7, x + heartSize / 2, startY + heartSize); ctx.bezierCurveTo(x + heartSize, startY + heartSize * 0.7, x + heartSize, startY, x + heartSize / 2, startY + heartSize * 0.4); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#a4281b'; ctx.lineWidth = 2; ctx.stroke(); } 
}

function drawFinalBossUI() {
    if (!finalBoss) return;
    
    const barWidth = canvas.width * 0.6;
    const barHeight = 30;
    const barX = canvas.width / 2 - barWidth / 2;
    const barY = canvas.height - 60; 

    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    const healthPercentage = finalBoss.health / finalBoss.maxHealth;
    const healthGrad = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
    healthGrad.addColorStop(0, '#e67e22');
    healthGrad.addColorStop(1, '#f1c40f');
    ctx.fillStyle = healthGrad;
    ctx.fillRect(barX, barY, barWidth * healthPercentage, barHeight);

    ctx.strokeStyle = '#ecf0f1';
    ctx.lineWidth = 4;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    drawGradientText('MÁQUINA ASCENDENTE', canvas.width / 2, barY - 15, 18, 'center', true, ctx);
}

function drawBossUI() { if (!boss) return; const barWidth = canvas.width / 2; const barHeight = 25; const barX = canvas.width / 2 - barWidth / 2; const barY = canvas.height - 50; ctx.fillStyle = '#555'; ctx.fillRect(barX, barY, barWidth, barHeight); const healthPercentage = boss.health / boss.maxHealth; const healthGrad = ctx.createLinearGradient(barX, 0, barX + barWidth, 0); healthGrad.addColorStop(0, '#ff6b6b');
        healthGrad.addColorStop(1, '#e74c3c'); ctx.fillStyle = healthGrad; ctx.fillRect(barX, barY, barWidth * healthPercentage, barHeight); ctx.strokeStyle = 'white'; ctx.lineWidth = 3; ctx.strokeRect(barX, barY, barWidth, barHeight); drawGradientText('SUPER AI BOSS', canvas.width / 2, barY - 15, 18, 'center', true, ctx);}
function drawPauseMenu() { ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; ctx.fillRect(0, 0, canvas.width, canvas.height); drawGradientText('PAUSADO', canvas.width / 2, canvas.height / 2 - 80, 40, 'center', true, ctx); const options = ['Continuar', 'Opções']; for (let i = 0; i < options.length; i++) { const isSelected = (selectedPauseOption === i); const size = isSelected ? 30 : 24; let style = '#d0d0d0'; if (isSelected) { style = '#f1c40f'; } const grad = ctx.createLinearGradient(0, (canvas.height/2 + i*50) - size, 0, canvas.height/2 + i*50); grad.addColorStop(0, '#ffffff'); grad.addColorStop(1, style); ctx.fillStyle = grad; ctx.font = `${size}px "Press Start 2P"`; ctx.textAlign = 'center'; ctx.fillText(options[i], canvas.width / 2, canvas.height/2 + i*50); } }
function drawOptionsMenu() { ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; ctx.fillRect(0, 0, canvas.width, canvas.height); drawGradientText('OPÇÕES', canvas.width / 2, canvas.height / 2 - 100, 40, 'center', true, ctx); const sliderWidth = 300, sliderHeight = 20, knobWidth = 12, knobHeight = 28; const sliderStartX = (canvas.width / 2 - sliderWidth / 2) + 10; const labelXPosition = sliderStartX - 20; const musicSliderY = canvas.height / 2 - 30; drawGradientText('Música', labelXPosition, musicSliderY + sliderHeight / 2 + 5, (selectedOptionSetting === 0) ? 24 : 20, 'right', true, ctx); ctx.fillStyle = '#555'; ctx.fillRect(sliderStartX, musicSliderY, sliderWidth, sliderHeight); const musicGrad = ctx.createLinearGradient(sliderStartX, 0, sliderStartX + sliderWidth, 0); musicGrad.addColorStop(0, '#f1c40f');
        musicGrad.addColorStop(1, '#f39c12'); ctx.fillStyle = musicGrad; ctx.fillRect(sliderStartX, musicSliderY, sliderWidth * musicVolume, sliderHeight); const sfxSliderY = canvas.height / 2 + 20; drawGradientText('Efeitos', labelXPosition, sfxSliderY + sliderHeight / 2 + 5, (selectedOptionSetting === 1) ? 24 : 20, 'right', true, ctx); ctx.fillStyle = '#555'; ctx.fillRect(sliderStartX, sfxSliderY, sliderWidth, sliderHeight); const sfxGrad = ctx.createLinearGradient(sliderStartX, 0, sliderStartX + sliderWidth, 0); sfxGrad.addColorStop(0, '#f1c40f');
        sfxGrad.addColorStop(1, '#f39c12'); ctx.fillStyle = sfxGrad; ctx.fillRect(sliderStartX, sfxSliderY, sliderWidth * sfxVolume, sliderHeight); const knobGrad = ctx.createLinearGradient(0, -knobHeight/2, 0, knobHeight/2); knobGrad.addColorStop(0, '#fff'); knobGrad.addColorStop(1, '#ccc'); ctx.fillStyle = knobGrad; ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(sliderStartX + sliderWidth * musicVolume - knobWidth / 2, musicSliderY + (sliderHeight / 2) - knobHeight / 2, knobWidth, knobHeight, [3]); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.roundRect(sliderStartX + sliderWidth * sfxVolume - knobWidth / 2, sfxSliderY + (sliderHeight / 2) - knobHeight / 2, knobWidth, knobHeight, [3]); ctx.fill(); ctx.stroke(); drawGradientText('Use <-- --> ou clique e arraste', canvas.width / 2, canvas.height / 2 + 150, 16, 'center', true, ctx); drawGradientText('Use ESC para voltar', canvas.width / 2, canvas.height / 2 + 180, 16, 'center', true, ctx); }

function drawStartScreen() { 
    drawGradientText('Super AI Bros.', canvas.width / 2, canvas.height / 2 - 40, 48, 'center', true, ctx);
    drawGradientText('Pressione qualquer tecla para começar!', canvas.width / 2, canvas.height / 2 + 30, 20, 'center', true, ctx);
}

function drawEndScreen(isVictory) {
    const overlayColor = isVictory ? 'rgba(12, 10, 26, 0.85)' : 'rgba(40, 10, 10, 0.85)';
    ctx.fillStyle = overlayColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (isVictory) {
        drawGradientText('VOCÊ VENCEU!', canvas.width / 2, canvas.height / 2 - 50, 48, 'center', true, ctx);
    } else {
        drawGradientText('FIM DE JOGO', canvas.width / 2, canvas.height / 2 - 50, 48, 'center', true, ctx);
    }
    
    let endMetricLabel = '';
    let endMetricValue = 0;

    if (finalBoss || (phaseOneComplete && !isVictory)) {
        endMetricLabel = 'Altura Final';
        endMetricValue = Math.max(0, Math.floor((phaseTwoStartScrollY - verticalScrollOffset) / 10));
    } else {
        endMetricLabel = 'Distância Final';
        endMetricValue = Math.floor(scrollOffset / 50);
    }
    
    drawGradientText(`${endMetricLabel}: ${endMetricValue}m`, canvas.width / 2, canvas.height / 2 + 20, 24, 'center', true, ctx);
    drawGradientText('Pressione ENTER para continuar', canvas.width / 2, canvas.height / 2 + 80, 20, 'center', true, ctx);
}

function drawScreenMessages() { if(screenMessage && screenMessage.lifespan > 0) { if (Math.floor(screenMessage.lifespan * 4) % 2 === 0) return; drawGradientText(screenMessage.text, canvas.width / 2, 100, 24, 'center', true, ctx); } }

// --- FUNÇÕES DE LÓGICA (UPDATE) ---
function updateCoinAnimations(deltaTime) {
    if (coinRewardState.active && coinRewardState.toSpawn > 0) {
        coinRewardState.spawnTimer -= deltaTime;
        if (coinRewardState.spawnTimer <= 0) {
            coinRewardState.spawnTimer = COIN_ANIM_SPAWN_INTERVAL;
            coinRewardState.toSpawn--;

            coinAnimations.push({
                x: coinRewardState.spawnPosition.x,
                y: coinRewardState.spawnPosition.y,
                vx: (Math.random() - 0.5) * 80,
                vy: COIN_ANIM_START_VELOCITY_Y,
                lifespan: COIN_ANIM_LIFESPAN
            });
        }
    }
    if (coinRewardState.toSpawn === 0) {
        coinRewardState.active = false;
    }

    for (let i = coinAnimations.length - 1; i >= 0; i--) {
        const coin = coinAnimations[i];
        coin.x += coin.vx * deltaTime;
        coin.y += coin.vy * deltaTime;
        coin.vy += COIN_ANIM_GRAVITY * deltaTime;
        coin.lifespan -= deltaTime;

        if (coin.lifespan <= 0) {
            if (!scoreLockCheat) {
                score += COIN_VALUE;
            }
            playSound(sounds.coin);
            for (let k = 0; k < 5; k++) {
                particles.push({
                    x: coin.x, y: coin.y, size: Math.random() * 3 + 1,
                    color: '#feca57', lifespan: 0.3, initialLifespan: 0.3,
                    vx: (Math.random() - 0.5) * 50, vy: (Math.random() - 0.5) * 50,
                    isScreenSpace: isVerticalPhase() ? false : true 
                });
            }
            coinAnimations.splice(i, 1);
        }
    }
}

function handleCollisions() { 
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;

    for (let i = coins.length - 1; i >= 0; i--) { 
        const coin = coins[i]; 
        if (!(coin instanceof Coin)) { coins.splice(i,1); continue; } 
        const dx = playerCenterX - coin.x; 
        const dy = playerCenterY - coin.y; 
        if (Math.sqrt(dx * dx + dy * dy) < player.width / 2 + coin.radius) { 
            if (!scoreLockCheat) { 
                score += COIN_VALUE; 
            } 
            playSound(sounds.coin); 
            coins.splice(i, 1); 
        } 
    } 
    for (let i = healthPacks.length - 1; i >= 0; i--) { 
        const pack = healthPacks[i]; 
        if (!(pack instanceof HealthPack)) { healthPacks.splice(i,1); continue; } 
        const dx = playerCenterX - pack.x; 
        const dy = playerCenterY - pack.y; 
        if (Math.sqrt(dx * dx + dy * dy) < player.width / 2 + pack.radius) { 
            player.health = Math.min(player.maxHealth, player.health + 1); 
            playSound(sounds.coin); 
            healthPacks.splice(i, 1); 
        } 
    } 
}

function updateGameLogic(deltaTime) { 
    if (boss && boss.health <= 0 && gameState !== 'gameWon') { 
        phaseOneComplete = true;
        gameWon = true; 
        gameState = 'gameWon'; 
        playSound(sounds.victory); 
        setTargetMusicVolumeFactor(gameState); 
    } 
    if ((finalBoss && finalBoss.health <= 0) && gameState !== 'gameWon') {
        gameWon = true; 
        localStorage.setItem('gameBeaten', 'true');
        gameState = 'gameWon';
        playSound(sounds.victory);
        setTargetMusicVolumeFactor(gameState);
    }
    if (player.health <= 0 && gameState !== 'gameOver' && player.captureState === 'none') { 
        gameWon = false; 
        gameState = 'gameOver'; 
        playSound(sounds.gameOver); 
        setTargetMusicVolumeFactor(gameState); 
    } 
}
function gerenciarPlataformas() {
    platforms = platforms.filter(p => p.y < canvas.height + 100 && (p.x + p.width - scrollOffset) > 0);
    if (platforms.length === 0) {
        platforms.push(new Platform(scrollOffset, 550, 600, 'stable', 'grass'));
    }
    let last = platforms[platforms.length - 1];
    while (last.x < scrollOffset + canvas.width + 200) {
        const gap = Math.random() * (PLATFORM_MAX_GAP - PLATFORM_MIN_GAP) + PLATFORM_MIN_GAP;
        const newX = last.x + last.width + gap;
        const isLongPlatform = Math.random() < LONG_PLATFORM_CHANCE;
        const newWidth = isLongPlatform ? Math.random() * (LONG_PLATFORM_MAX_WIDTH - LONG_PLATFORM_MIN_WIDTH) + LONG_PLATFORM_MIN_WIDTH : Math.random() * (PLATFORM_MAX_WIDTH - PLATFORM_MIN_WIDTH) + PLATFORM_MIN_WIDTH;
        const deltaY = (Math.random() - 0.5) * (PLATFORM_MAX_JUMP_HEIGHT + PLATFORM_MAX_DROP_HEIGHT);
        const newY = Math.max(250, Math.min(last.y + deltaY, 550));
        const newPlatform = new Platform(newX, newY, newWidth, 'stable', 'grass');
        
        if (gameState === 'playing') {
            let canHaveItems = true;
            let hasCoinsOnPlatform = false;
            let hasBushOnPlatform = false;
            let itemPlacedOnPlatform = false;

            if (isLongPlatform && Math.random() < OBSTACLE_CHANCE) {
                canHaveItems = false;
                let generatedWallData = null;
                let generatedWallWithTopSpikesThisTime = false;
                if (score >= 501) {
                    if (Math.random() < WALL_CHANCE) {
                        const isTallWall = Math.random() < TALL_WALL_CHANCE;
                        const wallHeight = isTallWall ? TALL_WALL_HEIGHT : NORMAL_WALL_HEIGHT;
                        const wallX = Math.random() * (newWidth - 30 - 20) + 10;
                        if (wallHeight === NORMAL_WALL_HEIGHT && score > 2000 && Math.random() < WALL_WITH_TOP_SPIKES_CHANCE) {
                            newPlatform.addObstacle({ type: 'wallWithTopSpikes', x: wallX, width: 30, wallHeight: NORMAL_WALL_HEIGHT, spikeHeight: 20 });
                            generatedWallWithTopSpikesThisTime = true;
                        } else {
                            generatedWallData = { type: 'wall', x: wallX, width: 30, height: wallHeight };
                            newPlatform.addObstacle(generatedWallData);
                        }
                        if (!generatedWallWithTopSpikesThisTime && generatedWallData && Math.random() < WALL_SPIKE_CHANCE) {
                            const numLateralSpikes = Math.random() < 0.6 ? 1 : 2;
                            const singleSpikeVisualHeight = 20;
                            const totalLateralSpikeHeight = numLateralSpikes * singleSpikeVisualHeight;
                            let yOffsetForLateralSpike = 5 + Math.random() * ((generatedWallData.height * 0.15) - 5);
                            yOffsetForLateralSpike = Math.max(5, yOffsetForLateralSpike);
                            if (yOffsetForLateralSpike + totalLateralSpikeHeight > generatedWallData.height - 5) { yOffsetForLateralSpike = Math.max(5, generatedWallData.height - totalLateralSpikeHeight - 5); }
                            generatedWallData.lateralSpikes = { yOffset: yOffsetForLateralSpike, height: totalLateralSpikeHeight, protrusion: 15, numSpikes: numLateralSpikes };
                        }
                    } else {
                        const numSpikes = Math.floor(Math.random() * 5) + 1;
                        const spikeWidth = numSpikes * 20;
                        newPlatform.addObstacle({ type: 'spike', x: Math.random() * (newWidth - spikeWidth), width: spikeWidth, height: 20 });
                    }
                } else { 
                    if (Math.random() < 0.5) {
                        const wallX = Math.random() * (newWidth - 30 - 20) + 10;
                        const wallHeight = NORMAL_WALL_HEIGHT;
                        generatedWallData = { type: 'wall', x: wallX, width: 30, height: wallHeight };
                        newPlatform.addObstacle(generatedWallData);
                        if (Math.random() < WALL_SPIKE_CHANCE * 0.7) {
                            const numLateralSpikes = 1;
                            const singleSpikeVisualHeight = 20;
                            const totalSpikeSetHeight = numLateralSpikes * singleSpikeVisualHeight;
                            let yOffsetForLateralSpike = 5 + Math.random() * ((wallHeight * 0.15) - 5);
                            yOffsetForLateralSpike = Math.max(5, yOffsetForLateralSpike);
                            if (yOffsetForLateralSpike + totalSpikeSetHeight > wallHeight - 5) { yOffsetForLateralSpike = Math.max(5, wallHeight - totalSpikeSetHeight - 5); }
                            generatedWallData.lateralSpikes = { yOffset: yOffsetForLateralSpike, height: totalSpikeSetHeight, protrusion: 15, numSpikes: numLateralSpikes };
                        }
                    } else {
                        const numSpikes = Math.floor(Math.random() * 3) + 1;
                        const spikeWidth = numSpikes * 20;
                        newPlatform.addObstacle({ type: 'spike', x: Math.random() * (newWidth - spikeWidth), width: spikeWidth, height: 20 });
                    }
                }
            }
            const hasDangerousObstacles = newPlatform.obstacles.some(obs => obs.type !== 'bush');
            
            if (!isLongPlatform && !hasDangerousObstacles) {
                if (score >= 1001 && score <= 1500) { if (Math.random() < FALLING_PLATFORM_CHANCE * 0.5) newPlatform.type = 'falling'; }
                else if (score > 1500) { if (Math.random() < FALLING_PLATFORM_CHANCE) newPlatform.type = 'falling'; }
            }

            if (canHaveItems) {
                if (isLongPlatform && !hasDangerousObstacles && Math.random() < CHEST_SPAWN_CHANCE) {
                    newPlatform.hasChest = true;
                    newPlatform.chestType = (Math.random() < CHEST_LUCK_CHANCE) ? 'reward' : 'trap';
                    itemPlacedOnPlatform = true;
                }
                
                if (!itemPlacedOnPlatform && Math.random() < COIN_SPAWN_CHANCE) {
                    hasCoinsOnPlatform = true;
                    itemPlacedOnPlatform = true;
                    const numCoins = 3 + Math.floor(Math.random() * 3);
                    const coinSpacing = 30;
                    const totalCoinWidth = (numCoins - 1) * coinSpacing;
                    const startX = newPlatform.x + (newPlatform.width / 2) - (totalCoinWidth / 2);
                    for (let i = 0; i < numCoins; i++) {
                        coins.push(new Coin(startX + (i * coinSpacing), newPlatform.y - 25));
                    }
                }
                
                if (!itemPlacedOnPlatform && newPlatform.width > 150 && Math.random() < BUSH_SPAWN_CHANCE && !hasDangerousObstacles) {
                    hasBushOnPlatform = true;
                    const numBushes = 1 + Math.floor(Math.random() * 2);
                    for(let i = 0; i < numBushes; i++) {
                        const bushWidth = Math.random() * 20 + 25;
                        const bushHeight = bushWidth * (0.6 + Math.random() * 0.2);
                        const bushX = Math.random() * (newPlatform.width - bushWidth);
                        newPlatform.addObstacle({ type: 'bush', x: bushX, width: bushWidth, height: bushHeight });
                    }
                }
            }
            
            const canSpawnHealth = canHaveItems && !itemPlacedOnPlatform && !hasCoinsOnPlatform && !hasBushOnPlatform && !hasDangerousObstacles;
            if (player.health < player.maxHealth && canSpawnHealth) {
                const missingHealth = player.maxHealth - player.health;
                const dynamicChance = BASE_HEALTH_PACK_CHANCE * (1 + missingHealth * HEALTH_PACK_CHANCE_MULTIPLIER);
                if (Math.random() < dynamicChance) {
                    healthPacks.push(new HealthPack(newPlatform.x + newPlatform.width / 2, newPlatform.y - 30));
                }
            }
        } else if (gameState === 'bossBattle') {
            if (boss && boss.health <= boss.maxHealth / 2) { newPlatform.type = 'falling'; }
            if (newPlatform.width > 150 && Math.random() < BUSH_SPAWN_CHANCE) {
                const bushWidth = Math.random() * 20 + 25;
                const bushHeight = bushWidth * (0.6 + Math.random() * 0.2);
                const bushX = Math.random() * (newWidth - bushWidth);
                newPlatform.addObstacle({ type: 'bush', x: bushX, width: bushWidth, height: bushHeight });
            }
            if (boss && player.health < player.maxHealth && boss.healthPacksSpawnedInBattle < BOSS_BATTLE_MAX_HEALTH_PACKS && Math.random() < HEALTH_PACK_SPAWN_CHANCE_BOSS) {
                boss.healthPacksSpawnedInBattle++;
                healthPacks.push(new HealthPack(newPlatform.x + newPlatform.width / 2, newPlatform.y - 30));
            }
        }
        platforms.push(newPlatform);
        last = newPlatform;
    }
}
// <<< INÍCIO DA ALTERAÇÃO >>>
function gerenciarPlataformasFase2() {
    platforms = platforms.filter(p => p.y < verticalScrollOffset + canvas.height + 200);

    const requiredTopY = verticalScrollOffset - 200; 
    const towerWidth = canvas.width * 0.6;
    const towerX = (canvas.width - towerWidth) / 2;

    let lastStonePlatform = platforms.filter(p => p.visualType === 'stone' || p.visualType === 'grass').sort((a,b) => a.y - b.y)[0];
    if (!lastStonePlatform) {
        lastStonePlatform = new Platform(0, canvas.height, 0);
    }
    
    let currentStoneY = lastStonePlatform.y;
    while (currentStoneY > requiredTopY) {
        const gapY = Math.random() * 130 + 120;
        currentStoneY -= gapY;

        const platformWidth = (Math.floor(Math.random() * 2) + 2) * BRICK_WIDTH;
        const platformX = towerX + Math.random() * (towerWidth - platformWidth);
        const newPlatform = new Platform(platformX, currentStoneY, platformWidth, 'stable', 'stone');

        let hasSpecialFeature = false;
        
        if (gameState !== 'finalBoss') {
            if (score >= 1501 && newPlatform.width >= BRICK_WIDTH * 3 && Math.random() < WINDOW_TRAP_CHANCE && Math.abs(newPlatform.y - lastWindowY) > MIN_WINDOW_SPACING) {
                newPlatform.hasWindowTrap = true;
                newPlatform.windowType = (Math.random() < WINDOW_REWARD_CHANCE) ? 'reward' : 'trap';
                lastWindowY = newPlatform.y;
                hasSpecialFeature = true;
            }

            if (!hasSpecialFeature && score >= 501 && newPlatform.width >= BRICK_WIDTH * 2 && Math.random() < PATROL_ENEMY_SPAWN_CHANCE) {
                const enemyY = newPlatform.y - 35;
                const enemyX = newPlatform.x + (newPlatform.width / 2) - (35 / 2); 
                enemies.push(new Enemy(enemyX, enemyY, 'patrol', ENEMY_SPEED_BASE, false, newPlatform));
                newPlatform.hasPatrolEnemy = true;
                hasSpecialFeature = true;
            }
            
            if (!hasSpecialFeature && Math.random() < BOTTOM_SPIKE_CHANCE) {
                const numSpikesInSet = (newPlatform.width / BRICK_WIDTH > 2) ? (Math.random() < 0.5 ? 2 : 1) : 1;
                const spikeSetWidth = numSpikesInSet * 20; 
                const startX = Math.random() * (newPlatform.width - spikeSetWidth);
                newPlatform.addObstacle({ type: 'spike-down', x: startX, width: spikeSetWidth, height: BOTTOM_SPIKE_HEIGHT });
                hasSpecialFeature = true;
            }
        }
        
        const isSafeForItems = !newPlatform.hasPatrolEnemy && !newPlatform.hasWindowTrap && !newPlatform.obstacles.some(obs => obs.type === 'spike-down');
        let hasCoinsOnPlatform = false;

        if (gameState !== 'finalBoss' && isSafeForItems) {
            if (Math.random() < COIN_SPAWN_CHANCE) {
                hasCoinsOnPlatform = true;
                const numCoins = 3 + Math.floor(Math.random() * 3);
                const coinSpacing = 30;
                const totalCoinWidth = (numCoins - 1) * coinSpacing;
                const startX = newPlatform.x + (newPlatform.width / 2) - (totalCoinWidth / 2);
                for (let i = 0; i < numCoins; i++) {
                    coins.push(new Coin(startX + (i * coinSpacing), newPlatform.y - 25));
                }
            }
            
            if (player.health < player.maxHealth && !hasCoinsOnPlatform) {
                const missingHealth = player.maxHealth - player.health;
                const dynamicChance = BASE_HEALTH_PACK_CHANCE * (1 + missingHealth * HEALTH_PACK_CHANCE_MULTIPLIER);
                if (Math.random() < dynamicChance) {
                    healthPacks.push(new HealthPack(newPlatform.x + newPlatform.width / 2, newPlatform.y - 30));
                }
            }
        } else if (gameState === 'finalBoss' && isSafeForItems) {
            if (finalBoss && player.health < player.maxHealth && finalBoss.healthPacksSpawnedInBattle < FINAL_BOSS_BATTLE_MAX_HEALTH_PACKS && Math.random() < HEALTH_PACK_SPAWN_CHANCE_BOSS) {
                finalBoss.healthPacksSpawnedInBattle++;
                healthPacks.push(new HealthPack(newPlatform.x + newPlatform.width / 2, newPlatform.y - 30));
            }
        }
        
        platforms.push(newPlatform);
    }
    
    let lastCloudPlatform = platforms.filter(p => p.visualType === 'cloud').sort((a,b) => a.y - b.y)[0];
    if (!lastCloudPlatform) {
         lastCloudPlatform = new Platform(0, canvas.height - 150, 0);
    }
    
    let currentCloudY = lastCloudPlatform.y;
    while (currentCloudY > requiredTopY) {
        const gapY = Math.random() * 220 + 180;
        currentCloudY -= gapY;

        if (Math.random() > CLOUD_PLATFORM_CHANCE) continue;
        
        const cloudWidth = 100 + Math.random() * 50;
        const spawnSide = Math.random() < 0.5 ? 'left' : 'right';
        let cloudX;
        
        if (spawnSide === 'left') {
            cloudX = Math.random() * (towerX - cloudWidth - 20);
        } else {
            cloudX = towerX + towerWidth + 20 + (Math.random() * (canvas.width - (towerX + towerWidth) - cloudWidth - 20));
        }
        
        const newCloud = new Platform(cloudX, currentCloudY, cloudWidth, 'pass-through-slow', 'cloud');
        platforms.push(newCloud);
    }
}
// <<< FIM DA ALTERAÇÃO >>>

function updateEnemies(deltaTime) { 
    enemies.forEach(enemy => { if (enemy instanceof Enemy) { const particleDataArray = enemy.update(deltaTime, player, scrollOffset, boss, platforms); if (Array.isArray(particleDataArray) && particleDataArray.length > 0) { particles.push(...particleDataArray); } } }); 
    enemies = enemies.filter(enemy => { if (!(enemy instanceof Enemy)) return false; 
        if(enemy.type === 'falling_rock') { return enemy.y < verticalScrollOffset + canvas.height + 100; }
        if (enemy.isScreenSpaceEntity) { return enemy.x + enemy.width > -50 && enemy.x < canvas.width + 50 && enemy.y > -enemy.height && enemy.y < canvas.height + enemy.height; } return enemy.x + enemy.width > scrollOffset && enemy.x < scrollOffset + canvas.width + enemy.width + 50; }); 
    if (gameState === 'playing' && (keys.left || keys.right) && enemySpawnCooldown <= 0 && Math.random() < ENEMY_SPAWN_CHANCE) { 
        let type = null; 
        const enemySpawnRoll = Math.random(); 
        let enemyXPos; 
        let enemySpeedToSet; 
        let isScreenEntityForThisSpawn = false; 
        
        if (score > 2000 && score < BOSS_TRIGGER_SCORE) {
            if (enemySpawnRoll < CHARGER_ENEMY_CHANCE) {
                type = 'charger';
                isScreenEntityForThisSpawn = true;
            } else if (enemySpawnRoll < CHARGER_ENEMY_CHANCE + HOMING_ENEMY_CHANCE) {
                type = 'homing';
                isScreenEntityForThisSpawn = false;
            } else {
                type = 'straight';
                isScreenEntityForThisSpawn = false;
            }
        } else if (score >= 1501 && score <= 2000) {
            type = Math.random() < HOMING_ENEMY_CHANCE ? 'homing' : 'straight';
            isScreenEntityForThisSpawn = false;
        } else if (score >= 1001 && score <= 1500) {
            type = 'straight';
            isScreenEntityForThisSpawn = false;
        }

        if (type) { 
            if (isScreenEntityForThisSpawn) { 
                enemyXPos = canvas.width - 50; 
                enemySpeedToSet = BOSS_MINION_STRAIGHT_SPEED; 
            } else { 
                enemyXPos = scrollOffset + canvas.width + Math.random() * 100 + 50; 
                enemySpeedToSet = ENEMY_SPEED;
            } 
            enemies.push(new Enemy( enemyXPos, Math.random() * (canvas.height - 200) + 50, type, enemySpeedToSet, isScreenEntityForThisSpawn )); 
            enemySpawnCooldown = ENEMY_SPAWN_COOLDOWN; 
        } 
    } 
}

function update(deltaTime) { 
    if (enemySpawnCooldown > 0) enemySpawnCooldown -= deltaTime; 
    for (let i = particles.length - 1; i >= 0; i--) { const p = particles[i]; if (!p || isNaN(p.x) || isNaN(p.y) || isNaN(p.vx) || isNaN(p.vy) || isNaN(p.lifespan)) { particles.splice(i,1); continue; } p.x += p.vx * deltaTime; p.y += p.vy * deltaTime; p.lifespan -= deltaTime; if (p.lifespan <= 0) particles.splice(i, 1); } 
    platforms.forEach(p => p.update(deltaTime)); 
    for (let i = projectileIndicators.length - 1; i >= 0; i--) { const p = projectileIndicators[i]; if(!p || isNaN(p.lifespan) || p.initialLifespan <= 0) { projectileIndicators.splice(i,1); continue; } p.lifespan -= deltaTime; if(p.lifespan <= 0) { const newMinion = new Enemy(p.x, p.y, p.projectileType, p.projectileSpeed, true); enemies.push(newMinion); const particleDataArray = newMinion.update(0, player, scrollOffset, boss); if (Array.isArray(particleDataArray) && particleDataArray.length > 0) { particles.push(...particleDataArray); } projectileIndicators.splice(i, 1); } } 
    
    const playerResult = player.update(deltaTime, keys, platforms, scrollOffset, infiniteInvincibilityCheat, enemies, sceneryManager, verticalScrollOffset, bossDebris); 
    if (playerResult.particles.length > 0) { particles.push(...playerResult.particles); } 
    
    if (player.x - scrollOffset > canvas.width / 2) { 
        scrollOffset = player.x - canvas.width / 2; 
    }
    if (player.y > canvas.height + 100 && player.health > 0) {
        player.respawn(platforms, scrollOffset);
    }

    interactionPrompts = [];
    if (player.canInteractWithChest) {
        const platformWithChest = player.canInteractWithChest;
        const chestHeight = 40;
        const chestCenterX = platformWithChest.x + platformWithChest.width / 2;
        const chestTopY = platformWithChest.y - chestHeight;
        interactionPrompts.push({
            x: chestCenterX,
            y: chestTopY - CHEST_PROMPT_Y_OFFSET
        });
    }

    if (chestToOpen) {
        if (chestToOpen.chestState === 'closed') {
            chestToOpen.chestState = 'opening';
            chestToOpen.chestAnimTimer = 0.5;
            playSound(sounds.jump); 

            if (chestToOpen.chestType === 'reward') {
                player.rewardSource = 'chest';
                const chestWidth = 50;
                const chestHeight = 40;
                const chestX = chestToOpen.x + (chestToOpen.width / 2) - (chestWidth / 2);
                const rewardSpawnPos = { x: chestX + chestWidth / 2, y: chestToOpen.y - chestHeight };
                triggerCoinReward(player, rewardSpawnPos, CHEST_REWARD_COIN_COUNT);
            } else { // 'trap'
                player.getCapturedByChest(chestToOpen);
            }
        }
        chestToOpen = null;
    }
    
    updateCoinAnimations(deltaTime);

    handleCollisions(); 
    sceneryManager.update(scrollOffset, canvas.width, gameState, verticalScrollOffset, platforms); 
    gerenciarPlataformas(); 
    updateEnemies(deltaTime); 
    if(gameState === 'bossBattle' && boss) { boss.update(deltaTime, scrollOffset, player); const playerScreenRect = {x: player.x - scrollOffset, y: player.y, width: player.width, height: player.height}; if (isCollidingWithDiamond(playerScreenRect, boss)) { player.takeDamage(); } for (let i = enemies.length - 1; i >= 0; i--) { const enemy = enemies[i]; if (!(enemy instanceof Enemy)) continue; if (enemy.isRebounded) { const enemyScreenRect = {x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height}; if (isCollidingWithDiamond(enemyScreenRect, boss)) { boss.health -= BOSS_DAMAGE_FROM_REBOUND; playSound(sounds.damage); for (let j = 0; j < 20; j++) { particles.push({ x: boss.x + (boss.width / 2), y: boss.y + boss.height / 2, size: Math.random() * 4 + 2, color: '#f1c40f', lifespan: 1, initialLifespan: 1, vx: (Math.random() - 0.5) * 500, vy: (Math.random() - 0.5) * 500, isScreenSpace: true }); } enemies.splice(i, 1); } } } } 
    updateGameLogic(deltaTime); 
    
    if (gameState === 'playing' && score >= BOSS_TRIGGER_SCORE && !boss) { gameState = 'bossBattle'; initBossBattle(); }
    if (currentTransitionState === 'day' && score >= DAY_TO_AFTERNOON_TRIGGER_SCORE) {
        currentTransitionState = 'dayToAfternoon';
        dayTransitionStartOffset = scrollOffset;
    } else if (currentTransitionState === 'afternoon' && score >= AFTERNOON_TO_NIGHT_TRIGGER_SCORE) {
        currentTransitionState = 'afternoonToNight';
        nightTransitionStartOffset = scrollOffset;
    }
}

function updateVerticalPhase(deltaTime) {
    if (screenShakeTimer > 0) {
        screenShakeTimer -= deltaTime;
    }
    
    interactionPrompts = []; 

    platforms.forEach(p => {
        if (p.hasWindowTrap && p.windowState === 'active') {
            const windowWidth = 60;
            const windowHeight = 90;
            const windowX = p.x + (p.width / 2) - (windowWidth / 2);
            const windowY = p.y - windowHeight;
            
            const dx = (player.x + player.width / 2) - (windowX + windowWidth / 2);
            const dy = (player.y + player.height / 2) - (windowY + windowHeight / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < WINDOW_PROMPT_DISTANCE) {
                interactionPrompts.push({
                    x: windowX + windowWidth / 2,
                    y: windowY - WINDOW_PROMPT_Y_OFFSET
                });
            }
        }
    });
    
    if (player.y > verticalScrollOffset + canvas.height && player.health > 0) {
        player.triggerFallRespawn(platforms, verticalScrollOffset);
        return; 
    }

    if (player.captureState === 'none') {
        const playerResult = player.update(deltaTime, keys, platforms, 0, infiniteInvincibilityCheat, enemies, sceneryManager, verticalScrollOffset, bossDebris);
        if (playerResult.particles.length > 0) {
            particles.push(...playerResult.particles);
        }
        
        if (player.canPickUpDebris) {
            const debris = player.canPickUpDebris;
            interactionPrompts.push({
                x: debris.x + debris.width / 2,
                y: debris.y - DEBRIS_PICKUP_PROMPT_Y_OFFSET
            });
        }

        let cameraFocusPointY = canvas.height * (gameState === 'finalBoss' ? 0.3 : 0.5);
        const targetScrollY = player.y - cameraFocusPointY;

        if (targetScrollY < verticalScrollOffset) {
            verticalScrollOffset = targetScrollY;
        }
    } else {
        player.update(deltaTime, keys, platforms, 0, infiniteInvincibilityCheat, enemies, sceneryManager, verticalScrollOffset, bossDebris);
        if (player.captureState === 'pulling' && player.captureAnimProgress >= 1) {
            player.respawnInTower(platforms);
            player.takeDamage(false); 
        }
    }
    
    if (gameState === 'phaseTwo' && score >= 2501 && score < FINAL_BOSS_TRIGGER_SCORE) {
        if (fallingRockSpawnTimer > 0) {
            fallingRockSpawnTimer -= deltaTime;
        }

        if (fallingRockSpawnTimer <= 0) {
            const spawnX = Math.random() * canvas.width;
            const spawnY = verticalScrollOffset - 50; 
            enemies.push(new Enemy(spawnX, spawnY, 'falling_rock', 0, false));
            fallingRockSpawnTimer = FALLING_ROCK_SPAWN_INTERVAL + (Math.random() - 0.5); 
        }
    }
    
    updateCoinAnimations(deltaTime);

    platforms.forEach(p => p.update(deltaTime)); 
    gerenciarPlataformasFase2();
    updateEnemies(deltaTime);
    handleCollisions();
    
    if (finalBoss) {
        const bossEvents = finalBoss.update(deltaTime, player, verticalScrollOffset);
        if (bossEvents.particles && bossEvents.particles.length > 0) {
            particles.push(...bossEvents.particles);
        }
        if (bossEvents.shake) {
            screenShakeTimer = FINAL_BOSS_SHAKE_DURATION; 
            const towerWidth = canvas.width * 0.6;
            const towerX = (canvas.width - towerWidth) / 2;
            const numDebris = 5 + Math.floor(Math.random() * 3);
            const laneWidth = towerWidth / numDebris;
            for (let i = 0; i < numDebris; i++) {
                const laneStart = towerX + i * laneWidth;
                const spawnX = laneStart + (Math.random() * (laneWidth - 30));
                const spawnY = verticalScrollOffset - (50 + Math.random() * 50);
                const spawnDelay = Math.random() * 0.5;
                const canPhase = Math.random() < DEBRIS_PHASE_CHANCE;
                bossDebris.push(new BossDebris(spawnX, spawnY, spawnDelay, canPhase));
            }
        }

        const playerScreenRect = {
            x: player.x,
            y: player.y - verticalScrollOffset,
            width: player.width,
            height: player.height
        };
        
        let tookContactDamage = false;

        if (!player.isInvincible) {
            const bodyHitboxes = finalBoss.getBodyHitboxes(verticalScrollOffset);
            for (const hitbox of bodyHitboxes) {
                let collision = false;
                if (hitbox.type === 'rect') {
                    collision = isColliding(playerScreenRect, hitbox);
                } else if (hitbox.type === 'circle') {
                    collision = isCollidingCircleRect(hitbox, playerScreenRect);
                }
                if (collision) {
                    player.takeDamage(true);
                    tookContactDamage = true;
                    break;
                }
            }

            if (!tookContactDamage) {
                const armHitboxes = finalBoss.getArmHitboxes(verticalScrollOffset);
                for (const arm of armHitboxes) {
                    if (isCollidingRectPolygon(playerScreenRect, arm.upperArm) || isCollidingRectPolygon(playerScreenRect, arm.forearm)) {
                        player.takeDamage(true);
                        tookContactDamage = true;
                        break; 
                    }
                }
            }

            if (finalBoss.attackState === 'laser_active') {
                const laserHitbox = finalBoss.getLaserHitbox(verticalScrollOffset);
                if (laserHitbox && isCollidingLineRect(laserHitbox, playerScreenRect)) {
                    player.takeDamage(true);
                }
            }
        }
        
        for(let i = bossDebris.length - 1; i >= 0; i--) {
            const d = bossDebris[i];
            d.update(deltaTime, platforms);

            if (d.state === 'thrown') {
                const weakPoints = finalBoss.getBodyHitboxes(verticalScrollOffset).filter(h => h.type === 'circle');
                for (const point of weakPoints) {
                    const weakPointWorldRect = { 
                        x: point.x - point.radius, 
                        y: point.y - point.radius + verticalScrollOffset, 
                        width: point.radius * 2, 
                        height: point.radius * 2 
                    };
                    const debrisWorldRect = { x: d.x, y: d.y, width: d.width, height: d.height };
                    
                    if (isColliding(debrisWorldRect, weakPointWorldRect)) {
                        finalBoss.takeDamage(1);
                        bossDebris.splice(i, 1);
                        for (let k = 0; k < 30; k++) {
                            particles.push({
                                x: point.x, y: point.y,
                                size: Math.random() * 5 + 2,
                                color: '#f1c40f',
                                lifespan: 0.8 + Math.random() * 0.5, initialLifespan: 1.3,
                                vx: (Math.random() - 0.5) * 600, vy: (Math.random() - 0.5) * 600,
                                isScreenSpace: true
                            });
                        }
                        break; 
                    }
                }
            }
            if (d.y > verticalScrollOffset + canvas.height + 50) {
                bossDebris.splice(i, 1);
            }
        }
    }

    sceneryManager.update(0, canvas.width, gameState, verticalScrollOffset, platforms);
    for (let i = particles.length - 1; i >= 0; i--) { const p = particles[i]; if (!p || isNaN(p.x) || isNaN(p.y) || isNaN(p.vx) || isNaN(p.vy) || isNaN(p.lifespan)) { particles.splice(i,1); continue; } p.x += p.vx * deltaTime; p.y += p.vy * deltaTime; p.lifespan -= deltaTime; if (p.lifespan <= 0) particles.splice(i, 1); }
    updateGameLogic(deltaTime);

    if (gameState === 'phaseTwo' && score >= FINAL_BOSS_TRIGGER_SCORE && !finalBoss) {
        initFinalBoss();
    }
}


function animate(timestamp) {
    requestAnimationFrame(animate);
    const deltaTime = Math.min((timestamp - lastTime) / 1000 || 0, 0.1);
    lastTime = timestamp;

    const isGameActive = gameState === 'playing' || gameState === 'bossBattle' || gameState === 'phaseTwo' || gameState === 'finalBoss';
    
    if (sounds.music.audio && sounds.music.audio.src) {
        const baseMusicVol = sounds.music.baseVolume * musicVolume;
        if (currentMusicVolumeFactor !== targetMusicVolumeFactor) {
            const transitionSpeed = MUSIC_VOLUME_TRANSITION_SPEED * deltaTime;
            if (currentMusicVolumeFactor < targetMusicVolumeFactor) {
                currentMusicVolumeFactor = Math.min(targetMusicVolumeFactor, currentMusicVolumeFactor + transitionSpeed);
            } else if (currentMusicVolumeFactor > targetMusicVolumeFactor) {
                currentMusicVolumeFactor = Math.max(targetMusicVolumeFactor, currentMusicVolumeFactor - transitionSpeed);
            }
            sounds.music.audio.volume = baseMusicVol * currentMusicVolumeFactor;
        } else {
            sounds.music.audio.volume = baseMusicVol * targetMusicVolumeFactor;
        }
        sounds.music.audio.volume = Math.max(0, Math.min(1, sounds.music.audio.volume));
    }

    if (isGameActive) {
        if (screenMessage && screenMessage.lifespan > 0) {
            screenMessage.lifespan -= deltaTime;
            if (screenMessage.lifespan <= 0) screenMessage = null;
        }
        
        if (isVerticalPhase()) {
            updateVerticalPhase(deltaTime);
        } else {
            update(deltaTime);
        }
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameState === 'start') {
        const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGradient.addColorStop(0, SKY_PALETTES.day[0]);
        bgGradient.addColorStop(0.6, SKY_PALETTES.day[1]);
        bgGradient.addColorStop(1, SKY_PALETTES.day[2]);
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawStartScreen();
    } else {
        offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        offscreenCtx.save();
        if (screenShakeTimer > 0 && isGameActive) {
            const shakeX = (Math.random() - 0.5) * SCREEN_SHAKE_MAGNITUDE;
            const shakeY = 0; 
            offscreenCtx.translate(shakeX, shakeY);
        }

        const activeState = (gameState === 'paused' || gameState === 'options') ? pauseButton.getAttribute('data-previous-state') : gameState;
        const isCurrentlyVertical = activeState === 'phaseTwo' || activeState === 'finalBoss';

        if (isCurrentlyVertical) {
            const bgGradient = offscreenCtx.createLinearGradient(0, 0, 0, canvas.height);
            bgGradient.addColorStop(0, SKY_PALETTES.night[0]); bgGradient.addColorStop(0.6, SKY_PALETTES.night[1]); bgGradient.addColorStop(1, SKY_PALETTES.night[2]);
            offscreenCtx.fillStyle = bgGradient;
            offscreenCtx.fillRect(0,0, canvas.width, canvas.height);
            
            sceneryManager.draw(offscreenCtx, 0, activeState, verticalScrollOffset, deltaTime, platforms, player);
            platforms.forEach(p => p.drawBase(offscreenCtx, 0, verticalScrollOffset, true, player));
            drawParticles(true); 
            if (finalBoss) { finalBoss.draw(offscreenCtx, verticalScrollOffset); }
            bossDebris.forEach(d => d.draw(offscreenCtx, verticalScrollOffset));
            enemies.forEach(e => { if (e instanceof Enemy) { e.draw(offscreenCtx, 0, verticalScrollOffset, true); } });
            player.draw(offscreenCtx, 0, verticalScrollOffset, true);
            coins.forEach(c => c.draw(offscreenCtx, 0, verticalScrollOffset, true));
            healthPacks.forEach(hp => hp.draw(offscreenCtx, 0, verticalScrollOffset, true));
            drawCoinAnimations(true);
            drawFogOverlay(true);
            if (activeState === 'finalBoss') { drawTowerLightingOverlay(offscreenCtx); }
            drawInteractionPrompts(offscreenCtx, true);
        } else {
            let fromPalette, toPalette, progress = 0;
            switch (currentTransitionState) {
                case 'day': fromPalette = SKY_PALETTES.day; toPalette = SKY_PALETTES.day; break;
                case 'dayToAfternoon': fromPalette = SKY_PALETTES.day; toPalette = SKY_PALETTES.afternoon; progress = (scrollOffset - dayTransitionStartOffset) / TRANSITION_DURATION_SCROLL; if (progress >= 1) { currentTransitionState = 'afternoon'; } break;
                case 'afternoon': fromPalette = SKY_PALETTES.afternoon; toPalette = SKY_PALETTES.afternoon; break;
                case 'afternoonToNight': fromPalette = SKY_PALETTES.afternoon; toPalette = SKY_PALETTES.night; progress = (scrollOffset - nightTransitionStartOffset) / TRANSITION_DURATION_SCROLL; if (progress >= 1) { currentTransitionState = 'night'; } break;
                case 'night': fromPalette = SKY_PALETTES.night; toPalette = SKY_PALETTES.night; break;
            }
            progress = Math.max(0, Math.min(1, progress));
            const currentColors = fromPalette.map((from, i) => rgbToString(lerpColor(from, toPalette[i], progress)));
            const bgGradient = offscreenCtx.createLinearGradient(0, 0, 0, canvas.height);
            bgGradient.addColorStop(0, currentColors[0]); bgGradient.addColorStop(0.6, currentColors[1]); bgGradient.addColorStop(1, currentColors[2]);
            offscreenCtx.fillStyle = bgGradient;
            offscreenCtx.fillRect(0,0, canvas.width, canvas.height);
    
            sceneryManager.draw(offscreenCtx, scrollOffset, activeState);
            platforms.forEach(p => p.draw(offscreenCtx, scrollOffset, 0, false, player));
            coins.forEach(c => c.draw(offscreenCtx, scrollOffset, 0, false));
            healthPacks.forEach(hp => hp.draw(offscreenCtx, scrollOffset, 0, false));
            drawParticles(false);
            if (boss) { boss.draw(offscreenCtx); }
            enemies.forEach(e => { if (e instanceof Enemy) { e.draw(offscreenCtx, scrollOffset); } });
            player.draw(offscreenCtx, scrollOffset, 0, false);
            drawProjectileIndicators();
            drawCoinAnimations(false);
            drawInteractionPrompts(offscreenCtx, false);
        }
        offscreenCtx.restore();
    
        const isOverlayState = gameState === 'paused' || gameState === 'options' || gameState === 'gameOver' || gameState === 'gameWon' || patchNotesContainer.classList.contains('visible');
        ctx.filter = isOverlayState ? 'blur(4px)' : 'none';
        ctx.drawImage(offscreenCanvas, 0, 0);
        ctx.filter = 'none';
    
        if (isGameActive) {
            drawGameStats(); 
            if (gameState === 'bossBattle') drawBossUI();
            if (gameState === 'finalBoss') drawFinalBossUI();
        }

        switch (gameState) {
            case 'paused': drawPauseMenu(); break;
            case 'options': drawOptionsMenu(); break;
            case 'gameOver': drawEndScreen(false); break;
            case 'gameWon': drawEndScreen(true); break;
        }
    }
    
    drawScreenMessages();
    const pauseBtnVisible = isGameActive;
    pauseButton.classList.toggle('hidden', !pauseBtnVisible);
}

// --- EVENT LISTENERS E INICIALIZAÇÃO ---
const versionLabel = document.getElementById('versionLabel'); const patchNotesContainer = document.getElementById('patchNotesContainer'); const modalOverlay = document.getElementById('modalOverlay'); const closePatchNotesBtn = document.getElementById('closePatchNotes'); const pointingArrow = document.getElementById('pointingArrow'); const cheatMenuButton = document.getElementById('cheatMenuButton'); const cheatInfoBox = document.getElementById('cheatInfoBox');
function openPatchNotes() { modalOverlay.classList.add('visible'); patchNotesContainer.classList.add('visible'); pointingArrow.classList.remove('visible'); localStorage.setItem('lastSeenGameVersion', versionLabel.textContent); }
function closePatchNotes() { modalOverlay.classList.remove('visible'); patchNotesContainer.classList.remove('visible'); }
function showPointingArrow() { const lastSeenVersion = localStorage.getItem('lastSeenGameVersion'); const currentGameVersion = versionLabel.textContent; if (lastSeenVersion === currentGameVersion) { pointingArrow.style.display = 'none'; return; } pointingArrow.classList.add('visible'); }
function toggleCheatInfo(event) { if (event.detail === 0) return; event.preventDefault(); cheatMenuButton.classList.remove('activated'); cheatInfoBox.style.display = cheatInfoBox.style.display === 'block' ? 'none' : 'block'; }
versionLabel.addEventListener('click', openPatchNotes); closePatchNotesBtn.addEventListener('click', closePatchNotes); modalOverlay.addEventListener('click', closePatchNotes); cheatMenuButton.addEventListener('click', toggleCheatInfo);
document.addEventListener('keydown', handleKeyDown); document.addEventListener('keyup', handleKeyUp); canvas.addEventListener('mousedown', handleMouseDown); document.addEventListener('mouseup', handleMouseUp); document.addEventListener('mousemove', handleMouseMove); canvas.addEventListener('click', handleClick); document.body.addEventListener('click', handleBodyClick); pauseButton.addEventListener('click', handlePauseButtonClick);
init(); animate(0);