import AppSettings from "@/common/settings/app-settings";
import { createRoot } from "react-dom/client";

const root = document.querySelector("#root");
root && createRoot(root).render(<AppSettings />);
