import express from "express"
import amqp from "amqplib"
import {v4 as uuid} from "uuid"

const app = express();
app.use(express.json());

let channel:amqp.Channel;
let connection:amqp.Connection;

const CODE_QUEUE="code_queue"
const RESULT_QUEUE="result_queue"

const codeMap=new Map<string,string|null>()

async function consumeResultQueue(){
    channel.consume(RESULT_QUEUE,(msg)=>{
        if(msg?.properties.correlationId){
            const output=msg.content.toString()
            codeMap.set(msg.properties.correlationId,output)
        }
    },{
        
    })
}


async function connectRabbit(){
    try{
         connection = await amqp.connect("amqp://localhost:5672");
         channel=await connection.createChannel();
         await channel.assertQueue(CODE_QUEUE, { durable: true });
         await channel.assertQueue(RESULT_QUEUE, { durable: true });
         console.log("Connected to RabbitMQ");
    }catch(e){
        console.log("error",e)
    }
}



app.post("/send-code", async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ error: "code is required" });

        const codeId = uuid();
        codeMap.set(codeId,null);

        const resultQueue = await channel.assertQueue("", { exclusive: true });

        channel.sendToQueue(CODE_QUEUE, Buffer.from(code), {
            correlationId: codeId,
            replyTo: resultQueue.queue
        });
        res.status(200).json({ codeId });
    } catch (error) {
        console.error("Error in /send-code:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/get-code",(req,res)=>{
    const codeId=req.query.codeID as string

   if(codeMap.has(codeId)){
    const output=codeMap.get(codeId)
    if(output){
        res.json({output})
    }else{
        res.status(202).json({message: "Code is still executing, please try again later"})
    }
   }else{
    res.status(404).json({error:"invalid code request"})
   }
})


app.listen(8000,()=>{console.log("ruuning coderunner")
    connectRabbit()
    consumeResultQueue()
})