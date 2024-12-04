import nodemailer from "nodemailer";
import Email from "../model/emailUsers.js";
import fs from "fs";
import path from "path";
import smtpTransport from "nodemailer-smtp-transport";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url); // Get the current file path
const __dirname = path.dirname(__filename); // Get the directory name

import dotenv from "dotenv";

dotenv.config();

export const handleWebHook = async (req, res) => {
  try {
    // console.log("webHook recieved: ", req.body);
    // res.send(req.body)
    const productId = req.body.id;
    const variants = req.body.variants;
    // console.log(variants);

    if (!variants || variants.length === 0) {
      console.log("No variants found for the product.");
      return res.status(200).send("No variants to process.");
    }

    const sendEmail = async () => {
      try {
        //template path
        const templatePath = path.resolve(
          __dirname,
          "../mailTemplate/template.html"
        );

        //read HTML template
        //male url friendly title
        const urlFriendlyTitle = existingProduct.productTitle
          .toLowerCase() // Convert to lowercase
          .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
          .replace(/\s+/g, "-") // Replace spaces with dashes
          .trim(); // Remove leading and trailing spaces

        let emailTemplate = fs.readFileSync(templatePath, "utf-8");
        //replace title
        emailTemplate = emailTemplate
          .replace("{{productTitle}}", existingProduct.productTitle)
          .replace(
            "{{productImageUrl}}",
            `https://www.shoemato.com/cdn/shop/${existingProduct.imageUrl}`
          )
          .replace(
            "{{productUrl}}",
            `https://www.shoemato.com/products/${urlFriendlyTitle}`
          );

        let transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          auth: {
            user: process.env.EMAIL_USER, // "superadmin@easybiznus.com",
            pass: process.env.EMAIL_USER_PASS, // "iqeambjveglefogs",
          },
        });
        const recipients = existingProduct.notifyUser.map((user) => user.email); // Extract emails from notifyUser

        const mailOptions = {
          from: process.env.EMAIL_USER, // "superadmin@easybiznus.com",
          to: "noreply@easybiznus.com", // A generic address or your own email
          bcc: recipients.join(","), //"ganesh.easybiznus@gmail.com,",
          subject: `Product back in stock`,
          html: emailTemplate,
        };

        transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            console.error(error);
          } else {
            console.log("Email sent: " + info.response);
            // Update emailSent field to true
            try {
              await Email.updateOne(
                { productId },
                { $set: { notifyUser: [] } }
              );
              console.log(
                `Updated emailSent to true for variantId: ${existingProduct.variantId}`
              );
            } catch (updateError) {
              console.error("Error updating emailSent field:", updateError);
            }
          }
        });

        console.log("email sent");
      } catch (error) {
        console.error("Error sending email:", error.message);
      }
    };

    //find existing products

    const existingProduct = await Email.findOne({ productId });

    //check if product available
    if (existingProduct) {
      variants.forEach((variant) => {
        const variantId = variant.id;
        const inventoryQuantity = variant.inventory_quantity;
        const variantTitle = variant.title;

        if (inventoryQuantity > 0) {
          if (
            existingProduct.productVariantId == variantId &&
            existingProduct.notifyUser.length > 0 &&
            existingProduct.notifyUser.length > 0
          ) {
            sendEmail();
          }
          // Example: Send a message/notification
        }
      });
    }
  } catch (error) {
    console.log("Error in finding product: ", error.message);
  }
};
