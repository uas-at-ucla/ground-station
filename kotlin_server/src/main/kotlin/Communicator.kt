package kotlinserver

import kotlinserver.interop.Interop
import kotlinserver.model.interop.Telemetry
import kotlinserver.model.ui.ConnectToInterop
import kotlinserver.model.ui.WebsocketFormattedMessage
import kotlinx.serialization.DeserializationStrategy
import kotlinx.serialization.SerializationException
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonConfiguration
import kotlinx.serialization.json.JsonObject

// Object class to prevent multiple instances of these functions & keep Main.kt clean
object Communicator {

    /**
     * Handle a message we received from the UI
     *
     * @param message is the message to handle
     * @param interop is the interop server to possibly forward requests to
     * @return true if we successfully handled the message, false otherwise
     *
     * Reasons to return false: unable to parse message from UI, bad response from interop
     */
    suspend fun handleMessage(message: WebsocketFormattedMessage, interop: Interop): Boolean {
        val type = message.type

        if (message.data != null) {
            when (type) {
                "CONNECT_TO_INTEROP" -> {
                    val data = parseMessageData(message.data, ConnectToInterop.serializer()) ?: return false
                    if (interop.connect(data.ip, data.username, data.password)) {
                        println("Interop connected")
                    } else {
                        println("Failed to connect to interop")
                    }

                    println(interop.getMission(1))
                    println(interop.getTeams()!![0])
                    println(interop.uploadTelemetry(Telemetry(6.0, 12.0, 3.0, 4.0)))
                }
            }
        }

        return true
    }

    /**
     * Helper function for parsing the data field within a WebsocketFormattedMessage. Handles exceptions.
     *
     * @param data is the JSON to parse
     * @param serializer is the serializer corresponding to the data type we want to parse the JSON into
     * @return the parsed data as a typed object, or null if we were unable to parse it
     */
    private fun <T> parseMessageData(data: JsonObject, serializer: DeserializationStrategy<T>): T? {
        return try {
            val json = Json(JsonConfiguration.Stable)
            json.parse(serializer, data.toString())
        } catch (se: SerializationException) {
            println("Unable to parse websocket data: $se")
            null
        }
    }
}
