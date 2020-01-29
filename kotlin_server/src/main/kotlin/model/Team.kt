package kotlinserver.model

import kotlinserver.model.serializers.OffsetDateTimeSerializer
import kotlinx.serialization.Serializable
import java.time.OffsetDateTime

@Serializable
data class Team (
    val team: TeamInfo,
    val inAir: Boolean,

    // Default arguments means these fields are optional. Currently required to correctly test /api/teams due to interop configuration
    val telemetry: Telemetry = Telemetry(0.0, 0.0, 0.0, 0.0),
    val telemetryId: String = "",
    val telemetryAgeSec: Double = 0.0,

    // OffsetDateTime is the closest Java class equivalent to the timestamp format AUVSI-SUAS uses; slightly different but should work
    @Serializable(with = OffsetDateTimeSerializer::class)
    val telemetryTimestamp: OffsetDateTime = OffsetDateTime.now()
)