const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

let bar_chart = d3.select('#bar')

// define a compare function for the 
function compareVals(a, b) {
    return b.sample_value - a.sample_value;
}



d3.json(url).then( data => {

    let meta = data.metadata.filter(sample => sample.id == '940')[0]
    let samps = data.samples.filter(sample => sample.id == '940')[0]
    let otu_ids = samps.otu_ids.map(id => id.toString())
    let otu_labels = samps.otu_labels
    let sample_values = samps.sample_values


    var list = [];

    for (var i = 0; i < samps.sample_values.length; i++) {
        list.push({'otu_id': 'OTU ' + otu_ids[i], 
                   'sample_value': sample_values[i],
                   'otu_label': otu_labels[i]})
    };

    let top_ten = list.sort(compareVals).slice(0, 10).reverse();
    console.log(top_ten);

    let graph_data = [{
        x: top_ten.map(d => d.sample_value),
        y: top_ten.map(d => d.otu_id),
        text: top_ten.map(d => d.otu_label),
        type: 'bar',
        orientation: 'h'
    }];

    let layout = {
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
        },
        yaxis: {
            type: 'category'
        }
    };

    console.log(graph_data);

    Plotly.newPlot('bar', graph_data, layout);

});