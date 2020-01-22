package kotlinserver.model

import kotlinx.serialization.Serializable

@Serializable
data class FlyZone(
    val altitudeMax: Double,
    val altitudeMin: Double,
    val boundaryPoints: List<Coordinate>
)