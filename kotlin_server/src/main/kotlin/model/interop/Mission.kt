package kotlinserver.model.interop

import kotlinx.serialization.Serializable

@Serializable
data class Mission(
    val id: Int,
    val lostCommsPos: Coordinate,
    val offAxisOdlcPos: Coordinate,
    val stationaryObstacles: List<Coordinate3D>,
    val searchGridPoints: List<Coordinate>,
    val waypoints: List<Waypoint>,
    val airDropBoundaryPoints: List<Coordinate>,
    val airDropPos: Coordinate,
    val emergentLastKnownPos: Coordinate,
    val ugvDrivePos: Coordinate,
    val flyZones: List<FlyZone>
)