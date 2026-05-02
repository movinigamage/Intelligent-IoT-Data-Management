//handles HTTP request logic for mock data routes

const {
  readProcessedData,
  getAvailableStreamNames,
  filterEntriesByStreamNames
} = require('../services/mockService');

const getStreams = async (req, res) => {
  try {
    const data = await readProcessedData();
    res.json(data);
    console.log("DATA:", data);
  } catch (err) {
    console.error('Error reading stream data:', err);
    res.status(500).json({ error: 'Failed to load stream data' });
  }
};

const getStreamNames = async (req, res) => {
  try {
    const streamNames = await getAvailableStreamNames();
    if (streamNames.length === 0) {
      return res.status(404).json({ error: "No stream names found" });
    }
    res.json(streamNames);
  } catch (err) {
    console.error('Error getting stream names:', err);
    res.status(500).json({ error: 'Failed to get stream names' });
  }
};

const postFilterStreams = async (req, res) => {
  const { streamNames } = req.body;

  if (!Array.isArray(streamNames) || streamNames.length === 0) {
    return res.status(400).json({ error: 'streamNames must be a non-empty array' });
  }

  try {
    const filtered = await filterEntriesByStreamNames(streamNames);
    res.json(filtered);
  } catch (err) {
    console.error('Error filtering stream data:', err);
    res.status(500).json({ error: 'Failed to filter stream data' });
  }
};

module.exports = {
  getStreams,
  getStreamNames,
  postFilterStreams
};