export default defineContentScript({
	matches: [
		"https://*.twitch.tv/*",
		"https://twitchtheater.tv/*",
		"https://multistre.am/*",
	],
	world: "MAIN",
	allFrames: true,
	main() {
		import("@/common/sub-mode/entrypoint").catch((err) => dlog(err));
		import("@/common/hide-reply/entrypoint").catch((err) => dlog(err));
	},
});
