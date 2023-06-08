const hexLookup = "0123456789abcdef";
console.time("session_id");
for (let i = 0; i < 1000000; i++) {
	let session_build = "";
	for (let j = 0; j < 32; j++) {
		session_build += hexLookup[Math.floor(Math.random() * 16)];
	}
}
console.timeEnd("session_id");
