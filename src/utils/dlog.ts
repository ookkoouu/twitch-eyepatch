function init() {
	return console.debug.bind(console, `[tcm/${import.meta.env.ENTRYPOINT}]`);
}

export default init();
