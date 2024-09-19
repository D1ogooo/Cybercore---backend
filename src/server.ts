import express from 'express'
import cors from 'cors'
import { router } from './routes';
const app = express()

app.use(cors())
app.use(express.json())
app.use(router)

const PORT = 3333;
app.listen(PORT, () => {
 console.log(`👩‍💻 Server running on port: ${PORT} 👩‍💻`);
})