class Tides {
  constructor(ocean) {
    this._dropHeight = 8;
    this._dropWidth = 8;
    this._dropSize = 4;
    this._drops = [];
    this._ocean = ocean;
    this._waves = this._ocean.getContext('2d');
    this.rain();

    document.body.classList.add('has-tides');
  }

  flood() {
    if (!document.body.classList.contains('has-canvas')) {
      document.body.classList.add('has-ocean');
    }

    console.log('Get ready, Noah!');
  }

  rain() {
    console.log('Make it rain!');

    let height = this._ocean.offsetHeight;
    let width = this._ocean.offsetWidth;
    let rows = Math.floor(height / this._dropHeight);
    let columns = Math.floor(width / this._dropWidth);
    
    for (let row = 0; row < rows; row++) {      
      for (let column = 0; column < columns; column++) {
        this._drops.push({
          row: row,
          column: column,
          x: column * this._dropWidth,
          y: row * this._dropHeight,
          scale: 1
        });
      }

      if (row = rows) {
        this.flood();
      }
    }
  }

  ripple(direction) {
    console.log('Surf’s up!');
  }
}

const ocean = document.querySelector('.ocean');
const waves = new Tides(ocean);
