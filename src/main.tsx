import { HelmetProvider } from "react-helmet-async";
import SeoBase from "@/components/seo/SeoBase";
// ...
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <SeoBase />
      {/* Tu Router/App existente */}
    </HelmetProvider>
  </React.StrictMode>
);
