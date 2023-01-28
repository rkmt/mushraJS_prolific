// configure the test here
var TestData = {
  "TestName": "Speech Quality Evaluation",
  "RateScalePng": "img/scale_abs.png",
  "RateScaleBgPng": "img/scale_abs_background.png",
  "RateMinValue": 0,
  "RateMaxValue": 100,
  "RateDefaultValue":0,
  "LoopByDefault": false,

  "ShowFileIDs": false,
  "EnableABLoop": true,
  "EnableOnlineSubmission": true,
  "SubmitResultsURL": "results1.php",
  "SupervisorContact": "foobar@abc.org",
  "ReturnURL": "https://app.prolific.co/submissions/complete?cc=XXXYYYZZZ", 
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
      "Name": "Test 1",
      "Reference": "test1/reference.wav",
      "Files": [
            "test1/1.wav",
            "test1/2.wav",
            "test1/3.wav",
            "test1/4.wav",
        ]
    },

  ]
}
