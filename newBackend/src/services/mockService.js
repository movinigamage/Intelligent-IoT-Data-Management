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

const datasetName =
  process.env.DEFAULT_DATASET_NAME && process.env.DEFAULT_DATASET_NAME.trim();

async function readProcessedData() {
  if (datasetName) {
    try {
      const fromDb = await getWideEntriesForDatasetName(datasetName);
      if (fromDb) return fromDb;
    } catch (err) {
      console.warn('DB read failed, falling back to mock file:', err.message);
    }
  }
  return mockRepository.getMockData();
}

async function getAvailableStreamNames() {
  if (datasetName) {
    try {
      const metrics = await getAvailableMetricsForDatasetName(datasetName);
      if (metrics) return metrics;
    } catch (err) {
      console.warn('DB stream names failed, falling back to mock file:', err.message);
    }
  }

  const entries = mockRepository.getMockData();
  if (!entries || entries.length === 0) return [];

  const excludedKeys = ['created_at', 'entry_id', 'was_interpolated'];
  return Object.keys(entries[0]).filter((key) => !excludedKeys.includes(key));
}

async function filterEntriesByStreamNames(streamNames) {
  if (datasetName) {
    try {
      const filtered = await filterWideEntriesByMetrics(datasetName, streamNames);
      if (filtered) return filtered;
    } catch (err) {
      console.warn('DB filter failed, falling back to mock file:', err.message);
    }
  }

  const entries = mockRepository.getMockData();

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
