import obj_NK225 from './data/test_data_NK225_day';
import * as dataTopix from './data/test_data_TOPIX_day';
import obj_sony from './data/test_data_sony_1m';
import opt_obj from './data/test_data_option_day';
import ChartLib from './chartLib';

export default class ChartDemo {
	constructor(chartlib) {
        this.chartlib = chartlib;
    }
    startTopix () {
        this.chartlib.setOHLC(dataTopix.topix);
        //var times = 0;
        //var topix_tick_arry = new Array();
        //topix_tick_arry[0] = topix_tick1;
        //topix_tick_arry[1] = topix_tick2;
        //topix_tick_arry[2] = topix_tick3;
        //timer = window.setInterval(
        //function () {
        //    if (times == topix_tick_arry.length) {
        //        times = 0;
        //    }
        //    chart.setTick(topix_tick_arry[times++]);
        //},
        //2000
        //);
    }
}

