package kotlinserver.interop

import io.ktor.client.HttpClient
import io.ktor.client.features.cookies.AcceptAllCookiesStorage
import io.ktor.client.features.cookies.HttpCookies
import io.ktor.client.request.post
import io.ktor.client.request.get
import io.ktor.client.statement.HttpResponse
import io.ktor.client.statement.HttpStatement
import io.ktor.client.statement.readText
import io.ktor.content.TextContent
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import kotlinserver.model.interop.*
import kotlinx.serialization.DeserializationStrategy
import kotlinx.serialization.SerializationException
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonConfiguration
import kotlinx.serialization.list

class Interop {

    // Data members
    private var mInteropURL = ""
    private var mConnected = false
    private val mJson = Json(JsonConfiguration.Stable)
    private val mClient = HttpClient {
        // Allows for dynamic storage of cookies after logging in
        install(HttpCookies) {
            storage = AcceptAllCookiesStorage()
        }
    }

    /**
     * Connects to the interop server. Must be called before any API requests can be sent.
     * Also deals with basic configuration, such as storing the interop server's IP address.
     * Endpoint: POST /api/login
     *
     * @param ip the IP address of the interop server to connect to
     * @param username login information for interop
     * @param password login information for interop
     * @return true if a connection was successfully established, false otherwise
     */
    suspend fun connect(ip: String, username: String, password: String): Boolean {
        mInteropURL = "http://$ip"
        val requestBody = mJson.stringify(
            LoginRequest.serializer(),
            LoginRequest(username = username, password = password)
        )
        println("Trying to connect")
        val response = postRequest("/api/login", requestBody)
        println("Connected!")
        mConnected = response.status == HttpStatusCode.OK
        return mConnected
    }

    /**
     * Get teams' information from interop.
     * Endpoint: GET api/teams
     *
     * @return a list of all teams with their status and information
     */
    suspend fun getTeams(): List<Team>? {
        if (!mConnected) return null
        val response = mClient.get<HttpStatement>("${mInteropURL}/api/teams").execute()
        return parseResponse(response, Team.serializer().list, "Teams") // type required since deserializing list
    }

    /**
     * Get a specific mission from interop.
     * Endpoint: GET /api/missions/{id}
     *
     * @param missionId is the ID of the mission to fetch
     */
    suspend fun getMission(missionId: Int): Mission? {
        if (!mConnected) return null
        val response = mClient.get<HttpStatement>("${mInteropURL}/api/missions/${missionId}").execute()
        return parseResponse(response, Mission.serializer())
    }
    

    /**
     * Uploads UAV telemetry data to interop.
     * Endpoint: POST /api/telemetry
     *
     * @param telemetry is the data to upload
     * @return true if telemetry was successfully uploaded via HTTP, false otherwise
     */
    suspend fun uploadTelemetry(telemetry: Telemetry): Boolean {
        if (!mConnected) return false
        val response = postRequest("/api/telemetry", mJson.stringify(Telemetry.serializer(), telemetry))
        return response.status == HttpStatusCode.OK
    }

    /**
     * Uploads Object Detection, Localization, Classification (ODLC) data to interop.
     * Endpoint: POST /api/odlcs
     *
     * @param odlc is the data to upload
     * @return the response data from interop
     */
    suspend fun uploadODLC(odlc: ODLC): DurableODLC? {
        if (!mConnected) return null
        val response = postRequest("/api/odlcs", mJson.stringify(ODLC.serializer(), odlc))
        return parseResponse(response, DurableODLC.serializer())
    }

    /**
     * Parses a JSON string into an object using a deserializer.
     *
     * @param response is the interop server's HTTP response
     * @param deserializer is the typed deserializer used to parse JSON
     * @param type is the type of object to parse
     * @return an object representing the JSON data in the HTTP response
     */
    private suspend inline fun <reified T> parseResponse(
        response: HttpResponse,
        deserializer: DeserializationStrategy<T>,
        type: String = T::class.java.simpleName
    ): T? {
        return if (response.status == HttpStatusCode.OK) {
            val responseText = response.readText()
            try {
                mJson.parse(deserializer, responseText)
            } catch (se : SerializationException) {
                println("Failed to parse interop server's response: $se")
                println(responseText)
                null
            }
        } else {
            println("Unable to get $type: ${response.status}")
            null
        }
    }

    /**
     * Sends a post request to the interop server and checks for errors.
     *
     * @param endpoint is the endpoint to post a request to
     * @param body is the contents of the request in String format
     * @return the interop server's response
     */
    private suspend inline fun postRequest(endpoint: String, body: String): HttpResponse {
        val response = mClient.post<HttpStatement>("$mInteropURL$endpoint") {
            this.body = TextContent(body, ContentType.Application.Json)
        }.execute()

        if (response.status != HttpStatusCode.OK) {
            println("HTTP error at $endpoint: ${response.status}")
        }

        return response
    }
}