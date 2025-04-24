SELECT 
    s.solarSystemID as solarSystemId, 
    s.solarSystemName, 
    s.security, 
    s.regionID,
    COALESCE(w.wormholeClassId, 0) as wormholeClassId,
    GROUP_CONCAT(j.toSolarSystemID) as connectedSystems
FROM mapSolarSystems s 
LEFT JOIN mapLocationWormholeClasses w ON s.regionID = w.locationId
LEFT JOIN mapSolarSystemJumps j ON s.solarSystemID = j.fromSolarSystemID
GROUP BY s.solarSystemID, s.solarSystemName, s.security, s.regionID, w.wormholeClassId;