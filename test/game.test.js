const supertest = require('supertest');
const app = require('../app.js'); 
const mongoose = require('mongoose');
const http = require('http'); 
const db = 'mongodb+srv://ibarraorvil:Sooth0212@cluster0.dh71ixn.mongodb.net/';
const {startGame, 
       playTurn, 
       getLastLetter, 
       fetchNewWord,
       countProvidedWords} = require("../controllers/game.controller.js")
let server;

describe("Pruebas de integracion para el juego", function() {
  let currentGameState = null;  
  // ** Database Connection Handling **
  beforeEach(async () => {
      await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
          .then(() => console.log('Connected to MongoDB database'))
          .catch(err => console.error('MongoDB connection error:', err));

          server = http.createServer(app);  // Create the server using 'app'
           server.listen(3000); 

              //Mokear juego comenzado
          currentGameState = {
            currentWord: "concertina",
            providedWords: [],
            remainingTime: 20,
            score: 0,
            user: {
                name: "Orvil",
                userId: "935c3127-5af1-416b-a548-14e32d9a7da1"
            }
          };
        });

  afterEach(async () => {
      await mongoose.disconnect(); 
      server.close(); // Close the server 
      currentGameState = null;  
  });

  describe.skip("Validación de nombre de usuario", function() {
    it("Debe rechazar nombres de usuario no válidos", function(done) {
        supertest(app)
          .post("/users/register") 
          .send({
            username: "EL$ikl?Z"
          })
          .expect(400) 
          .end(done);
    });  
  });

  describe.skip("Validación de palabra del usuario", function() {

    it("Debe rechazar palabras con símbolos", function(done) {
      supertest(app)
        .post("/game/play") 
        .send({
          userId: "935c3127-5af1-416b-a548-14e32d9a7da1",
          word: "KF/$)#S!", 
          currentGameState: { 
            currentWord: "concertina", 
            providedWords: [],
            remainingTime: 20,
            score: 0,
            user: {
              name: "Orvil",
              userId: "935c3127-5af1-416b-a548-14e32d9a7da1" 
            }
          }
        })
        .expect(400) 
        .expect('Content-Type', /json/) 
        .expect((res) => {
           
           if (res.body.message !== 'Provided word should contain only letters and numbers') {
               throw new Error('Incorrect error message received');
           }
        })
        .end(done);
    });  
  });   
  describe.skip("Validación de respuesta tardía", function() {
    it("Deberá devolver el número de palabras y la posición en la tabla de posiciones si la respuesta es tardía", function(done) {

      setTimeout(() => {
        supertest(app)
          .post("/game/play")
          .send({
            userId: "935c3127-5af1-416b-a548-14e32d9a7da1", 
            word: "dummyWord", 
            currentGameState: { 
              currentWord: "concertina", 
              providedWords: [],
              remainingTime: 20,
              score: 0,
              user: {
                name: "Orvil",
                userId: "935c3127-5af1-416b-a548-14e32d9a7da1" 
              }            
            }
          })
          .expect(200) 
          .expect('Content-Type', /json/) 
          /*
          .expect((res) => {
            expect(res.body.wordCount).toBeGreaterThan(0); 
            expect(res.body.position).toBeGreaterThan(0); 
          })
          */
          .end(done);
      }, 20000); 
    });
  });
  describe("Validación de respuesta en juego en curso", function() {
    it("Deberá devolver una palabra mientras el juego siga en curso", async function() {
      const response = await supertest(app)
        .post("/game/play")
        .send({
          currentGameState: { 
            currentWord: "concertina", 
            providedWords: [],
            remainingTime: 20,
            score: 0,          },
          userId: "935c3127-5af1-416b-a548-14e32d9a7da1", 
          word: "aduana", 
          
        })
        .expect(200); 
  

      const word = response.body.currentWord; 
      expect(word).toBeTruthy();
      expect(typeof word).toBe('string'); 
    });
  });
  describe("Validación del formato de la tabla", function() {
    it("Deberá devolver una tabla con el formato correcto", async function() {

      const response = await supertest(app)
        .post("/game/play") 
        .send({ 
          // ... (Data needed to generate the table)
        })
        .expect(200);

      const tableData = response.body.table;
      expect(tableData).toBeInstanceOf(Array); 
      expect(tableData.length).toBeGreaterThan(0); 
  
      for (const row of tableData) {
        expect(row).toBeInstanceOf(Array); 
        expect(row.length).toBeGreaterThan(0); 
      }
    });
  });
  describe('Validación de extracción de última letra', () => {
    it('Debe extraer la última letra correctamente', () => {
      const testWord = "example";
      const expectedLastLetter = "e";
  

      const result = playTurn.getLastLetter(testWord); 
  
      expect(result).toBe(expectedLastLetter);
    });
  });
  describe('Validación de obtención de nueva palabra', () => {
    it('Debe devolver una palabra que inicie con la última letra proporcionada', async () => {
      const lastLetter = 't';
      const stubbedWordList = ['test', 'travel', 'another']; 
  
      // Stub the wordList to control the random selection
      sinon.stub(wordList, 'length').value(stubbedWordList.length);
      sinon.stub(Math, 'random').returns(0.5); 
  
      const result = await playTurn.fetchNewWord(lastLetter); 
  
      expect(result).toBe('travel');
  
      // Restore stubs
      sinon.restore();
    });
});
});
