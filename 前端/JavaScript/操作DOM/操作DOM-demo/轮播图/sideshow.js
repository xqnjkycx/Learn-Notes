/**
 * @imgSrcArray: 图片资源构成的数组
 * @switcher: 轮播图所需要适配切换方式
*/
class LjkSideShow{
    constructor(switcher){
        this.switcher = switcher;
    }
    go(){
        if(this.switcher === null) throw new Error("请先设置正确的switcher！！");
        if(this.switcher.autoPlay) this.switcher.play();
    }
}
/**
 * Switcher类是所有轮播切换动画的父类
*/
class LjkSwitcher{
    constructor(){
        this.imgSrcArr = null;
        this.switchDurationTime = 3000;
        this.looper = true;
        this.autoPlay = true;
    }
    setSwitcherDurationTime(t){
        this.setSwitchDurationTime = t;
    }
    setSwitcherLooper(t){
        this.looper = t;
    } 
    setSwitcherAutoPlay(t){
        this.autoPlay = t;
    }
    setImageSrcArr(arr){
        this.imgSrcArr = arr;
    }
}
/**
 * 直接切换
*/
class DirectlySwitcher extends LjkSwitcher{
    constructor(imgSrcArr,switchDurationTime,looper,autoPlay) {
        super(imgSrcArr,switchDurationTime,looper,autoPlay);
        this.oImg = document.querySelector("#ljkSideshowItem");
        this.idx = 0;
    }
    play(){
        let that = this;
        this.oImg.src = this.imgSrcArr[this.idx];
        setInterval(()=>{
            that._next();
        },that.switchDurationTime);
    }
    _next(){
        console.log(this.idx);
        this.idx == this.imgSrcArr.length ? this.idx = 0 : this.idx++;
        this.oImg.src = this.imgSrcArr[this.idx];
    }
}