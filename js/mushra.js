/*
	mushraJS - HTML5 and JavaScript framework for listening tests
    Copyright (C) 2012  Sebastian Kraft

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

// ###################################################################
// hold some state variables and ratings
var TestState = {
    "CurrentTest": -1, 		// the current test index
	"TestIsRunning": 0,		// is true if test is running, false when finished or not yet started
	"FileMappings": {},		// arrays with random file mappings
	"Ratings": {},			// array with ratings
	"AudiosInLoadQueue": -1,
};


// ###################################################################
// Audio pool object. Creates and manages <audio> tags for playback
var AudioPool = {
	"NumPlayers": 0,
	"NumUsed": 0,
	"LoopAudio": 0,
	"ABPos": [ 0, 100],
	
	// insert audio pool into DOM
	register: function() {
		$('<div id="AudioPool"></div>').appendTo('body');
	},

	// callback for time update event
	timeUpdateCallback: function(e) {
	
	}, 
	
	// callback for time update event
	ABLoopCallback: function(e) {
		var progress = e.target.currentTime / e.target.duration * 100;
			
		if (progress > AudioPool.ABPos[1]) {
			if (AudioPool.LoopAudio == true)
				e.target.currentTime = AudioPool.ABPos[0] / 100 * e.target.duration;
			else
				e.target.pause();
		}
		

	}, 	
	
	// callback for error event
	errorCallback: function(e) {
	
	}, 
	
	// callback for error event
	dataLoadedCallback: function(e) {
	
	}, 	
	
	// clear all files
	clear: function(){
		this.NumUsed = 0;	
	},
	
	// add new file to pool
	addAudio : function(path, ID){
	
		if (this.NumPlayers<=this.NumUsed) {
			$('<audio id="" src="" preload="auto" class="audiotags"></audio>').appendTo('#AudioPool'); 		
			this.NumPlayers++;
		}

		$('.audiotags').eq(this.NumUsed).attr('src', path);
		$('.audiotags').eq(this.NumUsed).attr('id', "audio"+ID);
		
		$('.audiotags').eq(this.NumUsed).off();
		$('.audiotags').eq(this.NumUsed).on("timeupdate", this.timeUpdateCallback);
		$('.audiotags').eq(this.NumUsed).on("timeupdate", this.ABLoopCallback);
		$('.audiotags').eq(this.NumUsed).on('ended', this, function(e) {
			if (e.data.LoopAudio==true) {
				this.currentTime = e.data.ABPos[0] / 100 * e.target.duration;
				this.play();
			}
		});
		
		$('.audiotags').eq(this.NumUsed).on("loadeddata", this.dataLoadedCallback);
		$('.audiotags').eq(this.NumUsed).on("error", this.errorCallback);
		
		this.NumUsed++;		
	},	
	
	// play audio with specified ID
	play: function(ID){
		var audiotag = document.getElementById("audio"+ID);
		
		audiotag.currentTime = this.ABPos[0] / 100 * audiotag.duration;
			
		audiotag.play(); 		
	},
	
	// pause all audios
	pause: function() {
		var audioTags = document.body.getElementsByTagName("audio");    
		for (var i = 0; i<audioTags.length; i++) { 
			audioTags[i].pause();
		}	
	},

	// set volume of <audio> tags
	setVolume: function(vol) {
		var vol = $('#VolumeSlider').slider('option', 'value') / 100;
		
		var audioTags = document.body.getElementsByTagName("audio");    
		for (var i = 0; i<audioTags.length; i++) { 
			audioTags[i].volume = vol;
		}
	},
	
	// set loop mode
	setLooped: function(loop) {
		if (loop!=this.LoopAudio) {
			this.LoopAudio = loop;
		}
	},
	
	// toggle loop mode
	toggleLooped: function() {
		this.LoopAudio = !this.LoopAudio;

	},		
};

// ###################################################################
// some helper functions

// logarithm to base 10
function log10(val) {
  return Math.log(val) / Math.log(10);
}

// check for Internet Explorer version
function clientIsIE() {
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
       var ieversion=new Number(RegExp.$1); // capture x.x portion and store as a number
       return ieversion;
    }
    return 0;
}

// check if value is in array
function isInArray(arr, val) {
	for (var i = 0; i<arr.length; i++) {
		if (arr[i]==val) return true;
	}
	return false;
}


// ###################################################################
// is called whenever an <audio> tag fires the onDataLoaded event
function audioLoadedCallback() {
    TestState.AudiosInLoadQueue--;
    
	// if all files are loaded show test
    if (TestState.AudiosInLoadQueue==0) {
    	$('#TestControls').show();
	    $('#TableContainer').show();
    	$('#PlayerControls').show();       
    	$('#LoadOverlay').hide();
	}
}

// ###################################################################
// pause all audios
function pauseAudios() {    
	AudioPool.pause();
	$(".playButton").removeClass('playButton-active');
	$('.RateSlider').parent().css('background-color', 'transparent');    
}

// ###################################################################
// enable looping for all audios
function loopAudios() {    
    AudioPool.toggleLooped();
	
	//if (AudioPool.LoopAudio==true)
	//	$('#ABRange').slider('enable');
	//else 
	//	$('#ABRange').slider('disable');	
}

// ###################################################################
// set volume of audio pool
function setVolume() {
	var vol = log10($('#VolumeSlider').slider('option', 'value')) / 2;
	AudioPool.setVolume(vol);
}

// ###################################################################
//play audio with specified html ID
function playAudio(id) {
    
    AudioPool.pause();

	$('.RateSlider').parent().css('background-color', 'transparent');
	$('button').removeClass('playButton-active');
	
	$('#slider'+id).parent().css('background-color', '#D5E5F6');
	$('#play'+id+'Btn').addClass('playButton-active');
	
	AudioPool.play(id);
}

// ###################################################################
// audio time update callback
function audioTimeUpdate(e) {

	var s = parseInt(e.target.currentTime % 60);
	var m = parseInt((e.target.currentTime / 60) % 60);
	
	if (m<10) m = "0"+m;
	if (s<10) s = "0"+s;            
	
	$('#duration > span').html( m + ':' + s );
	
	var progress = e.target.currentTime / e.target.duration * 100;
	
	$('#ProgressBar').progressbar( "option", "value", progress);

}

// ###################################################################
// audio loading error callback
function audioLoadError(e) {

//	var s = parseInt(e.target.currentTime % 60);

	var errorTxt = "<p>ERROR loading audio file "+ e.target.src+"</p>";
	
	$('#LoadOverlay').append(errorTxt);
}

// ###################################################################
// read ratings from TestState object
function readRatings(TestIndx) {
    
    if ((TestIndx in TestState.Ratings)==false) return false;
	
	$(".RateSlider").each( function() {
		var pos = $(this).attr('id').lastIndexOf('slider');
		var fileNum = $(this).attr('id').substring(pos+6, $(this).attr('id').length);	
		//alert();
	    $(this).slider('value', TestState.Ratings[TestIndx][fileNum]);
		$(this).slider('refresh');
	});

}

// ###################################################################
// save ratings to TestState object
function saveRatings(TestIndx) {
	var ratings = {};
	$(".RateSlider").each( function() {
		var pos = $(this).attr('id').lastIndexOf('slider');
		var fileNum = $(this).attr('id').substring(pos+6, $(this).attr('id').length);
		
		ratings[fileNum] = $(this).slider( "option", "value" );	
	});	
	TestState.Ratings[TestIndx] = ratings;	
}

// ###################################################################
// create random mapping to test files
function createFileMapping(TestIndx) {
	var fileMapping = [];
	var NumFiles = TestData.Testsets[TestIndx].Files.length;
	
	for (var i = 0; i<NumFiles+1; i++) { 		
		
		var RandFileNumber = Math.floor(Math.random()*(NumFiles+1));
		if (RandFileNumber>NumFiles) RandFileNumber = NumFiles;
		
		if (isInArray(fileMapping, RandFileNumber)==true) {
			RandFileNumber = NumFiles;
			while (isInArray(fileMapping, RandFileNumber)==true) {
				RandFileNumber--;
			}
		}
		if (RandFileNumber<0) alert(fileMapping);
		fileMapping.push(RandFileNumber);	
	}
	
	$.each(fileMapping, function(index, value) { 
		if (value==NumFiles) fileMapping[index]='HiddenRef';
	});
	
	TestState.FileMappings[TestIndx] = fileMapping;
}

// ###################################################################
// format test results and return them as a string
function Results2HtmlTab() {
	var lbr = "<br />";
	var resultString = "Results: "+TestData.TestName+lbr;
	for (var i = 0; i<TestData.Testsets.length; i++) { 
		resultString += (lbr+TestData.Testsets[i].Name+lbr);
        var tab = document.createElement('table');    
		var row;		
		var cell;
		// hidden reference
		row = tab.insertRow(-1);
		cell = row.insertCell(-1);
		cell.innerHTML = "Hidden Reference";			
		cell = row.insertCell(-1);
		cell.innerHTML = TestState.Ratings[i]["HiddenRef"];        
		
		// other files
		for (var k = 0; k<TestData.Testsets[i].Files.length; k++) {	
    		row = tab.insertRow(-1);		    		
			cell = row.insertCell(-1);
			cell.innerHTML = TestData.Testsets[i].Files[k];			
			cell = row.insertCell(-1);
			cell.innerHTML = TestState.Ratings[i][k];
		}
		resultString += (tab.outerHTML);
	}
	
	return resultString;
}
function Results2CSV() {
	var sep = ";";
	var lbr = "\n";
	var resultString = $('#UserName').val() + sep;
	for (var i = 0; i<TestData.Testsets.length; i++) { 
		resultString +=  TestState.Ratings[i]["HiddenRef"] + sep; 
		
		// other files
		for (var k = 0; k<TestData.Testsets[i].Files.length; k++) {	
			resultString +=  TestState.Ratings[i][k] + sep; 
		}		
	}
	resultString += lbr; 
	return resultString;
}
function Results2Text() {
	var sep = ";";
	var lbr = "\n";
	var resultString = $('#UserName').val() + sep + $('#UserEMail').val() + lbr;
	for (var i = 0; i<TestData.Testsets.length; i++) { 

		resultString += (lbr+TestData.Testsets[i].Name+lbr);		
		resultString +=  "Hidden Reference" + sep + TestState.Ratings[i]["HiddenRef"] + lbr; 
		
		// other files
		for (var k = 0; k<TestData.Testsets[i].Files.length; k++) {			
			resultString +=  TestData.Testsets[i].Files[k] + sep + TestState.Ratings[i][k] + lbr; 
		}
	}
	
	return resultString;
}

// ###################################################################
// submit test results to server
function SubmitTestResults() {
	
	var UserName = $('#UserName').val();
	
	$.ajax({
			type: "POST",
			url: TestData.SubmitResultsURL,
			data: {testresults:Results2Text(), testresultscsv:Results2CSV(), username:UserName},
			dataType: 'json'})
		.done( function (response){
		        if (response.error==false) {
    				$('#SubmitBox').html("Your submission was succesful.<br/><br/>");

	    			$("#ResultsBox").show();				
                	$('#SubmitData').button('option',{ icons: { primary: 'ui-icon-check' }});	
                	TestState.TestIsRunning = 0;			
            	} else {
    				$('#SubmitBox').html("span class='error'The following error occured during your submission:<br/>"
    				                        +response.message+
    				                         "<br/><br/> Please copy/paste the following table content and send it to our email adress "
    				                        +TestData.SupervisorContact+"<br/><br/> Sorry for any inconvenience!</span><br/><br/>"); 
	    			$("#ResultsBox").show();   
                	$('#SubmitData').button('option',{ icons: { primary: 'ui-icon-alert' }});	            	            	
            	}
			})
		.fail (function (xhr, ajaxOptions, thrownError){		
    				$('#SubmitBox').html("<span class='error'>The following error occured during your submission:<br/>"
    				                        +ajaxOptions+
    				                        "<br/><br/> Please copy/paste the following table content and send it to our email adress "
    				                        +TestData.SupervisorContact+"<br/><br/> Sorry for any inconvenience!</span><br/><br/>");
	    			$("#ResultsBox").show();   
                	$('#SubmitData').button('option',{ icons: { primary: 'ui-icon-alert' }});			    			
			});		
	$('#SubmitData').button('option',{ icons: { primary: 'load-indicator' }});

}

// ###################################################################
// retrieve file path from audio ID
function AudioID2Path(TestIndx, AudioID) {
   var filePath = "";
   switch (AudioID) {
        case "Reference": filePath = TestData.Testsets[TestIndx].Reference;                       
                          break;
        case "HiddenRef": filePath = TestData.Testsets[TestIndx].Reference;                       
                          break;
						  
        default: filePath = TestData.Testsets[TestIndx].Files[AudioID];    
   }
   
   return filePath;
}

// ###################################################################
// main routine
// prepares display to run test with number TestIndx
function RunTest(TestIndx) {

    pauseAudios();

	// save ratings from last test if available
	if (TestState.CurrentTest>=0) saveRatings(TestState.CurrentTest);
	
	if (TestIndx<0) TestIndx=0;

	// if previous test was last one, ask before loading final page and exiting test
	if (TestIndx>=TestData.Testsets.length) {
		if (confirm('This was the last test. Do you want to finish?')) {
		
			$('#TableContainer').hide();
			$('#PlayerControls').hide();		
			$('#TestControls').hide();		
			$('#TestEnd').show();		
			
			resultsBox = document.getElementById('ResultsBox');
			
			resultsBox.innerHTML = Results2HtmlTab();
						
    		if (TestData.EnableOnlineSubmission) {
            	$("#ResultsBox").hide();
            	$("#SubmitBox").show();            	        	
			} else {
				$("#ResultsBox").show();
				$("#SubmitBox").hide();
			}
		}
		return; 	
	}

    var row = new Array();
    var cell = new Array();

	// clear old test table
	if ($('#TableContainer > table')) {
	    $('#TableContainer > table').remove();
	}
	
	AudioPool.clear();
	
	// create random file mapping if not yet done
	if (!TestState.FileMappings[TestIndx]) {
		createFileMapping(TestIndx);
	}	
	
	// create new test table
    var tab = document.createElement('table');
    tab.setAttribute('id','TestTable');
 	
	var fileID = "";
	
    // add reference
	fileID = "Reference";
    row  = tab.insertRow(-1);
    cell[0] = row.insertCell(-1);
    cell[0].innerHTML = "<span class='testItem'>Reference</span>";
    cell[1] = row.insertCell(-1);
	TestState.AudiosInLoadQueue = 1;
    cell[1].innerHTML =  '<button id="play'+fileID+'Btn" class="playButton" onclick="playAudio(\''+fileID+'\')">Play</button>';
    cell[2] = row.insertCell(-1);
	cell[2].innerHTML = "<button class='stopButton' onclick='pauseAudios();'>Stop</button>";  	
    cell[3] = row.insertCell(-1);
	cell[3].innerHTML = "<img id='ScaleImage' src='"+TestData.RateScalePng+"'/>";  	
	//cell[3].innerHTML = '<object type="image/svg+xml" data="'+TestData.RateScaleSvg+'"><img src="'+TestData.RateScalePng+'" alt="Blue Square"/></object>';
	
	AudioPool.addAudio(AudioID2Path(TestIndx, fileID), fileID);
	
	
    // add spacing
    row = tab.insertRow(-1);
    row.setAttribute("height","5"); 

//	var rateMin = TestData.RateMinValue;
//	var rateMax = TestData.RateMaxValue;
	
	// add test items
    for (var i = 0; i<TestState.FileMappings[TestIndx].length; i++) { 
		var fileID = TestState.FileMappings[TestIndx][i];
        row[i]  = tab.insertRow(-1);
        cell[0] = row[i].insertCell(-1);
        cell[0].innerHTML = "<span class='testItem'>Test Item "+ (i+1)+"</span>";
        cell[1] = row[i].insertCell(-1);
		TestState.AudiosInLoadQueue += 1;
        cell[1].innerHTML =  '<button id="play'+fileID+'Btn" class="playButton" onclick="playAudio(\'' + fileID + '\')">Play</button>';
        cell[2] = row[i].insertCell(-1);
        cell[2].innerHTML = "<button class='stopButton' onclick='pauseAudios();'>Stop</button>";  
        cell[3] = row[i].insertCell(-1);
        var fileIDstr = "";
        if (TestData.ShowFileIDs) {
            if (fileID.length>1) 
				fileIDstr = fileID.charAt(0);
			else
				fileIDstr = fileID;			
        }
        cell[3].innerHTML = "<div class='RateSlider' id='slider"+fileID+"' >"+fileIDstr+"</div>";

		AudioPool.addAudio(AudioID2Path(TestIndx, fileID), fileID);

    }        

	// set current test name
	$('#TestHeading').html(TestData.Testsets[TestIndx].Name + " (" + (TestIndx+1) + " of " + TestData.Testsets.length + ")");
	$('#TestHeading').show();

	// hide everything instead of load animation
	$('#TestIntroduction').hide();
	$('#TestControls').hide();
	$('#TableContainer').hide();
	$('#PlayerControls').hide();
	$('#LoadOverlay').show();
		
	// set some state variables
	TestState.CurrentTest = TestIndx;
	TestState.TestIsRunning = 1;
	
	// move the created table to the DOM
    $('#TableContainer').append(tab);	
	
	$('.RateSlider').each( function() {
		$(this).slider({
				value: TestData.RateDefaultValue,
				min: TestData.RateMinValue,
				max: TestData.RateMaxValue,
				animate: false,
				orientation: "horizontal"
			});
			
		$(this).slider('option', 'value', 0);
		$(this).css('background-image', 'url('+TestData.RateScaleBgPng+')');
	});

	$('.stopButton').each( function() {
		$(this).button();
	});
	
	$('.playButton').each( function() {
		$(this).button();
	});	
	
    // load already existing ratings
	readRatings(TestIndx);			
	
}

// ###################################################################
// is called when onLoad event of the <body> is fired
function PageReady() {

	// check if config file is found and TestData is loaded
	if (typeof(TestData) == 'undefined') {
		alert('Config file could not be loaded!');
	}

    // check for IE as it does not support .wav in <audio> tags
	if (!clientIsIE()) {
	    // show introduction
		$('#TestTitle').html(TestData.TestName);
    	$('#TestIntroduction').show();
   	} else {
 		$('#TestTitle').html('Internet Explorer is not supported! Please use Firefox, Opera, Google Chrome or any other HTML5 capable browser.');
	}
	 
	if (TestData.LoopByDefault) {
		document.getElementById('loopAudio').checked = true;
	} else {
		document.getElementById('loopAudio').checked = false;
	}	 
	
	// setup buttons and controls
	$('#VolumeSlider').slider({
			min:0,
			max:100,
			change: setVolume,
			value:100,
		});
		
	if (TestData.EnableABLoop==true) {
		$('#ABRange').slider({
				range: true,
				values: [ 0, 100],
				min:0,
				max:100,
				slide: function( event, ui ) {
					AudioPool.ABPos = ui.values;
				}
			});		
	} else {
		$('#ABRange').hide();
		$('#ProgressBar').css('margin-top', $('#ProgressBar').height() + 'px');
	}
	$('#PauseButton').button();
	$('#loopAudio').button();
	$('#ProgressBar').progressbar();
	$('#nextTest').button();
	$('#prevTest').button();
	$('#startTest').button();
	$('#SubmitData').button({ icons: { primary: 'ui-icon-locked' }});
	
	// create audio pool
	AudioPool.register();
	AudioPool.timeUpdateCallback = audioTimeUpdate;
	AudioPool.errorCallback = audioLoadError;
	AudioPool.dataLoadedCallback = audioLoadedCallback;
	
	AudioPool.setLooped(TestData.LoopByDefault);
		
	// install handler to warn user when test is running and he tries to leave the page
	window.onbeforeunload = function () {
		if (TestState.TestIsRunning) {
			check = ('The listening test is not yet finished!');
			return check;
		} else {
			return;
		}
	};

}
