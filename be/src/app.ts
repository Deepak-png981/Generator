import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import chatRoute from './routes/chat';


const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/', chatRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
