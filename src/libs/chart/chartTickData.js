export default class ChartTickData {
	constructor() {
        this.m_tickList  = [];
        this.m_symbol    = "";
        this.m_highPrice = 0.0;
        this.m_lowPrice  = 0.0;
        this.m_maxVolume = 0;
    }
    init () {
        this.m_symbol = "";
        this.m_highPrice = 0.0;
        this.m_lowPrice = 0.0;
        this.m_maxVolume = 0;
    }
    clear (){
        this.m_tickList = [];
	    this.init();
    }
    add (obj){
        this.m_tickList.push(obj);
	    return true;	
    }
    getEntrySize() {
        return this.m_tickList.length;
    }
    updatePrice (priceVal){
        var price = Number(priceVal);
        if (this.m_highPrice == 0.0) {
            this.m_highPrice = price;
            this.m_lowPrice = price;
	    }else{
            if (this.m_highPrice < price) {
                this.m_highPrice = price;
            } else if (price < this.m_lowPrice) {
                this.m_lowPrice = price;
		    }
	    }
	    return;
    }
    updateVolume (volVal){
        var vol = Number(volVal);
	    if (vol <= 0) return;
	    if (this.m_maxVolume == 0) {
	        this.m_maxVolume = vol;
	    }else{
	        if (this.m_maxVolume < vol) {
	            this.m_maxVolume = vol;
		    }
	    }
	    return;
    }
	setSymbol (symbolVal) {
	    this.m_symbol = symbolVal;
	    return true;
    }
    getPriceRange(bgnIndex, dispEntryCnt) {
        let maxValue = 0, minValue = 0;
        let endCount = bgnIndex + dispEntryCnt;
        if(this.m_tickList.length < endCount){
            endCount = this.m_tickList.length;
        }
        for (let i = bgnIndex; i < endCount; ++i) {
            if (this.m_tickList[i] <= 0) continue;
            if (maxValue < this.m_tickList[i]) {
                maxValue = this.m_tickList[i];
            }
            if (this.m_tickList[i] < minValue || 0 === minValue) {
                minValue = this.m_tickList[i];
            }
        }
        return [maxValue, minValue];
    }
}

