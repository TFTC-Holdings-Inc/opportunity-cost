import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "displayName",
  },
  auth: true,
  fields: [
    {
      name: "firstName",
      type: "text",
      required: true,
      admin: {
        description: "First name of the user",
      },
    },
    {
      name: "lastName",
      type: "text",
      required: true,
      admin: {
        description: "Last name of the user",
      },
    },
    {
      name: "displayName",
      type: "text",
      admin: {
        description:
          "Public display name (optional, defaults to first + last name)",
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            if (siblingData.firstName && siblingData.lastName) {
              return `${siblingData.firstName} ${siblingData.lastName}`;
            }
            return siblingData.firstName || siblingData.lastName || "Anonymous";
          },
        ],
      },
    },
    {
      name: "bio",
      type: "textarea",
      admin: {
        description: "Short bio for author profile",
      },
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Profile picture",
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.firstName && data.lastName) {
          data.displayName = `${data.firstName} ${data.lastName}`;
        }
      },
    ],
  },
};
