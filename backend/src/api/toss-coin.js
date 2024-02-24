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
    const { token, winningStreak } = await Token.findOne(tokenFilter).exec();
    
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
    // Determine win type
    console.log(winningStreak, 'winningstreak')
    const threePointBonusWin = win && winningStreak === 2;
    const fivePointBonusWin = win && winningStreak === 4;

    // Add toss record to database
    await Toss.create({
      userId: req.userId,
      toss,
      wager,
      win,
    });

    let updateAfterCoinToss = {};
    if (win) {
      // Calculate winning multiplier depending on the win type
      const winningMultiplier = fivePointBonusWin ? 10 : threePointBonusWin ? 3 : 2;
      updateAfterCoinToss = { 
        token: updatedTokenLessWager + ( wager * winningMultiplier ),
        winningStreak: winningStreak < 5 ? winningStreak + 1 : 1 // We update the winning streak by adding 1 if it is less than 5 otherwise, we set it to 1
      };
    } else {
      updateAfterCoinToss = { 
        winningStreak: 0 // We update the winning streak to 0 because a loss has happened
      };
    }

    const {token: updatedToken } = await Token.findOneAndUpdate(tokenFilter, updateAfterCoinToss, {
      new: true
    });

    let message;
    // I chose the traditional conditions over ternary here for readability
    if (win) {
      if (fivePointBonusWin) {
        message = `${serverToss}, winning streak! You won 5x your wager`
      } else if (threePointBonusWin) {
        message = `${serverToss}, winning streak! You won 3x your wager`
      } else {
        message = `${serverToss}, you won`
      }
    } else {
      message = `${serverToss}, you lost`
    }

    res.status(200).json({message, token: updatedToken});

  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
  
};

export default tossCoin;