// define the url where the JSON data can be retrieved
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// start by defining dropdown values with the `names` list
d3.json(url).then( id_grab => {
    
    let otu_ids = id_grab.names
    
    d3.select('#selDataset').selectAll('option')
                            .data(otu_ids)
                            .enter()
                            .append('option')
                            .attr('value', id => id)
                            .text(id => id)

    init(otu_ids[0]); // call the initiation function with a starter value

});

// define a compare function for sorting
function compareVals(a, b) {

    return b.sample_value - a.sample_value;

}

// define an inital function that grabs the default dropdown value
function init(starter_subject) {
    
    grabData(starter_subject).then( initial_data =>

        plotData(initial_data)
    );

}

// the name of this function is referenced in the HTML file
function optionChanged(subject) {

    grabData(subject).then( new_data => {
        
        // restyling requires each trace to have its own array
        // newPlot calls are not expensive with this data quantity
        // so we simply redraw new plots from scratch
        plotData(new_data)

    });
};

function grabData(subj_id) {
    
    return d3.json(url).then( data => {
        
        // assign all data to variables
        let meta = data.metadata.filter(sample => sample.id == subj_id)[0]
        let samps = data.samples.filter(sample => sample.id == subj_id)[0]
        let otu_ids = samps.otu_ids.map(id => id.toString())
        let otu_labels = samps.otu_labels
        let sample_values = samps.sample_values

        // TOP TEN
        // instnatiate an empty list 
        var list = [];

        // populate the list with associated objects for clean sorting
        for (var i = 0; i < sample_values.length; i++) {
            list.push({
                'otu_id': 'OTU ' + otu_ids[i],
                'sample_value': sample_values[i],
                'otu_label': otu_labels[i]})
        };

        // sort the list, slice the first ten values and then reverse the array for Plotly
        let top_ten = list.sort(compareVals).slice(0, 10).reverse();
        
        return {
            'meta': meta,
            'otu_ids': otu_ids,
            'otu_labels': otu_labels,
            'sample_values': sample_values,
            'top_ten': top_ten
        }
    });
}

function plotData(datalist) {

        // construct a data dictionary array for Plotly
        let bar_data = [{
            x: datalist.top_ten.map(d => d.sample_value),
            y: datalist.top_ten.map(d => d.otu_id),
            text: datalist.top_ten.map(d => d.otu_label),
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
            x: datalist.otu_ids,
            y: datalist.sample_values,
            text: datalist.otu_labels,
            mode: 'markers',
            marker: {
                size: datalist.sample_values,
                color: datalist.otu_ids,
                colorscale: 'Earth'
            }
        }];

        // plot the bubble chart
        Plotly.newPlot('bubble', bubble_data);


        // METADATA PANEL
        // construct the metadata panel by converting the `meta` object into an array of key-value pairs
        let demo_info = Object.entries(datalist.meta)

        d3.select('#sample-metadata').html('') // clear anything already present
                                    .selectAll('p') // these paragraphs don't exist yet,
                                    .data(demo_info) // but we'll dynamically assign data to them
                                    .enter()
                                    .append('p') // add the paragraphs
                                    .text(d => d[0] + ': ' + d[1]); // assign formatted text

        var gauge_data = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: datalist.meta.wfreq,
            title: { text: "Belly Button Washing Frequency<br><sup>Scrubs per Week</sup>" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                bar: {
                    color: '#2a4858'
                },
                axis: { range: [0, 9] },
                steps: [
                    { range: [0, 1], color: "#c15151" },
                    { range: [1, 2], color: "#c85d46" },
                    { range: [2, 3], color: "#cc6c3b" },
                    { range: [3, 4], color: "#cb7b30" },
                    { range: [4, 5], color: "#c78c27" },
                    { range: [5, 6], color: "#bf9c22" },
                    { range: [6, 7], color: "#b2ad26" },
                    { range: [7, 8], color: "#a2bd34" },
                    { range: [8, 9], color: "#8ccc49" }
                ],
            }
        }];
        
        var gauge_layout = {margin: { t: 150, b: 50 } };
        Plotly.newPlot('gauge', gauge_data, gauge_layout);
}