import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST','OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.get('/mensaje', (req, res) => {
  console.log("DEBUG: Aquí estoy en el backend");
  res.json({ 
    status: 'success',
    mensaje: '¡Backend conectado correctamente!' 
  });
});


app.post('/guardarProps', (req, res) => {
  const { valor } = req.body;
  let valorString = '0.00';
  
  if(valor > 0){
    valorString = valor.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  res.json({ 
    valorString: valorString,
  });
});

app.post('/pago', (req, res) => {
  const { pago, tipoPago, porPagar, totalPagado } = req.body;
  
  let text = '';

  switch(tipoPago){
    case 1:  // Efectivo
      text = 'Pago $' + pago + ' en Efectivo';
      break;
    case 2:  // BBVA
      text = 'Pago $' + pago + ' en BBVA';
      break;
    case 3:  // Santander
      text = 'Pago $' + pago + ' en Santander';
      break;
  }

  const valor = parseFloat(pago);
  const pendiente = parseFloat(porPagar.replace(/,/g, ''));
  const total = pendiente - valor;
  
  const pagado = parseFloat(totalPagado.replace(/,/g, ''));
  const totalPag = pagado + valor;

  const totalString = total.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const pagadoString = totalPag.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });


  res.json({ 
    text: text,
    total: totalString,
    pagado: pagadoString,
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Servidor backend en http://localhost:${PORT}`);
});