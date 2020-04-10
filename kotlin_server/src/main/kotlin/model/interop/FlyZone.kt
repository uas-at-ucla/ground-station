package kotlinserver.model.interop

import kotlinserver.model.interop.Coordinate
import kotlinx.serialization.Serializable

@Serializable
data class FlyZone(
    val altitudeMax: Double,
    val altitudeMin: Double,
    val boundaryPoints: List<Coordinate>
)