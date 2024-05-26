const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();

const { deposit } = require('./deposit');


const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/getTokens", async (req, res) => {

  const { userAddress, chain } = req.query;

  const tokens = await Moralis.EvmApi.token.getWalletTokenBalances({
    chain: chain,
    address: userAddress,
  });

  const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
    chain: chain,
    address: userAddress,
    mediaItems: true,
  });

  const myNfts = nfts.raw.result.map((e, i) => {
    if (e?.media?.media_collection?.high?.url && !e.possible_spam && (e?.media?.category !== "video") ) {
      return e["media"]["media_collection"]["high"]["url"];
    }
  })

  const balance = await Moralis.EvmApi.balance.getNativeBalance({
    chain: chain,
    address: userAddress
  });

  const jsonResponse = {
    tokens: tokens.raw,
    nfts: myNfts,
    balance: balance.raw.balance / (10 ** 18)
  }


  return res.status(200).json(jsonResponse);
});

app.post('/deposit', async (req, res) => {
  const { currency, amount } = req.body;
  console.log("i am here")
  try {
    console.log("i am here before note")

    const note = await deposit(currency, amount);
    res.send({ note });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
