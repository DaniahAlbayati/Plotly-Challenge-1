// Create Variables
var names = [];
var metadata = [];
var samples = [];

  // read Json
  d3.json("samples.json").then((data) =>{

    // Get the data
    names = data.names;
    metadata = data.metadata;
    samples = data.samples;

    console.log(names);

    init();
  });

function init() {
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("select");
  // Assigning ID to dropdownMenu
  names.forEach((sample) =>{
  dropdownMenu.append("option").text(sample).property("value",sample)});
    
  // assign the dropdown value to a variable
    var dropdown = dropdownMenu.property("value");
    console.log(dropdown)

    panel(dropdown);
    create_charts(dropdown);
  }

  function panel(dropdown){
  // read Json
  d3.json("samples.json").then((data) =>{
  // Get the data
  metadata = data.metadata;

  var subject = metadata.filter(sample_object => sample_object.id == dropdown);
  var results = subject[0];

  // use D3 to link the panel with the samplemetadata
  var panel = d3.select("#sample-metadata");
  // Use `.html("") to Clear any data
  panel.html("");

  // use the entries to add the keys/values to the panel
  Object.entries(results).forEach(([key, value]) => {
    panel.append("h5").text(`${key}:${value}`);
  });
})

  }
    // Build Bar/bubble Chart
    //Use `sample_values` as the values for the bar chart.
function create_charts(sample) {
// read Json
  d3.json("samples.json").then((data) => {

    //Get the data
  samples = data.samples;

  //filter the samples from the Json file
  var subject = samples.filter(sample_object => sample_object.id == sample);
  var results = subject[0];
  var otu_ids = results.otu_ids;
  var sample_values = results.sample_values;
  var otu_labels = results.otu_labels;

  // Build the bubble chart
var bubble = {
  x:otu_ids,
  y:sample_values,
  text: otu_labels,
  mode:'markers',
  marker:{
    size: sample_values,
    color: otu_ids,
    colorscale:"Earth"
  }
},

  data = [bubble];
  var layout ={
   title: "Belly Button Biodiversity",
   xaxis:{ title: "OTU_ IDS"}
 };
    Plotly.newPlot("bubble", data, layout);

// bar chart
var bar = [{
  x: sample_values.slice(0, 10).reverse(),
  y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
  type: "bar",
  orientation: "h",
}];

// Render the plot to the div tag with id "plot"
 Plotly.newPlot("bar", bar);
  });
};

function optionChanged (sample) {
panel(sample);
create_charts(sample);
}




