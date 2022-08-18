const express = require("express");
const router = express.Router();

router.get('/as', async (req, res) => {
    const query = {};
    const cursor = asCollection.find(query);
    const allusers = await cursor.toArray();
    res.send(allusers);
});//for All users
module.exports = router;