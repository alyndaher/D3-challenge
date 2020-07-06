// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create SVG wrapper, append SVG group to hold the scatterplot chart
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Retrieve data from the CSV file and execute following code
d3.csv("assets/data/data.csv").then(function(alldata, err) {
    if (err) throw err;

    //parse data and convert to integer
    alldata.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    //console.log(alldata);

    //Create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([4, 26])
        .range([height, 0]);

    //Create x scale function
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(alldata, d => d.poverty)* 0.90, 
            d3.max(alldata, d => d.poverty) *1.1])
        .range([0,width]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    //append x axis
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(alldata)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 12)
        .attr("fill", "rgb(108,195,222)")
        .attr("opacity", ".8");
        

    //append State Abbreviations
    var abbrtext = chartGroup.selectAll("text")
        .data(alldata, function(d) {return d || this.textContent;});

        abbrtext.enter()
        .append("text")
        .text(function(d) {return `${d.abbr}`})
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("text-anchor", "middle")
        .attr("fill","white")
        .attr("font-size", "11px")
        .attr("font-weight","bold");


  // Create group for two y and x-axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertylabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") 
        .classed("active", true)
        .text("Poverty (%)");
    
    // append y-axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .classed("axis-text", true)
        .classed("active", true)
        .text("Lacks Healthcare (%)");

    
    });
