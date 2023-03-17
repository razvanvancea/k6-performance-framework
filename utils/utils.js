export const randomEmail = () => {
	var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
	var string = '';
	for (var i = 0; i < 15; i++) {
		string += chars[Math.floor(Math.random() * chars.length)];
	}
	return string + '@gmail.com';
};

export const randomString = (length) => {
	let result = '';
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
};
