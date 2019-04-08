document.addEventListener("DOMContentLoaded", function(event) { 
  document.getElementById("download-to-svg").onclick = function(){
    var fileName = "skirt_draft.svg"
    var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({asString:true}));
    var link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
  }
});

/*fetch('http://localhost:3000/data')
  .then((response) => response.json())
  .then((data) => {
      var w = data.waist;
      var h = data.hip;
      var shd = data.side_hip_depth;
      var fhd = data.front_hip_depth;
      var bhd = data.back_hip_depth;
      var sl = data.skirt_length;
      var bha = data.back_hip_arc;
  })
    $.getJSON('/data.json', function (data) {
    console.log(data)
  
  .catch((e) => {
    console.log(e);
  });*/
//var dataurl = 'data.json';
function loadJSON(callback) {

  var skirtObj = new XMLHttpRequest();
  skirtObj.overrideMimeType("application/json");
  skirtObj.open('GET', '/data.json', true);
  skirtObj.onreadystatechange = function () {
  if (skirtObj.readyState == 4 && skirtObj.status == "200") {
  
  // .open will NOT return a value but simply returns undefined in async mode so use a callback
  callback(skirtObj.responseText);
  
  }
  }
  skirtObj.send(null);
  
  }
  

$(function() {
  paper.install(window);
  loadJSON(function(response) {
    skirt = JSON.parse(response);
    console.log(skirt.waist)
    paper.setup('papersc');
    with (paper) {
                
        var t;
        var scale = 10;
        var waist = skirt.waist * scale;
        var hip = skirt.hip * scale;
        var side_hip_depth = skirt.side_hip_depth * scale;
        var front_hip_depth = skirt.front_hip_depth *scale;
        var back_hip_depth = skirt.back_hip_depth * scale;
        var back_hip_arc = skirt.back_hip_arc * scale;
        var skirt_length = skirt.skirt_length * scale;
        var dart_placement = waist/8.5
        var dart_distances = [];
        var back_waist_arc = waist/4;
        var front_waist_arc = back_waist_arc + (0.5*scale);

        // calculate required measurements from entered measurements
        var hip_to_knee = ((skirt_length/scale) - (front_hip_depth/scale)) * scale
        var front_hip_arc = ((hip/2)/scale - (back_hip_arc)/scale + 0.5) * scale
        var hw = (hip - waist)/scale
        if (hw <= 4)
            dart_distances = [0.75, 0, 0.5, 0];
        else if (hw > 4 && hw <= 5) 
            dart_distances = [1, 0, 0.5, 0];
        else if (hw > 5 && hw <= 6)
            dart_distances = [0.625, 0.625, 0.5, 0];
        else if (hw > 6 && hw <= 7)
            dart_distances = [0.75, 0.75, 0.5, 0];
        else if (hw > 7 && hw <= 9)
            dart_distances = [0.875, 0.875, 0.375, 0.375];
        else if (hw > 9 && hw <= 10)
            dart_distances = [1*scale, 1*scale, 0.5*scale, 0.5*scale];
        else if (hw > 10 && hw <= 11)
            dart_distances = [1.125*scale, 1.125*scale, 0.625*scale, 0.625*scale];
        else if (hw > 11 && hw <= 12)
            dart_distances = [1.25*scale, 1.25*scale, 0.625*scale, 0.625*scale];
        else if (hw > 12 && hw <= 14)
            dart_distances = [1.375*scale, 1.375*scale, 0.625*scale, 0.625*scale];
        else console.log("<b> The system may not give an accurate draft for your skirt </b>");

        console.log(dart_distances)

        //back skirtdraft
        var FE = hip_to_knee;
        var EG = back_hip_depth;
        var GL1 = dart_placement;
        var R = dart_distances[0]/2;
        var L2U1 = 1.25 * scale;
        var T = dart_distances[1]/2;
        var U2P = back_waist_arc - dart_placement - (1.25 * scale)
        var CB = hip_to_knee;
        var BF = back_hip_arc + (0.5 * scale);
        var back_dart = 5 * scale;
        var top_hip_rise = 0.5 * scale;

        //front skirtdraft

        var S = dart_distances[2]/2;
        var V2N1 = 1.25 * scale;
        var W = dart_distances[3]/2;
        var QV1 = front_waist_arc - dart_placement; - (1.25 *scale)
        var HN2 = dart_placement;
        var HI = front_hip_depth;
        var IJ = hip_to_knee;
        var JB = front_hip_arc + (0.5 * scale);
        var front_dart = 3 * scale;

        //inner lines
        var EC = back_hip_arc + (0.5 * scale);
        var CI = front_hip_arc + (0.5 * scale);

        //begin drawing
        var Path1 = new Path();
        Path1.strokeColor = 'black';
        Path1.strokeWidth = 0.5;
        Path1.add(new Point(200, 200));
        Path1.add(new Point(200, CB+200));
        Path1.add(new Point(-BF+200, CB+200));
        Path1.add(new Point(-BF+200, 200));
        Path1.add(new Point(200, 200));

        var Path2 = new Path();
        Path2.strokeColor = 'black';
        Path2.strokeWidth = 0.5;
        Path2.add(new Point(200, 200));
        Path2.add(new Point(200, CB+200));
        Path2.add(new Point(JB+200, CB+200));
        Path2.add(new Point(JB+200, 200));
        Path2.add(new Point(200, 200));

        var Path3 = new Path();
        Path3.strokeColor = 'black';
        Path3.strokeWidth = 0.5;
        Path3.add(new Point(-BF+200, 200));
        Path3.add(new Point(-BF+200, -EG+200));
        Path3.add(new Point(-BF+GL1+200, -EG+200));
        Path3.add(new Point(-BF+GL1+R+200, -EG+back_dart+200));
        Path3.add(new Point(-BF+GL1+R+R+200, -EG+200));
        Path3.add(new Point(-BF+GL1+R+R+L2U1+200, -EG+200));
        Path3.add(new Point(-BF+GL1+R+R+L2U1+T+200, -EG+back_dart+200));
        Path3.add(new Point(-BF+GL1+R+R+L2U1+T+T+200, -EG+200));
        Path3.add(new Point(-BF+GL1+R+R+L2U1+T+T+U2P+200, -EG-top_hip_rise+200));
        Path3.arcTo(new Point(200, 190),new Point(200, 200));
        //Path3.add(new Point(-BF+200, 200));
        //Path3.add(new Point(200, 200));
        var text = new PointText(new Point(250, 208));
        text.fillColor = 'black';
        text.fontSize = 8;

        // Set the content of the text item:
        text.content = 'Front hip line';

        var text = new PointText(new Point(-BF+4+200, 250));
        text.fillColor = 'black';
        text.fontSize = 8;

        // Set the content of the text item:
        text.content = 'CB';


        var Path4 = new Path();
        Path4.strokeColor = 'black';
        Path4.strokeWidth = 0.5;
        Path4.add(new Point(JB+200, 200));
        Path4.add(new Point(JB+200, -EG+200));
        Path4.add(new Point(JB-HN2+200, -EG+200));
        Path4.add(new Point(JB-HN2-S+200, -EG+front_dart+200));
        Path4.add(new Point(JB-HN2-S-S+200, -EG+200));
        Path4.add(new Point(JB-HN2-S-S-V2N1+200, -EG+200));
        Path4.add(new Point(JB-HN2-S-S-V2N1-W+200, -EG+front_dart+200));
        Path4.add(new Point(JB-HN2-S-S-V2N1-W-W+200, -EG+200));
        Path4.add(new Point(JB-HN2-S-S-V2N1-W-W-QV1+200, -EG-top_hip_rise+200));
        Path4.arcTo(new Point(200, 190),new Point(200, 200));

        //myPath.add(new Point(-BF+200, -EG+200));
        //myPath.add(new point(GL1-BF+200, -EG+200));
        var text = new PointText(new Point(130, 208));
        text.fillColor = 'black';
        text.fontSize = 8;

        // Set the content of the text item:
        text.content = 'Back hip line';

        var text = new PointText(new Point(JB-14+200, 250));
        text.fillColor = 'black';
        text.fontSize = 8;

        // Set the content of the text item:
        text.content = 'CF';

paper.PaperScript.load();
}
//console.log(skirt);
    })
  });






//var skirt_draft = new Group (Path1, Path2, Path3, Path4);
//myPath.add(new Point(-BF+200, -EG+200));
//myPath.add(new point(GL1-BF+200, -EG+200));




// To calculate the position of the dart apex, move the apex point half the 
// distance from the dart right and down either 5 cm for for back or 3 cm for front.
// paper.js measures angles in degrees by default

// create 2 layers. One for the helper function rectangles and aone for the main 
// skirt draft
