package kotlinserver.model.ui

import kotlinx.serialization.Serializable

@Serializable
data class ConnectToInterop(
    val ip: String,
    val username: String,
    val password: String,
    val missionId: Int
)