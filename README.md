# otel-batch-issue
Repro for BatchLogRecordProcessor not sending records when queue hits maxExportBatchSize

## Running
Execute
```shell
npm install
npx tsx index.ts
```

## Expected
With `{maxExportBatchSize: 2, scheduledDelayMillis: 5_000}`, records should be sent to the exporter when there are 2 records in the queue.

## Actual
Records are emitted at every `scheduledDelayMillis`ms, regardless of queue length.

Processor still respects the `maxExportBatchSize` though and sending them in batches,
while waiting for another `scheduledDelayMillis` between batches.

The [JavaDocs](https://www.javadoc.io/doc/io.opentelemetry/opentelemetry-sdk-logs/latest/io/opentelemetry/sdk/logs/export/BatchLogRecordProcessor.html) state:
> Logs are exported either when there are maxExportBatchSize pending logs or scheduleDelayNanos has passed since the last export finished.

Which makes more sense given this is a batch processor. 
Js implementation acts more or less as a rate limiter.

Unsure if there is a global SDK definition describing the intended behavior.