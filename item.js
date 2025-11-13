// item.js

// Classe para as Moedas
class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 8;
        this.value = COIN_VALUE;
    }

    draw(ctx, scrollOffset, verticalScrollOffset = 0, isVertical = false) {
        const coinX = this.x - (isVertical ? 0 : scrollOffset);
        const coinY = this.y - (isVertical ? verticalScrollOffset : 0);

        const grad = ctx.createRadialGradient(coinX, coinY, this.radius * 0.2, coinX, coinY, this.radius);
        grad.addColorStop(0, '#feca57');
        grad.addColorStop(1, '#f39c12');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(coinX, coinY, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#b8930b';
        ctx.lineWidth = 2;
        ctx.stroke();

        // <<< INÍCIO DA MODIFICAÇÃO >>>
        if (debugMode) {
            ctx.strokeStyle = 'pink';
            ctx.lineWidth = 2;
            ctx.beginPath();
            // A hitbox representa a área de colisão do próprio item
            ctx.arc(coinX, coinY, this.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        // <<< FIM DA MODIFICAÇÃO >>>
    }
}

// Classe para os Kits Médicos
class HealthPack {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 12;
    }

    draw(ctx, scrollOffset, verticalScrollOffset = 0, isVertical = false) {
        const packX = this.x - (isVertical ? 0 : scrollOffset);
        const packY = this.y - (isVertical ? verticalScrollOffset : 0);
        
        const packGrad = ctx.createRadialGradient(packX, packY, 2, packX, packY, this.radius);
        packGrad.addColorStop(0, '#ff8b8b');
        packGrad.addColorStop(1, '#d13423');
        ctx.fillStyle = packGrad;
        ctx.beginPath();
        ctx.arc(packX, packY, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#a4281b';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = 'white';
        const crossWidth = this.radius * 0.3;
        const crossLength = this.radius * 1.2;
        ctx.fillRect(packX - crossLength / 2, packY - crossWidth / 2, crossLength, crossWidth);
        ctx.fillRect(packX - crossWidth / 2, packY - crossLength / 2, crossWidth, crossLength);

        // <<< INÍCIO DA MODIFICAÇÃO >>>
        if (debugMode) {
            ctx.strokeStyle = 'pink';
            ctx.lineWidth = 2;
            ctx.beginPath();
            // A hitbox representa a área de colisão do próprio item
            ctx.arc(packX, packY, this.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        // <<< FIM DA MODIFICAÇÃO >>>
    }
}