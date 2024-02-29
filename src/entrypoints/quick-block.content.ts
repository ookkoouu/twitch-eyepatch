export default defineContentScript({
	matches: ["https://www.twitch.tv/*"],
	world: "MAIN",
	async main() {
		await import("@/common/quick-block/entrypoint").catch((err) => dlog(err));
	},
});
