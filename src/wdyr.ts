// // src/wdyr.ts
// import React from "react";

// export const setupWDYR = async () => {
//   if (import.meta.env.DEV) {
//     try {
//       const module = await import("@welldone-software/why-did-you-render");
//       const whyDidYouRender = module.default;
//       whyDidYouRender(React, {
//         trackAllPureComponents: true,
//         trackHooks: true,
//       });
//       console.log("✅ WDYR enabled");
//     } catch (err) {
//       console.error("Failed to load WDYR:", err);
//     }
//   }
// };
