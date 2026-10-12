export function publicLeadBinding(target='local',id?:string){
 if(!['local','staging','production'].includes(target))throw new Error('Invalid public-leads deployment target');
 if(target==='local')return {binding:'EZWAY_LEADS_DB',database_name:'ezway-public-leads',database_id:'00000000-0000-4000-8000-000000000001',migrations_dir:'migrations/leads'};
 if(!id||!/^[a-f\d]{8}-(?:[a-f\d]{4}-){3}[a-f\d]{12}$/i.test(id)||id.startsWith('00000000-'))throw new Error('A real dedicated remote D1 ID is required; local placeholders cannot be deployed');
 return {binding:'EZWAY_LEADS_DB',database_name:`ezway-public-leads-${target}`,database_id:id,migrations_dir:'migrations/leads'};
}
