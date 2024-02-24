import react from "@vitejs/plugin-react";
import { defineConfig } from "wxt";

export default defineConfig({
	srcDir: "src/",
	vite: () => ({
		plugins: [react()],
	}),
	manifest: {
		permissions: ["storage"],
	},
	zip: {
		artifactTemplate: "{{browser}}.zip",
		sourcesTemplate: "{{browser}}-sources.zip",
	},
});
