import express from 'express';
import { router } from './routers/user';
import { product_router } from './routers/product';
import './db/mongoConn';

const app : express.Application = express();

const port : number = 3000;

// Parse JSON request bodies
app.use(express.json());
app.use(router);
app.use(product_router);

// app.get('/',(req,res)=>{
//     res.send('Welcome!');
// })

app.listen(port,()=>{
    console.log(`server is runing on localhost:${port}`);
})