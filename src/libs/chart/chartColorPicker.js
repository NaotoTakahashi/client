import ChartButton from './chartButton';
import ChartSlider from './chartSlider';

const HUE_NUM = 359;
const SAT_NUM = 100;
const VAL_NUM = 100;

class ChartColorLabel {
    constructor(chartCanvas) {
        this.m_cc = chartCanvas;
        this.m_label_rc = { left: 0, top: 0, right: 0, bottom: 0 };
        this.m_color = 'rgb(255,255,255)';
        this.m_selected = false;
    }
    init(color) {
        this.m_color = color;
    }
    getColor() {
        return this.m_color;
    }
    setSelected(boolVal) {
        this.m_selected = boolVal;
    }
    draw(rc) {
        this.m_label_rc.left = rc.left;
        this.m_label_rc.right = rc.right;
        this.m_label_rc.top = rc.top;
        this.m_label_rc.bottom = rc.bottom;

        let selectMargin = 0;
        if (this.m_selected) {
            selectMargin = 4;
        }
        let x1 = this.m_label_rc.left - selectMargin;
        let y1 = this.m_label_rc.top - selectMargin;
        let x2 = this.m_label_rc.right + selectMargin;
        let y2 = this.m_label_rc.bottom + selectMargin;
        this.m_cc.drawFill(this.m_color, x1, y1, x2, y2);
        const flameColor = 'rgb(190, 190, 190)';
        this.m_cc.drawThinLine(flameColor, x1, y1, x1, y2);
        this.m_cc.drawThinLine(flameColor, x1, y1, x2, y1);
        this.m_cc.drawThinLine(flameColor, x2, y1, x2, y2);
        this.m_cc.drawThinLine(flameColor, x2, y2, x1, y2);
    }
    //==============================================================================
    //  マウスエリア内判定
    //==============================================================================
    innerArea(x, y) {
        if (this.m_label_rc.left <= x && x <= this.m_label_rc.right) {
            if (this.m_label_rc.top <= y && y <= this.m_label_rc.bottom) {
                return true;
            }
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOUSE MOVE]
    //==============================================================================
    uiEvtMouseMovePerformed(x, y) {
        if (this.innerArea(x, y)) {
            return true;
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [LEFT BUTTON PUSHED]
    //==============================================================================
    uiEvtMouseLeftPerformed(x, y) {
        if (this.innerArea(x, y)) {
            return true;
        }
    }
    //==============================================================================
    //	UI EVENT [BUTTON PUSH UP]
    //==============================================================================
    uiEvtMouseUpPerformed(x, y) {
        if (this.innerArea(x, y)) {
            return true;
        }
        return false;
    }
}
export class ChartColorParamLabel extends ChartColorLabel {
    constructor(chartCanvas) {
        super(chartCanvas);
        this.m_rgb = '0,0,0';
    }
    init(rgb) {
        this.m_rgb = rgb;
        this.m_color = 'rgb(' + rgb + ')';
    }
    getRGB() {
        return this.m_rgb;
    }
    getRGBArray() {
        return this.m_rgb.split(",");
    }
    setRGB(rgbArry) {
        let s = '' + rgbArry[0] + ',' + rgbArry[1] + ',' + rgbArry[2];
        this.init(s);
    }
    draw(rc) {
        this.m_label_rc.left = rc.left;
        this.m_label_rc.right = rc.right;
        this.m_label_rc.top = rc.top;
        this.m_label_rc.bottom = rc.bottom;

        let x1 = rc.left;
        let y1 = rc.top;
        let x2 = rc.right;
        let y2 = rc.bottom;

        const flameColor = 'rgb(190, 190, 190)';
        this.m_cc.drawThinLine(flameColor, x1, y1, x1, y2);
        this.m_cc.drawThinLine(flameColor, x1, y1, x2, y1);
        this.m_cc.drawThinLine(flameColor, x2, y1, x2, y2);
        this.m_cc.drawThinLine(flameColor, x2, y2, x1, y2);

        let selectMargin = 4;
        x1 += selectMargin;
        y1 += selectMargin;
        x2 -= selectMargin;
        y2 -= selectMargin;
        this.m_cc.drawFill(this.m_color, x1, y1, x2, y2);
    }
}
export default class ChartColorPicker {
    constructor(chartCanvas) {
        this.m_cc = chartCanvas;
        this.m_enabled = true;
        this.m_hue_rc = { left: 0, top: 0, right: 0, bottom: 0 };
        this.m_val_rc = { left: 0, top: 0, right: 0, bottom: 0, width: 13 };
        this.m_selected_hue = HUE_NUM;
        this.m_selected_sat = SAT_NUM;
        this.m_selected_hue_pos = { x: 0, y: 0 };
        this.m_selected_val_pos = { x: 0, y: 0 };
        this.m_pushed_hue_pushed = false;
        this.m_pushed_val_pushed = false;
        this.m_selectedColor = '';
        this.m_curColor = [0,0,0];
        this.m_basicColor = Array(40);
        this.setBasicColor();
        this.m_basicColorLabel = Array(40);
        for (let i = 0; i < this.m_basicColorLabel.length; i++) {
            this.m_basicColorLabel[i] = new ChartColorLabel(chartCanvas);
            this.m_basicColorLabel[i].init(this.toRGBStr(this.m_basicColor[i]));
        }
        this.m_slider = new Array(3);
        this.m_sliderName = new Array(3);
        for (let i = 0; i < this.m_slider.length; ++i) {
            this.m_slider[i] = new ChartSlider();
            this.m_slider[i].init(0, 255, 1, 100);
            this.m_sliderName[i] = 'NOSET';
        }
    }
    init(color) {
        this.m_selectedColor = color;
    }
    setBasicColor() {
        this.m_basicColor[0] = [255, 128, 128];
        this.m_basicColor[1] = [255, 255, 128];
        this.m_basicColor[2] = [128, 255, 128];
        this.m_basicColor[3] = [0, 255, 128];
        this.m_basicColor[4] = [128, 255, 255];
        this.m_basicColor[5] = [0, 128, 255];
        this.m_basicColor[6] = [255, 128, 192];
        this.m_basicColor[7] = [255, 128, 255];
        this.m_basicColor[8] = [0, 0, 128];
        this.m_basicColor[9] = [255, 255, 255];
        this.m_basicColor[10] = [255, 0, 0];
        this.m_basicColor[11] = [255, 255, 0];
        this.m_basicColor[12] = [128, 255, 0];
        this.m_basicColor[13] = [0, 255, 64];
        this.m_basicColor[14] = [0, 255, 255];
        this.m_basicColor[15] = [0, 128, 192];
        this.m_basicColor[16] = [128, 128, 192];
        this.m_basicColor[17] = [255, 0, 255];
        this.m_basicColor[18] = [0, 0, 64];
        this.m_basicColor[19] = [192, 192, 192];
        this.m_basicColor[20] = [128, 64, 64];
        this.m_basicColor[21] = [255, 128, 64];
        this.m_basicColor[22] = [0, 255, 0];
        this.m_basicColor[23] = [0, 128, 128];
        this.m_basicColor[24] = [0, 64, 128];
        this.m_basicColor[25] = [128, 128, 255];
        this.m_basicColor[26] = [128, 0, 64];
        this.m_basicColor[27] = [255, 0, 128];
        this.m_basicColor[28] = [128, 128, 64];
        this.m_basicColor[29] = [128, 128, 128];
        this.m_basicColor[30] = [128, 0, 0];
        this.m_basicColor[31] = [255, 128, 0];
        this.m_basicColor[32] = [0, 128, 0];
        this.m_basicColor[33] = [0, 128, 64];
        this.m_basicColor[34] = [0, 0, 255];
        this.m_basicColor[35] = [0, 0, 160];
        this.m_basicColor[36] = [128, 0, 128];
        this.m_basicColor[37] = [128, 0, 255];
        this.m_basicColor[38] = [128, 128, 0];
        this.m_basicColor[39] = [0, 0, 0];
    }
    setEnabled(boolVal) {
        this.m_enabled = boolVal;
        this.m_pushed_hue_pushed = false;
        this.m_pushed_val_pushed = false;
    }
    getSelectValue() {
        return this.m_selectedColor;
    }
    getSelectRGBValue() {
        return this.m_curColor;
    }
    isEnabled() {
        return this.m_enabled;
    }
    draw(rc) {

        if (!this.m_enabled) {
            return;
        }

        // HUEパレットグラデーション部定義
        this.m_hue_rc.left = rc.left + 8;
        this.m_hue_rc.right = this.m_hue_rc.left + HUE_NUM + 1;
        this.m_hue_rc.top = rc.top + 6;
        this.m_hue_rc.bottom = this.m_hue_rc.top + SAT_NUM;

        // HUEパレットグラデーション部描画
        for (let s = 0; s <= SAT_NUM; s++) {
            for (let h = 0; h <= HUE_NUM; h++) {
                let hue = HUE_NUM - h;
                let sat = SAT_NUM - s;
                this.m_cc.ctx.fillStyle = 'rgb(' + this.hsvToRgb(hue, sat / SAT_NUM, 1).join(",") + ')';
                this.m_cc.ctx.fillRect(this.m_hue_rc.left + h, this.m_hue_rc.top + s, 1, 1);
            }
        }
        // HUE選択マーク
        if (0 <= this.m_selected_hue_pos.x && 0 <= this.m_selected_hue_pos.y) {
            let select_x = this.m_hue_rc.left + this.m_selected_hue_pos.x;
            let select_y = this.m_hue_rc.top + this.m_selected_hue_pos.y;
            let x1 = select_x - 5;
            let x2 = select_x + 5;
            let y1 = select_y - 5;
            let y2 = select_y + 5;
            this.m_cc.drawLine("black", x1, select_y, x2, select_y);
            this.m_cc.drawLine("black", select_x, y1, select_x, y2);
        }

        // VAL彩度グラデーション部定義
        this.m_val_rc.left = this.m_hue_rc.right + 7;
        this.m_val_rc.right = this.m_val_rc.left + this.m_val_rc.width;
        this.m_val_rc.top = this.m_hue_rc.top;
        this.m_val_rc.bottom = this.m_val_rc.top + VAL_NUM;

        // VAL彩度グラデーション部描画
        let value = 1.0;
        let [hue, sat] = this.getSelectedHV();
        for (let v = 0; v <= VAL_NUM; v++) {
            this.m_cc.ctx.fillStyle = 'rgb(' + this.hsvToRgb(hue, sat / SAT_NUM, value).join(",") + ')';
            this.m_cc.ctx.fillRect(this.m_val_rc.left, this.m_val_rc.top + v, this.m_val_rc.width, 1);
            value -= 0.01
        }

        const lineColor = 'rgb(150,150,150)';
        const flameColor = 'rgb(255,255,255)';
        let x1 = this.m_val_rc.left;
        let x2 = this.m_val_rc.right;
        let y1 = this.m_val_rc.top;
        let y2 = this.m_val_rc.top + VAL_NUM;
        this.m_cc.drawLine(lineColor, x1, y1, x1, y2);
        this.m_cc.drawLine(lineColor, x1, y1, x2, y1);
        this.m_cc.drawLine(flameColor, x2, y1, x2, y2);
        this.m_cc.drawLine(flameColor, x2, y2, x1, y2);

        // VAL選択マーク
        let select_y = this.m_val_rc.top;
        if (0 <= this.m_selected_val_pos.y) {
            select_y = this.m_val_rc.top + this.m_selected_val_pos.y;
        }
        this.m_cc.drawSmallStringL('◀', this.m_val_rc.right, select_y - 6, lineColor);

        // 選択色描画
        let selected_val = 1;
        if (0 < this.m_selected_val_pos.y) {
            selected_val = 1 - (this.m_selected_val_pos.y * 0.01);
        }
        const selectedColorHeight = 25;
        if (this.m_selectedColor === '') {
            this.setSelectRGB();
        }
        let selectedColorBottom;
        {
            let x1 = this.m_hue_rc.left;
            let y1 = this.m_hue_rc.bottom + 6;
            let x2 = this.m_val_rc.right;
            let y2 = y1 + selectedColorHeight;
            selectedColorBottom = y2;
            const flameColor = 'rgb(190, 190, 190)';
            this.m_cc.drawThinLine(flameColor, x1, y1, x1, y2);
            this.m_cc.drawThinLine(flameColor, x1, y1, x2, y1);
            this.m_cc.drawThinLine(flameColor, x2, y1, x2, y2);
            this.m_cc.drawThinLine(flameColor, x2, y2, x1, y2);
            const margin = 5;
            this.m_cc.drawFill(this.m_selectedColor, x1 + margin, y1 + margin, x2 - margin + 2, y2 - margin + 2);
        }

        // 基本カラーラベル描画
        let label_rc;
        {
            const margin = 7;
            let label_width = 31;
            let label_height = 15;
            let lable_left = this.m_hue_rc.left + 4;
            let label_top = selectedColorBottom + 10;
            label_rc = { left: lable_left, top: label_top, right: lable_left + label_width, bottom: label_top + label_height };
            for (let i = 0; i < this.m_basicColor.length; i++) {
                this.m_basicColorLabel[i].draw(label_rc);
                if (0 < i && 0 === (i + 1) % 10) {
                    // 10列で下段へ移行
                    label_rc.left = lable_left;
                    label_rc.right = lable_left + label_width;
                    label_rc.top = label_rc.bottom + margin;
                    label_rc.bottom = label_rc.top + label_height;
                } else {
                    label_rc.left = label_rc.right + margin;
                    label_rc.right = label_rc.left + label_width;
                }
            }
            // 1回余分に加算したため戻す
            label_rc.bottom -= label_height;
        }

        // RGBスライダー描画
        let slider_width = 295;
        let slider_height = 30;
        let rgbStr = ['（Ｒ）', '（Ｇ）', '（Ｂ）'];
        let colorStr = ['red', 'green', 'blue'];
        let slider_rc = { left: label_rc.left, top: label_rc.bottom, right: label_rc.left + slider_width, bottom: label_rc.bottom + slider_height };
        for (let i = 0; i < this.m_slider.length; ++i) {
            this.m_slider[i].draw(slider_rc, this.m_cc);
            this.m_cc.drawStringL(rgbStr[i], slider_rc.right + 50, slider_rc.top + 9, 'white');
            slider_rc.top += slider_height;
            slider_rc.bottom = slider_rc.top + slider_height;
        }
    }
    getSelectedHV() {
        let hue = 100;
        let sat = 100;
        if (0 <= this.m_selected_hue_pos.x && 0 <= this.m_selected_hue_pos.y) {
            hue = HUE_NUM - this.m_selected_hue_pos.x;
            sat = SAT_NUM - this.m_selected_hue_pos.y;
        }
        return [hue, sat];
    }
    toRGBStr(rgbVal) {
        return 'rgb(' + rgbVal[0] + ',' + rgbVal[1] + ',' + rgbVal[2] + ')';
    }
    setCurrentColor(r, g, b) {
        this.m_slider[0].setCurValue(r);
        this.m_slider[1].setCurValue(g);
        this.m_slider[2].setCurValue(b);
        this.m_curColor[0] = r;
        this.m_curColor[1] = g;
        this.m_curColor[2] = b;
        this.m_selectedColor = 'rgb(' + r + ',' + g + ',' + b + ')';
        for (let i = 0; i < this.m_basicColorLabel.length; i++) {
            this.m_basicColorLabel[i].setSelected(false);
        }
    }
    setSelectRGB() {
        let [hue, sat] = this.getSelectedHV();
        let val = 1;
        if (0 < this.m_selected_val_pos.y) {
            val = 1 - (this.m_selected_val_pos.y * 0.01);
        }
        let [r, g, b] = this.hsvToRgb(hue, sat / SAT_NUM, val);
        this.setCurrentColor(r, g, b);
    }
    hsvToRgb(H, S, V) {
        const C = V * S;
        const Hp = H / 60;
        const X = C * (1 - Math.abs(Hp % 2 - 1));

        let R, G, B;
        if (0 <= Hp && Hp < 1) { [R, G, B] = [C, X, 0] };
        if (1 <= Hp && Hp < 2) { [R, G, B] = [X, C, 0] };
        if (2 <= Hp && Hp < 3) { [R, G, B] = [0, C, X] };
        if (3 <= Hp && Hp < 4) { [R, G, B] = [0, X, C] };
        if (4 <= Hp && Hp < 5) { [R, G, B] = [X, 0, C] };
        if (5 <= Hp && Hp < 6) { [R, G, B] = [C, 0, X] };

        let m = V - C;
        [R, G, B] = [R + m, G + m, B + m];

        R = Math.floor(R * 255);
        G = Math.floor(G * 255);
        B = Math.floor(B * 255);

        return [R, G, B];
    }
    //==============================================================================
    //  マウスエリア内判定
    //==============================================================================
    innerHue(x, y) {
        if (this.m_hue_rc.left <= x && x <= this.m_hue_rc.right) {
            if (this.m_hue_rc.top <= y && y <= this.m_hue_rc.bottom) {
                return true;
            }
        }
        return false;
    }
    innerVal(x, y) {
        let str_width = 12;
        if (this.m_val_rc.left <= x && x <= this.m_val_rc.right + str_width) {
            if (this.m_val_rc.top <= y && y <= this.m_val_rc.bottom) {
                return true;
            }
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOUSE MOVE]
    //==============================================================================
    uiEvtMouseMovePerformed(x, y) {
        if (!this.m_enabled) {
            return false;
        }
        if (this.innerHue(x, y) && this.m_pushed_hue_pushed) {
            this.m_selected_hue_pos.x = x - this.m_hue_rc.left;
            this.m_selected_hue_pos.y = y - this.m_hue_rc.top;
            this.setSelectRGB();
            return true;
        }
        if (this.innerVal(x, y) && this.m_pushed_val_pushed) {
            this.m_selected_val_pos.x = x - this.m_val_rc.left;
            this.m_selected_val_pos.y = y - this.m_val_rc.top;
            this.setSelectRGB();
            return true;
        }
        for (let i = 0; i < this.m_slider.length; ++i) {
            if (this.m_slider[i].uiEvtMouseMovePerformed(x, y)) {
                this.setCurrentColor(this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue(), this.m_slider[2].getCurValue());
                return true;
            }
        }
        this.m_pushed_hue_pushed = false;
        this.m_pushed_val_pushed = false;
        return false;
    }
    //==============================================================================
    //	UI EVENT [LEFT BUTTON PUSHED]
    //==============================================================================
    uiEvtMouseLeftPerformed(x, y) {
        if (!this.m_enabled) {
            return false;
        }
        if (this.innerHue(x, y)) {
            this.m_pushed_hue_pushed = true;
            this.m_pushed_val_pushed = false;
            this.m_selected_hue_pos.x = x - this.m_hue_rc.left;
            this.m_selected_hue_pos.y = y - this.m_hue_rc.top;
            this.setSelectRGB();
            return true;
        }
        if (this.innerVal(x, y)) {
            this.m_pushed_val_pushed = true;
            this.m_pushed_hue_pushed = false;
            this.m_selected_val_pos.x = x - this.m_val_rc.left;
            this.m_selected_val_pos.y = y - this.m_val_rc.top;
            this.setSelectRGB();
            return true;
        }
        for (let i = 0; i < this.m_basicColorLabel.length; i++) {
            if (this.m_basicColorLabel[i].uiEvtMouseLeftPerformed(x, y)) {
                this.setCurrentColor(this.m_basicColor[i][0], this.m_basicColor[i][1], this.m_basicColor[i][2]);
                this.m_basicColorLabel[i].setSelected(true);
                return true;
            }
        }
        for (let i = 0; i < this.m_slider.length; ++i) {
            if (this.m_slider[i].uiEvtMouseLeftPerformed(x, y)) {
                return true;
            }
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [BUTTON PUSH UP]
    //==============================================================================
    uiEvtMouseUpPerformed(x, y) {
        this.m_pushed_hue_pushed = false;
        this.m_pushed_val_pushed = false;
        if (!this.m_enabled) {
            return false;
        }
        for (let i = 0; i < this.m_slider.length; ++i) {
            if (this.m_slider[i].uiEvtMouseUpPerformed(x, y)) {
                this.setCurrentColor(this.m_slider[0].getCurValue(), this.m_slider[1].getCurValue(), this.m_slider[2].getCurValue());
                return true;
            }
        }
        return false;
    }
    //==============================================================================
    //	UI EVENT [MOVE OUT]
    //==============================================================================
    uiEvtMouseOutPerformed() {
        this.m_pushed_hue_pushed = false;
        this.m_pushed_val_pushed = false;
    }
    //==============================================================================
    //	UI EVENT [MOVE IN]
    //==============================================================================
    uiEvtMouseInPerformed() {
        this.m_pushed_hue_pushed = false;
        this.m_pushed_val_pushed = false;
    }
}
