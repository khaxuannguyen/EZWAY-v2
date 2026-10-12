import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

test('Sites migration journal creates the existing lead schema without changing original migrations',()=>{
 const journal=JSON.parse(readFileSync(new URL('../drizzle/meta/_journal.json',import.meta.url),'utf8'));
 const db=new DatabaseSync(':memory:');
 try{
  for(const [i,entry] of journal.entries.entries()){
   const sql=readFileSync(new URL(`../drizzle/${entry.tag}.sql`,import.meta.url),'utf8');
   const original=readFileSync(new URL(`../migrations/leads/${i===0?'0001_public_leads':'0002_delivery_attempts'}.sql`,import.meta.url),'utf8');
   const clean=(s:string)=>s.replaceAll('--> statement-breakpoint','').replace(/\s+/g,' ').trim();
   assert.equal(clean(sql),clean(original));
   for(const statement of sql.split('--> statement-breakpoint'))if(statement.trim())db.exec(statement);
  }
  const columns=db.prepare('PRAGMA table_info(lead_deliveries)').all().map(c=>c.name);
  assert.ok(columns.includes('attempt_count'));assert.ok(columns.includes('updated_at'));
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM quote_requests').get()?.n,0);
 }finally{db.close();}
});
