const TimeseriesRepository = require('../repositories/timeseriesRepository');

const repo = new TimeseriesRepository();

function tsToIso(ts) {
  if (ts instanceof Date) return ts.toISOString();
  return String(ts);
}

/**
 * Pivots long-format rows to wide entries compatible with mock JSON shape:
 * { created_at, entry_id, <metric>: value, ... }
 */
function pivotLongToWide(rows) {
  const groups = new Map();

  for (const row of rows) {
    const key = `${tsToIso(row.ts)}|${row.entity ?? ''}`;
    let entry = groups.get(key);

    if (!entry) {
      const entity = row.entity;
      let entryId = entity;
      if (
        entity !== null &&
        entity !== undefined &&
        /^\d+$/.test(String(entity).trim())
      ) {
        entryId = Number(String(entity).trim());
      }

      entry = {
        created_at: tsToIso(row.ts),
        entry_id: entryId,
      };
      groups.set(key, entry);
    }

    entry[row.metric] = row.value;
  }

  return Array.from(groups.values()).sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at),
  );
}

async function getWideEntriesForDatasetName(datasetName) {
  if (!datasetName) return null;
  const datasetId = await repo.getDatasetIdByName(datasetName);
  if (datasetId == null) return null;
  const n = await repo.countRowsByDatasetId(datasetId);
  if (n === 0) return null;
  const longRows = await repo.findAllLongByDatasetId(datasetId);
  return pivotLongToWide(longRows);
}

async function getAvailableMetricsForDatasetName(datasetName) {
  if (!datasetName) return null;
  const datasetId = await repo.getDatasetIdByName(datasetName);
  if (datasetId == null) return null;
  const n = await repo.countRowsByDatasetId(datasetId);
  if (n === 0) return null;
  return repo.findDistinctMetricsByDatasetId(datasetId);
}

async function filterWideEntriesByMetrics(datasetName, streamNames) {
  const entries = await getWideEntriesForDatasetName(datasetName);
  if (!entries) return null;

  return entries.map((entry) => {
    const filtered = {
      created_at: entry.created_at,
      entry_id: entry.entry_id,
    };
    for (const name of streamNames) {
      if (entry[name] !== undefined) {
        filtered[name] = entry[name];
      }
    }
    return filtered;
  });
}

module.exports = {
  pivotLongToWide,
  getWideEntriesForDatasetName,
  getAvailableMetricsForDatasetName,
  filterWideEntriesByMetrics,
};
