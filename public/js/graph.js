$(document).ready(() => {
  const currency = new Currency();
});

class Currency {
  constructor() {
    this.ctx = document.getElementById('graphics').getContext('2d');
    this.initCurrencyStatistics();
    this.getDataGraphics();
  }

  async getDataGraphics() {
    const result = await this.getCurrencyStatistics();
    this.drawGraphics(result);
  }

  initCurrencyStatistics() {
    setInterval(async () => {
      const result = await this.getCurrencyStatistics();
      this.drawGraphics(result);
    }, 20000);
  }

  async getCurrencyStatistics() {
    try {
      const response = await fetch('/statistics?duration=minutes&count=5');
      return await response.json();
    } catch (error) {
      alert(error);
    }
  }

  drawGraphics(result) {
    const datasets = [];

    for (let i in result.dataset) {
      if (result.dataset.hasOwnProperty(i)) {
        datasets.push(result.dataset[i]);
      }
    }

    const chart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: result.labels,
        datasets: datasets,
      },
      options: {}
    });
  }
}
