import type { CollectionConfig } from "payload";

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "postsCount"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "URL-friendly version of the tag name",
      },
      hooks: {
        beforeValidate: [
          ({ value, originalDoc, data }) => {
            if (value) {
              return value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
            }

            if (data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
            }
          },
        ],
      },
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
      admin: {
        description: "Brief description of what this tag represents",
      },
    },
    {
      name: "postsCount",
      type: "number",
      admin: {
        readOnly: true,
        description: "Number of posts using this tag",
      },
      defaultValue: 0,
    },
  ],
};
