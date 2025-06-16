# AI Business Generator

## Opis

AI Business Generator jest to prosta aplikacja polegająca na wysłaniu formularza do serweru sterowanego Agentem AI, zbudowanego w edytorze graficznyn N8N. 
Projekt AI Business Generator został stworzony z pomocą Sztucznej Inteligencji. 


## 📦 Zawartość projektu

- HTML + CSS (Tailwind)
- JavaScript (Vanilla)
- Możliwość pobierania pliku MarkDown z gotowym Business Summary
- Integracja z webhookiem n8n

---

## 🛠️ Wymagania

- Node.js (tylko jeśli używasz Tailwind lokalnie)
- Brak backendu – czysty frontend

---

## 🚧 Setup lokalny

1. **Sklonuj repozytorium**

```bash
git clone https://github.com/theOneAndOnlyPGFPP10/AiBusinessGenerator.git
cd AiBusinessGenerator
```
2. **Zainstaluj zalezności**

```bash
npm install
```
3. **Zbuduj CSS**
```bash
npm run watch
```
Powyzsza komenda kryje 

```bash
npx tailwindcss -i ./css/input.css -o ./css/output.css --watch
```
zaraz po niej mozesz wyjść z podglądu naciskając w terminalu `Ctrl` + `C`.

4. **Zbuduj Agenta AI w n8n**

Cały workflow Agenta AI, potrzebnego do wygenerowania Business Pitch, znajduje się w pliku `n8n_workflow.json`. Ten plik nalezy zaimportować do swojego workflow, w swoim edytorze n8n.
Dodatkowo, nalezy ustawić Credentials dla OpenAI w `OpenAI Chat Model`. Ta usługa jest **płatna** a bez niej serwer nie ruszy. 

## START

1. **Interfejsu**
Aby wystartować z aplikacją, nalezy w terminalu aplikacji wpisać komendę 

```bash
npm run start
```
Ta komenda pozwoli wystartować interfejs projektu.

2. **Serwera**
Serwer nalezy włączyć poprzez przycisk czerwony "Execute workflow", na dole widoku. 
Dodatkowo, nalezy się upewnić czy cały workflow jest w trybie Editor a nie Executions, u góry widoku.


## **Sposób uzytku**
Przed wypełnieniem formularza w generatorze planu biznesowego, nalezy przycisnąć w n8n wspomniany, akapit wcześniej, czerwony przycisk, poniewaz tylko wtedy n8n będzie nasłuchiwał i wykona swoją pracę po wciśnięciu przycisku Submit. 

Po wypełnieniu formularza i wciśnieciu Submit, Serwer powinien po chwili przesłać wyniki.
U dołu strony, znajdziesz czarny przycisk odpowiadający za przesłanie pliku MD, który jest markdownem przesłanych informacji. **Zanim wciśniesz** czarny przycisk, wciśnij w n8n czerwony przycisk by rozpocząć nasłuch. DOpiero wtedy mozesz nacisnąć w Interfejsie czarny przycisk. 



Miłego korzystania z aplikacji!