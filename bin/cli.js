const program = require('commander');
const version = require('../package.json').version;
const sign = require('./sign');
const decode = require('./decode');

program
	.version(version)
	.option('-c, --clean', 'Suppress default roles when signing a token')
	.option('-s, --secret <secret>', 'Define the secret used. Will default to ENV var $secret if set, otherwise "ssh".')
	.option('-a, --admin', 'Add superadmin role to the signing (*@/)')
	.option('-v, --verbose', 'Include header and signature when decoding a token.')
	.description('mugs CLI tool.');

program
	.command('sign [roles...]')
	.description('Sign a new token')
	.action((roles, cmd) => sign(roles, cmd.parent.clean, cmd.parent.admin, cmd.parent.secret || process.env.secret));

program
	.command('decode')
	.description('Decode a JWT token')
	.action((token, cmd) => decode(token));

if (!process.argv.slice(2).length) {
	program.outputHelp();
}

program.parse(process.argv);
