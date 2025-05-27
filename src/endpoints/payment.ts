import validate from "@utils/bodyValidation";
import loginBody from "@zod/login";
import Stripe from 'stripe';
import {Router} from "express";


const router = Router();


async function stripeLink(amount: number, currency: string, user: string): Promise<string> {
    const stripe = new Stripe('sk_test_51RSHJCP9UaJVHbfDgLFw2M0KG5ApXSwcGdxGJTuE5JHRJp3Kb7HjJEGV8Un7pIujEqjSzjA7Dy3M5vAzcbB7CUEi009vgCFbMF');

    const price = await stripe.prices.create({
        unit_amount: amount,
        currency: currency,
        product_data: {
            name: `Rechargement de ${amount / 100} ${currency.toUpperCase()}`,
        }
    })

    const link = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [{
            price: price.id,
            quantity: 1,
        }],
        success_url: `http://localhost:3000/payment/success`,
        cancel_url: `http://localhost:3000/payment/cancel`,
        metadata: {
            user: user
        }

    })

    return link.url
}

router.post('/payment', async (req, res) => {

    const {amount, currency} = req.body;


    const link = await stripeLink(amount, currency, "test_user");

    res.status(200).json({success: true, result: link});
});

router.get('/payment/success', (req, res) => {
    console.log(req.body)
    res.status(200).json({message: 'Payment successful!'});

})

router.post('/webhook', async (req, res) => {
    console.log(req)
    const sig = req.headers['stripe-signature'];
    console.log(sig)
    console.log(sig === "whsec_299e0e80672fa19c579f4988da1c62f4213418c81910bf341a58db81ad26ffeb")
})


export default router;