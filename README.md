![wiretap](http://dev.phloe.net/wiretap/img/logotype.png)


Wiretap your subjects

## wiretap
Install a new wiretap
##### Arguments
* `object` - (Object) The object to wiretap.
* `name` - (String) Optional. The name to appear for the object in the transcript.
* `cleanup` - (Function) Optional. A function you can call to clean up stuff before playing back the recorded calls.
	
## Methods

### record
Start to record calls to your objects methods.

### stop
Stop recording calls.

### play
Replay the recorded calls.

### erase
Erase the recorded calls.

### transcribe
Get a transcript of the recorded calls.

### cleanup
Executes the supplied wiretap cleanup function. Handy for clean up before playing back recorded calls.


## Usage
	var aide = {
		call: function (number) {
			// do stuff
		},
		meet: function (contact) {
			// do stuff
		}
	};
	
	var nixon = wiretap(aide, "aide");
	
	nixon.record();
	
	aide.call("555-1234");
	aide.meet("Mr. Smith");
	
	nixon.stop();
	
	console.log(nixon.transcribe());
	
	// logs: aide.call(555-1234) aide.meet(Mr. Smith)
	
	nixon.play();
	
	// calls the entire queue again: aide.call("555-1234"); aide.meet("Mr. Smith");

