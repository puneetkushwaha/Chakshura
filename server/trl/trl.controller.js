// server/trl/trl.controller.js
const { computeTRLForTechnology } = require("./trl.service");

exports.getTRLForTechnology = async (req, res) => {
  try {
    const tech = req.query.tech;

    if (!tech) {
      return res
        .status(400)
        .json({ error: "Query parameter 'tech' is required" });
    }

    const result = await computeTRLForTechnology(tech);

    return res.json(result);
  } catch (err) {
    console.error("Error in getTRLForTechnology:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
