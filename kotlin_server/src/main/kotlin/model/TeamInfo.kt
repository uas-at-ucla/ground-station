package kotlinserver.model

import kotlinx.serialization.Serializable

@Serializable
data class TeamInfo (
    val id: Int,
    val username: String,
    val name: String,
    val university: String
)