import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },

    productTitle: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    productVariantId: {
      type: String,
      required: true,
    },

    notifyUser: [
      {
        name: {
          type: String,
        },
        email: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Email = mongoose.model("Email", EmailSchema);
export default Email;
