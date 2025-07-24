import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "description", "postsCount"],
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
        description: "URL-friendly version of the category name",
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
        description: "Brief description of what this category covers",
      },
    },
    {
      name: "color",
      type: "text",
      admin: {
        description: "Hex color code for category styling (e.g., #ff6b35)",
      },
      validate: (val) => {
        if (val && !/^#[0-9A-F]{6}$/i.test(val)) {
          return "Please enter a valid hex color code (e.g., #ff6b35)";
        }
        return true;
      },
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Optional image to represent this category",
      },
    },
    {
      name: "postsCount",
      type: "number",
      admin: {
        readOnly: true,
        description: "Number of posts in this category",
      },
      defaultValue: 0,
    },
  ],
};
