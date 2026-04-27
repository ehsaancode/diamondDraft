fetch('http://localhost:5000/api/products', { 
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'T', sku: 'TEST-1234', price: 99 }) 
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
