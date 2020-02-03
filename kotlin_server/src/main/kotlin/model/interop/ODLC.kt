package kotlinserver.model.interop

import kotlinx.serialization.Serializable

/**
 * From the documentation:
 *
 * Most of the odlc characteristics are optional; if not provided in this initial POST request, they may be
 * added in a future PUT request. Characteristics not provided will be considered left blank. Note that some
 * characteristics must be submitted by the end of the mission to earn credit for the odlc.
 */

@Serializable
data class ODLC(
    val mission: Int,
    val type: String, // TODO (Make this a string enum for better type safety)
    val latitude: Double,
    val longitude: Double,
    val orientation: String, // TODO (string enum)
    val shape: String, // TODO (string enum)
    val shapeColor: String, // TODO (string enum)
    val autonomous: Boolean
)