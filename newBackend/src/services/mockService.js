const MockRepository = require('../repositories/mockRepository');
// const {
//   getWideEntriesForDatasetName,
//   getAvailableMetricsForDatasetName,
//   filterWideEntriesByMetrics,
// } = require('./Timeseries_Service');

let getWideEntriesForDatasetName;
let getAvailableMetricsForDatasetName;
let filterWideEntriesByMetrics;

try {
  ({
    getWideEntriesForDatasetName,
    getAvailableMetricsForDatasetName,
    filterWideEntriesByMetrics,
  } = require('./Timeseries_Service'));
} catch (err) {
  console.warn('Timeseries service not available, using mock only');
}

const mockRepository = new MockRepository();

const readProcessedData = async () => {
  return await mockRepository.getMockData();
};

const getAvailableStreamNames = async () => {
  const entries = await mockRepository.getMockData();
  if (!entries || entries.length === 0) return [];

  const excludedKeys = ["created_at", "entry_id", "was_interpolated"];
  return Object.keys(entries[0]).filter(key => !excludedKeys.includes(key));
};

const filterEntriesByStreamNames = async (streamNames) => {
  const entries = await mockRepository.getMockData();

  return entries.map((entry) => {
    const filteredEntry = {
      created_at: entry.created_at,
      entry_id: entry.entry_id,
    };

    streamNames.forEach((name) => {
      if (entry[name] !== undefined) {
        filteredEntry[name] = entry[name];
      }
    });

    return filteredEntry;
  });
}

module.exports = {
  readProcessedData,
  getAvailableStreamNames,
  filterEntriesByStreamNames,
};
