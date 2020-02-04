package kotlinserver.model.ui

import kotlinserver.model.interop.Mission
import kotlinx.serialization.Serializable

@Serializable
data class InteropData(
    val ip: String,
    val mission: Mission
)