// src/api/higherManager.js
import axiosBackend from "../configs/axios-config";

/**
 * idObj: { landId?, managerId? }
 *
 * - If landId provided -> GET /api/higherManager/land/:landId/card
 * - Else if managerId provided -> GET /api/higherManager/dashboard?managerId=:managerId
 *
 * Returns the parsed data object (not axios response).
 */
export const getHigherManagerDashboardCardInfo = async (idObj = {}, options = {}) => {
  const { landId, managerId } = idObj || {};

  if (!landId && !managerId) {
    return Promise.reject(new Error("landId or managerId is required"));
  }

  if (landId) {
    const res = await axiosBackend.get(`/api/higherManager/land/${landId}/card`, options);
    return res.data;
  } else {
    // managerId path
    const res = await axiosBackend.get(`/api/higherManager/dashboard`, {
      params: { managerId },
      ...options,
    });
    return res.data;
  }
};

/**
 * Optional convenience mapper (keeps same behaviour)
 */
export const fetchAndMapDashboard = async (idObj = {}, options = {}) => {
  const data = await getHigherManagerDashboardCardInfo(idObj, options);

  const ov = data.overview || {};
  const overview = {
    totalLands: ov.totalLands ?? ov.total_lands ?? 0,
    totalArea: ov.totalArea ?? ov.total_area ?? 0,
    divisions: ov.divisions ?? ov.totalDivisions ?? 0,
    landsInProgress: ov.landsInProgress ?? ov.pendingOperations ?? 0,
  };

  const rawGraph = Array.isArray(data.graph) ? data.graph : [];
  const graph = rawGraph.map((g) => ({
    name: g.month ?? g.name ?? "Unknown",
    total: typeof g.count === "number" ? g.count : g.total ?? 0,
    progress: typeof g.progress === "number" ? g.progress : 0,
  }));

  const rawCoverage = Array.isArray(data.coverage) ? data.coverage : [];
  const coverage = rawCoverage.map((c) => ({
    name: c.land ?? c._id ?? c.name ?? "Unknown",
    value: typeof c.area === "number" ? c.area : c.value ?? 0,
  }));

  return { overview, graph, coverage, raw: data };
};

export default {
  getHigherManagerDashboardCardInfo,
  fetchAndMapDashboard,
};
