// CHART INIT ------------------------------**
let coffeedata;
let type = d3.select('#group-by').node().value;
let reverse = false;


// create svg with margin convention
const margin = {top: 20, right: 20, bottom: 20, left: 50};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom; 

const svg = d3.select('.chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


// create scales without domains
let xScale = d3.scaleBand()
    .rangeRound([0,width])
    .paddingInner(0.1);

let yScale = d3.scaleLinear()
    .range([height, 0]);


// create axes and axis title containers
let xAxis = d3.axisBottom()
    .scale(xScale);

let yAxis = d3.axisLeft()
    .scale(yScale);

let xAxisGroup = svg.append('g')
    .attr('class', 'axis x-axis');

let yAxisGroup = svg.append('g')
    .attr('class', 'axis y-axis');

let yLabel = svg.append('text')
    .attr('class', 'y-axis-title')
    .attr('x', 5)
    .attr('y', 0)
    .attr('alignment-baseline', 'baseline')
    .text("Stores");

// (Later) Define update parameters: measure type, sorting direction

// CHART UPDATE FUNCTION -------------------**
function update(data, type, reverse){ //data key function? 
    coffeedata = data.sort(function(a,b) {
        if (reverse) {
            return a[type] - b[type];
        } else {
            return b[type] - a[type];
        }
    });

	// update domains
    xScale.domain(data.map(function(d) {
        return d.company;
    }));
    yScale.domain(d3.extent(data, d=> d[type]));

	// update bars
    let bars = svg.selectAll('.bar')
        .remove()
        .exit()
        .data(data, d=> d.company);
    
   bars.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) {
            return xScale(d.company);
        })
        .attr('y', height)
        .attr('width', xScale.bandwidth())
        .attr('height', 0)

        //transitions
        .merge(bars)
        .transition()
        .duration(1000)
        .delay(function(d, i) {
            return (i+1)*100;
        })
        .attr('x', function(d) {
            return xScale(d.company);
        })
        .attr('y', function(d) {
            return yScale(d[type]);
        })
        .attr('height', function(d) {
            return height - yScale(d[type]);
        })
        .attr('fill', d3.color('steelblue'));

	// update axes and axis title
    xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5, 's');

    yAxis = d3.axisLeft()
        .scale(yScale);
    
    xAxisGroup = svg.select('.x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    yAxisGroup = svg.select('.y-axis')
        .call(yAxis);

    yLabel = svg.select('.y-axis-title')
        .text(type);
    
    bars.exit().remove();
}

// CHART UPDATES ---------------------------**

// Loading data
d3.csv('coffee-house-chains.csv', d3.autoType).then(data => {
    
	update(data, type, reverse); // simply call the update function with the supplied data**

});

// (Later) Handling the type change
d3.select('#group-by').on('change', (event)=> {
    type = d3.select('#group-by').node().value;
    update(coffeedata, type, reverse);
})

// (Later) Handling the sorting direction change
d3.select('.button').on('click', (event)=> {
    reverse = !reverse;
    update(coffeedata, type, reverse);
})
