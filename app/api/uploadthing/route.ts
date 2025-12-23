import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// יצירת ה-Route Handlers עבור ה-App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
