export const randomEmail = () => {
	var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
	var string = '';
	for (var i = 0; i < 15; i++) {
		string += chars[Math.floor(Math.random() * chars.length)];
	}
	return string + '@gmail.com';
};

export const randomString = (length=1) => {
	let result = '';
	let counter = 0;
	const chars =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	while (counter < length) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
		counter += 1;
	}
	return result;
};
