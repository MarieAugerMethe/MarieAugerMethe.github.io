/* Javascript with code specific for the sampling distribution chapter.
/* Date: 2021-04-20
/* Author: Rodolfo Lourenzutti*/

get_data_from_table = (table_name, collapsible = false) =>{ 
	const table = document.getElementById(table_name);
	const entries_pop = table.querySelectorAll("td");
    let data;
    if (collapsible) data = Array((entries_pop.length-3)/2);
    else data = Array(entries_pop.length/2);
       
	let cont = 0;
	entries_pop.forEach(
		(entry) => {
			value = parseFloat(entry.textContent);
			if (!isNaN(value)) {
				data[cont++] = parseFloat(entry.textContent);
				entry.value = value;
			}
		}
	);
	return data;
}

selectConfigureSVG = (id, height = 400) => {
    let svg = d3.select('#' + id);
    svg.selectAll("*").remove();
    svg.attr('width', width)
        .attr('height', height + margin.top + margin.bottom )
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    return svg;
}

makeXAxis = (bins, xLabel, height = 400) => {
    x = d3.scaleLinear()
    .domain([bins[0].x0 - 1, bins[bins.length - 1].x1 + 5])
    .range([margin.left, width - margin.right]);

    xAxis = g => g
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 100).tickSizeOuter(0))
    .call(g => g.append("text")
        .attr("x", width / 2)
        .attr("y", 7)
        .attr("fill", "currentColor")
        .attr("font-weight", "bold")
        .attr("text-anchor", "bottom")
        .attr('font-size', '16px')
        .attr("class", "axis")
        .attr("dy", "2.5em")
        .text(xLabel)
        .attr("class","axes-label"));

        return [x, xAxis];

}

makeYAxis = (bins, height = 400) => {
    y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length) + 10]).nice()
        .range([height - margin.bottom, margin.top]);

    yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(height / 100))
        .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", -(height - margin.bottom)/3)
        .attr("y", -45)
        .attr("font-weight", "bold")
        .attr('font-size', '16px')
        .attr('transform', 'rotate(270)')
        .attr("text-anchor", "middle")
        .text("Frequency")
        .attr("class","axes-label"));

        return [y, yAxis];
}

appendBars = (svg, bins, x, y) => {
    svg.append("g")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("x", d => x(d.x0) + 1)
        .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr("y", d => y(d.length))
        .attr("height", d => y(0) - y(d.length))
        .attr("class", 'bin');
}

appendTitle = (svg, title) => {
    svg.append("text")
    .attr("x", width / 2)
    .attr("y", 50)
    .attr("text-anchor", "middle")
    .text(title)
    .attr("dy", "-15px")
    .attr("class", "plot-title");
}

appendAxes = (svg, xAxis, yAxis) => {
    svg.append("g")
        .call(xAxis);
    
    svg.append("g")
        .call(yAxis);
}

makeHistogram = (id, data, nbins, title, xLabel, height = 400) => {
    let svg = selectConfigureSVG(id, height);
    
    let bins = d3.bin()
        .thresholds(nbins)(data);

    [x, xAxis] = makeXAxis(bins, xLabel, height);
    [y, yAxis] = makeYAxis(bins, height);
    appendBars(svg, bins, x, y);
    //appendTitle(svg, title);
    appendAxes(svg, xAxis, yAxis);
}


/** Getting the calculated style properties */
const pop_dist = document.getElementById('pop-dist-stat-100-grades').parentElement;
let margin = { top: 25, right: 30, bottom: 25, left: 60 },
    height = 400,
    width = pop_dist.clientWidth - parseInt(window.getComputedStyle(pop_dist).paddingRight);

/****************************************
*** Creates the Population Distribution
*** for the STAT 100 grades
*****************************************/
grades = get_data_from_table("pop-grades");
makeHistogram("pop-dist-stat-100-grades", grades, 6, "Population distribution STAT 100 grades", "Final Grades", height = 400)