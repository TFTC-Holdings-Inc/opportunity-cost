import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "filename",
    description: "Upload and manage images, videos, and other media files",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description: "Alternative text for accessibility and SEO",
      },
    },
    {
      name: "caption",
      type: "text",
      admin: {
        description: "Optional caption for the media",
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Detailed description of the media content",
      },
    },
    {
      name: "mediaType",
      type: "select",
      required: true,
      defaultValue: "image",
      options: [
        { label: "Image", value: "image" },
        { label: "Video", value: "video" },
        { label: "Audio", value: "audio" },
        { label: "Document", value: "document" },
        { label: "Other", value: "other" },
      ],
      admin: {
        description: "Type of media file",
      },
    },
    {
      name: "tags",
      type: "array",
      fields: [
        {
          name: "tag",
          type: "text",
          required: true,
        },
      ],
      admin: {
        description: "Tags for organizing and searching media",
      },
    },
    {
      name: "credit",
      type: "text",
      admin: {
        description: "Photo credit or source attribution",
      },
    },
    {
      name: "license",
      type: "select",
      options: [
        { label: "All Rights Reserved", value: "all-rights-reserved" },
        { label: "Creative Commons BY", value: "cc-by" },
        { label: "Creative Commons BY-SA", value: "cc-by-sa" },
        { label: "Creative Commons BY-NC", value: "cc-by-nc" },
        { label: "Creative Commons BY-NC-SA", value: "cc-by-nc-sa" },
        { label: "Public Domain", value: "public-domain" },
        { label: "Fair Use", value: "fair-use" },
      ],
      defaultValue: "all-rights-reserved",
      admin: {
        description: "License or usage rights for this media",
      },
    },
  ],
  upload: {
    staticDir: "media",
    staticURL: "/media",
    imageSizes: [
      {
        name: "thumbnail",
        width: 150,
        height: 150,
        position: "centre",
      },
      {
        name: "preview",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 600,
        height: 400,
        position: "centre",
      },
      {
        name: "featured",
        width: 1200,
        height: 630,
        position: "centre",
      },
      {
        name: "hero",
        width: 1920,
        height: 1080,
        position: "centre",
      },
    ],
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "video/mp4",
      "video/webm",
      "audio/mp3",
      "audio/wav",
      "application/pdf",
    ],
    crop: true,
    focalPoint: true,
    formatOptions: {
      format: "webp",
      options: {
        quality: 85,
      },
    },
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === "create") {
          // Auto-detect media type based on mime type
          if (data.mimeType) {
            if (data.mimeType.startsWith("image/")) {
              data.mediaType = "image";
            } else if (data.mimeType.startsWith("video/")) {
              data.mediaType = "video";
            } else if (data.mimeType.startsWith("audio/")) {
              data.mediaType = "audio";
            } else if (data.mimeType === "application/pdf") {
              data.mediaType = "document";
            } else {
              data.mediaType = "other";
            }
          }
        }
      },
    ],
  },
};
