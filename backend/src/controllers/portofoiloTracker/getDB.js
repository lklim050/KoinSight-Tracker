import {
  Crypto24hrHistory,
  Crypto30daysHistory,
} from "../../scripts/syncHistory.js";
import { CryptoTop250Coins } from "../../scripts/syncTop250.js";

export const postCoin24hrHistory = async (req, res) => {
  try {
    const coin24hr = await Crypto24hrHistory.findById(req.body.id);
    const first = coin24hr.price_history[0].price;
    const last = coin24hr.price_history.at(-1).price;
    const firstTimeStamp = coin24hr.price_history[0].timestamp;
    const lastTimeStamp = coin24hr.price_history.at(-1).timestamp;
    const earliest = new Date(firstTimeStamp);
    const latest = new Date(lastTimeStamp);
    res.json({
      status: "fetch successfully from Database",
      last_fetched: coin24hr.last_fetched,
      first_timestamp: firstTimeStamp,
      latest_timestamp: lastTimeStamp,
      first_price: first,
      latest_price: last,
      first_date: earliest,
      latest_date: latest,
      show: coin24hr,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const postCoin30daysHistory = async (req, res) => {
  try {
    const coin30days = await Crypto30daysHistory.findById(req.body.id);
    const first = coin30days.price_history[0].price;
    const last = coin30days.price_history.at(-1).price;
    const firstTimeStamp = coin30days.price_history[0].timestamp;
    const lastTimeStamp = coin30days.price_history.at(-1).timestamp;
    const earliest = new Date(firstTimeStamp);
    const latest = new Date(lastTimeStamp);
    res.json({
      status: "fetch successfully from Database",
      last_fetched: coin30days.last_fetched,
      first_timestamp: firstTimeStamp,
      latest_timestamp: lastTimeStamp,
      first_price: first,
      latest_price: last,
      first_date: earliest,
      latest_date: latest,
      show: coin30days,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const getTop250Coins = async (req, res) => {
  try {
    const allCoins = await CryptoTop250Coins.find();
    res.json({
      status: "fetch successfully from Database",
      msg: `${allCoins.length} entries fetched`,
      show: allCoins,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const postTop250Coins = async (req, res) => {
  try {
    const coin = await CryptoTop250Coins.findOne({ id: req.body.id });

    res.json({
      status: "fetch successfully from Database",
      show: coin,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};
