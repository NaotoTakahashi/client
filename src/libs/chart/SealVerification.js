export default class SealVerification {
	constructor() {
        this.m_img = null;
        this.m_img_rc = null;
    }
    init () {
    }
    setSettingImg(src) {
        this.m_img = new Image();
        this.m_img.src = src;
    }
    setImagePos(rc) {
        this.m_img_rc = rc;
        this.m_img_rc.width =  rc.right - rc.left;
        this.m_img_rc.height = rc.bottom - rc.top;
    }
    draw(canvas) {
        if(this.m_img !== null){
            canvas.ctx.drawImage(this.m_img, this.m_img_rc.left, this.m_img_rc.top, this.m_img_rc.width, this.m_img_rc.height);
        }

    }
    onMousedown(e) {
    }
    onMousemove(e) {
    }
    onMouseup(e) {
    }
}
