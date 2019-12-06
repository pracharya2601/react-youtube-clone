export const _signUp = (username, password, phonenumber) => {
	return fetch("http://localhost:5000/signup/", {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ username, password, phonenumber })
	}).then(res => res.json())
}

export const _login = (username, password) => {
	return fetch("http://localhost:5000/login/", {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ username, password })
	}).then(res => res.json())
}