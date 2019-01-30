var storage= require('node-persist');
storage.initSync();

var argv= require('yargs')
.command('adduser','create a new account',function(yargs){

    yargs.options({
        name:{
            demand:true,
            alias:'n',
            description:' Username goes here',
            type:'string'
        },
        uname:{
            demand:true,
            alias:'u',
            description:' Account name goes here',
            type:'string'
        },
        password:{
            demand:true,
            alias:'p',
            description:'Password goes here',
            type:'string'
        }
    }).help('help')
})
.command('getaccount','get the details about your account',function(yargs){
    yargs.options({
        name:{
            demand:true,
            alias:'n',
            description:' Username goes here',
            type:'string'
        }
    }).help('help')

}).help('help').argv;


//

var command=argv._[0];

function createAccount(account){

    var accounts= storage.getItemSync('accounts');
    if(typeof accounts ==='undefined'){
        accounts=[];
    }
    accounts.push(account);
    storage.setItemSync('accounts',accounts);

    return account;
}

function getAccount(accountName){
    var accounts =storage.getItemSync('accounts');
    var matched;
    accounts.forEach(function(account){
        if(account.name === accountName){
            matched=account
        }
    })
return matched;
}

if(command==='adduser')
{
    var createdAccount=createAccount({
        name:argv.name,
        username:argv.uname,
        password:argv.password
    });
    console.log('account is created');
    console.log(createdAccount);
} 
else if(command ==='getaccount'){
    var fetched= getAccount(argv.name);
    if(typeof fetched ==='undefined'){
        console.log('account details are not matched');
    }else {
        console.log('account is found');
        console.log(fetched);
    }
}
