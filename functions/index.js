const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.getCheapestProduct = functions.https.onRequest(async (req, res) => {
    try {
        const productsSnapshot = await db.collection("items")
            .orderBy("price", "asc")
            .limit(1)
            .get();

        if (productsSnapshot.empty) {
            return res.status(404).json({ message: "No products found" });
        }

        const cheapestProduct = productsSnapshot.docs[0].data();
        return res.status(200).json({ product: cheapestProduct });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
