function createChartWaiting(ctx) {
    const SLICES_PER_PERIOD = 10;
    const PERIODS = 3;

    function makeData(start, amp) {
        const SLICES = Math.floor(PERIODS * SLICES_PER_PERIOD) + 1;
        const labels = new Array(SLICES).fill('');
        const values = new Array(SLICES).fill(null).map((_, i) => amp * Math.sin(start + 2 * Math.PI * i / SLICES_PER_PERIOD));
        return {
            labels,
            values
        };
    }

    const initData = makeData(0, 0);

    const options = {
        type: 'line',
        data: {
            labels: initData.labels,
            datasets: [
                {
                    data: initData.values,
                    borderWidth: 1,
                    pointRadius: 0
                }
            ]
        },
        options: {
            scales: {
                xAxes: [{
                    display: false
                }],
                yAxes: [{
                    display: false,
                    ticks: {
                        suggestedMin: -1,
                        suggestedMax: 1
                    }
                }]
            },
            legend: false,
            responsive: false
        }
    };

    let chart = new Chart(ctx, options);

    function update() {
        if (!chart) {
            return;
        }
        const data = makeData(-new Date() / 1000, 0.75 + 0.25 * Math.sin(+new Date() / 500));
        chart.data.datasets[0].data = data.values;
        chart.update();
        setTimeout(update, 300)
    }
    update();

    return {
        destroy() {
            chart.destroy();
            chart = null;
        }
    };
}
