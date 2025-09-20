import { createClient } from "redis";

const subscriberRedis = createClient({url: "redis://localhost:6379"});

const connectRedis = async () => {
    try {
        await subscriberRedis.connect();
        console.log("Engine Redis connected successfully");
    } catch (error) {
        console.log('Engine Redis not connected', error);
    }
}

// Initialize connection
connectRedis();

// Simple function to check and process queue
async function processQueue() {
    try {
        // Pop one job from the queue (lowest score = highest priority)
        const result = await subscriberRedis.zPopMin("workflow:execution");
        
        if (!result ) {
            console.log(" No jobs in queue");
            return;
        }

        const job = result;
        const executionData = JSON.parse(job.value);
        
        console.log(" Got job from queue!");
        console.log("Job Details:");
        console.log(`   Execution ID: ${executionData.executionId}`);
        console.log(`   Workflow ID: ${executionData.workflowId}`);
        console.log(`   User ID: ${executionData.userId}`);
        console.log(`   Workflow Name: ${executionData.workflow.name}`);
        console.log(`   Triggered By: ${executionData.triggeredBy}`);
        console.log(`   Priority: ${executionData.priority}`);
        console.log(`   Status: ${executionData.status}`);
        
        console.log("\n🔗 Workflow Structure:");
        console.log(`   Nodes: ${executionData.workflow.nodes.length}`);
        console.log(`   Edges: ${executionData.workflow.edges.length}`);
        
        console.log("\n Full Job Data:");
        console.log(JSON.stringify(executionData, null, 2));
        
        console.log("\n" + "=".repeat(50) + "\n");
        
    } catch (error) {
        console.error(" Error processing queue:", error);
    }
}

// Function to continuously monitor queue
async function startMonitoring() {
    console.log("Starting queue monitoring...");
    console.log("Checking for jobs every 2 seconds...\n");
    
    setInterval(async () => {
        await processQueue();
    }, 20000); 
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log("\n Shutting down...");
    await subscriberRedis.quit();
    process.exit(0);
});

// Start monitoring
startMonitoring();