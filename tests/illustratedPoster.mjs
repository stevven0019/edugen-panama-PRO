import assert from 'node:assert/strict';
import fs from 'node:fs';
import {illustratedSheets,vocabularyWords,illustrationPrompt} from '../src/resources/illustratedPoster.js';
import handler from '../api/scenario-poster.js';
assert.deepEqual(vocabularyWords('be (am, is, are), cut, fold'),['be (am, is, are)','cut','fold']);
const grade5=JSON.parse(fs.readFileSync('public/curriculums/English_Curriculum_Grade_5.json')).scenarios[0];
const {sheets}=illustratedSheets(grade5);const words=sheets.flat().map(i=>i.word);
assert.ok(words.includes('scissors'));assert.ok(words.includes('flowchart'));assert.ok(words.includes('under'));assert.equal(sheets.length,1);
assert.equal(words.length,Object.values(grade5.communicative_competences.vocabulary.linguistic_competences).flatMap(vocabularyWords).length);
assert.ok(illustrationPrompt(grade5,'5th Grade',0,0).includes("Let's make a poster."));
assert.ok(illustrationPrompt(grade5,'5th Grade',0,0).includes('Recommended Grammatical Features'));
assert.throws(()=>illustrationPrompt(grade5,'5th Grade',0,1));
let count=0;for(const f of fs.readdirSync('public/curriculums').filter(f=>f.endsWith('.json'))){for(const raw of JSON.parse(fs.readFileSync('public/curriculums/'+f)).scenarios){try{const result=illustratedSheets(raw);assert.equal(result.sheets.length,1);assert.ok(result.sheets[0].length>0);count++;}catch(e){assert.match(e.message,/no contiene vocabulario/);}}}
process.env.GEMINI_API_KEY='test';process.env.VITE_FIREBASE_API_KEY='test';
const call=async(body,authorization='Bearer test')=>{const res={headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(data){this.data=data;return this;},send(data){this.data=data;return this;}};await handler({method:'POST',headers:{authorization},body},res);return res;};
const original=global.fetch;let imageCalls=0;
global.fetch=async(url,options)=>{if(url.includes('identitytoolkit'))return {ok:true,json:async()=>({users:[{localId:'user'}]})};imageCalls++;const payload=JSON.parse(options.body);assert.deepEqual(payload.generationConfig.responseModalities,['TEXT','IMAGE']);assert.ok(payload.contents[0].parts[0].text.includes('scissors'));return {ok:true,json:async()=>({candidates:[{content:{parts:[{inlineData:{mimeType:'image/png',data:Buffer.from('mock-image').toString('base64')}}]}}]})};};
assert.equal((await call({grade:'5th Grade',index:0,sheetIndex:0},'')).code,401);
assert.equal((await call({grade:'../../secret',index:0,sheetIndex:0})).code,400);
assert.equal((await call({grade:'5th Grade',index:0,sheetIndex:999})).code,400);
const ok=await call({grade:'5th Grade',index:0,sheetIndex:0});assert.equal(ok.code,200);assert.equal(ok.headers['Content-Type'],'image/png');assert.equal(imageCalls,1);
global.fetch=original;console.log('Passed: '+count+' curriculum scenarios, exact vocabulary, pagination, authentication and mocked image response.');

const market={title:'At the market',communicative_competences:{grammatical_features:['WH-Questions (e.g., "How much is it?")','Quantities (e.g., "I need five potatoes.")','Present Simple (e.g., "I want three apples and one banana.")'],vocabulary:{linguistic_competences:{nouns:'market, price, shopping list, item, store, cost, pineapple, cashier, money, cassava, potatoes',verbs:'buy, sell, ask, pay, choose, compare, need, want, get, cost, help',adjectives:'cheap, fresh, expensive, delicious, ripe',adverbs:'quickly, easily, often',interrogatives:'how much, how many',numbers:'1-100'}}}};
const marketPoster=illustratedSheets(market);assert.equal(marketPoster.sheets.length,1);assert.equal(marketPoster.grammar.length,3);assert.equal(marketPoster.sheets[0].filter(i=>i.word==='cost').length,2);assert.equal(marketPoster.sheets[0].filter(i=>i.category==='numbers')[0].word,'1-100');assert.ok(illustrationPrompt(market,'5th Grade',0,0).includes('cassava'));
