function init() {
	return console.debug.bind(
		console,
		`[eyepatch/${import.meta.env.ENTRYPOINT}]`,
	);
}

export default init();
