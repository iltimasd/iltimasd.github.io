   var svg = d3.select("svg"),
   width = +svg.attr("width"),
   height = +svg.attr("height");
   var color = d3.scaleOrdinal(d3.schemeCategory20);
   var simulation = d3.forceSimulation()
   .force("link", d3.forceLink().id(function(d) { return d.id; })
     )
   .force("center", d3.forceCenter(width / 2, height / 2));
   d3.json("./chains.json", function(error, graph) {
     if (error) throw error;
     var link = svg.append("g")
     .attr("class", "links")
     .selectAll("line")
     .data(graph.links)
     .enter().append("line")
     .attr("stroke-width", function(d) { return Math.sqrt(d.value); });
     var node = svg.append("g")
     .attr("class", "nodes")
     .selectAll("circle")
     .data(graph.nodes)
     .enter().append("circle")
     .attr("r", 10)
     .attr("fill", function(d) { return color(d.group); })
     .call(d3.drag()
       .on("start", dragstarted)
       .on("drag", dragged)
       .on("end", dragended));
 //var g = svg.append("g");
 var texts = svg.append("g")
 .attr("class","labels")
 .selectAll("text.label")
 .data(graph.nodes)
 .enter().append("text")
 .attr("class", "label")
 .attr("fill", "black")
 .attr("dx", function(d){return 9})
 .text(function(d) {  return d.id;  });
 simulation
 .nodes(graph.nodes)
 .force("charge", d3.forceManyBody().strength(function(d) {
  d.weight = link.filter(function(l) {
  return l.source == d.id || l.target.index == d.index
  }).size();
  console.log(d.index+":"+d.weight);
  return (d.weight*-150)-100; 
}).distanceMax(300))
 .force("collide", d3.forceCollide().radius(function(d) { return 10; }))
 .on("tick", ticked);
 simulation.force("link")
 .links(graph.links)
 function ticked() {
   link
   .attr("x1", function(d) { return d.source.x; })
   .attr("y1", function(d) { return d.source.y; })
   .attr("x2", function(d) { return d.target.x; })
   .attr("y2", function(d) { return d.target.y; });
   node
   .attr("cx", function(d) { return d.x; })
   .attr("cy", function(d) { return d.y; });
   texts.attr("transform", function(d) {
     return "translate(" + d.x+10 + "," + d.y+10 + ")";
   });
 }
});
function dragstarted(d) {
  d3.select(".def")
  .attr("visibility","hidden")
  ;
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
  if(d.group!=3){
    if(d.group!=1){
      d3.select(".frame")
      .attr("src",d.src)
      ;
    }
  }
}
function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}
function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}