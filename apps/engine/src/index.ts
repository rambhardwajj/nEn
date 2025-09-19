import { createClient } from "redis";

const subscriberRedis = createClient({url: "redis://localhost:6379"});

const connectRedis = async() =>{
    try {
        await subscriberRedis.connect();
    } catch (error) {
        console.log('subRedis not connected', error);
    }
}

connectRedis();
