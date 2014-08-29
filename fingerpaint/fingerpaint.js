var canvas;
var strokeStyle = "red";
var lineWidth = "4";
var lineCap = "round";
var maxUndo = 20;
var undoData = new Array();
var redoData = new Array();
var lastX;
var lastY;

Array.prototype.clear=function()
{
	this.length = 0;
};
  
function $(id) 
{
	return document.getElementById(id);
}

function $n(name) 
{
	return document.getElementsByName(name);
}

function initCanvas()
{
	canvas = $("canvas").getContext("2d");
	$("canvas").width = $("canvas").width;
	
	canvas.strokeStyle = strokeStyle;
	canvas.lineWidth = lineWidth;	
	canvas.lineCap = lineCap;
}

function init()
{
	initCanvas();
	 
	$("canvas").addEventListener("touchstart", touchStart, false);
	$("canvas").addEventListener("touchmove", touchMove, false);
	$("canvas").addEventListener("touchend", touchEnd, false);		
}

function touchStart(event)
{
	event.preventDefault();
	redoData.clear();
	
	if (undoData.length > maxUndo) {
		undoData.shift();
	}
	undoData.push(canvas.getImageData(0, 0, $("canvas").width, $("canvas").height));
	
	var x = event.touches[0].pageX;
	var y = event.touches[0].pageY;
	
	canvas.beginPath();
	canvas.moveTo(x, y);
	
	lastX = x;
	lastY = y;	
}

function touchMove(event)
{
	event.preventDefault();
	
	var x = event.touches[0].pageX;
	var y = event.touches[0].pageY;

	canvas.lineTo(x, y);
	canvas.stroke();
	
	lastX = x;
	lastY = y;
}

function touchEnd(event)
{
	event.preventDefault();
	canvas.lineTo(lastX, lastY);
	canvas.stroke();
}

function resetPallete()
{
	var colors = $n("color");
	
	for (var c = 0; c < colors.length; c++) {
		colors[c].className = "color";
	}
	
	$("tools").style.backgroundColor = "transparent";
}

function setColor(element)
{
	resetPallete();
	strokeStyle = element.style.backgroundColor;
	canvas.strokeStyle = strokeStyle;
	element.className = "color active";
}

function setMixColor(element)
{
	resetPallete();
	
	if ($("mixcolor").className == "blank") {
		$("mixcolor").style.backgroundColor = element.style.backgroundColor;
		$("mixcolor").className = "mixed";
	} else {
		$("mixcolor").style.backgroundColor = mixColors($("mixcolor").style.backgroundColor, element.style.backgroundColor);
	}
	
	strokeStyle = $("mixcolor").style.backgroundColor;
	$("tools").style.backgroundColor = strokeStyle;
	canvas.strokeStyle = strokeStyle;
}

function mixColors(base, add)
{
	var brgb = base.substring(4, base.length-1).split(",");
	var argb = add.substring(4, add.length-1).split(",");
	var r = Math.round(parseFloat(brgb[0]) + (parseFloat(argb[0])/10));
	var g = Math.round(parseFloat(brgb[1]) + (parseFloat(argb[1])/10));
	var b = Math.round(parseFloat(brgb[2]) + (parseFloat(argb[2])/10));
	
	return "rgb(" + r + "," + g + "," + b + ")";		
}

function resetMixColor(element)
{
	$("mixcolor").className = "blank";
	$("tools").style.backgroundColor = "transparent";
	$("mixcolor").style.backgroundColor = "rgb(255,255,255)";
}

function setLineStyle(element)
{
	var w = element.id.substring(2);
	lineWidth = w;
	canvas.lineWidth = lineWidth;
}

function doTools()
{
	if ($("toolbox").className == "close") {
		$("toolbox").style.webkitTransform = 'translate(0px,-220px)';
		$("toolbox").className = "open";
	} else {
		$("toolbox").style.webkitTransform = 'translate(0px,220px)';
		$("toolbox").className = "close";	
	}
}

function doTrash()
{
	if (confirm("Delete the current painting?")) {
  		initCanvas();
  	}
}

function doUndo()
{
	if (undoData.length > 0) {
		redoData.push(canvas.getImageData(0, 0, $("canvas").width, $("canvas").height));
		canvas.putImageData(undoData.pop(), 0, 0);
	}
}

function doRedo()
{
	if (redoData.length > 0) {
		undoData.push(canvas.getImageData(0, 0, $("canvas").width, $("canvas").height));
		canvas.putImageData(redoData.pop(), 0, 0);
	}
}

function doSave()
{
	window.open($("canvas").toDataURL());
}