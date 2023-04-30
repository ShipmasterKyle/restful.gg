// Create Headers
const headers = {
  "Content-Type": "application/json"
}
var xhttp 

 class ggs {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */

    getInfo () {
        return {
            id: 'ggs',
            name: 'RESTful.gg',
//             blockIconURI: miiicon,
//             menuIconURI: miiicon,
            docsURI: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            color1: '#1D65E0',
            color2: '#A4C1F2',
            blocks: [
                {
                    opcode: 'open',
                    text: 'Send [data] to [url] with method [method]',
                    blockType: "command",
                    arguments: {
			data: {
			    type: "string",
			    defaultValue: '{ "username": "testSubject"}'
			},
                        url: {
                            type: "string",
                            defaultValue: ''
                        },
			 method: {
                            type: "string",
                            defaultValue: 'GET'
                        }
                    }
                },
                {
                	opcode: 'makeJSON',
                    blockType: "reporter",
                    text: 'Use [Method] to convert [toBeJSONified] to JSON',
					arguments: {
                        Method: {
							type: "string",
							defaultValue: 'stringify',
						},
						toBeJSONified: {
							type: "string",
							defaultValue: '{"test": true}',
						},
					}
                },
				{
					"opcode": 'parseJSON',
					"blockType": "reporter",
					"text": '[PATH] of [JSON_STRING]',
					"arguments": {
						"PATH": {
							"type": "string",
							"defaultValue": 'fruit/apples',
						},
						"JSON_STRING": {
							"type": "string",
							"defaultValue": '{"fruit": {"apples": 2, "bananas": 3}, "total_fruit": 5}',
						},
					},
				},
				{
                	"opcode": 'isValidJSON',
                    "blockType": "Boolean",
                    "text": 'Is [JSON_STRING] actual JSON?',
					"arguments": {
						"JSON_STRING": {
							"type": "string",
							"defaultValue": '{"fruit": {"apples": 2, "bananas": 3}, "total_fruit": 5}',
						},
					},
                },
				{
                	"opcode": 'checkJSONforValue',
                    "blockType": "Boolean",
					"text": 'Does JSON [JSON_STRING] contains [VALUE]?',
					"arguments": {
						"JSON_STRING": {
							"type": "string",
							"defaultValue": '{"foo": "bar"}',
						},
						"VALUE": {
							"type": "string",
							"defaultValue": 'bar',
						},
					},
                },
            ]
        }
    }

    open (args, utils) {
	 // get data from args
	 const data = args.data;
	 if (data) {
	    xhttp = new XMLHttpRequest()
	    try {
		console.log(data)
	    	xhttp.open(args.method,args.url)
		 xhttp.send(data);
	    } catch {
		console.log("an error occured")
	    }
	 }
    }
    checkJSONforValue(args, utils){
		try {
			return Object.values(JSON.parse(args.JSON_STRING)).includes(args.VALUE);
		} catch(err) {
			return false;
		};
	};
	
	isValidJSON({JSON_STRING}) {
		try {
			JSON.parse(JSON_STRING);
			return true;
		} catch(err) {
			return false;
		}
	};
	
	makeJSON(args, utils) {
		if (args.Method == "stringify") {
            try {
                return JSON.stringify(args.toBeJSONified);
            } catch {
                return "Not JSON!";
            };
        } else if (args.Method == "parse"){
            try {
                return JSON.parse(args.toBeJSONified);
            } catch {
                return "Not JSON!";
            };
        }
	}
	
	parseJSON(args, utils) {
		try {
			const path = PATH.toString().split('/').map(prop => decodeURIComponent(prop));
			if (path[0] === '') path.splice(0, 1);
			if (path[path.length - 1] === '') path.splice(-1, 1);
			let json;
			try {
				json = JSON.parse(' ' + args.JSON_STRING);
			} catch (e) {
				return e.message;
			};
			path.forEach(prop => json = json[prop]);
			if (json === null) return 'null';
			else if (json === undefined) return '';
			else if (typeof json === 'object') return JSON.stringify(json);
			else return json.toString();
		} catch (err) {
			return '';
		};
	};
}

(function() {
    var extensionClass = ggs;
    if (typeof window === "undefined" || !window.vm) {
	console.log("Sandboxed mode detected, Load unsandboxed.");
    } else {
        var extensionInstance = new extensionClass(window.vm.extensionManager.runtime);
        var serviceName = window.vm.extensionManager._registerInternalExtension(extensionInstance);
        window.vm.extensionManager._loadedExtensions.set(extensionInstance.getInfo().id, serviceName);
	console.log("Unsandboxed mode detected. Good.");
    };
})()
