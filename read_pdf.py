import PyPDF2
import sys

def parse_pdf(file_path):
    with open(file_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        text = ''
        for page in reader.pages:
            text += page.extract_text() + '\n'
        return text

print("=== PLATAFORMA ===")
print(parse_pdf('/Users/pedroselestrim/Documents/brand-generator/EXEMPLO DE RESULTADO/PLATAFORMA - Dolce Dessert.pdf')[:3000])

print("\n\n=== KEYWORD ===")
print(parse_pdf('/Users/pedroselestrim/Documents/brand-generator/EXEMPLO DE RESULTADO/KEYWORD - Dolce Dessert.pdf')[:3000])
