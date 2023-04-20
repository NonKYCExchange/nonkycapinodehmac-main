const NonKYC = require( "./xApiHmac.js" );

const yourApiKey = "";
const yourApiSecret = "";

const xApi = new NonKYC.Api( yourApiKey, yourApiSecret );


runTest();


async function runTest()
{


	let balances  = await xApi.balances();

	console.log(balances);




}