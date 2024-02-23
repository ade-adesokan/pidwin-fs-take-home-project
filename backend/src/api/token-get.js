import Token from "../models/token.js";

const getToken = async (req, res) => {
  try {
  
    if (!req.userId) {
      return res.json({ message: "Unauthenticated" });
    }

    const { token } = await Token.findOne({userId: req.userId}).exec();

    res.status(200).json({token});
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default getToken;