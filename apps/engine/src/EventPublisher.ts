import {createClient} from "redis"

export class EventPublisher {
    private client ; 

    constructor(){
        this.client = createClient({url: "redis://localhost:6379"})
        this.client.connect();
    }

    async publish( channel: string, event: any ){
        await this.client.publish(channel, JSON.stringify(event) )
    }
}

