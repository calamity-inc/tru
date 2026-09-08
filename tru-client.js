const { truDecodeInvite, truConnect } = require("./libtru.js");

if (!process.argv[2]) {
	console.log("Syntax: node tru-client.js <id or invite>");
	process.exit(1);
}

truConnect("198.251.89.45", process.argv[2], (id) => {
	console.log("Waiting for host.");
	console.log(`To start the host, run: pluto tru-host.pluto ${id}`);
}).then(ws => {
	console.log("Connection established.");
	ws.onmessage = (event) => {
		console.log("Got message: " + event.data);
	};
	ws.onclose = () => {
		console.log("Connection closed.");
	};
	ws.send("Hello from the client!");
}).catch(e => console.log(e));
