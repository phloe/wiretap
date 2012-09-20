![wiretap](http://dev.phloe.net/wiretap/img/logotype.png)


Wiretap your subjects

Records method calls on an object and can play them back.

**Potential uses**: Record and replay macros or even provide crude history/undo capabilities.

## wiretap
Install a new wiretap on an object.

##### Arguments
* `object` - (Object) The object to wiretap.
* `name` - (String) Optional. The name to appear for the object in the transcript.
* `cleanup` - (Function) Optional. A function you can call to clean up stuff before playing back the recorded calls.

##### Returns
A wiretap instance.
	
## Methods

### record
Start to record calls to your objects methods. Using labels you can switch between multiple recordings.

##### Arguments
* `label` - (String) Optional. The label you want give the recording.

##### Returns
The wiretap instance.

### stop
Stop recording calls.

##### Arguments
* `label` - (String) Optional. The label of the recording you want to stop recording.

##### Returns
The wiretap instance.

### play
Replay the recorded calls.

##### Arguments
* `label` - (String) Optional. The label of the recording you want to play back.

##### Returns
The wiretap instance.

### erase
Erase the recorded calls.
##### Arguments
* `label` - (String) Optional. The label you want to erase.

##### Returns
The wiretap instance.

### transcribe
Get a transcript of the recorded calls.

##### Arguments
* `label` - (String) Optional. The label of the recording you want to transcribe.

##### Returns
(String) The transcript as a string.

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
	
	nixon.record("watergate");
	
	aide.call("555-1234");
	aide.meet("Mr. Smith");
	
	nixon.stop("watergate");
	
	console.log(nixon.transcribe("watergate"));
	
	// logs: aide.call("555-1234") aide.meet("Mr. Smith")
	
	nixon.play("watergate");
	
	// calls the entire queue again: aide.call("555-1234"); aide.meet("Mr. Smith");

