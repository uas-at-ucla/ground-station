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
import io.ktor.http.Cookie
import io.ktor.http.HttpStatusCode
import io.ktor.http.setCookie
import kotlinserver.model.*
import kotlinx.serialization.DeserializationStrategy
import kotlinx.serialization.ImplicitReflectionSerializer
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonConfiguration
import kotlinx.serialization.list
import kotlinx.serialization.serializer

class Interop {

    // Interop setup credentials
    // IP, port, username, and password are all specified within Flightdeck. We should get these values from
    // Flightdeck instead of hard-coding them here; this should be a POST request when clicking the "Connect to Interop"
    // button. This will require direct modification of front-end code; until then, interop credentials will need
    // to remain hard-coded.
    private val mInteropIP = "167.71.120.140" // at competition, replace this with IP address given at setup time
    private val mInteropPort = "8000"
    private val mInteropURL = "http://${mInteropIP}:${mInteropPort}"
    private val mInteropUsername = "testuser" // also replace with username given at check-in
    private val mInteropPassword = "testpass" // same as interop username

    // Data members
    private val mClient = HttpClient() {
        // Allows for dynamic storage of cookies after logging in
        install(HttpCookies) {
            storage = AcceptAllCookiesStorage()
        }
    }
    private val mJson = Json(JsonConfiguration.Stable)

    /**
     * Connects to the interop server. Must be called before any API requests can be sent.
     * Endpoint: POST /api/login
     *
     * @return true if a connection was successfully established, false otherwise
     */
    suspend fun connect(): Boolean {
        val requestBody = mJson.stringify(
            LoginRequest.serializer(),
            LoginRequest(username = mInteropUsername, password = mInteropPassword)
        )
        val response = postRequest("/api/login", requestBody)
        return response.status == HttpStatusCode.OK
    }

    /**
     * Get teams' information from interop.
     * Endpoint: GET api/teams
     *
     * @return a list of all teams with their status and information
     */
    suspend fun getTeams(): List<Team>? {
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
    suspend fun uploadODLC(odlc: ODLC) {
        val response = postRequest("/api/odlcs", mJson.stringify(ODLC.serializer(), odlc))
        // TODO (Return response from ODLC POST request)
    }

    suspend fun updateODLC(id: Int) {

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
            mJson.parse(deserializer, response.readText())
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