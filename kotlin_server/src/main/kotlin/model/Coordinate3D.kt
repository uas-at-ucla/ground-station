package kotlinserver.model

import kotlinx.serialization.Serializable

@Serializable
data class Coordinate3D(
    val latitude: Double,
    val radius: Double,
    val longitude: Double,
    val height: Double
)