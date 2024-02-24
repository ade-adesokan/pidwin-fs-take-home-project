import Toss from "../models/toss.js";

const getTosses = async (req, res) => {
  try {
  
    if (!req.userId) {
      return res.json({ message: "Unauthenticated" });
    }

    const {limit = "10"} = req.query;
    const tosses = await Toss.find(
      {userId: req.userId},
      null,
      {
        limit: parseInt(limit), 
        sort: { createdAt: -1}
      }).exec();

    res.status(200).json(tosses);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong fetching toss history" });
  }
};

export default getTosses;