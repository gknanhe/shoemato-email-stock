import Email from "../model/emailUsers.js";

export const saveUser = async (req, res)=>{
    try {
        console.log(req.body);
        
        const {  email,  name,  product_id,  product_title, product_variant_id, image_url } = req.body;


        const existingProduct  = await Email.findOne({ productId: product_id });

        if(existingProduct){
            const emailExists = existingProduct.notifyUser.some(user=> user.email == email);


            if(emailExists){
                return res.status(200).json({
                    message: "This email is already subscribed for notifications."
                });
            }else{
                existingProduct.notifyUser.push({
                    name,
                    email
                });


                await existingProduct.save();

                return res.status(200).json({
                    message: "Email added successfully to the notification list."

                });
            }
        }
        else{
            const newPoduct = new Email({
                productId: product_id,
               productTitle: product_title,
               productVariantId: product_variant_id,
               imageUrl:image_url,
                notifyUser:[
                    {
                        name,
                        email
                    }
                ]
            });

            await newPoduct.save();

            return res.status(200).json({
                message: "Product created and email added successfully."

            });
        }
    } catch (error) {
        console.error("Error adding email:", error.message);
        return res.status(500).json({
            message: "Something went wrong. Please try again later."
        });    }
}