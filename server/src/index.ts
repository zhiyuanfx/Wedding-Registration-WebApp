import express, { Express } from "express";
import { addGuest, guestList, loadGuest, updateGuest } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.get("/api/guestList", guestList);
app.get("/api/loadGuest", loadGuest)
app.post("/api/addGuest", addGuest);
app.post("/api/updateGuest", updateGuest);  
app.listen(port, () => console.log(`Server listening on ${port}`));
