import { db } from "@/db";
import { badRequest, ok, serverError } from "@/lib/api-helpers";

/**
 * Webhook endpoint for instrument data ingestion.
 * Lab equipment (DAQ, oscilloscopes, sensors) POST measurement data here.
 *
 * Expected payload:
 * {
 *   instrument_id: string,
 *   experiment_id: string,
 *   api_key: string,           // pre-shared key for authentication
 *   channels: [
 *     { channel: 0, samples: [[time_offset_ms, value], ...] }
 *   ]
 * }
 *
 * For high-frequency data, the instrument should batch samples
 * and send them in chunks (max 10,000 points per request).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { instrument_id, experiment_id, api_key, channels } = body;

    // Validate required fields
    if (!instrument_id || !experiment_id || !api_key || !channels) {
      return badRequest(
        "Required fields: instrument_id, experiment_id, api_key, channels",
      );
    }

    // Validate API key (should match env var)
    if (api_key !== process.env.INSTRUMENT_API_KEY) {
      return badRequest("Invalid API key");
    }

    // Validate channels
    if (!Array.isArray(channels) || channels.length === 0) {
      return badRequest("channels must be a non-empty array");
    }

    // For now, acknowledge receipt. In production, this would:
    // 1. Validate instrument exists and is active
    // 2. Validate experiment exists and is running
    // 3. Write data to measurement_data (partitioned table)
    // 4. Or enqueue to pgmq for async batch processing
    //
    // const { data, error } = await supabase
    //   .from('measurement_data')
    //   .insert(channels.flatMap(ch =>
    //     ch.samples.map(([t, v]: [number, number]) => ({
    //       experiment_id,
    //       channel: ch.channel,
    //       time_offset_ms: t,
    //       value: v,
    //     }))
    //   ));

    const totalSamples = channels.reduce(
      (sum: number, ch: any) => sum + (ch.samples?.length ?? 0),
      0,
    );

    return ok({
      accepted: true,
      instrument_id,
      experiment_id,
      channels: channels.length,
      samples: totalSamples,
      message: `Accepted ${totalSamples} samples from ${channels.length} channels`,
    });
  } catch (error) {
    return serverError(error);
  }
}
