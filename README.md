 mushraJS
=====================

Introduction
---------------------

**mushraJS** is a HTML5 and JavaScript based framework to create MUSHRA listening tests. 
MUSHRA is the abbreviation for *MUlti Stimulus with Hidden Reference and Anchor* and 
describes a method for subjective evaluation of audio quality. It is described in detail 
in the [ITU-R recommendation BS.1534-1](http://www.itu.int/rec/R-REC-BS.1116-1-199710-I/e).

The framework does not rely on any server side ressources and completely runs locally in 
your browser if desired. However it is possible to transmit the results to a web service to
collect them and do further evaluation.


Requirements
---------------------

As the framework uses modern HTML5 techniques for audio playback and the user interface it 
is very important to use a modern web browser. Please keep in mind, that the playback 
of .WAV audio files is supported on all major browsers with the only exception of the 
Microsoft Internet Explorer. That's the only reason why this browser is currently not 
supported by mushraJS.

JQuery and JQueryUI are used to simplify the coding with JavaScript. Both are already part of 
the package and can be found in `js/` subfolder.

Configuration
---------------------

The configuration of the test is written in [JSON format](http://en.wikipedia.org/wiki/JSON). 
See `example_config.js` to get an impression how it works. The config has to be loaded before
any other JavaScript files in the header of the `index.html` file.

It is recommended to use .WAV files for the samples as these are of high quality and equally 
supported by all browsers except Internet Explorer. Other file formats like .FLAC, .MP3 or 
.OGG are only supported by different subsets of browsers.


License
---------------------

The complete sources, html and script files as well as images are released unter the *GPLv3 
license*. A copy of the GPL is provided in the `LICENSE.txt` file.