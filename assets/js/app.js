console.log("Begin app.js");

var svgWidth = 1000;
var svgHeight = 800;

var margin = {
    top: 50,
    bottom: 100,
    right: 50,
    left: 50
};

var chartHeight = svgHeight - margin.top  - margin.bottom;
var chartWidth  = svgWidth  - margin.left - margin.right;

// create svg container
var svg = d3.select("#scatter")
.append("svg")
.attr("height", svgHeight)
.attr("width", svgWidth);

// shift everything over by the margins
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from our data csv
d3.csv("./assets/data/data.csv").then(function(healthFactors) {
    console.log("Reading the csv data");

    // cast all our numeric fields
    healthFactors.forEach(function(data) {
        data.poverty = +data.poverty;
        data.povertyMOE = +data.povertyMOE;
        data.age = +data.age;
        data.ageMOE = +data.ageMOE;
        data.income = +data.income;
        data.incomeMOE = +data.incomeMOE;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;
    });

    //     *** this was meant to verify that healthFactors values are indeed numeric ***
    // testArray = [];
    // for (i=0; i<healthFactors.length; i++)  {
    //     testArray.push(healthFactors[i].smokes + 1);
    // }
    // console.log(testArray);

    // create scales
    var xScale = d3.scaleLinear()
    .domain([d3.min(healthFactors, d => d.poverty)*.9, d3.max(healthFactors, d => d.poverty)])
    .range([0, chartWidth]);
    
    minHF = d3.min(healthFactors, d => d.smokes);
    console.log(minHF);
    maxHF = d3.max(healthFactors, d => d.smokes);
    console.log(maxHF);


    var yScale = d3.scaleLinear()
    .domain([d3.min(healthFactors, d => d.smokes)*.9, d3.max(healthFactors, d => d.smokes)*1.1])
    .range([chartHeight, 0]);

    // create axes
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // append axes
    svg.append("g")
    .attr("transform", `translate(${margin.left}, ${chartHeight+margin.top})`)
    .call(xAxis);

    svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .call(yAxis);

    // labels for axes
    svg.append("text")
        .attr("x", svgWidth / 2)
        .attr("y", chartHeight + margin.bottom)
        .attr("font-size", "22px")
        .style("text-anchor","middle")
        .text("% in Poverty");

    svg.append("text")
        .attr("transform","rotate(-90)")
        .attr("y", 0 )
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("font-size", "22px")
        .style("text-anchor","middle")
        .text("% Smokers");

    // setup the tool tip
    var tool_tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-8, 0])
      .html(function(d) { return `${d.state}<br>In Poverty: ${d.poverty}%<br>Smokes: ${d.smokes}%`; });
    svg.call(tool_tip);

    // append circles for datapoints

    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthFactors)
        .enter()
        .append("circle");

    var circlesAttributes = circlesGroup
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.smokes))
        .attr("r", "15")
        .attr("fill", "gold")
        .attr("stroke-width", "1")
        .attr("stroke", "black")
        .on("mouseover", tool_tip.show)
        .on("mouseout", tool_tip.hide);
    
    var txt = chartGroup.selectAll("text")
        .data(healthFactors)
        .enter()
        .append("text");

    var txtLabels = txt
            .attr("x", d => xScale(d.poverty))
            .attr("y", d => yScale(d.smokes)+4)  // slight offset to center this in the circle
            .text(d => d.abbr)
            .attr("text-anchor","middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px")
            .attr("stroke", "black")
            .attr("fill", "black")
            .on("mouseover", tool_tip.show)   // since text is plotted separately from circles,
            .on("mouseout", tool_tip.hide);   // we need this here as well as above

});

