import Token from "../models/token.js";
import Toss from "../models/toss.js";


const systemToss = () => {
  return Math.floor(Math.random() * 2) <= 0 ? 'head' : 'tail';
}

const tossCoin = async (req, res) => {
  const { wager, toss } = req.body;

  try {
  
    if (!req.userId) {
      return res.json({ message: "Unauthenticated" });
    }

    // if toss is not head or tail
    if (toss !== 'head' && toss !== 'tail') {
      return res.status(400).json({ message: "Toss can only be head or tail" });
    }

    // if wager is 0
    if (wager == 0) {
      return res.status(400).json({ message: "Wager cannot be 0" });
    }

    const tokenFilter = {userId: req.userId}
    const { token } = await Token.findOne(tokenFilter).exec();
    
    // wager is more than available tokens
    if (wager > token) {
      return res.status(400).json({ message: "Insufficient tokens" });
    }

    // Update token with new value less the wager
    const update = { token: token - wager };
    const {token: updatedTokenLessWager } = await Token.findOneAndUpdate(tokenFilter, update, {
      new: true
    });
    
    // System tosses coin
    const serverToss = systemToss(); 
    const win = serverToss === toss;

    // Add toss record to database
    await Toss.create({
      userId: req.userId,
      toss,
      wager,
      win,
    });

    // If toss is won, respond with toss value and updated token after win
    if (win) {
      const update = { token: updatedTokenLessWager + ( wager * 2 ) };
      const {token: updatedToken } = await Token.findOneAndUpdate(tokenFilter, update, {
        new: true
      });
      return res.status(200).json({message:`${serverToss}, you won`, token: updatedToken});
    }

    // toss is lost, respond with toss value and token reflecting loss
    res.status(200).json({message: `${serverToss}, you lost`, token: updatedTokenLessWager});
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
  
};

export default tossCoin;