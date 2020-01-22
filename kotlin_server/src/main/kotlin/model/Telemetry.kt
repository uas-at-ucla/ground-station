package kotlinserver.model

import kotlinx.serialization.Serializable

@Serializable
data class Telemetry (
    val latitude: Double,
    val longitude: Double,
    val altitude: Double,
    val heading: Double
)