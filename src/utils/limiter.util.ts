import PQueue from "p-queue";

const queue = new PQueue({ concurrency: 2 });

export const limitConcurrentRequests = async (tasks: (() => Promise<any>)[]) => {
    return Promise.all(tasks.map((task) => queue.add(task)));
};
