// configure the test here
var TestData = {
  "TestName": "Your Test Name",
  "RateScalePng": "scale_abs.png",
  "RateScaleBgPng": "scale_abs_background.png",
  "RateScaleSvg": "scale.svg",  
  "RateMinValue": -4,
  "RateMaxValue": 4,
  "LoopByDefault": false,
  "ShowFileIDs": false,
  "EnableABLoop": false,
  "EnableOnlineSubmission": false,
  "SubmitResultsURL": "",
  "SupervisorContact": "",
  "Testsets": [
    //    
    {
      "Name": "Test 1",
      "Reference": "test1/reference.wav",
      "Files": [
            "test1/1.wav",
			"test1/2.wav",
			"test1/3.wav",
			"test1/4.wav",
        ]
    },
    //    
    {
      "Name": "Test 2",
      "Reference": "test2/reference.wav",
      "Files": [
            "test2/1.wav",
			"test2/2.wav",
			"test2/3.wav",
			"test2/4.wav",
        ]
    },
  ]
}
