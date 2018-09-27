import {Component, OnInit} from '@angular/core';
import {logging} from 'selenium-webdriver';

@Component({
  selector: 'app-cuadrilla',
  templateUrl: './cuadrilla.component.html',
  styleUrls: ['./cuadrilla.component.css']
})
export class CuadrillaComponent implements OnInit {
  cuadrilla;
  values = [];
  numbers = [];
  firstValue;
  secondValue;
  error = false;
  showing = false;
  loosingCount = 0;
  canChoose = true;
  cuadrillaSize;
  timer = 0;
  firstclick = false;
  timeLimit = 60;
  timeInterval;
  findedCards = [];
  constructor() {
  }

  ngOnInit() {
    this.cuadrillaSize = 4;
    this.generateCuadrilla(this.cuadrillaSize);
  }

  generateAllNumbers(value) {
    const numStart = value;
    this.numbers = new Array((numStart * numStart) / 2);
    for (let x = 1; x <= this.numbers.length; x++) {
      this.numbers[x - 1] = x;
    }
  }

  generateCuadrillasValues(numStart) {
    const b = new Array(numStart);
    const maxValue = numStart * numStart;
    let canAdd = false;
    for (let i = 0; i < b.length; i++) {
      b[i] = new Array(numStart);
      for (let o = 0; o < b[i].length; o++) {
        canAdd = false;
        while (!canAdd) {
          let value = this.numbers[Math.floor(Math.random() * (maxValue - 1) + 0)];
          while (!value) {
            value = this.numbers[Math.floor(Math.random() * (maxValue - 1) + 0)];
          }
          if (this.canAddValue(value)) {
            b[i][o] = {
              canShow: false,
              value: value,
              hasPair: false,
              line: i,
              column: o
            };
            canAdd = true;
          }
        }
      }
    }
    this.cuadrilla = b;
  }

  getValue(data) {
    if (data.hasPair) {
      return data.value;
    } else {
      if (data.canShow) {
        return data.value;
      } else {
        return '????';
      }
    }
  }
  setValuestoPlay(value) {
    if (!this.firstValue) {
      this.firstValue = value;
      this.firstValue.canShow = true;
    } else {
      if (this.firstValue !== value) {
        this.secondValue = value;
        this.secondValue.canShow = true;
        if (this.firstValue.value === value.value) {
          this.firstValue.hasPair = true;
          value.hasPair = true;
          this.findedCards.push({...this.firstValue});
          this.findedCards.push({...value});
          this.firstValue = null;
        } else {
          this.loosingCount++;
          this.canChoose = false;
          setTimeout(() => {
            this.firstValue.hasPair = false;
            value.hasPair = false;
            value.canShow = false;
            this.firstValue.canShow = false;
            this.firstValue = null;
            this.secondValue.canShow = false;
            this.secondValue = null;
            this.canChoose = true;
          }, 500);
        }
      }
    }
    if (!this.firstclick) {
      this.timeInterval = setInterval(() => {
        if (this.timer !== this.timeLimit) {
          this.timer++;
        } else {
          this.loosingCount = 3;
          clearInterval(this.timeInterval);
        }
      }, 1000);
    }
    this.firstclick = true;
    if (this.checkIfwonPaa()) {
      clearInterval(this.timeInterval);
      this.timeLimit = 60;
      this.timer = 0;
      this.loosingCount = 0;
      this.findedCards = [];
      this.firstclick = false;
      alert('gano!');
      this.generateCuadrilla(4);
    }
  }

  setTimeLimit(time) {
    this.timeLimit = parseInt(time, 10);
  }

  secondsToMinutes(value) {
    const time = parseInt(value, 10);
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    let secondsString = `${seconds}`;
    if (seconds < 10) {
      secondsString = `0${seconds}`;
    }
    return `${minutes}:${secondsString}`;
  }

  checkIfwonPaa() {
    const won = this.cuadrilla.length * this.cuadrilla.length;
    let hasWon = 0;
    this.cuadrilla.forEach((row) => {
      row.forEach((value) => {
        if (value.hasPair) {
          hasWon++;
        }
      });
    });
    return hasWon === won;
  }

  generarValor(newValue) {
    if (parseInt(newValue, 10) % 2 === 0) {
      this.cuadrillaSize = parseInt(newValue, 10);
      this.generateCuadrilla(this.cuadrillaSize);
      this.error = false;
    } else {
      this.error = true;
    }
  }

  generateCuadrilla(valueNum) {
    this.values = [];
    const numStart = valueNum;
    this.generateAllNumbers(numStart);
    this.generateCuadrillasValues(numStart);
  }

  toggleShow() {
    this.showing = !this.showing;
    this.cuadrilla.forEach((row) => {
      row.forEach((value) => {
        value.canShow = this.showing;
      });
    });
  }

  canAddValue(value) {
    let permit = 0;
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i] === value) {
        permit++;
      }
    }
    if (permit === 2) {
      return false;
    } else {
      this.values.push(value);
      return true;
    }
  }

  getMatchingAmount() {
    let num = 0;
    this.cuadrilla.forEach((x) => x.forEach((card) => card.hasPair ? num++ : null));
    clearInterval(this.timeInterval);
    return num > 0 ? num / 2 : num;
  }

  playAgain() {
    this.loosingCount = 0;
    this.timer = 0;
    this.timeLimit = 60;
    this.firstclick = false;
    this.findedCards = [];
    this.generateCuadrilla(this.cuadrillaSize);
  }
 
}
