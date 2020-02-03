package kotlinserver.model.interop

import kotlinx.serialization.Serializable

@Serializable
data class DurableODLC(
    val id: Int,
    val mission: Int,
    val type: String, // TODO (Make this a string enum for better type safety)
    val latitude: Double,
    val longitude: Double,
    val orientation: String, // TODO (string enum)
    val shape: String, // TODO (string enum)
    val shapeColor: String, // TODO (string enum)
    val autonomous: Boolean
)