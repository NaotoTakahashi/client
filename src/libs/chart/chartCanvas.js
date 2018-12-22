export class ChartRect {
	constructor() {
        this.top = 0;
        this.bottom = 0;
        this.left = 0;
        this.right = 0;
    }
    set(t, l, r, b) { 
        this.top = t;
        this.bottom = b;
        this.left = l;
        this.right = r;
    }
    getTop() { return this.top; }
    getBottom() { return this.bottom; }
    getLeft() { return this.left; }
    getRight() { return this.right; }
}
//const STD_FONT = "12px 'sans-serif'";
const SMALL_FONT = "11px 'Arial'";
const STD_FONT = "13px 'Arial'";
const BLD_FONT = "bold 16px 'Arial'";
export class ChartCanvas {
	constructor() {
	    //this.canvas = null;
	    //this.ctx = this.canvas.getContext('2d');
	    this.m_colTick = "darkorange";
	    this.m_colStick = 'rgb(100, 100, 100)';
	    this.m_colBack = 'rgb(80, 80, 80)';
	    this.m_colScale = 'rgb(80, 80, 80)';
        this.m_colCross = 'rgb(255, 255, 255)';
        this.m_settingImgSrc = null;
        this.m_dustboxImg = null;
    }
    setCanvas(canvas, context) {
    	this.canvas  = canvas;
        this.ctx = context;
        this.ctx.textBaseline = "top";
    }
    setSettingImg(src) {
        this.m_settingImgSrc = src;
    }
    setDustboxImg(src) {
        this.m_dustboxImg = new Image();
        this.m_dustboxImg.src = src;
    }
    getWidth() {
        return (this.canvas === undefined) ? 0 : this.canvas.width;
        //return this.canvas.width;
    }
    getHeight() {
        return (this.canvas === undefined) ? 0 : this.canvas.height;
        //return this.canvas.height;
    }
    drawErrorString(msg) {
        const centet_x = this.getWidth() >> 1;
        const center_y = this.getHeight() >> 1;
        this.ctx.beginPath();

        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.getWidth(), this.getHeight());
        
        const radius = 6;
        const x = centet_x - 200;
        const y = center_y - 25;
        const width = 400;
        const height = 50;

        this.ctx.strokeStyle = 'white';
        this.ctx.fillStyle = 'white';
        this.ctx.moveTo(x+radius,y);
        this.ctx.arcTo(x+width, y,        x+width, y+height, radius);
        this.ctx.arcTo(x+width, y+height, x,       y+height, radius);
        this.ctx.arcTo(x,       y+height, x,       y,        radius);
        this.ctx.arcTo(x,       y,        x+width, y,        radius);
        this.ctx.stroke();
        this.ctx.fill();

        this.ctx.fillStyle = 'red';
        this.ctx.font = STD_FONT;
        this.ctx.textAlign = "center";
        this.ctx.fillText(msg, centet_x + 0.5, (center_y - 7) + 0.5);
        this.ctx.closePath();
    }
    drawStringR(str, x1, y1, color) {
        this.ctx.beginPath();
        if (typeof color === "undefined") {
            //this.ctx.fillStyle = "white";
            this.ctx.fillStyle = 'rgb(153,153,153)';
        } else {
            this.ctx.fillStyle = color;
        }
        this.ctx.font = STD_FONT;
        this.ctx.textAlign = "right";
        this.ctx.fillText(str, x1 + 0.5, y1 + 0.5);
        this.ctx.closePath();
    }
    drawSmallStringL(str, x1, y1, color) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.font = SMALL_FONT;
        this.ctx.textAlign = "left";
        this.ctx.fillText(str, x1 + 0.5, y1 + 0.5);
        this.ctx.closePath();
    }
    drawStringL(str, x1, y1, color) {
        this.ctx.beginPath();
        if (typeof color === "undefined") {
            //this.ctx.fillStyle = "white";
            this.ctx.fillStyle = 'rgb(153,153,153)';
        } else {
            this.ctx.fillStyle = color;
        }
        //this.ctx.font = "12px";
        this.ctx.font = STD_FONT;
        this.ctx.textAlign = "left";
        this.ctx.fillText(str, x1 + 0.5, y1 + 0.5);
        this.ctx.closePath();
    }
    drawStringC(str, x1, y1, color) {
        this.ctx.beginPath();
        if (typeof color === "undefined") {
            //this.ctx.fillStyle = "white";
            this.ctx.fillStyle = 'rgb(153,153,153)';
        } else {
            this.ctx.fillStyle = color;
        }
        this.ctx.font = STD_FONT;
        this.ctx.textAlign = "center";
        this.ctx.fillText(str, x1 + 0.5, y1 + 0.5);
        this.ctx.closePath();
    }
    drawBtnString(str, x1, y1, color) {
        this.ctx.beginPath();
        if (typeof color === "undefined") {
            //this.ctx.fillStyle = "white";
            this.ctx.fillStyle = 'rgb(153,153,153)';
        } else {
            this.ctx.fillStyle = color;
        }
        this.ctx.font = BLD_FONT;
        this.ctx.textAlign = "center";
        this.ctx.fillText(str, x1 + 0.5, y1 + 0.5);
        this.ctx.closePath();
    }
    drawIndexText(color, str, x1, y1) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.font = STD_FONT;
        this.ctx.textAlign = "left";
        this.ctx.fillText(str, x1 + 0.5, y1 + 0.5);
        this.ctx.closePath();
    }
    drawLine(color, x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.moveTo(x1 + 0.5, y1 + 0.5);
        this.ctx.lineTo(x2 + 0.5, y2 + 0.5);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    drawBoldLine (color, size, x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = size;
        this.ctx.moveTo(x1 + 0.5, y1 + 0.5);
        this.ctx.lineTo(x2 + 0.5, y2 + 0.5);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    drawThinLine(color, x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 0.3;
        this.ctx.moveTo(x1 + 0.5, y1 + 0.5);
        this.ctx.lineTo(x2 + 0.5, y2 + 0.5);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    drawFrameLine (x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgb(255,255,255)';
        this.ctx.lineWidth = 1;
        this.ctx.moveTo(x1 + 0.5, y1 + 0.5);
        this.ctx.lineTo(x2 + 0.5, y2 + 0.5);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    drawScaleLine (x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "blue";
        this.ctx.lineWidth = 1;
        this.ctx.moveTo(x1 + 0.5, y1 + 0.5);
        this.ctx.lineTo(x2 + 0.5, y2 + 0.5);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    drawDottedLine (color, p1x, p1y, p2x, p2y) {
        const d = Math.sqrt(Math.pow(p2x - p1x, 2) + Math.pow(p2y - p1y, 2));
        const rad = Math.atan2(p2y - p1y, p2x - p1x);
        const space = 4;
        const dotted = Math.round(d / space / 2);
        for (let i = 0; i < dotted; i++) {
            const p3x = Math.cos(rad) * space * (i * 2) + p1x;
            const p3y = Math.sin(rad) * space * (i * 2) + p1y;
            const p4x = Math.cos(rad) * space * (i * 2 + 1) + p1x;
            const p4y = Math.sin(rad) * space * (i * 2 + 1) + p1y;
            this.ctx.beginPath();
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(p3x, p3y);
            this.ctx.lineTo(p4x, p4y);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }
    drawGradFill(x1, y1, x2, y2) {
        this.ctx.beginPath();
        const gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, 'rgb(0,0,0)');
        gradient.addColorStop(0.5, 'rgb(50,50,50)');
        gradient.addColorStop(1, 'rgb(0,0,0)');
        this.ctx.fillStyle = gradient;
        this.ctx.rect(x1, y1, x2 - x1, y2 - y1);
        this.ctx.fill();
        this.ctx.closePath();
    }
    drawGradient(color, x1, y1, x2, y2) {
        this.ctx.beginPath();
        const gradient = this.ctx.createLinearGradient(x1, y1, x1, y2);
        gradient.addColorStop(0, color[0]);
        gradient.addColorStop(0.5, color[1]);
        gradient.addColorStop(1, color[2]);
        this.ctx.fillStyle = gradient;
        this.ctx.rect(x1, y1, x2 - x1, y2 - y1);
        this.ctx.fill();
        this.ctx.closePath();
    }
    drawSplitter (x1, y1, x2, y2) {
        this.ctx.beginPath();
        var gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, 'rgb(120,120,120)');
        gradient.addColorStop(0.2, 'rgb(200,200,200)');
        gradient.addColorStop(1, 'rgb(120,120,120)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
        this.ctx.closePath();
    }
    drawBackground (x1, y1, w,h) {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'rgb(20,34,50)';
        //this.ctx.fillStyle = "black";
        //this.ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
        this.ctx.fillRect(x1, y1, w, h);
        this.ctx.closePath();
    }
    drawPolygon (color, arry, size) {
        this.ctx.beginPath();
        this.ctx.moveTo(arry[0].x + 0.5, arry[0].y + 0.5);
        for (var i = 1; i < size; i++) {
            this.ctx.lineTo(arry[i].x + 0.5, arry[i].y + 0.5);
        }
        //this.ctx.fillStyle = "rgba(0,0,200, 0.5)";
        this.ctx.globalAlpha = 0.7;
        this.ctx.fillStyle = color;
        this.ctx.fill();
        //this.ctx.strokeStyle = 'rgba(0, 255, 0)';
        //this.ctx.stroke();
        this.ctx.globalAlpha = 1.0;
        this.ctx.closePath();
    }
    drawFill (color, x1, y1, x2, y2) {
        this.ctx.beginPath();
        //this.ctx.globalAlpha = 0.7;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
        //this.ctx.globalAlpha = 1.0;
        this.ctx.closePath();
    }
    drawWhiteStick (x, candle_w, open, high, low, close, stroke_color, edge) {
        this.ctx.beginPath();
        var xLinePoint = (candle_w / 2) >> 0;
        this.ctx.fillStyle = 'rgb(255,90,80)';
        this.ctx.fillRect(x + 0.5, close + 0.5, candle_w, open - close);
        var candle_color = 'rgb(20,35,50)';
        if (edge) {
            this.ctx.strokeStyle = stroke_color;
            this.ctx.strokeRect(x + 0.5, close + 0.5, candle_w, open - close);
            candle_color = stroke_color;
        }
        if (high != open) {
            this.drawLine(candle_color, x + xLinePoint, high, x + xLinePoint, close);
        }
        if (low != close) {
            this.drawLine(candle_color, x + xLinePoint, open, x + xLinePoint, low);
        }
        this.ctx.closePath();
    }
    drawBlackStick (x, candle_w, open, high, low, close, stroke_color, edge) {
        this.ctx.beginPath();
        var xLinePoint = (candle_w / 2) >> 0;
        this.ctx.fillStyle = 'rgb(80,120,165)';
        this.ctx.fillRect(x + 0.5, open + 0.5, candle_w, close - open);
        var candle_color = 'rgb(80,120,165)';
        if (edge) {
            this.ctx.strokeStyle = stroke_color;
            this.ctx.strokeRect(x + 0.5, open + 0.5, candle_w, close - open);
            candle_color = stroke_color;
        }
        if (high != open) {
            this.drawLine(candle_color, x + xLinePoint, high, x + xLinePoint, open);
        }
        if (low != close) {
            this.drawLine(candle_color, x + xLinePoint, close, x + xLinePoint, low);
        }
        this.ctx.closePath();
    }
    drawUpperSemicircle (color, x, y, w) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.arc(x, y, w, 0, Math.PI, true);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    drawLowerSemicircle (color, x, y, w) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.arc(x, y, w, 0, Math.PI, false);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    drawEllipse (color, x1, y1, w) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.arc(x1, y1, w, 0, Math.PI * 2, true);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    drawEllipse(color, x1, y1, w) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.arc(x1, y1, w, 0, Math.PI * 2, true);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    drawEllipseOblong(color, cx, cy, w, h) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        const lx = cx - w/2,
            rx = cx + w/2,
            ty = cy - h/2,
            by = cy + h/2;
        const magic = 0.551784;
        const xmagic = magic*w/2;
        const ymagic = h*magic/2;
        this.ctx.moveTo(cx,ty);
        this.ctx.bezierCurveTo(cx+xmagic,ty,rx,cy-ymagic,rx,cy);
        this.ctx.bezierCurveTo(rx,cy+ymagic,cx+xmagic,by,cx,by);
        this.ctx.bezierCurveTo(cx-xmagic,by,lx,cy+ymagic,lx,cy);
        this.ctx.bezierCurveTo(lx,cy-ymagic,cx-xmagic,ty,cx,ty);
        this.ctx.stroke();
    }
    drawCircle(color, cx, cy, w, h) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        const lx = cx - w,
            rx = cx + w,
            ty = cy - h,
            by = cy + h;
        const magic = 0.551784;
        const xmagic = magic*w;
        const ymagic = h*magic;
        this.ctx.moveTo(cx,ty);
        this.ctx.bezierCurveTo(cx+xmagic,ty,rx,cy-ymagic,rx,cy);
        this.ctx.bezierCurveTo(rx,cy+ymagic,cx+xmagic,by,cx,by);
        this.ctx.bezierCurveTo(cx-xmagic,by,lx,cy+ymagic,lx,cy);
        this.ctx.bezierCurveTo(lx,cy-ymagic,cx-xmagic,ty,cx,ty);
        this.ctx.stroke();
    }
    drawEllipseFill (color_strok, color_fill, x1, y1, w) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color_strok;
        this.ctx.lineWidth = 1;
        this.ctx.arc(x1, y1, w, 0, Math.PI * 2, true);
        this.ctx.stroke();
        this.ctx.fillStyle = color_fill;
        this.ctx.fill();
        this.ctx.closePath();
    }
    drawBlend(color, alpha, x, y, w, h) {
        this.ctx.beginPath();
        //this.ctx.fillStyle = "rgba(45,58,80, 0.5)";
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
        this.ctx.fillStyle = "#ffffff";
        this.ctx.globalAlpha = 1.0;
        this.ctx.closePath();
    }
    drawStrokRect(color, linew, x, y, w, h) {
        this.ctx.beginPath();
        this.ctx.lineWidth = linew;
        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(x, y, w, h);
        this.ctx.closePath();
    }
    drawRect(color, x, y, w, h) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(x, y, w, h);
        this.ctx.closePath();
    }
    drawFillRect(color, strokeColor, x, y, w, h) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = strokeColor;
        this.ctx.strokeRect(x, y, w, h);
        this.ctx.closePath();
    }
    drawBlendRect(color, strokeColor, alpha, x, y, w, h) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = alpha;
        this.ctx.fillRect(x, y, w, h);
        this.ctx.globalAlpha = 1.0;
        this.ctx.strokeStyle = strokeColor;
        this.ctx.strokeRect(x, y, w, h);
        this.ctx.closePath();
    }
    drawRoundedRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x+radius,y);
        this.ctx.arcTo(x+width, y,        x+width, y+height, radius);
        this.ctx.arcTo(x+width, y+height, x,       y+height, radius);
        this.ctx.arcTo(x,       y+height, x,       y,        radius);
        this.ctx.arcTo(x,       y,        x+width, y,        radius);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    drawFillRoundRect(color, strokeColor, x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = strokeColor;
        this.ctx.fillStyle = color;
        this.ctx.moveTo(x+radius,y);
        this.ctx.arcTo(x+width, y,        x+width, y+height, radius);
        this.ctx.arcTo(x+width, y+height, x,       y+height, radius);
        this.ctx.arcTo(x,       y+height, x,       y,        radius);
        this.ctx.arcTo(x,       y,        x+width, y,        radius);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
    }


}

