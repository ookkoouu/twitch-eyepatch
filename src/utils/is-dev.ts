export default function isDevelopment() {
	try {
		return import.meta.env.DEV;
	} catch {
		return false;
	}
}
