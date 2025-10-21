// src/api/higherManager.js
import axiosBackend from "../configs/axios-config";

/**
 * Calls backend:
 * GET /api/manager/:landId/dashboard
 *
 * Expected backend shape:
 * {
 *   overview: { totalLands, totalArea, divisions, landsInProgress },
 *   graph: [{ month, count, progress? }, ...],
 *   coverage: [{ division, area }, ...]
 * }
 */

/** Raw call - returns axios response data */
export const getHigherManagerDashboardCardInfo = (landId, options = {}) => {
  if (!landId) {
    return Promise.reject(new Error("landId is required"));
  }
  // axios supports passing { signal } in modern versions if you want cancellation
  return axiosBackend.get(`/api/manager/${landId}/dashboard`, options).then(res => res.data);
};

/**
 * Convenience function which fetches dashboard and maps shapes
 * to what the frontend components expect:
 * - Graph: [{ name, total, progress }]
 * - Coverage: [{ name, value }]
 */
export const fetchAndMapDashboard = async (landId, options = {}) => {
  const data = await getHigherManagerDashboardCardInfo(landId, options);

  const ov = data.overview || {};
  const overview = {
    totalLands: ov.totalLands ?? 0,
    totalArea: ov.totalArea ?? 0,
    divisions: ov.divisions ?? 0,
    landsInProgress: ov.landsInProgress ?? 0,
  };

  const rawGraph = Array.isArray(data.graph) ? data.graph : [];
  const graph = rawGraph.map((g) => ({
    name: g.month ?? g.name ?? "Unknown",
    total: typeof g.count === "number" ? g.count : (g.total ?? 0),
    progress: typeof g.progress === "number" ? g.progress : 0,
  }));

  const rawCoverage = Array.isArray(data.coverage) ? data.coverage : [];
  const coverage = rawCoverage.map((c) => ({
    name: c.land ?? c._id ?? c.name ?? "Unknown",
    value: typeof c.area === "number" ? c.area : (c.value ?? 0),
  }));

  return { overview, graph, coverage };
};

export default {
  getHigherManagerDashboardCardInfo,
  fetchAndMapDashboard,
};
