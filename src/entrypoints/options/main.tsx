import AppSettings from "@/components/app-settings";
import { createRoot } from "react-dom/client";

const root = document.querySelector("#root");
root && createRoot(root).render(<AppSettings />);
