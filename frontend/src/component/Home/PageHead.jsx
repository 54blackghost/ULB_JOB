import React from "react";



export const pageHead = (title, description, image) => ({
  meta: [
    { title: `${title} | ULB JOB` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} | ULB JOB` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    ...(image
      ? [
          { property: "og:image", content: image },
          { name: "twitter:image", content: image },
        ]
      : []),
  ],
});