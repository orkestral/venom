class Counter {
  constructor(msTime) {
    this.isFirstCall = true;
    this.startTime = '';
  }

  counterInit() {
    if (this.isFirstCall) {
      console.log(`Starting count down for close`);
      this.isFirstCall = false;
      this.startTime = new Date();
    } else return false;
  }

  getElapsedTime() {
    //console.log('Elapsed Time ' + this.calculateTime())
    return this.calculateTime();
  }

  calculateTime() {
    let currentTime = new Date();
    return Math.round(currentTime.getTime() - this.startTime.getTime());
  }
}
module.exports = Counter;
