package kotlinserver.model.ui

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonObject

@Serializable
data class WebsocketFormattedMessage(
    val type: String,
    val data: JsonObject? // will need to be deserialized further
)