import test from 'node:test';
import assert from 'node:assert/strict';
import {newPendingPayments, paymentNoticeText} from '../src/services/paymentNotices.js';
import handler from '../api/send-admin-notification.js';

test('only new pending receipts create notices; approvals and previous receipts do not', () => {
 const records=[{id:'old',status:'pending'},{id:'new',status:'pending'},{id:'approved',status:'approved'},{id:'rejected',status:'rejected'}];
 const seen=new Set(['old']);
 assert.deepEqual(newPendingPayments(records,seen).map(p=>p.id),['new']);
 records.forEach(p=>seen.add(p.id));
 assert.deepEqual(newPendingPayments(records,seen),[]);
 assert.deepEqual(newPendingPayments([...records,{id:'later',status:'pending'}],seen).map(p=>p.id),['later']);
});
test('notices format amounts and group simultaneous receipts', () => {
 assert.equal(paymentNoticeText([{email:'teacher@example.com',amount:5}]),'teacher@example.com · $5.00 · Pendiente de revisión');
 assert.equal(paymentNoticeText([{},{}]),'2 comprobantes pendientes de revisión.');
});
test('mail configuration check sends no mail and exposes no credentials', async () => {
 const names=['RESEND_API_KEY','VITE_RESEND_API_KEY','SMTP_HOST','SMTP_USER','SMTP_PASS'];
 const saved=Object.fromEntries(names.map(key=>[key,process.env[key]]));
 const response={setHeader(){},status(code){this.code=code;return this;},json(data){this.data=data;return this;}};
 try {
  names.forEach(key=>delete process.env[key]);
  await handler({method:'GET'},response);
  assert.deepEqual(response.data,{configured:false,provider:null});
  process.env.RESEND_API_KEY='test-secret';
  await handler({method:'GET'},response);
  assert.deepEqual(response.data,{configured:true,provider:'resend'});
  assert.ok(!JSON.stringify(response.data).includes('test-secret'));
 } finally { for(const name of names) {if(saved[name]===undefined)delete process.env[name];else process.env[name]=saved[name];} }
});
