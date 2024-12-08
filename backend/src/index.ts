import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 7000;

app.use(express.json()); 

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});
  
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
  