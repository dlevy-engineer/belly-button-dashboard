// define the url where the JSON data can be retrieved
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// define a compare function for the 
function compareVals(a, b) {
    return b.sample_value - a.sample_value;
}

// load data with D3
d3.json(url).then( data => {

    // assign all data to variables
    let meta = data.metadata.filter(sample => sample.id == '940')[0]
    let samps = data.samples.filter(sample => sample.id == '940')[0]
    let otu_ids = samps.otu_ids.map(id => id.toString())
    let otu_labels = samps.otu_labels
    let sample_values = samps.sample_values

    // TOP TEN BAR CHART
    // instnatiate an empty list 
    var list = [];

    // populate the list with associated objects for clean sorting
    for (var i = 0; i < samps.sample_values.length; i++) {
        list.push({'otu_id': 'OTU ' + otu_ids[i], 
                   'sample_value': sample_values[i],
                   'otu_label': otu_labels[i]})
    };

    // sort the list, slice the first ten values and then reverse the array for Plotly
    let top_ten = list.sort(compareVals).slice(0, 10).reverse();

    // construct a data dictionary array for Plotly
    let bar_data = [{
        x: top_ten.map(d => d.sample_value),
        y: top_ten.map(d => d.otu_id),
        text: top_ten.map(d => d.otu_label),
        type: 'bar',
        orientation: 'h'
    }];

    // construct an object for layout specs
    let bar_layout = {
        margin: {
            l: 100,
            r: 100,
            t: 150,
            b: 50
        },
        yaxis: {
            type: 'category'
        }
    };

    // plot the bar chart
    Plotly.newPlot('bar', bar_data, bar_layout);


    // BUBBLE CHART
    // construct a data dictionary array for Plotly
    let bubble_data = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: 'Earth'
        }
    }];

    // plot the bubble chart
    Plotly.newPlot('bubble', bubble_data);


    // METADATA PANEL
    // construct the metadata panel by converting the `meta` object into an array of key-value pairs
    let demo_info = Object.entries(meta)

    d3.select('#sample-metadata').selectAll('p') // these paragraphs don't exist yet,
                                 .data(demo_info) // but we'll dynamically assign data to them
                                 .enter()
                                 .append('p') // add the paragraphs
                                 .text(d => d[0] + ': ' + d[1]); // assign formatted text

    var gauge_data = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: meta.wfreq,
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: { range: [0, 9] },
            steps: [
                { range: [0, 1], color: "lightgray" },
                { range: [1, 2], color: "gray" }
            ],
        }
    }];
    
    var gauge_layout = {margin: { t: 150, b: 50 } };
    Plotly.newPlot('gauge', gauge_data, gauge_layout);
});