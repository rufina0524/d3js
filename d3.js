
// Transform SVG project from vertical to horizontal.
const diagonal = d3.svg.diagonal()
                  .projection(d => [d.y, d.x]);

// Zoom function.
const zoom = (element) => {
    element.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
};

const treeJson = d3.json('data.json', (error, treeData) => {

  // Zoom listener callback.
  const zoomListener = d3.behavior.zoom()
                        .scaleExtent([0.1, 3])
                        .on("zoom", () => {
                          zoom(svgGroup);
                        });

  // Drag listener callback.
  const dragListener = d3.behavior.drag()
                        .on("dragstart", () => {
                          console.info("[drag start]")
                        })
                        .on("drag", () => {
                          console.info("[drag]")
                        })
                        .on("dragend", () => {
                          console.info("[drag end]");
                        });

  // Create SVG Canvas.
  const baseSvg = d3.select('#tree-container')
                    .append('svg')
                    .attr('width', $(document).width())
                    .attr('height', $(document).height())
                    .call(zoomListener);

  // Create an SVG group which can be zoomed.
  const svgGroup = baseSvg.append('g');

  const tree = d3.layout.tree()
                .size([$(document).height(), $(document).width() / 2]);

  try {

  const nodes = tree.nodes(treeData).reverse();
  const links = tree.links(nodes);
  let translateX = $(document).width() * 0.25;
  let translateY = $(document).height() * 0.5;
  let i = 0;

  const node = svgGroup.selectAll('g.nodes')
                .data(nodes, (item) => item.id || (item.id = i++));

  // Create an SVG group for a node.
  // Note: By default, coordinates are for vertical presentation.
  //       For horizontal presentation, x-y corrdinates are reversed.
  const nodeEnter = node.enter().append('g')
                      .call(dragListener)
                      .attr('transform', (d, index) => {
                        translateY += index * 10;
                        return 'translate(' + d.y + ', ' + d.x + ')'
                      });

  // Create the circular node in the group.
  nodeEnter.append('circle')
    .attr('class', 'node-circle')
    .attr('r', 10)
    .style("fill", function(d) {
      return d._children || d.children ? "#0f0" : "#f00";
    });

  // Create text for the node.
  nodeEnter.append('text')
    .text((item) => item.name);


  // Create links path.
  const link = svgGroup.selectAll("path.link")
           .data(links, function(d) {
               return d.target.id;
           });

  link.enter()
    .insert('path', 'g')
    .attr('fill', 'none')
    .attr('stroke', 'blue')
    .attr('class', 'link')
    .attr('d', diagonal);

link.exit().remove();

}catch (e) {
  debugger
}
});
