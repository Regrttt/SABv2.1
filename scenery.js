// scenery.js (CORREÇÃO: Iluminação da torre agora é desenhada também durante a finalBoss)

class SceneryManager {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.midgroundHills = []; 
        this.bushes = [];
        this.trees = [];
        this.clouds = [];
        this.stars = []; 
        this.towerDetails = new Map();
        this.lastWindowY = Infinity; 
        this.PARALLAX = {
            hill: 0.6,
            bush: 0.7, 
            tree: 0.8,
            cloud: 0.4,
            star: 0.2
        };
        this.lastGeneratedX = { hill: 0, tree: 0, cloud: 0, bush: 0 };
        this.lastGeneratedY = { star: 0, cloud: 0 };
        
        this.mossCooldown = 0;

        this.seedX = Math.random() * 10000;
        this.seedY = Math.random() * 10000;
        this.seedZ = Math.random() * 10000;
        this.seedW = Math.random() * 10000;
    }

    update(scrollOffset, canvasWidth, gameState = 'playing', verticalScrollOffset = 0, platforms = []) {
        if (gameState === 'phaseTwo' || gameState === 'finalBoss') { 
            this.generateStars(verticalScrollOffset);
            this.generateVerticalClouds(verticalScrollOffset);
            this.stars = this.stars.filter(s => s.y - (verticalScrollOffset * this.PARALLAX.star) < this.canvasHeight + 50);
            this.clouds = this.clouds.filter(c => c.y - (verticalScrollOffset * this.PARALLAX.cloud) < this.canvasHeight + 200);
        }
        this.generateScenery(scrollOffset, canvasWidth); 
        this.pruneScenery(scrollOffset);
    }
    
    generateStars(verticalScrollOffset) {
        const starTargetY = verticalScrollOffset - this.canvasHeight * 1.5;
        while (this.lastGeneratedY.star > starTargetY) {
            const y = this.lastGeneratedY.star - (Math.random() * 20 + 5);
            const x = Math.random() * this.canvasWidth;
            const size = Math.random() * 2 + 1.5;
            this.stars.push({ x, y, size, blinkTimer: Math.random() * 5 });
            this.lastGeneratedY.star = y;
        }
    }

    generateVerticalClouds(verticalScrollOffset) {
        const cloudTargetY = verticalScrollOffset - this.canvasHeight * 1.5;
        while(this.lastGeneratedY.cloud > cloudTargetY) {
            const y = this.lastGeneratedY.cloud - (Math.random() * 300 + 200);
            const x = Math.random() * this.canvasWidth;
            const baseSize = Math.random() * 40 + 40;
            const numBlobs = Math.floor(Math.random() * 4) + 3;
            const blobs = [];
            for (let i = 0; i < numBlobs; i++) { blobs.push({ offsetX: (Math.random() - 0.5) * baseSize * 2, offsetY: (Math.random() - 0.5) * baseSize * 0.8, size: baseSize * (Math.random() * 0.5 + 0.7) }); }
            this.clouds.push({ x, y, size: baseSize, blobs });
            this.lastGeneratedY.cloud = y;
        }
    }
    
    pruneScenery(scrollOffset) {
        this.midgroundHills = this.midgroundHills.filter(h => h.x + h.width > scrollOffset * this.PARALLAX.hill);
        this.bushes = this.bushes.filter(b => b.x + b.width > scrollOffset * this.PARALLAX.bush);
        this.trees = this.trees.filter(t => t.x + t.size * 2 > scrollOffset * this.PARALLAX.tree - 200);
        
        if (gameState !== 'phaseTwo' && gameState !== 'finalBoss') { 
            this.clouds = this.clouds.filter(c => c.x + c.size * 2 > scrollOffset * this.PARALLAX.cloud - 200);
        }
    }

    generateScenery(scrollOffset, canvasWidth) {
        if (gameState !== 'phaseTwo' && gameState !== 'finalBoss') { 
            const cloudTargetX = (scrollOffset * this.PARALLAX.cloud) + canvasWidth * 1.5;
            while(this.lastGeneratedX.cloud < cloudTargetX) {
                const x = this.lastGeneratedX.cloud + Math.random() * 300 + 150;
                const y = Math.random() * (this.canvasHeight * 0.4) + 50;
                const baseSize = Math.random() * 30 + 30;
                const numBlobs = Math.floor(Math.random() * 4) + 3;
                const blobs = [];
                for (let i = 0; i < numBlobs; i++) { blobs.push({ offsetX: (Math.random() - 0.5) * baseSize * 2, offsetY: (Math.random() - 0.5) * baseSize * 0.8, size: baseSize * (Math.random() * 0.5 + 0.7) }); }
                this.clouds.push({ x, y, size: baseSize, blobs });
                this.lastGeneratedX.cloud = x;
            }
        }

        const hillTargetX = (scrollOffset * this.PARALLAX.hill) + canvasWidth * 1.5;
        while (this.lastGeneratedX.hill < hillTargetX) {
            const x = this.lastGeneratedX.hill;
            const segmentWidth = 40;
            const height = 150;
            const hillSegment = { x, y: height, width: segmentWidth };
            hillSegment.hasDetail = (Math.random() < 0.9);
            this.midgroundHills.push(hillSegment);
            this.lastGeneratedX.hill += segmentWidth;
        }
        
        const bushTargetX = (scrollOffset * this.PARALLAX.bush) + canvasWidth * 1.5;
        while (this.lastGeneratedX.bush < bushTargetX) {
            const x = this.lastGeneratedX.bush;
            const segmentWidth = 140 + (Math.random() - 0.5) * 40;
            const segmentHeight = segmentWidth * 0.9;
            const y = this.canvasHeight - (segmentHeight * 0.4) + 20;
            const bushSegment = { x, y, width: segmentWidth, height: segmentHeight, details: [] };
            const numDetails = Math.floor(Math.random() * 4);
            for (let i = 0; i < numDetails; i++) {
                bushSegment.details.push({
                    angle: Math.random() * Math.PI * 2,
                    distance: (segmentHeight * 0.5) * (Math.random() * 0.6 + 0.2)
                });
            }
            this.bushes.push(bushSegment);
            this.lastGeneratedX.bush += segmentWidth;
        }

        const treeTargetX = (scrollOffset * this.PARALLAX.tree) + canvasWidth * 1.5;
        while (this.lastGeneratedX.tree < treeTargetX) {
            const gap = Math.random() * 100 + 80;
            const x = this.lastGeneratedX.tree + gap;
            const baseSize = Math.random() * 30 + 55;
            const y = (this.canvasHeight * 0.5) - (Math.random() * 80);
            
            const numBlobs = Math.floor(Math.random() * 5) + 4;
            const blobs = [];
            for (let i = 0; i < numBlobs; i++) {
                blobs.push({
                    offsetX: (Math.random() - 0.5) * baseSize * 1.5,
                    offsetY: (Math.random() - 0.5) * baseSize * 0.6,
                    size: baseSize * (Math.random() * 0.4 + 0.6)
                });
            }

            const branches = [];
            const trunkHeight = this.canvasHeight - y;
            const generateBranchesForSide = (side) => {
                if (Math.random() > 0.35) return;
                const usedOffsets = [];
                for (let i = 0; i < 3; i++) {
                    if (Math.random() < [0.60, 0.40, 0.20][i]) {
                        const yOffset = (Math.random() * 0.7 + 0.15) * trunkHeight;
                        let isTooClose = false;
                        for (const offset of usedOffsets) {
                            if (Math.abs(yOffset - offset) < 40) {
                                isTooClose = true;
                                break;
                            }
                        }
                        if (!isTooClose) {
                            branches.push({ side: side, yOffset: yOffset });
                            usedOffsets.push(yOffset);
                        }
                    } else {
                        break;
                    }
                }
            };
            generateBranchesForSide('left');
            generateBranchesForSide('right');
            this.trees.push({ x, y, size: baseSize, blobs, branches });
            this.lastGeneratedX.tree = x;
        }
    }

    draw(ctx, scrollOffset, gameState = 'playing', verticalScrollOffset = 0, deltaTime = 0, platforms = [], player = null) {
        if (gameState === 'phaseTwo' || gameState === 'finalBoss') { 
            this.drawStars(ctx, verticalScrollOffset, deltaTime);
            this.drawClouds(ctx, verticalScrollOffset, true);
            this.drawTowerBackground(ctx, verticalScrollOffset, platforms, player, gameState);
        } else {
            this.drawClouds(ctx, scrollOffset, false);
            this.drawMidgroundHills(ctx, scrollOffset);
            this.drawBushes(ctx, scrollOffset);
            this.drawTrees(ctx, scrollOffset);
        }
    }
    
    drawTowerBackground(ctx, verticalScrollOffset, platforms, player, gameState) {
        const towerWidth = this.canvasWidth * 0.6;
        const towerX = (this.canvasWidth - towerWidth) / 2;
        
        ctx.save();
        ctx.beginPath();
        ctx.rect(towerX, 0, towerWidth, this.canvasHeight);
        ctx.clip();

        const brickHeight = 30;
        const brickWidth = 60;
        
        const startRow = Math.floor(verticalScrollOffset / brickHeight);
        const endRow = Math.ceil((verticalScrollOffset + this.canvasHeight) / brickHeight);
        
        for (let r = startRow; r <= endRow; r++) {
            for (let c = 0; c < Math.ceil(towerWidth / brickWidth) + 1; c++) {
                
                const key = `${r},${c}`;
                
                if (!this.towerDetails.has(key)) {
                    this.generateDetailForKey(key, r, c, brickWidth, brickHeight);
                }
                
                const detail = this.towerDetails.get(key);
                if (!detail) continue;
                
                const xOffset = (r % 2 === 0) ? 0 : -brickWidth / 2;
                const brickScreenX = towerX + c * brickWidth + xOffset;
                const brickScreenY = r * brickHeight - verticalScrollOffset;

                if (brickScreenX > towerX + towerWidth || brickScreenX + brickWidth < 0) {
                    continue;
                }
                
                const baseR = 92, baseG = 102, baseB = 103;
                const variation = detail.colorVariation * 255;
                const brickColor = `rgb(${baseR + variation}, ${baseG + variation}, ${baseB + variation})`;
                ctx.fillStyle = brickColor;
                ctx.fillRect(brickScreenX, brickScreenY, brickWidth, brickHeight);
                
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.lineWidth = 1;
                ctx.strokeRect(brickScreenX, brickScreenY, brickWidth, brickHeight);

                if (detail.type === 'crack') {
                    ctx.strokeStyle = '#4b4b4b';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(brickScreenX + detail.startX, brickScreenY + detail.startY);
                    for(let i = 0; i < detail.points.length; i++) {
                        ctx.lineTo(brickScreenX + detail.points[i].x, brickScreenY + detail.points[i].y);
                    }
                    ctx.stroke();
                } else if (detail.type === 'moss') {
                    this.drawHangingMoss(ctx, brickScreenX, brickScreenY, detail);
                }
            }
        }
        
        // <<< INÍCIO DA MODIFICAÇÃO: Iluminação da torre persiste na batalha final >>>
        if (gameState === 'phaseTwo' || gameState === 'finalBoss') {
            const lightingOverlay = ctx.createLinearGradient(towerX, 0, towerX + towerWidth, 0);
            lightingOverlay.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
            lightingOverlay.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
            lightingOverlay.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
            ctx.fillStyle = lightingOverlay;
            ctx.fillRect(towerX, 0, towerWidth, this.canvasHeight);
        }
        // <<< FIM DA MODIFICAÇÃO >>>

        ctx.restore();
    }

    drawHangingMoss(ctx, brickX, brickY, detail) {
        ctx.fillStyle = '#4a543e';
        detail.blobs.forEach(blob => {
             ctx.beginPath();
             ctx.ellipse(brickX + blob.x, brickY + blob.y + 1.5, blob.rx, blob.ry, blob.rot, 0, Math.PI * 2);
             ctx.fill();
        });

        const mossGrad = ctx.createLinearGradient(0, brickY, 0, brickY + 40);
        mossGrad.addColorStop(0, '#8A9A5B'); 
        mossGrad.addColorStop(1, '#6B8E23');
        ctx.fillStyle = mossGrad;
        
        detail.blobs.forEach(blob => {
             ctx.beginPath();
             ctx.ellipse(brickX + blob.x, brickY + blob.y, blob.rx, blob.ry, blob.rot, 0, Math.PI * 2);
             ctx.fill();
        });

        ctx.fillStyle = 'rgba(200, 200, 160, 0.3)';
        detail.highlights.forEach(h => {
            ctx.beginPath();
            ctx.arc(brickX + h.x, brickY + h.y, h.r, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    generateDetailForKey(key, row, col, brickWidth, brickHeight) {
        let seed1 = Math.abs(Math.sin(row * 12.9898 + col * 78.233 + this.seedX) * 43758.5453 % 1);
        let seed2 = Math.abs(Math.cos(row * 37.311 + col * 13.998 + this.seedY) * 54321.9876 % 1);
        let seed3 = Math.abs(Math.sin(row * -21.543 + col * -91.332 + this.seedZ) * 12345.6789 % 1);
        let seed4 = Math.abs(Math.cos(row * -5.123 + col * 42.789 + this.seedW) * 9876.54321 % 1);

        let detail = { type: 'none', colorVariation: 0 };
        
        if (seed4 < 0.2) {
            detail.colorVariation = (seed1 - 0.7) * 0.15; 
        }

        if (this.mossCooldown > 0) {
            this.mossCooldown--;
        }
        
        if (seed2 < 0.03) {
            detail.type = 'crack';
            detail.startX = brickWidth * 0.1 + seed1 * brickWidth * 0.8;
            detail.startY = brickHeight * 0.1 + seed2 * brickHeight * 0.8;
            detail.points = [];
            let currentX = detail.startX;
            let currentY = detail.startY;
            const segments = 2 + Math.floor(seed3 * 3);
            for (let i = 0; i < segments; i++) {
                currentX += (Math.random() - 0.5) * 25;
                currentY += (Math.random() - 0.5) * 25;
                currentX = Math.max(0, Math.min(brickWidth, currentX));
                currentY = Math.max(0, Math.min(brickHeight, currentY));
                detail.points.push({x: currentX, y: currentY});
            }
        } else if (this.mossCooldown <= 0 && seed3 < 0.02) { 
            this.mossCooldown = 50;
            detail.type = 'moss';
            detail.blobs = [];
            detail.highlights = [];

            const mainBlobX = brickWidth * (0.2 + Math.random() * 0.6);
            const mainBlobY = 5 + Math.random() * 10;
            const mainBlobRx = 8 + Math.random() * 6;
            const mainBlobRy = 4 + Math.random() * 3;
            
            detail.blobs.push({
                x: mainBlobX, y: mainBlobY,
                rx: mainBlobRx, ry: mainBlobRy,
                rot: (Math.random() - 0.5) * 0.2
            });

            const numSubBlobs = 1 + Math.floor(Math.random() * 2);
            for (let i=0; i< numSubBlobs; i++) {
                detail.blobs.push({
                    x: mainBlobX + (Math.random() - 0.5) * mainBlobRx,
                    y: mainBlobY + Math.random() * mainBlobRy,
                    rx: mainBlobRx * (0.4 + Math.random() * 0.2),
                    ry: mainBlobRy * (0.6 + Math.random() * 0.3),
                    rot: (Math.random() - 0.5) * 0.5
                });
            }
            
            const numHighlights = 1 + Math.floor(Math.random() * 2);
            for(let i = 0; i < numHighlights; i++){
                const blob = detail.blobs[0];
                detail.highlights.push({
                    x: blob.x + (Math.random() - 0.5) * blob.rx,
                    y: blob.y + (Math.random() - 0.5) * blob.ry * 0.5,
                    r: Math.random() * 1.2 + 0.8
                });
            }
        }
        
        this.towerDetails.set(key, detail);
    }

    drawStars(ctx, verticalScrollOffset, deltaTime) {
        ctx.globalAlpha = 1.0;
        this.stars.forEach(star => {
            star.blinkTimer -= deltaTime;
            if (star.blinkTimer < 0) {
                star.blinkTimer = Math.random() * 3 + 2; 
            }

            const screenY = star.y - (verticalScrollOffset * this.PARALLAX.star);
            
            let alpha = 0.5; 
            if (star.blinkTimer < 0.25) {
                alpha = 1.0; 
            } else if (star.blinkTimer < 1.0) {
                alpha = 0.5 + ((1.0 - star.blinkTimer) * 0.5);
            }
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            
            const armLength = star.size + 1;
            const armThickness = 1;
            ctx.fillRect(star.x - armLength / 2, screenY - armThickness / 2, armLength, armThickness);
            ctx.fillRect(star.x - armThickness / 2, screenY - armLength / 2, armThickness, armLength);
        });
        ctx.globalAlpha = 1.0;
    }
    
    drawBushes(ctx, scrollOffset) {
        const parallax = this.PARALLAX.bush;
        this.bushes.forEach(bush => {
            const bushX = bush.x - scrollOffset * parallax;
            const bushY = bush.y;
            const bushWidth = bush.width;
            const bushHeight = bush.height;
            const mainRadius = bushHeight * 0.5;
            const sideRadius = bushHeight * 0.4;
            const verticalOffset = bushHeight * 0.1;
            const mainCenterX = bushX + bushWidth / 2;
            const leftCenterX = bushX + bushWidth * 0.25;
            const rightCenterX = bushX + bushWidth * 0.75;
            const lumpCenterY = bushY - verticalOffset;
            const grad = ctx.createRadialGradient(mainCenterX, lumpCenterY, 0, mainCenterX, lumpCenterY, bushHeight);
            grad.addColorStop(0, '#256139');
            grad.addColorStop(1, '#1a4328');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(leftCenterX, bushY, sideRadius, 0, Math.PI * 2);
            ctx.arc(rightCenterX, bushY, sideRadius, 0, Math.PI * 2);
            ctx.arc(mainCenterX, lumpCenterY, mainRadius, 0, Math.PI * 2);
            ctx.fill();

            if (bush.details.length > 0) {
                bush.details.forEach(detail => {
                    const detailX = mainCenterX + Math.cos(detail.angle) * detail.distance;
                    const detailY = lumpCenterY + Math.sin(detail.angle) * detail.distance;
                    const detailGrad = ctx.createRadialGradient(detailX, detailY, 0, detailX, detailY, 5);
                    detailGrad.addColorStop(0, '#6aaa79');
                    detailGrad.addColorStop(1, '#3e8253');
                    ctx.fillStyle = detailGrad;
                    const detailHRadius = 5;
                    const detailVRadius = 3;
                    ctx.save();
                    ctx.translate(detailX, detailY);
                    ctx.rotate(detail.angle + Math.PI / 2);
                    ctx.beginPath();
                    ctx.ellipse(0, 0, detailHRadius, detailVRadius, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                });
            }
        });
    }
    
    drawMidgroundHills(ctx, scrollOffset) {
        const hillData = this.midgroundHills;
        const parallax = this.PARALLAX.hill;
        const fixedTopY = this.canvasHeight * 0.55; 
        hillData.forEach(seg => {
            const screenX = seg.x - scrollOffset * parallax;
            if (screenX > ctx.canvas.width || screenX + seg.width < 0) return;
            const radius = seg.width / 2;
            const circleCenterY = fixedTopY + radius;
            const grad = ctx.createLinearGradient(screenX, 0, screenX + seg.width, 0);
            grad.addColorStop(0, '#1e5233');
            grad.addColorStop(0.5, '#2a8c4a');
            grad.addColorStop(1, '#1e5233');
            ctx.fillStyle = grad;
            const path = new Path2D();
            path.moveTo(screenX, this.canvasHeight);
            path.lineTo(screenX, circleCenterY);
            path.arc(screenX + radius, circleCenterY, radius, Math.PI, 0);
            path.lineTo(screenX + seg.width, this.canvasHeight);
            path.closePath();
            ctx.fill(path);
            if (seg.hasDetail) {
                const cloverY = circleCenterY;
                const cloverHRadius = 4; 
                const cloverVRadius = 2.5;
                const spacing = 7;     
                const createCloverGradient = (x, y, r) => {
                    const cloverGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
                    cloverGrad.addColorStop(0, '#8fdb83');
                    cloverGrad.addColorStop(1, '#2a8c4a');
                    return cloverGrad;
                };
                ctx.fillStyle = createCloverGradient(screenX + radius - spacing, cloverY, cloverHRadius);
                ctx.beginPath();
                ctx.ellipse(screenX + radius - spacing, cloverY, cloverHRadius, cloverVRadius, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = createCloverGradient(screenX + radius + spacing, cloverY, cloverHRadius);
                ctx.beginPath();
                ctx.ellipse(screenX + radius + spacing, cloverY, cloverHRadius, cloverVRadius, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = createCloverGradient(screenX + radius, cloverY - spacing, cloverHRadius);
                ctx.beginPath();
                ctx.ellipse(screenX + radius, cloverY - spacing, cloverVRadius, cloverHRadius, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    drawTrees(ctx, scrollOffset) {
        this.trees.forEach(tree => {
            const treeX = tree.x - scrollOffset * this.PARALLAX.tree;
            const treeY = tree.y;
            const trunkWidth = tree.size * 0.25;
            const trunkX = treeX - trunkWidth / 2;
            
            const branchLength = tree.size * 0.4;
            const branchWidth = trunkWidth * 0.6;
            
            tree.branches.forEach(branch => {
                const startY = treeY + branch.yOffset;
                let startX, endX;
                if (branch.side === 'left') {
                    startX = trunkX;
                    endX = startX - branchLength;
                } else {
                    startX = trunkX + trunkWidth;
                    endX = startX + branchLength;
                }
                const endY = startY - branchLength;
                
                ctx.save();
                ctx.translate(startX, startY);
                const angle = Math.atan2(endY - startY, endX - startX);
                ctx.rotate(angle);

                const branchGrad = ctx.createLinearGradient(0, 0, branchLength, 0);
                branchGrad.addColorStop(0, '#7a4800');
                branchGrad.addColorStop(1, '#9b7653');
                ctx.fillStyle = branchGrad;
                const overlap = 5;
                ctx.fillRect(-overlap, -branchWidth / 2, branchLength + overlap, branchWidth);

                ctx.fillStyle = '#9b7653';
                ctx.beginPath();
                ctx.arc(branchLength, 0, branchWidth / 2, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            });

            const trunkGrad = ctx.createLinearGradient(trunkX, 0, trunkX + trunkWidth, 0);
            trunkGrad.addColorStop(0, '#7a4800');
            trunkGrad.addColorStop(0.5, '#9b7653');
            trunkGrad.addColorStop(1, '#7a4800');
            ctx.fillStyle = trunkGrad;
            ctx.fillRect(trunkX, treeY, trunkWidth, this.canvasHeight - treeY);

            const grad = ctx.createRadialGradient(treeX, treeY, 0, treeX, treeY, tree.size * 1.2);
            grad.addColorStop(0, '#8fdb83');
            grad.addColorStop(1, '#3baa6a');
            ctx.fillStyle = grad;
            ctx.beginPath(); 
            tree.blobs.forEach(blob => { 
                ctx.moveTo(treeX + blob.offsetX, treeY + blob.offsetY); 
                ctx.arc(treeX + blob.offsetX, treeY + blob.offsetY, blob.size, 0, Math.PI * 2); 
            }); 
            ctx.fill();
        });
    }

    drawClouds(ctx, offset, isVertical = false) { 
        const cloudData = this.clouds;
        if (!cloudData) return;
        cloudData.forEach(cloud => { 
            const parallax = this.PARALLAX.cloud; 
            let cloudX, cloudY;

            if (isVertical) {
                cloudX = cloud.x;
                cloudY = cloud.y - offset * parallax;
            } else {
                cloudX = cloud.x - offset * parallax; 
                cloudY = cloud.y;
            }
            
            const grad = ctx.createRadialGradient(cloudX, cloudY, 0, cloudX, cloudY, cloud.size * 1.5);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
            grad.addColorStop(1, 'rgba(210, 210, 220, 0.7)');
            ctx.fillStyle = grad;
            ctx.beginPath(); 
            cloud.blobs.forEach(blob => {
                ctx.moveTo(cloudX + blob.offsetX, cloudY + blob.offsetY); 
                ctx.arc(cloudX + blob.offsetX, cloudY + blob.offsetY, blob.size, 0, Math.PI * 2); 
            }); 
            ctx.fill(); 
        }); 
    }
}