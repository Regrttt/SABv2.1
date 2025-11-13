// boss.js

class Boss {
    constructor() {
        this.x = 50;
        this.y = 150;
        this.initialY = 150;
        this.width = 200;
        this.height = 200;
        this.health = 100;
        this.maxHealth = 100;
        this.bobAngle = 0;
        this.isVulnerable = false;
        this.phaseTwoTriggered = false;
        this.attackCooldown = 2;
        this.attackCooldownMax = 2.5;
        this.healthPacksSpawnedInBattle = 0;
        this.dashTimer = BOSS_DASH_COOLDOWN;
        this.lastScrollOffsetForDash = 0;
        this.isDashing = false;
        this.dashPhase = 'none';
        this.windUpTimer = 0;
        this.returnX = 0;
        this.returnY = 0;
        this.velocityX = 0;
        this.velocityY = 0;
    }

    update(deltaTime, scrollOffset, player) {
        if (!this.isDashing) {
            this.bobAngle += 1.2 * deltaTime;
            this.y = this.initialY + Math.sin(this.bobAngle) * 20;
            if (scrollOffset > this.lastScrollOffsetForDash) {
                this.dashTimer = BOSS_DASH_COOLDOWN;
                this.lastScrollOffsetForDash = scrollOffset;
            } else {
                this.dashTimer -= deltaTime;
            }
            if (this.dashTimer <= 0) {
                this.isDashing = true;
                this.dashPhase = 'winding_up';
                this.windUpTimer = 0.5;
                this.returnX = this.x; 
                this.returnY = this.y;
            }
            if (this.attackCooldown > 0) {
                this.attackCooldown -= deltaTime;
            } else {
                const attackTypeRoll = Math.random();
                let type, minionSpeed;
                if (attackTypeRoll < REBOUND_ENEMY_CHANCE) { type = 'rebound'; minionSpeed = BOSS_MINION_REBOUND_SPEED; }
                else if (attackTypeRoll < REBOUND_ENEMY_CHANCE + HOMING_ENEMY_CHANCE) { type = 'homing'; minionSpeed = BOSS_MINION_HOMING_SPEED; }
                else { type = 'straight'; minionSpeed = BOSS_MINION_STRAIGHT_SPEED; }
                projectileIndicators.push({ 
                    x: this.x, y: Math.random() * (canvas.height - 150) + 50, 
                    lifespan: PROJECTILE_INDICATOR_DURATION, initialLifespan: PROJECTILE_INDICATOR_DURATION, 
                    projectileType: type, projectileSpeed: minionSpeed 
                });
                this.attackCooldown = this.attackCooldownMax;
            }
        } else {
            switch(this.dashPhase) {
                case 'winding_up':
                    this.x -= 150 * deltaTime;
                    this.windUpTimer -= deltaTime;
                    if (this.windUpTimer <= 0) {
                        this.dashPhase = 'dashing';
                        const targetX = player.x - scrollOffset + (player.width / 2);
                        const targetY = player.y + (player.height / 2);
                        const currentBossX = this.x + (this.width / 2);
                        const currentBossY = this.y + (this.height / 2);
                        const dx = targetX - currentBossX;
                        const dy = targetY - currentBossY;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        this.velocityX = (dx / distance) * BOSS_DASH_SPEED;
                        this.velocityY = (dy / distance) * BOSS_DASH_SPEED;
                    }
                    break;
                case 'dashing':
                    this.x += this.velocityX * deltaTime;
                    this.y += this.velocityY * deltaTime;
                    if (this.x > canvas.width || this.x < -this.width || this.y < -this.height) {
                        this.dashPhase = 'returning';
                    }
                    break;
                case 'returning':
                    const dx = this.returnX - this.x;
                    const dy = this.returnY - this.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 20) {
                        this.isDashing = false;
                        this.dashPhase = 'none';
                        this.dashTimer = BOSS_DASH_COOLDOWN;
                    } else {
                        this.x += (dx / dist) * BOSS_DASH_SPEED * 1.2 * deltaTime;
                        this.y += (dy / dist) * BOSS_DASH_SPEED * 1.2 * deltaTime;
                    }
                    break;
            }
        }
        if (this.health <= this.maxHealth / 2 && !this.phaseTwoTriggered) {
            this.phaseTwoTriggered = true;
            platforms.forEach(p => { p.type = 'falling'; });
        }
    }

    draw(ctx) {
        const bossX = this.x;
        const bossY = this.y;

        const bossGrad = ctx.createRadialGradient(bossX + this.width/2, bossY + this.height/2, 20, bossX + this.width/2, bossY + this.height/2, this.width);
        bossGrad.addColorStop(0, '#5f27cd');
        bossGrad.addColorStop(1, '#3d1a4d');
        ctx.fillStyle = bossGrad; 
        ctx.beginPath(); 
        ctx.moveTo(bossX + this.width / 2, bossY); 
        ctx.lineTo(bossX + this.width, bossY + this.height / 2); 
        ctx.lineTo(bossX + this.width / 2, bossY + this.height); 
        ctx.lineTo(bossX, bossY + this.height / 2); 
        ctx.closePath(); 
        ctx.fill(); 
        
        ctx.strokeStyle = '#3d1a4d';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        const centerX = bossX + this.width / 2; 
        const centerY = bossY + this.height / 2; 
        const eyeSize = 40; 
        const eyeGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, eyeSize);
        let eyeStrokeColor;
        
        if(this.isVulnerable) {
            eyeGrad.addColorStop(0, '#feca57');
            eyeGrad.addColorStop(1, '#f1c40f');
            eyeStrokeColor = '#f1c40f';
        } else {
            eyeGrad.addColorStop(0, '#ff6b6b');
            eyeGrad.addColorStop(1, '#e74c3c');
            eyeStrokeColor = '#e74c3c';
        }
        ctx.fillStyle = eyeGrad; 
        ctx.beginPath(); 
        ctx.moveTo(centerX, centerY - eyeSize); 
        ctx.lineTo(centerX + eyeSize, centerY); 
        ctx.lineTo(centerX, centerY + eyeSize); 
        ctx.lineTo(centerX - eyeSize, centerY); 
        ctx.closePath(); 
        ctx.fill(); 

        ctx.strokeStyle = eyeStrokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (debugMode) {
            ctx.strokeStyle = 'pink';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(bossX + this.width / 2, bossY);
            ctx.lineTo(bossX + this.width, bossY + this.height / 2);
            ctx.lineTo(bossX + this.width / 2, bossY + this.height);
            ctx.lineTo(bossX, bossY + this.height / 2);
            ctx.closePath();
            ctx.stroke();
        }
    }
}


class FinalBoss {
    constructor(startY) {
        this.y = startY;
        this.bobAngle = 0;
        this.flameAngle = 0; 
        
        this.health = FINAL_BOSS_HEALTH;
        this.maxHealth = FINAL_BOSS_HEALTH;
        this.isInvincible = false;
        this.invincibilityTimer = 0;
        
        this.attackState = 'idle'; 
        this.attackTimer = 2.0;
        this.attackSubTimer = 0;
        
        this.slashCount = 0;
        this.lastSlashSide = 'right';
        this.activeArm = null;

        this.isInRageMode = false;
        this.rageBobSpeedMultiplier = 1.0;
        this.rageFlameSpeedMultiplier = 1.0;
        this.comboHitCount = 0;
        this.healthPacksSpawnedInBattle = 0;
        
        this.rageLightingAlpha = 0;
        this.rageLightingFadeInDuration = 1.5;
        
        this.attackPool = ['slash_simple', 'slash_simple', 'slash_double'];
        this.rageAttackPool = ['slash_simple', 'slash_double', 'combo_slash', 'combo_slash', 'laser_beam'];

        this.glowState = 'idle';
        this.glowTimer = 2.0 + Math.random() * 2;
        this.glowProgress = 0;
        this.glowChargeDuration = 0.4;
        this.glowFadeDuration = 0.8;
        
        this.laserAngle = 0;

        this.arms = [
            { 
                side: 'left', 
                animationAngle: Math.random() * Math.PI * 2,
                animationSpeed: 1.8 + Math.random() * 0.5,
                targetShoulderAngle: -Math.PI * 0.6,
                currentShoulderAngle: -Math.PI * 0.6,
                targetElbowAngle: Math.PI * 0.4,
                currentElbowAngle: Math.PI * 0.4,
                breathingAmplitude: 1.0 
            },
            { 
                side: 'right', 
                animationAngle: Math.random() * Math.PI * 2,
                animationSpeed: 1.8 + Math.random() * 0.5,
                targetShoulderAngle: -Math.PI * 0.4,
                currentShoulderAngle: -Math.PI * 0.4,
                targetElbowAngle: -Math.PI * 0.4,
                currentElbowAngle: -Math.PI * 0.4,
                breathingAmplitude: 1.0 
            }
        ];
    }

    update(deltaTime, player, verticalScrollOffset) {
        const particlesToCreate = []; 
        let events = { shake: false }; 

        if (this.isInvincible) {
            this.invincibilityTimer -= deltaTime;
            if (this.invincibilityTimer <= 0) {
                this.isInvincible = false;
            }
        }
        
        this.bobAngle += 1.5 * deltaTime * this.rageBobSpeedMultiplier;
        this.flameAngle += 6 * deltaTime * this.rageFlameSpeedMultiplier; 
        
        if (this.attackState === 'rage_transition') {
            this.rageLightingAlpha += deltaTime / this.rageLightingFadeInDuration;
            if (this.rageLightingAlpha >= 1) {
                this.rageLightingAlpha = 1;
                this.attackState = 'idle';
                this.attackTimer = 1.0; 
            }
        }

        this.attackTimer -= deltaTime;
        if (this.attackTimer <= 0 && this.attackState === 'idle') {
            
            if (this.slashCount >= 4) {
                this.attackState = 'grabbing';
                this.attackSubTimer = 0.5;
                this.arms[0].targetShoulderAngle = -Math.PI * 0.8;
                this.arms[0].targetElbowAngle = Math.PI * 0.7;
                this.arms[1].targetShoulderAngle = -Math.PI * 0.2;
                this.arms[1].targetElbowAngle = -Math.PI * 0.7;
            } else {
                const currentPool = this.isInRageMode ? this.rageAttackPool : this.attackPool;
                const nextAttack = currentPool[Math.floor(Math.random() * currentPool.length)];

                switch(nextAttack) {
                    case 'slash_simple':
                        this.attackState = 'slash_telegraph';
                        this.attackSubTimer = FINAL_BOSS_SLASH_TELEGRAPH_TIME;
                        const sideToAttack = this.lastSlashSide === 'left' ? 'right' : 'left';
                        this.activeArm = this.arms.find(arm => arm.side === sideToAttack);
                        this.lastSlashSide = sideToAttack;
                        if (sideToAttack === 'left') {
                            this.activeArm.targetShoulderAngle = -Math.PI * 0.9;
                            this.activeArm.targetElbowAngle = Math.PI * 0.1;
                        } else {
                            this.activeArm.targetShoulderAngle = -Math.PI * 0.1;
                            this.activeArm.targetElbowAngle = -Math.PI * 0.1;
                        }
                        break;
                    case 'slash_double':
                        this.attackState = 'double_slash_telegraph';
                        this.attackSubTimer = FINAL_BOSS_SLASH_TELEGRAPH_TIME;
                        this.arms[0].targetShoulderAngle = -Math.PI * 0.9;
                        this.arms[0].targetElbowAngle = Math.PI * 0.1;
                        this.arms[1].targetShoulderAngle = -Math.PI * 0.1;
                        this.arms[1].targetElbowAngle = -Math.PI * 0.1;
                        break;
                    case 'combo_slash':
                        this.attackState = 'combo_slash_telegraph';
                        this.comboHitCount = 0; 
                        this.attackSubTimer = FINAL_BOSS_SLASH_TELEGRAPH_TIME * 0.4;
                        this.activeArm = this.arms.find(arm => arm.side === 'left');
                        this.activeArm.targetShoulderAngle = -Math.PI * 0.9;
                        this.activeArm.targetElbowAngle = Math.PI * 0.1;
                        break;
                    case 'laser_beam':
                        this.attackState = 'laser_charge';
                        this.attackSubTimer = FINAL_BOSS_LASER_CHARGE_TIME;
                        const playerCenter = {
                            x: player.x + player.width / 2,
                            y: (player.y - verticalScrollOffset) + player.height / 2
                        };
                        const eyePos = this.getBodyHitboxes(verticalScrollOffset)[0];
                        this.laserAngle = Math.atan2(playerCenter.y - eyePos.y, playerCenter.x - eyePos.x);
                        break;
                }
            }
        }
        
        // --- LÓGICA DE ESTADOS DE ATAQUE (Existente) ---
        if (this.attackState === 'grabbing') {
            this.attackSubTimer -= deltaTime;
            if (this.attackSubTimer <= 0) {
                this.attackState = 'shaking';
                this.attackSubTimer = FINAL_BOSS_SHAKE_DURATION;
                events.shake = true; 
            }
        } else if (this.attackState === 'shaking') {
            this.attackSubTimer -= deltaTime;
            if (this.attackSubTimer <= 0) {
                this.attackState = 'releasing';
                this.attackSubTimer = 0.5; 
                this.arms.forEach(arm => {
                    arm.targetShoulderAngle = (arm.side === 'left') ? -Math.PI * 0.6 : -Math.PI * 0.4;
                    arm.targetElbowAngle = (arm.side === 'left') ? Math.PI * 0.4 : -Math.PI * 0.4;
                });
            }
        } else if (this.attackState === 'releasing') {
             this.attackSubTimer -= deltaTime;
             if (this.attackSubTimer <= 0) {
                this.attackState = 'idle';
                this.attackTimer = FINAL_BOSS_SHAKE_ATTACK_COOLDOWN; 
                this.slashCount = 0;
             }
        }
        else if (this.attackState === 'slash_telegraph') {
            this.attackSubTimer -= deltaTime;
            if (this.attackSubTimer <= 0) {
                this.attackState = 'slashing';
                this.attackSubTimer = FINAL_BOSS_SLASH_EXTEND_TIME;
                if (this.activeArm.side === 'left') {
                    this.activeArm.targetShoulderAngle = -Math.PI * 0.1;
                } else {
                    this.activeArm.targetShoulderAngle = -Math.PI * 0.9;
                }
            }
        } else if (this.attackState === 'slashing') {
            this.attackSubTimer -= deltaTime;
            if (this.attackSubTimer <= 0) {
                this.attackState = 'slash_retract';
                this.attackSubTimer = FINAL_BOSS_SLASH_RETRACT_TIME;
                this.activeArm = null; 
                this.arms.forEach(arm => {
                    arm.targetShoulderAngle = (arm.side === 'left') ? -Math.PI * 0.6 : -Math.PI * 0.4;
                    arm.targetElbowAngle = (arm.side === 'left') ? Math.PI * 0.4 : -Math.PI * 0.4;
                });
            }
        } else if (this.attackState === 'slash_retract') {
            this.attackSubTimer -= deltaTime;
            if (this.attackSubTimer <= 0) {
                this.attackState = 'idle';
                this.slashCount++;
                this.attackTimer = FINAL_BOSS_SLASH_COOLDOWN;
            }
        }
        else if (this.attackState === 'double_slash_telegraph') {
            this.attackSubTimer -= deltaTime;
            if (this.attackSubTimer <= 0) {
                this.attackState = 'double_slashing';
                this.attackSubTimer = FINAL_BOSS_SLASH_EXTEND_TIME;
                this.arms[0].targetShoulderAngle = -Math.PI * 0.1;
                this.arms[1].targetShoulderAngle = -Math.PI * 0.9;
            }
        } else if (this.attackState === 'double_slashing') {
            this.attackSubTimer -= deltaTime;
            if (this.attackSubTimer <= 0) {
                this.attackState = 'double_slash_retract';
                this.attackSubTimer = FINAL_BOSS_SLASH_RETRACT_TIME;
                this.arms.forEach(arm => {
                    arm.targetShoulderAngle = (arm.side === 'left') ? -Math.PI * 0.6 : -Math.PI * 0.4;
                    arm.targetElbowAngle = (arm.side === 'left') ? Math.PI * 0.4 : -Math.PI * 0.4;
                });
            }
        } else if (this.attackState === 'double_slash_retract') {
            this.attackSubTimer -= deltaTime;
            if (this.attackSubTimer <= 0) {
                this.attackState = 'idle';
                this.slashCount++; 
                this.attackTimer = FINAL_BOSS_SLASH_COOLDOWN;
            }
        }
        else if (this.attackState === 'combo_slash_telegraph') {
            this.attackSubTimer -= deltaTime;
            if (this.attackSubTimer <= 0) {
                this.attackState = 'combo_slashing';
                this.attackSubTimer = FINAL_BOSS_SLASH_EXTEND_TIME * 0.4;
                if (this.comboHitCount === 2) { 
                    this.arms[0].targetShoulderAngle = Math.PI * 0.2;
                    this.arms[0].targetElbowAngle = Math.PI * 0.1;
                    this.arms[1].targetShoulderAngle = -Math.PI * 1.2;
                    this.arms[1].targetElbowAngle = -Math.PI * 0.1;
                } else {
                    if (this.activeArm.side === 'left') {
                        this.activeArm.targetShoulderAngle = Math.PI * 0.2;
                        this.activeArm.targetElbowAngle = Math.PI * 0.1;
                    } else {
                        this.activeArm.targetShoulderAngle = -Math.PI * 1.2;
                        this.activeArm.targetElbowAngle = -Math.PI * 0.1;
                    }
                }
            }
        } else if (this.attackState === 'combo_slashing') {
            this.attackSubTimer -= deltaTime;
            if (this.attackSubTimer <= 0) {
                this.attackState = 'combo_slash_retract';
                this.attackSubTimer = FINAL_BOSS_SLASH_RETRACT_TIME * 0.5;
                this.activeArm = null; 
                this.arms.forEach(arm => {
                    arm.targetShoulderAngle = (arm.side === 'left') ? -Math.PI * 0.6 : -Math.PI * 0.4;
                    arm.targetElbowAngle = (arm.side === 'left') ? Math.PI * 0.4 : -Math.PI * 0.4;
                });
            }
        } else if (this.attackState === 'combo_slash_retract') {
            this.attackSubTimer -= deltaTime;
            if (this.attackSubTimer <= 0) {
                this.comboHitCount++;
                if (this.comboHitCount >= 3) {
                    this.attackState = 'idle';
                    this.slashCount++; 
                    this.attackTimer = FINAL_BOSS_POST_COMBO_COOLDOWN;
                } else {
                    this.attackState = 'combo_slash_telegraph';
                    this.attackSubTimer = FINAL_BOSS_COMBO_COOLDOWN; 
                    if (this.comboHitCount === 1) { 
                        this.activeArm = this.arms.find(arm => arm.side === 'right');
                        this.activeArm.targetShoulderAngle = -Math.PI * 0.1;
                        this.activeArm.targetElbowAngle = -Math.PI * 0.1;
                    } else { 
                        this.activeArm = null;
                        this.arms[0].targetShoulderAngle = -Math.PI * 0.9;
                        this.arms[0].targetElbowAngle = Math.PI * 0.1;
                        this.arms[1].targetShoulderAngle = -Math.PI * 0.1;
                        this.arms[1].targetElbowAngle = -Math.PI * 0.1;
                    }
                }
            }
        }
        else if (this.attackState === 'laser_charge') {
            this.attackSubTimer -= deltaTime;
            if (this.attackSubTimer <= 0) {
                this.attackState = 'laser_active';
                this.attackSubTimer = FINAL_BOSS_LASER_ACTIVE_TIME;
            }
        } else if (this.attackState === 'laser_active') {
            this.attackSubTimer -= deltaTime;
            const playerCenter = { x: player.x + player.width / 2, y: (player.y - verticalScrollOffset) + player.height / 2 };
            const eyePos = this.getBodyHitboxes(verticalScrollOffset)[0];
            const targetAngle = Math.atan2(playerCenter.y - eyePos.y, playerCenter.x - eyePos.x);

            let angleDiff = targetAngle - this.laserAngle;
            while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
            while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
            
            this.laserAngle += angleDiff * FINAL_BOSS_LASER_ROTATION_SPEED * deltaTime;
            
            for(let i = 0; i < 2; i++) {
                const angle = this.laserAngle + (Math.random() - 0.5) * 0.5;
                particlesToCreate.push({
                    x: eyePos.x, y: eyePos.y,
                    size: Math.random() * 2 + 1,
                    color: Math.random() < 0.5 ? '#f1c40f' : 'rgba(255, 255, 255, 0.7)',
                    lifespan: 0.2 + Math.random() * 0.2,
                    initialLifespan: 0.4,
                    vx: -Math.cos(angle) * (Math.random() * 100 + 50),
                    vy: -Math.sin(angle) * (Math.random() * 100 + 50),
                    isScreenSpace: true
                });
            }

            if (this.attackSubTimer <= 0) {
                this.attackState = 'idle';
                this.slashCount++;
                this.attackTimer = FINAL_BOSS_SLASH_COOLDOWN;
            }
        }

        // <<< INÍCIO DA MODIFICAÇÃO >>>
        this.arms.forEach(arm => {
            arm.animationAngle += arm.animationSpeed * deltaTime;
            
            const lerpFactor = 5 * deltaTime;
            arm.currentShoulderAngle += (arm.targetShoulderAngle - arm.currentShoulderAngle) * lerpFactor;
            arm.currentElbowAngle += (arm.targetElbowAngle - arm.currentElbowAngle) * lerpFactor;
            
            const isAttacking = this.attackState.includes('grabbing') || 
                                this.attackState.includes('shaking') || 
                                this.attackState.includes('slash') ||
                                this.attackState.includes('laser');

            if (isAttacking) {
                arm.breathingAmplitude = Math.max(0, arm.breathingAmplitude - deltaTime * 4);
            } else {
                arm.breathingAmplitude = Math.min(1, arm.breathingAmplitude + deltaTime * 4);
            }
        });
        // <<< FIM DA MODIFICAÇÃO >>>

        if (this.glowState === 'idle') {
            this.glowTimer -= deltaTime;
            if (this.glowTimer <= 0) {
                this.glowState = 'charging';
                this.glowProgress = 0;
                this.glowTimer = 3.0 + Math.random() * 4.0; 
            }
        } else if (this.glowState === 'charging') {
            this.glowProgress += deltaTime / this.glowChargeDuration;
            if (this.glowProgress >= 1) {
                this.glowProgress = 1;
                this.glowState = 'fading';
            }
        } else if (this.glowState === 'fading') {
            this.glowProgress -= deltaTime / this.glowFadeDuration;
            if (this.glowProgress <= 0) {
                this.glowProgress = 0;
                this.glowState = 'idle';
            }
        }

        const anchorPos = verticalScrollOffset + canvas.height - FINAL_BOSS_VERTICAL_OFFSET;
        const naturalRisePos = this.y - FINAL_BOSS_RISE_SPEED * deltaTime;
        this.y = Math.min(naturalRisePos, anchorPos);
        
        events.particles = particlesToCreate;
        return events;
    }

    takeDamage(amount) {
        if (this.isInvincible) return;

        this.health -= amount;
        this.isInvincible = true;
        this.invincibilityTimer = 0.5; 
        playSound(sounds.damage);

        if (this.health <= this.maxHealth / 2 && !this.isInRageMode) {
            this.enterRageMode();
        }
    }

    enterRageMode() {
        this.isInRageMode = true;
        this.rageBobSpeedMultiplier = 1.5;
        this.rageFlameSpeedMultiplier = 1.6;
        screenShakeTimer = 1.0; 
        
        this.slashCount = 0;

        bossDebris = []; 
        if (player) {
            player.heldDebris = null;
        }

        this.attackState = 'rage_transition';
    }
    
    getArmHitboxes(verticalScrollOffset) {
        const screenY = this.y - verticalScrollOffset;
        const bobOffset = Math.sin(this.bobAngle) * 10;
        const bossY = screenY + bobOffset;
        const shoulderY = bossY;
        const towerWidth = canvas.width * 0.6;
        const towerX = (canvas.width - towerWidth) / 2;
        
        const leftShoulderX = towerX;
        const rightShoulderX = towerX + towerWidth;

        const hitboxes = [];

        this.arms.forEach(arm => {
            const shoulderPos = { 
                x: (arm.side === 'left') ? leftShoulderX : rightShoulderX,
                y: shoulderY
            };

            const upperArmLength = 180;
            const forearmLength = 150;
            const armWidth = 40;
            
            const shoulderAngle = arm.currentShoulderAngle + Math.sin(arm.animationAngle) * (((arm.side === 'left') ? 0.2 : -0.2) * arm.breathingAmplitude);
            const elbowAngle = arm.currentElbowAngle + Math.cos(arm.animationAngle) * (0.2 * arm.breathingAmplitude);

            const elbowPos = {
                x: shoulderPos.x + Math.cos(shoulderAngle) * upperArmLength,
                y: shoulderPos.y + Math.sin(shoulderAngle) * upperArmLength
            };

            const hookPos = {
                x: elbowPos.x + Math.cos(shoulderAngle + elbowAngle) * forearmLength,
                y: elbowPos.y + Math.sin(shoulderAngle + elbowAngle) * forearmLength
            };

            const createRotatedRect = (start, end, width) => {
                const angle = Math.atan2(end.y - start.y, end.x - start.x);
                const perpAngle = angle + Math.PI / 2;
                const halfWidth = width / 2;
                const perpX = Math.cos(perpAngle) * halfWidth;
                const perpY = Math.sin(perpAngle) * halfWidth;

                return [
                    { x: start.x + perpX, y: start.y + perpY },
                    { x: end.x + perpX, y: end.y + perpY },
                    { x: end.x - perpX, y: end.y - perpY },
                    { x: start.x - perpX, y: start.y - perpY }
                ];
            };
            
            const upperArmPolygon = createRotatedRect(shoulderPos, elbowPos, armWidth);
            const forearmPolygon = createRotatedRect(elbowPos, hookPos, armWidth);

            const hookLines = [];
            const hookAngle = shoulderAngle + elbowAngle + Math.PI / 2;
            const cosHook = Math.cos(hookAngle);
            const sinHook = Math.sin(hookAngle);
            
            const p1x = hookPos.x + (20 * cosHook - 40 * sinHook);
            const p1y = hookPos.y + (20 * sinHook + 40 * cosHook);
            hookLines.push({ x1: hookPos.x, y1: hookPos.y, x2: p1x, y2: p1y });
            
            const p2x = hookPos.x + (-20 * cosHook - 40 * sinHook);
            const p2y = hookPos.y + (-20 * sinHook + 40 * cosHook);
            hookLines.push({ x1: hookPos.x, y1: hookPos.y, x2: p2x, y2: p2y });

            hitboxes.push({
                side: arm.side,
                hook: { lines: hookLines },
                upperArm: upperArmPolygon,
                forearm: forearmPolygon
            });
        });

        return hitboxes;
    }

    getLaserHitbox(verticalScrollOffset) {
        if (this.attackState !== 'laser_active') return null;

        const eyePos = this.getBodyHitboxes(verticalScrollOffset)[0];
        return {
            type: 'line',
            x1: eyePos.x,
            y1: eyePos.y,
            x2: eyePos.x + Math.cos(this.laserAngle) * (canvas.width * 1.5),
            y2: eyePos.y + Math.sin(this.laserAngle) * (canvas.width * 1.5)
        };
    }
    
    getBodyHitboxes(verticalScrollOffset) {
        const screenY = this.y - verticalScrollOffset;
        const bobOffset = Math.sin(this.bobAngle) * 10;
        const bossY = screenY + bobOffset;

        const headWidth = 180;
        const headHeight = 140;
        const headX = canvas.width / 2 - headWidth / 2;
        const headY = bossY - headHeight + 30;
        
        const torsoHeight = 140;
        const shoulderY = bossY;
        
        const torsoHitbox = {
            type: 'rect',
            x: headX, 
            y: shoulderY,
            width: headWidth,
            height: torsoHeight
        };
        
        const headHitbox = {
            type: 'circle',
            x: headX + headWidth/2,
            y: headY + 60,
            radius: 35
        };
        
        const towerWidth = canvas.width * 0.6;
        const towerX = (canvas.width - towerWidth) / 2;
        const leftShoulderX = towerX;
        const rightShoulderX = towerX + towerWidth;
        const waistLX = canvas.width / 2 - 80 / 2;
        const waistY = shoulderY + torsoHeight;

        const leftVeeLine = {
            type: 'line',
            x1: leftShoulderX, y1: shoulderY,
            x2: waistLX, y2: waistY - 20
        };
        const rightVeeLine = {
            type: 'line',
            x1: rightShoulderX, y1: shoulderY,
            x2: waistLX + 80, y2: waistY - 20
        };

        return [headHitbox, torsoHitbox, leftVeeLine, rightVeeLine];
    }
    
    draw(ctx, verticalScrollOffset) {
        if (this.isInvincible && Math.floor(this.invincibilityTimer * 20) % 2 === 0) {
            return; 
        }

        let bodyShakeX = 0;
        if (this.attackState === 'shaking') {
            bodyShakeX = (Math.random() - 0.5) * (SCREEN_SHAKE_MAGNITUDE * 0.7);
        }

        const towerWidth = canvas.width * 0.6;
        const towerX = (canvas.width - towerWidth) / 2;

        const screenY = this.y - verticalScrollOffset;
        const bobOffset = Math.sin(this.bobAngle) * 10;
        const bossY = screenY + bobOffset;

        const headWidth = 180;
        const headHeight = 140;
        const headX = canvas.width / 2 - headWidth / 2 + bodyShakeX;
        const headY = bossY - headHeight + 30; 
        
        const leftShoulderX = towerX + bodyShakeX;
        const rightShoulderX = towerX + towerWidth + bodyShakeX;
        const shoulderY = bossY;
        
        const torsoHeight = 140;
        const torsoWaistWidth = 80;
        const waistLX = canvas.width / 2 - torsoWaistWidth / 2 + bodyShakeX;
        const waistRX = canvas.width / 2 + torsoWaistWidth / 2 + bodyShakeX;
        const waistY = shoulderY + torsoHeight;

        const lightGrayColor = '#d3d3d3'; 
        const eyeRadius = 35; 
        const orbX = canvas.width / 2 + bodyShakeX;
        const orbY = shoulderY + 65;

        const flameHeight = 40 + Math.sin(this.flameAngle) * 10;
        const flameSway = Math.cos(this.flameAngle * 0.5) * 15;
        const flameGrad = ctx.createLinearGradient(0, waistY, 0, waistY + flameHeight);
        flameGrad.addColorStop(0, 'rgba(243, 156, 18, 0.9)'); 
        flameGrad.addColorStop(0.5, 'rgba(230, 126, 34, 0.6)'); 
        flameGrad.addColorStop(1, 'rgba(230, 126, 34, 0)');
        ctx.fillStyle = flameGrad;

        ctx.beginPath();
        ctx.moveTo(waistLX, waistY - 20);
        ctx.quadraticCurveTo(canvas.width / 2 + flameSway + bodyShakeX, waistY + flameHeight, waistRX, waistY - 20);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = lightGrayColor; 
        ctx.strokeStyle = '#2c3e50'; 
        ctx.lineWidth = 4;
        
        ctx.beginPath();
        ctx.moveTo(leftShoulderX, shoulderY); 
        ctx.quadraticCurveTo(canvas.width / 2 - 150 + bodyShakeX, shoulderY + 70, waistLX, waistY - 20);
        ctx.quadraticCurveTo(canvas.width / 2 + bodyShakeX, waistY + 20, waistRX, waistY - 20);
        ctx.quadraticCurveTo(canvas.width / 2 + 150 + bodyShakeX, shoulderY + 70, rightShoulderX, shoulderY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke(); 
        
        const orbGrad = ctx.createRadialGradient(orbX, orbY, 5, orbX, orbY, eyeRadius);
        orbGrad.addColorStop(0, '#f1c40f');
        orbGrad.addColorStop(1, '#e67e22');
        ctx.fillStyle = orbGrad;

        ctx.beginPath();
        ctx.arc(orbX, orbY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#c0392b'; 
        ctx.lineWidth = 3;
        ctx.stroke(); 
        
        if (this.attackState === 'laser_charge' || this.attackState === 'laser_active') {
            const eyePos = this.getBodyHitboxes(verticalScrollOffset)[0];
            const laserEndX = eyePos.x + Math.cos(this.laserAngle) * (canvas.width * 1.5);
            const laserEndY = eyePos.y + Math.sin(this.laserAngle) * (canvas.width * 1.5);
            
            if (this.attackState === 'laser_charge') {
                ctx.strokeStyle = 'rgba(255, 100, 100, 0.5)';
                ctx.lineWidth = FINAL_BOSS_LASER_WIDTH_TELEGRAPH;
                ctx.beginPath();
                ctx.moveTo(eyePos.x, eyePos.y);
                ctx.lineTo(laserEndX, laserEndY);
                ctx.stroke();
            } else { 
                ctx.strokeStyle = 'rgba(230, 126, 34, 0.5)';
                ctx.lineWidth = FINAL_BOSS_LASER_WIDTH_ACTIVE;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(eyePos.x, eyePos.y);
                ctx.lineTo(laserEndX, laserEndY);
                ctx.stroke();
                
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.lineWidth = FINAL_BOSS_LASER_WIDTH_ACTIVE * 0.5;
                ctx.beginPath();
                ctx.moveTo(eyePos.x, eyePos.y);
                ctx.lineTo(laserEndX, laserEndY);
                ctx.stroke();
                
                ctx.lineCap = 'butt';
            }
        }
        
        this.arms.forEach(arm => {
            const armShoulderX = (arm.side === 'left') ? leftShoulderX : rightShoulderX;
            
            const upperArmLength = 180;
            const armWidth = 40;
            const forearmLength = 150;
            
            const shoulderAngle = arm.currentShoulderAngle + Math.sin(arm.animationAngle) * (((arm.side === 'left') ? 0.2 : -0.2) * arm.breathingAmplitude);
            const elbowAngle = arm.currentElbowAngle + Math.cos(arm.animationAngle) * (0.2 * arm.breathingAmplitude);
            
            const elbowPos = {
                x: armShoulderX + Math.cos(shoulderAngle) * upperArmLength,
                y: shoulderY + Math.sin(shoulderAngle) * upperArmLength
            };

            const hookPos = {
                x: elbowPos.x + Math.cos(shoulderAngle + elbowAngle) * forearmLength,
                y: elbowPos.y + Math.sin(shoulderAngle + elbowAngle) * forearmLength
            };

            ctx.fillStyle = lightGrayColor;
            ctx.strokeStyle = '#2c3e50'; 
            ctx.lineWidth = 4;

            ctx.save();
            ctx.translate(armShoulderX, shoulderY);
            ctx.rotate(shoulderAngle);
            ctx.beginPath();
            ctx.roundRect(0, -armWidth / 2, upperArmLength, armWidth, [armWidth/2]);
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            ctx.save();
            ctx.translate(elbowPos.x, elbowPos.y);
            ctx.rotate(shoulderAngle + elbowAngle);
            ctx.beginPath();
            ctx.roundRect(0, -armWidth / 2, forearmLength, armWidth, [armWidth/2]);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            
            ctx.fillStyle = '#34495e'; 
            ctx.beginPath();
            ctx.arc(armShoulderX, shoulderY, armWidth, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(elbowPos.x, elbowPos.y, armWidth * 0.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            ctx.save();
            ctx.translate(hookPos.x, hookPos.y);
            ctx.rotate(shoulderAngle + elbowAngle + Math.PI / 2); 
            ctx.lineWidth = 6;
            ctx.strokeStyle = '#c0392b'; 
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(30, 20, 20, 40);
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(-30, 20, -20, 40);
            ctx.stroke();
            ctx.restore();
        });

        ctx.fillStyle = lightGrayColor;
        ctx.strokeStyle = '#2c3e50'; 
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(headX, headY + headHeight);
        ctx.quadraticCurveTo(headX, headY, headX + headWidth / 2, headY);
        ctx.quadraticCurveTo(headX + headWidth, headY, headX + headWidth, headY + headHeight);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        const eyeGrad = ctx.createRadialGradient(headX + headWidth/2, headY + 60, 5, headX + headWidth/2, headY + 60, eyeRadius);
        eyeGrad.addColorStop(0, '#f1c40f');
        eyeGrad.addColorStop(1, '#e67e22');
        ctx.fillStyle = eyeGrad;
        ctx.beginPath();
        ctx.arc(headX + headWidth/2, headY + 60, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#c0392b'; 
        ctx.lineWidth = 3;
        ctx.stroke();

        if (this.glowState !== 'idle') {
            const glowAlpha = (this.glowState === 'charging') 
                ? this.glowProgress * 0.7 
                : this.glowProgress * 0.7;
            
            const radiusMultiplier = 1 + (this.glowState === 'charging' ? this.glowProgress * 0.5 : (1-this.glowProgress) * 0.5);

            const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, eyeRadius * radiusMultiplier);
            glowGrad.addColorStop(0, `rgba(255, 255, 224, ${glowAlpha})`); 
            glowGrad.addColorStop(1, `rgba(241, 196, 15, 0)`);
            
            ctx.fillStyle = glowGrad;

            ctx.beginPath();
            ctx.arc(headX + headWidth/2, headY + 60, eyeRadius * radiusMultiplier, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(orbX, orbY, eyeRadius * radiusMultiplier, 0, Math.PI * 2);
            ctx.fill();
        }

        if (debugMode) {
            ctx.strokeStyle = 'pink';
            ctx.lineWidth = 2;
            
            this.getBodyHitboxes(verticalScrollOffset).forEach(hitbox => {
                if (hitbox.type === 'rect') {
                    ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
                } else if (hitbox.type === 'circle') {
                    ctx.beginPath();
                    ctx.arc(hitbox.x, hitbox.y, hitbox.radius, 0, Math.PI * 2);
                    ctx.stroke();
                } else if (hitbox.type === 'line') {
                    ctx.beginPath();
                    ctx.moveTo(hitbox.x1, hitbox.y1);
                    ctx.lineTo(hitbox.x2, hitbox.y2);
                    ctx.stroke();
                }
            });

            this.getArmHitboxes(verticalScrollOffset).forEach(arm => {
                const drawPolygon = (polygon) => {
                    ctx.beginPath();
                    ctx.moveTo(polygon[0].x, polygon[0].y);
                    for (let i = 1; i < polygon.length; i++) {
                        ctx.lineTo(polygon[i].x, polygon[i].y);
                    }
                    ctx.closePath();
                    ctx.stroke();
                };
                drawPolygon(arm.upperArm);
                drawPolygon(arm.forearm);
                
                arm.hook.lines.forEach(line => {
                    ctx.beginPath();
                    ctx.moveTo(line.x1, line.y1);
                    ctx.lineTo(line.x2, line.y2);
                    ctx.stroke();
                });
            });

            const laserHitbox = this.getLaserHitbox(verticalScrollOffset);
            if (laserHitbox) {
                ctx.beginPath();
                ctx.moveTo(laserHitbox.x1, laserHitbox.y1);
                ctx.lineTo(laserHitbox.x2, laserHitbox.y2);
                ctx.stroke();
            }
        }
    }
}


class BossDebris {
    constructor(x, y, delay = 0, isPhasing = false) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.width = this.radius * 2;
        this.height = this.radius * 2;
        this.velocityY = 0;
        this.velocityX = 0; 
        this.state = 'falling';
        this.spawnDelay = delay;
        this.isPhasing = isPhasing; 

        this.throw_startX = 0;
        this.throw_startY = 0;
        this.throw_targetX = 0;
        this.throw_targetY = 0;
        this.throw_progress = 0;
        this.throw_duration = 0.4;

        this.details = [];
        const numDetails = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < numDetails; i++) {
            this.details.push({
                angle: Math.random() * Math.PI * 2,
                radius: this.radius * (0.4 + Math.random() * 0.5),
                arcLength: Math.PI * (0.2 + Math.random() * 0.3)
            });
        }
    }

    throwAt(targetX, targetY) {
        this.state = 'thrown';
        this.throw_startX = this.x;
        this.throw_startY = this.y;
        this.throw_targetX = targetX;
        this.throw_targetY = targetY;
        this.throw_progress = 0;
    }

    update(deltaTime, platforms) {
        if (this.spawnDelay > 0) {
            this.spawnDelay -= deltaTime;
            return;
        }

        if (this.state === 'falling') {
            this.velocityY += BOSS_DEBRIS_GRAVITY * deltaTime;
            this.y += this.velocityY * deltaTime;

            if (!this.isPhasing) {
                for (const p of platforms) {
                    if (p.visualType === 'cloud') continue;
                    
                    const pRect = { x: p.x, y: p.y, width: p.width, height: 1 };
                    const dRect = { x: this.x, y: this.y, width: this.width, height: this.height };

                    if (isColliding(dRect, pRect) && (this.y + this.height) < (p.y + 20)) {
                        this.y = p.y - this.height;
                        this.velocityY = 0;
                        this.state = 'landed';
                        playSound(sounds.land);
                        break;
                    }
                }
            }

        } else if (this.state === 'thrown') {
            this.throw_progress += deltaTime / this.throw_duration;
            const t = Math.min(1, this.throw_progress);
            this.x = this.throw_startX + (this.throw_targetX - this.throw_startX) * t;
            this.y = this.throw_startY + (this.throw_targetY - this.throw_startY) * t;
        }
    }

    draw(ctx, vOffset) {
        if (this.spawnDelay > 0) {
            return;
        }

        const screenX = this.x;
        const screenY = this.y - vOffset;

        const centerX = screenX + this.radius;
        const centerY = screenY + this.radius;
        
        let color1, color2, strokeColor, detailStrokeColor;

        if (this.isPhasing) {
            ctx.globalAlpha = 0.6;
            color1 = '#727879'; 
            color2 = '#5d6465'; 
            strokeColor = '#4e5455';
            detailStrokeColor = 'rgba(78, 84, 85, 0.7)';
        } else {
            color1 = '#95a5a6';
            color2 = '#7f8c8d';
            strokeColor = '#6c7a7b';
            detailStrokeColor = 'rgba(92, 102, 103, 0.7)';
        }

        const rockGrad = ctx.createRadialGradient(
            centerX - this.radius * 0.4, 
            centerY - this.radius * 0.4, 
            this.radius * 0.1, 
            centerX, 
            centerY, 
            this.radius
        );
        rockGrad.addColorStop(0, color1); 
        rockGrad.addColorStop(1, color2);
        ctx.fillStyle = rockGrad;

        ctx.beginPath();
        ctx.arc(centerX, centerY, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = detailStrokeColor;
        ctx.lineWidth = 1.5;
        this.details.forEach(detail => {
            ctx.beginPath();
            ctx.arc(centerX, centerY, detail.radius, detail.angle, detail.angle + detail.arcLength);
            ctx.stroke();
        });

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 1.0;

        if (debugMode) {
            ctx.strokeStyle = 'pink';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, this.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}