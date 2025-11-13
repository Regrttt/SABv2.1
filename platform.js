// platform.js

class Platform {
    constructor(x, y, width, type = 'stable', visualType = 'grass') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 40; 
        this.type = type; 
        this.visualType = visualType;
        this.obstacles = [];
        this.isFalling = false;
        this.fallSpeed = 0;
        // <<< INÍCIO DA ALTERAÇÃO >>>
        this.hasPatrolEnemy = false;
        // <<< FIM DA ALTERAÇÃO >>>
        
        this.hasWindowTrap = false; 
        this.windowType = null;
        this.windowState = 'active';

        this.hasChest = false;
        this.chestState = 'closed'; // 'closed', 'opening', 'open'
        this.chestType = null; // 'reward' ou 'trap'

        if (this.visualType === 'stone') {
            this.height = 25;
        } else if (this.visualType === 'cloud') {
            this.height = 25; 
            const model0 = [
                { offsetX: this.width * 0.5,  offsetY: this.height * 0.5, radiusX: this.width * 0.35, radiusY: this.width * 0.22 },
                { offsetX: this.width * 0.25, offsetY: this.height * 0.6, radiusX: this.width * 0.3,  radiusY: this.width * 0.18 },
                { offsetX: this.width * 0.75, offsetY: this.height * 0.6, radiusX: this.width * 0.3,  radiusY: this.width * 0.18 }
            ];
            const model1 = [
                { offsetX: this.width * 0.3, offsetY: this.height * 0.4, radiusX: this.width * 0.3, radiusY: this.width * 0.2 },
                { offsetX: this.width * 0.7, offsetY: this.height * 0.5, radiusX: this.width * 0.4, radiusY: this.width * 0.22 },
                { offsetX: this.width * 0.5, offsetY: this.height * 0.7, radiusX: this.width * 0.25, radiusY: this.width * 0.18 }
            ];
            const model2 = [
                { offsetX: this.width * 0.25, offsetY: this.height * 0.6, radiusX: this.width * 0.28, radiusY: this.width * 0.18 },
                { offsetX: this.width * 0.6, offsetY: this.height * 0.3, radiusX: this.width * 0.25, radiusY: this.width * 0.15 },
                { offsetX: this.width * 0.75, offsetY: this.height * 0.7, radiusX: this.width * 0.3, radiusY: this.width * 0.2 },
                { offsetX: this.width * 0.4, offsetY: this.height * 0.8, radiusX: this.width * 0.22, radiusY: this.width * 0.14 }
            ];
            const models = [model0, model1, model2];
            this.fogBlobs = models[Math.floor(Math.random() * models.length)];
        }
    }

    addObstacle(obstacle) {
        this.obstacles.push(obstacle);
    }

    update(deltaTime) {
        if (this.isFalling) {
            this.fallSpeed += FALLING_PLATFORM_ACCELERATION * deltaTime;
            this.y += this.fallSpeed;
        }
        if (this.chestState === 'opening' && this.chestAnimTimer > 0) {
            this.chestAnimTimer -= deltaTime;
            if (this.chestAnimTimer <= 0) {
                this.chestState = 'open';
            }
        }
    }

    draw(ctx, scrollOffset, verticalScrollOffset = 0, isVertical = false, player = null) {
        const platformX = this.x - (isVertical ? 0 : scrollOffset);
        const platformY = this.y - (isVertical ? verticalScrollOffset : 0);
        this.drawComplete(ctx, platformX, platformY, false, player, verticalScrollOffset);
    }

    drawBase(ctx, scrollOffset, verticalScrollOffset = 0, isVertical = false, player = null) {
        const platformX = this.x - (isVertical ? 0 : scrollOffset);
        const platformY = this.y - (isVertical ? verticalScrollOffset : 0);
        if (platformX + this.width < 0 || platformX > ctx.canvas.width || platformY + this.height < 0 || platformY > ctx.canvas.height) {
            return;
        }
        this.drawComplete(ctx, platformX, platformY, true, player, verticalScrollOffset); 
    }

    drawFog(ctx, platformX, platformY) {
        const fogGrad = ctx.createRadialGradient(platformX + this.width / 2, platformY, 0, platformX + this.width / 2, platformY, this.width * 0.9);
        fogGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        fogGrad.addColorStop(1, 'rgba(220, 220, 230, 0.7)');
        ctx.fillStyle = fogGrad;

        ctx.beginPath();
        if (this.fogBlobs.length > 0) {
            const firstBlob = this.fogBlobs[0];
            ctx.moveTo(platformX + firstBlob.offsetX, platformY + firstBlob.offsetY);
        }
        this.fogBlobs.forEach(blob => {
            const blobX = platformX + blob.offsetX;
            const blobY = platformY + blob.offsetY;
            ctx.ellipse(blobX, blobY, blob.radiusX, blob.radiusY, 0, 0, Math.PI * 2);
        });
        ctx.fill();
    }
    
    drawComplete(ctx, platformX, platformY, baseOnly = false, player = null, verticalScrollOffset = 0) {
        switch (this.visualType) {
            case 'grass':
                this.drawGrassPlatform(ctx, platformX, platformY);
                break;
            case 'stone':
                this.drawStonePlatform(ctx, platformX, platformY);
                break;
            case 'cloud':
                this.drawCloudPlatform(ctx, platformX, platformY, baseOnly);
                break;
        }

        if (debugMode) {
            ctx.strokeStyle = 'pink';
            ctx.lineWidth = 2;
            ctx.strokeRect(platformX, platformY, this.width, this.height);
        }

        this.drawDetails(ctx, platformX, platformY, player, verticalScrollOffset);
    }
    
    drawDetails(ctx, platformX, platformY, player, verticalScrollOffset) {
        const scrollOffset = this.x - platformX;
        const isVertical = (verticalScrollOffset > 0);
        
        if (this.hasChest) {
            const chestWidth = 50;
            const chestHeight = 40;
            const chestX = platformX + (this.width / 2) - (chestWidth / 2);
            const chestY = platformY - chestHeight;

            // Cores
            const woodDark = '#8C5A2B';
            const woodLight = '#A06B3E';
            const metalDark = '#5A5A5A';
            const metalLight = '#C0C0C0';
            const lockColor = '#FFD700';

            // --- Base do Baú ---
            ctx.fillStyle = woodDark;
            ctx.fillRect(chestX, chestY, chestWidth, chestHeight);
            
            ctx.fillStyle = woodLight;
            ctx.fillRect(chestX + 5, chestY + 5, chestWidth - 10, chestHeight - 10);

            // --- Tiras de Metal da Base ---
            ctx.fillStyle = metalDark;
            ctx.fillRect(chestX, chestY, 8, chestHeight); // Esquerda
            ctx.fillRect(chestX + chestWidth - 8, chestY, 8, chestHeight); // Direita
            ctx.fillRect(chestX, chestY + chestHeight - 8, chestWidth, 8); // Fundo

            // --- Tampa do Baú ---
            const lidHeight = 20;
            const lidY = chestY - lidHeight + 5; // Leve sobreposição
            const pivotX = chestX + chestWidth / 2;
            const pivotY = chestY;

            ctx.save();
            ctx.translate(pivotX, pivotY);

            let lidAngle = 0;
            if (this.chestState === 'opening') {
                const openProgress = 1 - (this.chestAnimTimer / 0.5); // 0.5s para abrir
                lidAngle = -openProgress * (Math.PI / 2.2);
            } else if (this.chestState === 'open') {
                lidAngle = -Math.PI / 2.2;
            }
            ctx.rotate(lidAngle);
            ctx.translate(-pivotX, -pivotY);

            // Desenho da Tampa
            ctx.fillStyle = woodDark;
            ctx.beginPath();
            ctx.moveTo(chestX - 2, chestY);
            ctx.lineTo(chestX - 2, chestY - lidHeight);
            ctx.quadraticCurveTo(chestX + chestWidth / 2, chestY - lidHeight - 10, chestX + chestWidth + 2, chestY - lidHeight);
            ctx.lineTo(chestX + chestWidth + 2, chestY);
            ctx.closePath();
            ctx.fill();

            // Tiras de Metal da Tampa
            ctx.fillStyle = metalDark;
            ctx.fillRect(chestX, chestY - lidHeight, 8, lidHeight);
            ctx.fillRect(chestX + chestWidth - 8, chestY - lidHeight, 8, lidHeight);

            ctx.restore();

            // --- Fechadura (sempre visível na base) ---
            if (this.chestState === 'closed') {
                ctx.fillStyle = lockColor;
                ctx.fillRect(chestX + chestWidth / 2 - 6, chestY + 10, 12, 10);
                ctx.fillStyle = 'black';
                ctx.fillRect(chestX + chestWidth / 2 - 2, chestY + 15, 4, 4);
            }
            
            if (debugMode) {
                ctx.strokeStyle = 'pink';
                ctx.lineWidth = 2;
                ctx.strokeRect(chestX, chestY, chestWidth, chestHeight);
            }
        }
        
        if (this.hasWindowTrap) {
            const windowWidth = 60;
            const windowHeight = 90;
            const windowX = platformX + (this.width / 2) - (windowWidth / 2);
            const windowY = platformY - windowHeight;
            const frameThickness = 12;

            ctx.fillStyle = 'black';
            const windowPath = new Path2D();
            windowPath.moveTo(windowX, windowY + windowHeight);
            windowPath.lineTo(windowX, windowY + windowWidth / 2);
            windowPath.arcTo(windowX, windowY, windowX + windowWidth / 2, windowY, windowWidth / 2);
            windowPath.arcTo(windowX + windowWidth, windowY, windowX + windowWidth, windowY + windowWidth / 2, windowWidth / 2);
            windowPath.lineTo(windowX + windowWidth, windowY + windowHeight);
            windowPath.closePath();
            ctx.fill(windowPath);

            if (this.windowState === 'closed') {
                const barGrad = ctx.createLinearGradient(windowX, windowY, windowX + windowWidth, windowY);
                barGrad.addColorStop(0, '#7f8c8d');
                barGrad.addColorStop(0.5, '#bdc3c7');
                barGrad.addColorStop(1, '#7f8c8d');
                
                ctx.fillStyle = barGrad;
                ctx.strokeStyle = '#2c3e50';
                ctx.lineWidth = 2;

                const barThickness = 8;
                const vBar1X = windowX + windowWidth / 3 - barThickness / 2;
                const vBar2X = windowX + (windowWidth / 3) * 2 - barThickness / 2;
                ctx.fillRect(vBar1X, windowY, barThickness, windowHeight);
                ctx.strokeRect(vBar1X, windowY, barThickness, windowHeight);
                ctx.fillRect(vBar2X, windowY, barThickness, windowHeight);
                ctx.strokeRect(vBar2X, windowY, barThickness, windowHeight);

                const hBar1Y = windowY + windowHeight / 3 - barThickness / 2;
                const hBar2Y = windowY + (windowHeight / 3) * 2 - barThickness / 2;
                ctx.fillRect(windowX, hBar1Y, windowWidth, barThickness);
                ctx.strokeRect(windowX, hBar1Y, windowWidth, barThickness);
                ctx.fillRect(windowX, hBar2Y, windowWidth, barThickness);
                ctx.strokeRect(windowX, hBar2Y, windowWidth, barThickness);
            }

            const stoneGrad = ctx.createLinearGradient(windowX, windowY, windowX + windowWidth, windowY);
            stoneGrad.addColorStop(0, '#6d6d6d');
            stoneGrad.addColorStop(0.5, '#9d9d9d');
            stoneGrad.addColorStop(1, '#6d6d6d');
            
            ctx.strokeStyle = '#3a3a3a';
            ctx.lineWidth = 1;
            ctx.fillStyle = stoneGrad;

            const drawFrameBlock = (x, y, w, h) => {
                ctx.fillRect(x, y, w, h);
                ctx.strokeRect(x, y, w, h);
            };
            
            drawFrameBlock(windowX - frameThickness, windowY + windowWidth / 2, frameThickness, windowHeight - windowWidth / 2);
            drawFrameBlock(windowX + windowWidth, windowY + windowWidth / 2, frameThickness, windowHeight - windowWidth / 2);
            
            const arcRadius = windowWidth / 2;
            const arcCenterX = windowX + arcRadius;
            for(let i = 0; i < 5; i++) {
                const angle = Math.PI + (i / 4 * Math.PI);
                const x1 = arcCenterX + Math.cos(angle) * arcRadius;
                const y1 = windowY + arcRadius + Math.sin(angle) * arcRadius;
                const x2 = arcCenterX + Math.cos(angle) * (arcRadius + frameThickness);
                const y2 = windowY + arcRadius + Math.sin(angle) * (arcRadius + frameThickness);
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }

            ctx.lineWidth = frameThickness + 1;
            ctx.strokeStyle = stoneGrad;
            ctx.beginPath();
            ctx.arc(arcCenterX, windowY + arcRadius, arcRadius, Math.PI, 0);
            ctx.stroke();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#3a3a3a';
            ctx.beginPath();
            ctx.arc(arcCenterX, windowY + arcRadius, arcRadius, Math.PI, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(arcCenterX, windowY + arcRadius, arcRadius + frameThickness, Math.PI, 0);
            ctx.stroke();

            if (player && player.captureState !== 'none' && player.capturedByPlatform === this) {
                if (isNaN(player.y) || isNaN(verticalScrollOffset) || isNaN(player.captureAnimProgress)) return;

                const handBaseX = windowX + windowWidth / 2;
                const handBaseY = windowY + windowHeight - frameThickness;

                let handTargetX, handTargetY, animProgress;
                
                if (player.captureState === 'reaching') {
                    animProgress = player.captureAnimProgress;
                    handTargetX = player.captureStartPos.x + player.width / 2;
                    handTargetY = player.captureStartPos.y + player.height / 2 - verticalScrollOffset;
                } else {
                    animProgress = 1.0;
                    handTargetX = player.x + player.width / 2;
                    handTargetY = player.y + player.height / 2 - verticalScrollOffset;
                }

                const currentHandX = handBaseX + (handTargetX - handBaseX) * animProgress;
                const currentHandY = handBaseY + (handTargetY - handBaseY) * animProgress;

                const controlX = handBaseX + (Math.sin(player.captureAnimProgress * Math.PI * 4)) * 40 * animProgress;
                const controlY = (handBaseY + currentHandY) / 2;

                const numSegments = 20;
                for (let i = 0; i <= numSegments; i++) {
                    const t = i / numSegments * animProgress;
                    if(t === 0) continue;
                    const t_inv = 1 - t;
                    
                    const currentX = t_inv*t_inv * handBaseX + 2*t_inv*t * controlX + t*t * handTargetX;
                    const currentY = t_inv*t_inv * handBaseY + 2*t_inv*t * controlY + t*t * handTargetY;

                    const radius = 10 * (1 - (i/numSegments)) + 2;
                    const segmentGrad = ctx.createLinearGradient(currentX - radius, currentY, currentX + radius, currentY);
                    segmentGrad.addColorStop(0, '#6c3a8d');
                    segmentGrad.addColorStop(0.5, '#a055d7');
                    segmentGrad.addColorStop(1, '#b57de8');

                    ctx.fillStyle = segmentGrad;
                    ctx.beginPath();
                    ctx.arc(currentX, currentY, radius, 0, Math.PI * 2);
                    ctx.fill();
                    
                    if (i > 2 && i % 4 === 0) {
                        ctx.fillStyle = 'rgba(190, 140, 220, 0.7)';
                        ctx.beginPath();
                        ctx.arc(currentX, currentY, radius * 0.6, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
            
            if (debugMode) {
                const windowHitbox = { x: windowX, y: windowY, width: windowWidth, height: windowHeight };
                ctx.strokeStyle = 'pink';
                ctx.lineWidth = 2;
                ctx.strokeRect(windowHitbox.x, windowHitbox.y, windowHitbox.width, windowHitbox.height);
            }
        }
        
        this.obstacles.forEach(obs => {
            if (obs.x === undefined) return;
            const obsXScreen = this.x + obs.x - (isVertical ? 0 : scrollOffset);
            
            if (obs.type === 'wall') {
                const wallY = platformY - obs.height;
                const wallGrad = ctx.createLinearGradient(obsXScreen, wallY, obsXScreen + obs.width, wallY + obs.height);
                wallGrad.addColorStop(0, '#c8d6e5');
                wallGrad.addColorStop(1, '#8395a7');
                ctx.fillStyle = wallGrad;
                ctx.fillRect(obsXScreen, wallY, obs.width, obs.height);
                ctx.strokeStyle = '#576574';
                ctx.lineWidth = 2;
                ctx.strokeRect(obsXScreen, wallY, obs.width, obs.height);

                if (obs.lateralSpikes) {
                    const spikes = obs.lateralSpikes;
                    const wallScreenX = this.x + obs.x - (isVertical ? 0 : scrollOffset);
                    const spikeAbsoluteYStart = platformY - obs.height + spikes.yOffset;
                    
                    const spikeGrad = ctx.createLinearGradient(wallScreenX - spikes.protrusion, 0, wallScreenX, 0);
                    spikeGrad.addColorStop(0, '#d1d8e0');
                    spikeGrad.addColorStop(1, '#a4b0be');
                    ctx.fillStyle = spikeGrad;
                    ctx.strokeStyle = '#576574';
                    ctx.lineWidth = 2;

                    const singleSpikeVisualHeight = 20;
                    for (let i = 0; i < spikes.numSpikes; i++) {
                        const y = spikeAbsoluteYStart + i * singleSpikeVisualHeight;
                        ctx.beginPath();
                        ctx.moveTo(wallScreenX, y);
                        ctx.lineTo(wallScreenX - spikes.protrusion, y + singleSpikeVisualHeight / 2);
                        ctx.lineTo(wallScreenX, y + singleSpikeVisualHeight);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                    }
                }

            } else if (obs.type === 'spike') {
                const spikeY = platformY;
                const numSpikes = Math.floor(obs.width / 20);
                const spikeGrad = ctx.createLinearGradient(obsXScreen, spikeY - obs.height, obsXScreen, spikeY);
                spikeGrad.addColorStop(0, '#d1d8e0');
                spikeGrad.addColorStop(1, '#a4b0be');
                ctx.fillStyle = spikeGrad;
                ctx.beginPath();
                ctx.moveTo(obsXScreen, spikeY);
                for (let i = 0; i < numSpikes; i++) {
                    ctx.lineTo(obsXScreen + i * 20 + 10, spikeY - obs.height); 
                    ctx.lineTo(obsXScreen + (i + 1) * 20, spikeY);
                }
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = '#576574';
                ctx.lineWidth = 2;
                ctx.stroke();
            } else if (obs.type === 'spike-down') {
                const spikeBaseY = platformY + this.height;
                const spikeTipY = spikeBaseY + obs.height;
                const numSpikes = Math.floor(obs.width / 20);
                const spikeGrad = ctx.createLinearGradient(obsXScreen, spikeBaseY, obsXScreen, spikeTipY);
                spikeGrad.addColorStop(0, '#a4b0be');
                spikeGrad.addColorStop(1, '#d1d8e0');
                ctx.fillStyle = spikeGrad;
                ctx.beginPath();
                ctx.moveTo(obsXScreen, spikeBaseY);
                for (let i = 0; i < numSpikes; i++) {
                    ctx.lineTo(obsXScreen + i * 20 + 10, spikeTipY); 
                    ctx.lineTo(obsXScreen + (i + 1) * 20, spikeBaseY);
                }
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = '#576574';
                ctx.lineWidth = 2;
                ctx.stroke();
            } else if (obs.type === 'wallWithTopSpikes') {
                const wallPartY = platformY - obs.wallHeight;
                const wallGrad = ctx.createLinearGradient(obsXScreen, wallPartY, obsXScreen + obs.width, wallPartY + obs.wallHeight);
                wallGrad.addColorStop(0, '#c8d6e5');
                wallGrad.addColorStop(1, '#8395a7');
                ctx.fillStyle = wallGrad;
                ctx.fillRect(obsXScreen, wallPartY, obs.width, obs.wallHeight);
                ctx.strokeStyle = '#576574';
                ctx.lineWidth = 2;
                ctx.strokeRect(obsXScreen, wallPartY, obs.width, obs.wallHeight);

                const topSpikeYPosition = platformY - obs.wallHeight;
                const spikeGrad = ctx.createLinearGradient(obsXScreen, topSpikeYPosition - obs.spikeHeight, obsXScreen, topSpikeYPosition);
                spikeGrad.addColorStop(0, '#d1d8e0');
                spikeGrad.addColorStop(1, '#a4b0be');
                ctx.fillStyle = spikeGrad;
                ctx.beginPath();
                ctx.moveTo(obsXScreen, topSpikeYPosition);
                ctx.lineTo(obsXScreen + obs.width / 2, topSpikeYPosition - obs.spikeHeight);
                ctx.lineTo(obsXScreen + obs.width, topSpikeYPosition);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = '#576574';
                ctx.lineWidth = 2;
                ctx.stroke();

            } else if (obs.type === 'bush') {
                const bushY = platformY;
                const bushGrad = ctx.createRadialGradient(obsXScreen + obs.width / 2, bushY, 5, obsXScreen + obs.width / 2, bushY, obs.height);
                bushGrad.addColorStop(0, '#3f9d5c');
                bushGrad.addColorStop(1, '#2a8c4a');
                ctx.fillStyle = bushGrad;
                ctx.beginPath();
                ctx.arc(obsXScreen + obs.width * 0.3, bushY, obs.height * 0.7, Math.PI, Math.PI * 2);
                ctx.arc(obsXScreen + obs.width * 0.7, bushY, obs.height * 0.9, Math.PI, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = '#1e6636';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            if (debugMode) {
                ctx.strokeStyle = 'pink';
                ctx.lineWidth = 2;
                let obsMainRect, obsSpikePartRect;
                if (obs.type === 'wall') {
                    obsMainRect = { x: this.x + obs.x, y: this.y - obs.height, width: obs.width, height: obs.height };
                    ctx.strokeRect(obsMainRect.x - (isVertical ? 0 : scrollOffset), obsMainRect.y - (isVertical ? verticalScrollOffset : 0), obsMainRect.width, obsMainRect.height);
                    if (obs.lateralSpikes) {
                        const spikeHitbox = { x: obsMainRect.x - obs.lateralSpikes.protrusion, y: obsMainRect.y + obs.lateralSpikes.yOffset, width: obs.lateralSpikes.protrusion, height: obs.lateralSpikes.height };
                        ctx.strokeRect(spikeHitbox.x - (isVertical ? 0 : scrollOffset), spikeHitbox.y - (isVertical ? verticalScrollOffset : 0), spikeHitbox.width, spikeHitbox.height);
                    }
                } else if (obs.type === 'spike') {
                    obsMainRect = { x: this.x + obs.x, y: this.y - obs.height, width: obs.width, height: obs.height };
                    ctx.strokeRect(obsMainRect.x - (isVertical ? 0 : scrollOffset), obsMainRect.y - (isVertical ? verticalScrollOffset : 0), obsMainRect.width, obsMainRect.height);
                } else if (obs.type === 'spike-down') {
                    const spikeHitbox = { x: platformX + obs.x, y: platformY + this.height, width: obs.width, height: obs.height };
                    ctx.strokeRect(spikeHitbox.x, spikeHitbox.y, spikeHitbox.width, spikeHitbox.height);
                } else if (obs.type === 'wallWithTopSpikes') {
                    obsMainRect = { x: this.x + obs.x, y: this.y - obs.wallHeight, width: obs.width, height: obs.wallHeight };
                    obsSpikePartRect = { x: this.x + obs.x, y: this.y - obs.wallHeight - obs.spikeHeight, width: obs.width, height: obs.spikeHeight };
                    ctx.strokeRect(obsMainRect.x - (isVertical ? 0 : scrollOffset), obsMainRect.y - (isVertical ? verticalScrollOffset : 0), obsMainRect.width, obsMainRect.height);
                    ctx.strokeRect(obsSpikePartRect.x - (isVertical ? 0 : scrollOffset), obsSpikePartRect.y - (isVertical ? verticalScrollOffset : 0), obsSpikePartRect.width, obsSpikePartRect.height);
                }
            }
        });
    }

    drawGrassPlatform(ctx, platformX, platformY) {
        const grassGrad = ctx.createLinearGradient(platformX, platformY, platformX, platformY + 15);
        grassGrad.addColorStop(0, '#55d175');
        grassGrad.addColorStop(0.5, '#34b055');
        grassGrad.addColorStop(1, '#2d9e4a');
        ctx.fillStyle = grassGrad;
        ctx.fillRect(platformX, platformY, this.width, 15);
        
        ctx.strokeStyle = '#2d9e4a';
        ctx.lineWidth = 2;
        ctx.strokeRect(platformX, platformY, this.width, 15);

        const dirtGrad = ctx.createLinearGradient(platformX, platformY + 15, platformX, platformY + this.height);
        dirtGrad.addColorStop(0, '#9b7653');
        dirtGrad.addColorStop(1, '#7a4800');
        ctx.fillStyle = dirtGrad;
        ctx.fillRect(platformX, platformY + 15, this.width, this.height - 15);

        ctx.strokeStyle = '#7a4800';
        ctx.lineWidth = 2;
        ctx.strokeRect(platformX, platformY + 15, this.width, this.height - 15);
    }

    drawStonePlatform(ctx, platformX, platformY) {
        const grad = ctx.createLinearGradient(platformX, platformY, platformX, platformY + this.height);
        grad.addColorStop(0, '#95a5a6');
        grad.addColorStop(1, '#7f8c8d');
        ctx.fillStyle = grad;
        ctx.fillRect(platformX, platformY, this.width, this.height);
        
        ctx.strokeStyle = '#6c7a7b';
        ctx.lineWidth = 2;
        ctx.strokeRect(platformX, platformY, this.width, this.height);

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 1;
        const brickWidth = 60;
        const numBricks = Math.floor(this.width / brickWidth);
        for (let i = 1; i < numBricks; i++) {
            ctx.beginPath();
            ctx.moveTo(platformX + i * brickWidth, platformY);
            ctx.lineTo(platformX + i * brickWidth, platformY + this.height);
            ctx.stroke();
        }
    }

    drawCloudPlatform(ctx, platformX, platformY, baseOnly = false) {
        const grad = ctx.createRadialGradient(platformX + this.width / 2, platformY + this.height / 2, 5, platformX + this.width / 2, platformY + this.height / 2, this.width / 2);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.05)'); 
        grad.addColorStop(1, 'rgba(220, 220, 230, 0.02)');
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.moveTo(platformX, platformY + this.height / 2);
        ctx.quadraticCurveTo(platformX + 10, platformY - 5, platformX + this.width / 2, platformY + 5);
        ctx.quadraticCurveTo(platformX + this.width - 10, platformY - 5, platformX + this.width, platformY + this.height / 2);
        ctx.quadraticCurveTo(platformX + this.width - 10, platformY + this.height + 5, platformX + this.width / 2, platformY + this.height - 5);
        ctx.quadraticCurveTo(platformX + 10, platformY + this.height + 5, platformX, platformY + this.height / 2);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(200, 200, 210, 0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();

        if (!baseOnly) {
            this.drawFog(ctx, platformX, platformY);
        }
    }
}