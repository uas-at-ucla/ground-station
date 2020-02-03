package kotlinserver

import io.ktor.application.Application
import io.ktor.application.install
import io.ktor.http.cio.websocket.Frame
import io.ktor.http.cio.websocket.pingPeriod
import io.ktor.http.cio.websocket.readText
import io.ktor.http.cio.websocket.timeout
import io.ktor.routing.routing
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.websocket.WebSockets
import io.ktor.websocket.webSocket
import kotlinserver.Communicator.handleMessage
import kotlinserver.interop.Interop
import kotlinserver.model.ui.WebsocketFormattedMessage
import kotlinx.coroutines.channels.ClosedReceiveChannelException
import kotlinx.serialization.SerializationException
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonConfiguration
import java.time.Duration

fun Application.module() {
    val json = Json(JsonConfiguration.Stable)
    val interop = Interop()

    install(WebSockets)

    routing {
        webSocket("/ui") {
            println("UI connected")
            try {
                for (frame in incoming) {
                    when (frame) {
                        is Frame.Text -> {
                            val contents = frame.readText()
                            try {
                                println("Received message")
                                val contentJson = json.parse(WebsocketFormattedMessage.serializer(), contents)
                                handleMessage(contentJson, interop)?.run {
                                    outgoing.send(Frame.Text(this))
                                }
                            } catch (se: SerializationException) {
                                println("Unable to parse message: $se")
                                println(contents)
                            }
                        }
                    }
                }
            } catch (ex : ClosedReceiveChannelException) {
                println("Connection closed: ${closeReason.await()}")
            }
            println("End of websocket code ${closeReason.await()}")
        }
        // webSocket("/uav") {} // handle more WebSockets in different ways by adding additional routes like this
    }
}

fun main() {
    embeddedServer(Netty, 8081, host = "0.0.0.0", module = Application::module).start(wait = true)
}