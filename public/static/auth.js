"use strict";
let authenticated = false;
{
	const sid = sessionStorage.getItem("sid");
	const notAuthenticated = () => {
		window.history.pushState({}, "", window.location);
		window.location.assign("/login/");
	};
	if (!sid) notAuthenticated();

	fetch("/auth/session", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ sid })
	})
		.then(res => res.json())
		.then(data => {
			if (!data?.isValid) notAuthenticated();
			authenticated = true;
		})
		.catch(err => {
			console.error(err);
			notAuthenticated();
		});
}
