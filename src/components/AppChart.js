import { Line } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import { changePrice } from "../redux/PriceSlice";

const AppChart = ({ handleLatestPrice }) => {
    const dispatch = useDispatch();

    const colors = {
        purple: "#4B40EE",
        grey: "rgba(232, 231, 255, 0.9)",
        lightgrey: "rgba(232, 231, 255, 0.6)",
        black: "#1A243A",
        white: "rgba(255, 255, 255, 0.7)",
        silver: "rgba(153, 153, 153, 1)",
        transparentSilver: "rgba(153, 153, 153, 0.6)",
        lightSilver: "rgba(226, 228, 231, 0.6)",
    }

    // custom tooltip block
    const getOrCreateTooltip = (chart) => {
        let tooltipEl = chart.canvas.parentNode.querySelector(".tooltipDesign");
        if(!tooltipEl) {
            tooltipEl = document.createElement("div");
            tooltipEl.classList.add("tooltipDesign");
            let tooltipTable = document.createElement("table");
            tooltipTable.classList.add("tooltipTable");

            //apend to parent
            tooltipEl.appendChild(tooltipTable);
            chart.canvas.parentNode.appendChild(tooltipEl);
        }
        return tooltipEl;
    }

    //trigger for tooltip
    const externaltooltip = (context) => {
        const {chart, tooltip} = context;
        const tooltipEl = getOrCreateTooltip(chart);

        // hide if mouseout
        if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return ;
        }

        // Set Text
        if (tooltip.body) {
          const bodyLines = tooltip.body.map(b => b.lines);

          const tableHead = document.createElement('thead');

          bodyLines.forEach((body, i) => {
            const tr = document.createElement("tr");
            tr.style.borderWidth = 0;

            const th = document.createElement("th");
            th.style.borderWidth = 0;
            const text = document.createTextNode(body);

            th.appendChild(text);
            tr.appendChild(th);
            tableHead.appendChild(tr);
          });

          const tableRoot = tooltipEl.querySelector('.tooltipTable');

          // Remove old children
          while (tableRoot.firstChild) {
            tableRoot.firstChild.remove();
          }

          // Add new children
          tableRoot.appendChild(tableHead);
        }

        const {offsetLeft: positionX, offsetTop: positionY, offsetWidth} = chart.canvas;

        // Display, position, and set styles for font
        tooltipEl.style.opacity = 1;
        tooltipEl.style.left = positionX + offsetWidth + 'px';
        tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    }

    const horizantalTooltipLine = {
        id: "horizantalTooltipLine",
        afterDraw(chart, args, options) {
            if (chart.tooltip?._active && chart.tooltip?._active.length) {
                const { ctx, chartArea: { top, right, bottom, left, width, height }} = chart;
                const activePoint = chart.tooltip._active[0];

                ctx.save();

                ctx.strokeStyle = options.lineColor;
                ctx.setLineDash([6, 10]);

                // ctx.strokeReact(x0, y0, x1, y1)
                // x0, y0 = start cordinates
                // x1, y1 = horizontal and vertical length
                ctx.strokeRect(left, activePoint.element.y, width, 0);
                ctx.restore();
            }
        }
    }

    const verticalTooltipLine = {
        id: "verticalTooltipLine",
        afterDraw(chart, args, options) {
            if (chart.tooltip?._active && chart.tooltip?._active.length) {
                const { ctx, chartArea: { top, right, bottom, left, width, height }} = chart;
                const activePoint = chart.tooltip._active[0];

                ctx.save();

                ctx.strokeStyle = options.lineColor;
                ctx.setLineDash([6, 10]);

                // ctx.strokeReact(x0, y0, x1, y1)
                // x0, y0 = start cordinates
                // x1, y1 = horizontal and vertical length
                ctx.strokeRect(activePoint.element.x, top, 0, height);
                ctx.restore();
            }
        }
    }

    // custom currentValueBox block
    const getOrCreateCurrentValueBox = (chart) => {
        let currentValueEl = chart.canvas.parentNode.querySelector(".currentValueBoxDesign");
        if(!currentValueEl) {
            currentValueEl = document.createElement("div");
            currentValueEl.classList.add("currentValueBoxDesign");
            let currentValueTable = document.createElement("table");
            currentValueTable.classList.add("last-value");

            //apend to parent
            currentValueEl.appendChild(currentValueTable);
            chart.canvas.parentNode.appendChild(currentValueEl);
        }
        return currentValueEl;
    }

    //plugin for current value box 
    const currentValueBox = {
        id: "currentValueBox",
        afterDraw(chart, args, options) {
            // const tooltip = chart;
            const currentValueEl = getOrCreateCurrentValueBox(chart);
            const dataArray = chart.config._config?.data?.datasets[0]?.data;

            // Set Text
            const tableHead = document.createElement('thead');
            if (dataArray && dataArray.length) {
                const tr = document.createElement("tr");
                tr.style.borderWidth = 0;

                const th = document.createElement("th");
                th.style.borderWidth = 0;
                const text = document.createTextNode(dataArray[dataArray.length - 1]);
                dispatch(changePrice(dataArray[dataArray.length - 1]))

                th.appendChild(text);
                tr.appendChild(th);
                tableHead.appendChild(tr);
            }
            const tableRoot = currentValueEl.querySelector('.last-value');

            // Remove old children
            while (tableRoot.firstChild) {
              tableRoot.firstChild.remove();
            }

            // Add new children
            tableRoot.appendChild(tableHead);

            const {offsetLeft: positionX, offsetTop: positionY, offsetWidth} = chart.canvas;

            // Display, position, and set styles for font
            currentValueEl.style.left = positionX + offsetWidth + 'px';
            currentValueEl.style.top = positionY + chart.getDatasetMeta(0).data[dataArray?.length - 1]?.y + 'px';
        }
    }

    //plugin for fixedVerticalGridLines
    const fixedVerticalGridLines = {
        id: "fixedVerticalGridLines",
        afterDraw(chart, args, options) {
            const { ctx, chartArea: { top, right, bottom, left, width, height }} = chart;
            ctx.save();

            ctx.strokeStyle = options.lineColor;

            // ctx.strokeReact(x0, y0, x1, y1)
            // x0, y0 = start cordinates
            // x1, y1 = horizontal and vertical length
            ctx.strokeRect(width/6, top, 0, height);
            ctx.strokeRect(width/6 * 2, top, 0, height);
            ctx.strokeRect(width/6 * 3, top, 0, height);
            ctx.strokeRect(width/6 * 4, top, 0, height);
            ctx.strokeRect(width/6 * 5, top, 0, height);
            ctx.restore();
        }
    }

    const chartData = (canvas) => {
        const data = [];
        const labelsData = [];

        // bar chart data
        const bardata = [];

        let prev = 100;
        for (let i = 0, j=1900; i < 122 && j < 2021; i++ && j++) {
            prev += 5 - Math.random() * 10;
            data.push(prev.toFixed(2));
            labelsData.push(j.toString());
        }

        for (let i = 0; i < 122; i++) {
            let prev = Math.random() * 10;
            bardata.push(prev.toFixed(2));
        }

        const ctx = canvas.getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        
        gradient.addColorStop(0, colors["grey"]);
        gradient.addColorStop(0.5, colors["lightgrey"]);
        gradient.addColorStop(1, colors["white"]);
        
        return {
            labels: labelsData,
            datasets: [
                {
                    label: "",
                    fill: true,
                    backgroundColor: gradient,
                    borderColor: colors["purple"],
                    borderWidth: 2,
                    radius: 0,
                    data,
                },
                {
                    type: "bar",
                    label: "",
                    backgroundColor: colors["transparentSilver"],
                    data: bardata,
                }
            ]
        }
    }

    const chartOptions = {
        scales: {
            x: {
                grid: {
                    display: true,
                    drawBorder: false,
                    drawOnChartArea: false,
                    drawTicks: false,
                },
                ticks: {
                    display: false
                }
            },
            y: {
                display: false,
            }
        },
        plugins: {
            legend: false,
            tooltip: {
                // Disable the on-canvas tooltip
                enabled: false,
                intersect: false,
                external: externaltooltip,
            },
            horizantalTooltipLine: {
                lineColor: colors["silver"],
                elementPosition: 3 
            },
            verticalTooltipLine: {
                lineColor: colors["silver"],
                elementPosition: 3
            },
            fixedVerticalGridLines: {
                lineColor: colors["lightSilver"]
            }
        },
    }

    return (
        <div className="app__chart">
            <Line 
                data={chartData} 
                options={chartOptions}
                plugins={[horizantalTooltipLine, verticalTooltipLine, currentValueBox, fixedVerticalGridLines]}
            />
        </div>
    )
}

export default AppChart;
