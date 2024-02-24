import { defineConfig } from "wxt";
import react from "@vitejs/plugin-react";

export default defineConfig({
	srcDir: "src/",
	vite: () => ({
		plugins: [react()],
	}),
	manifest: {
		permissions: ["storage"],
	},
});
