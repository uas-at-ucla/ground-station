package kotlinserver

import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.features.CORS
import io.ktor.features.CallLogging
import io.ktor.features.DefaultHeaders
import io.ktor.http.*
import io.ktor.request.receiveText
import io.ktor.response.respondText
import io.ktor.routing.Routing
import io.ktor.routing.get
import io.ktor.routing.post
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import kotlinserver.interop.Interop
import kotlinserver.model.Telemetry
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonConfiguration

// for testing
@Serializable
data class Message(
    val message: String,
    val data: Int
)

fun Application.module() {
    val interop = Interop()

    install(DefaultHeaders)
    install(CallLogging)

    // CORS is required since the front-end is currently a separate webapp. We can integrate the front-end
    // as a resource of this JVM project to try and get rid of the need for CORS
    install(CORS) {
        header(HttpHeaders.AccessControlAllowOrigin)
        anyHost()
    }
    install(Routing) {
        get("/get-request") {
            call.respondText("Responding to get")
            println("Received get from frontend")
        }
        post("/post-request") {
            val data = call.receiveText()

            val json = Json(JsonConfiguration.Stable)
            val dataObject = json.parse(Message.serializer(), data)
            println("Received post from frontend with message: ${dataObject.message} and data: ${dataObject.data}")

            // Send message to interop
            // Presumably, messages will be sent to interop when this server receives an update
            // in telemetry from the drone; i.e., the drone sends a post request to this server
            if (interop.connect()) {
                println("Interop connected")
            }
            println(interop.getTeams()!![0].toString())
            println(interop.getMission(1))
//            val telemetry = Telemetry(6.0, 12.0, 3.0, 4.0)
//            println(interop.uploadTelemetry(telemetry))

            call.respondText("Responding to post")
        }
    }
}

fun main() {
    embeddedServer(Netty, 8080, host = "0.0.0.0", module = Application::module).start(wait = true)
}