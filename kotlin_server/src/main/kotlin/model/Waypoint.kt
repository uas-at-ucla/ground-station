package kotlinserver.model

import kotlinx.serialization.Serializable

@Serializable
data class Waypoint(
    val latitude: Double,
    val altitude: Double,
    val longitude: Double
)