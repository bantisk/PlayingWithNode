var storage= require('node-persist');
storage.initSync();
var crypto= require('crypto-js')
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
        masterpassword:{
            demand:true,
            alias:'m',
            description:' Master password name goes here',
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
        },
        masterpassword:{
            demand:true,
            alias:'m',
            description:' Master password goes here',
            type:'string'
        }
    }).help('help')

}).help('help').argv;


//

var command=argv._[0];


function getAccounts(masterpassword){
    var ea= storage.getItemSync('accounts');
    var accounts=[];
    if(typeof ea !== 'undefined'){
        var bytes=crypto.AES.decrypt(ea,masterpassword);
        accounts=JSON.parse(bytes.toString(crypto.enc.Utf8));
    }
    return accounts;
}
function saveAccounts(accounts,masterpassword){

    var ea= crypto.AES.encrypt(JSON.stringify(accounts),masterpassword);
    storage.setItemSync('accounts',ea.toString());
    return accounts
}
function createAccount(account,masterpassword){

    var accounts= getAccounts(masterpassword);
    accounts.push(account);;
    saveAccounts(account,masterpassword)

}

function getAccount(accountName,masterpassword){
  var accounts= getAccount(masterpassword);
  var matched;
  
  accounts.forEach(function(account){
      if(account.name ===accountName){
          matched= account
      }
  })
  return matched
}

if(command==='adduser')
{
    var createdAccount=createAccount({
        name:argv.name,
        username:argv.uname,
        password:argv.password
    },argv.masterpassword);
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
