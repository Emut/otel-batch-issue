import {BatchLogRecordProcessor, ConsoleLogRecordExporter, LoggerProvider} from "@opentelemetry/sdk-logs";

const main = async ():Promise<void> => {
    const consoleExporter = new ConsoleLogRecordExporter();
    const batchProcessor = new BatchLogRecordProcessor(consoleExporter, {maxExportBatchSize: 2, scheduledDelayMillis: 5_000});
    const loggerProvider = new LoggerProvider({processors:[batchProcessor]});
    const logger = loggerProvider.getLogger('default');

    for (let i = 0; i < 5; ++i) {
        logger.emit({body: `${i}`});
    }

    // 5 logs of batches of 2
    // expect to see 2 batches of 2 immediately, followed by the 5th one after 5_000ms
    // instead get (5_000ms wait, 2 logs, 5_000ms wait, 2 logs, 5_000ms wait, 1 log)

    setInterval(() => console.log(Date.now()), 1_000);
};

(async () => {
    await main();
})();