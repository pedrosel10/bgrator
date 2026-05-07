import fs from 'fs';
import pdf from 'pdf-parse';

async function parse() {
  const p1 = fs.readFileSync('./EXEMPLO DE RESULTADO/PLATAFORMA - Dolce Dessert.pdf');
  const d1 = await pdf(p1);
  console.log("=== PLATAFORMA ===");
  console.log(d1.text.substring(0, 2000));
  
  const p2 = fs.readFileSync('./EXEMPLO DE RESULTADO/KEYWORD - Dolce Dessert.pdf');
  const d2 = await pdf(p2);
  console.log("\n\n=== KEYWORD ===");
  console.log(d2.text.substring(0, 2000));
}

parse();
