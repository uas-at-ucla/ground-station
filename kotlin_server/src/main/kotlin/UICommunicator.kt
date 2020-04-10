package kotlinserver

import kotlinserver.interop.Interop
import kotlinserver.model.interop.Telemetry
import kotlinserver.model.ui.ConnectToInterop
import kotlinserver.model.ui.InteropData
import kotlinserver.model.ui.WebsocketFormattedMessage
import kotlinx.serialization.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonConfiguration
import kotlinx.serialization.json.JsonObject

// Messages we are able to send to UI:
// [ ] "TELEMETRY",
// [ ] "COMPILED_DRONE_PROGRAM",
// [ ] "UPLOADED_DRONE_PROGRAM",
// [ ] "MISSION_STATUS",
// [ ] "GIMBAL_SETPOINT",
// [ ] "DEPLOYMENT_MOTOR_SETPOINT",
// [ ] "LATCH_SETPOINT",
// [ ] "HOTWIRE_SETPOINT",
// [X] "INTEROP_DATA",
// [ ] "PING",
// [ ] "UGV_MESSAGE",
// [ ] "DROPPY_COMMAND_RECEIVED"


// Messages we can send to UI
/*
TELEMETRY
INTEROP_DATA
 */

// Object class to prevent multiple instances of these functions & keep Main.kt clean
object UICommunicator {

    // Message types client expects (see basicMessages in externalActions.ts)
    const val TELEMETRY = "TELEMETRY"
    const val COMPILED_DRONE_PROGRAM = "COMPILED_DRONE_PROGRAM"
    const val UPLOADED_DRONE_PROGRAM = "UPLOADED_DRONE_PROGRAM"
    const val MISSION_STATUS = "MISSION_STATUS"
    const val GIMBAL_SETPOINT = "GIMBAL_SETPOINT"
    const val DEPLOYMENT_MOTOR_SETPOINT = "DEPLOYMENT_MOTOR_SETPOINT"
    const val LATCH_SETPOINT = "LATCH_SETPOINT"
    const val HOTWIRE_SETPOINT = "HOTWIRE_SETPOINT"
    const val INTEROP_DATA = "INTEROP_DATA"
    const val PING = "PING"
    const val UGV_MESSAGE = "UGV_MESSAGE"
    const val DROPPY_COMMAND_RECEIVED = "DROPPY_COMMAND_RECEIVED"

    // Message types client can send to us
    const val CONNECT_TO_INTEROP = "CONNECT_TO_INTEROP"
    const val SENSORS = "SENSORS"


    // Static data members
    val mJson = Json(JsonConfiguration.Stable)

    /**
     * Handle a message we received from the UI
     *
     * @param message is the message to handle
     * @param interop is the interop server to possibly forward requests to
     * @return a stringified JSON to respond to UI, or null if an error occurred.
     * This returned string will be empty if the client does not expect any particular response data.
     *
     * Reasons for errors: unable to parse message from UI, bad response from interop
     */
    suspend fun handleMessage(message: WebsocketFormattedMessage, interop: Interop): String? {
        val type = message.type

        if (message.data != null) {
            when (type) {
                // This action sends IP, username, password, and missionId, and expects us to send back
                // the interop IP address and corresponding mission data
                CONNECT_TO_INTEROP -> {
                    val data = parseMessageData(message.data, ConnectToInterop.serializer()) ?: return null
                    if (interop.connect(data.ip, data.username, data.password)) {
                        println("Interop connected at ip ${data.ip}, user ${data.username}")
                    } else {
                        println("Failed to connect to interop at ip ${data.ip}, user ${data.username}")
                    }

                    val interopData = InteropData(data.ip, interop.getMission(data.missionId) ?: return null)
                    return createReturnMessage(INTEROP_DATA, interopData, InteropData.serializer())
                }
            }
        }

        return null
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
            mJson.parse(serializer, data.toString())
        } catch (se: SerializationException) {
            println("Unable to parse websocket data: $se")
            null
        }
    }

    /**
     * Helper function for creating the return message to the UI
     * The return message is a stringified WebsocketFormattedMessage
     *
     * @param type is the basicMessage type that the UI expects
     * @param data is the associated data for the message type
     * @param serializer is used to convert the data to string
     * @return the stringified form of the return message
     */
    private inline fun <reified T : Any> createReturnMessage(
        type: String,
        data: T,
        serializer: SerializationStrategy<T>
    ): String {
        return try {
            val dataAsString = mJson.stringify(serializer, data)
            val dataAsJsonObject = mJson.parse(JsonObject.serializer(), dataAsString)
            val formattedMessage = WebsocketFormattedMessage(type, dataAsJsonObject)
            mJson.stringify(WebsocketFormattedMessage.serializer(), formattedMessage)
        } catch (se : SerializationException) {
            println("Failed to create return message when handling message from UI: $se")
            ""
        }
    }
}
