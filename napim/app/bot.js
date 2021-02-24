const Discord = require('discord.js');//Highest was here ?
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const moment = require('moment');
var Jimp = require('jimp');
const { Client, Util } = require('discord.js');
const weather = require('weather-js')
const fs = require('fs');
const YouTube = require("simple-youtube-api");
const queue = new Map();
const ffmpeg = require("ffmpeg"); //ben napim
const express = require("express");

const ytdl = require("ytdl-core");
const db = require('quick.db');
const http = require('http');

require('./util/eventLoader.js')(client);
const path = require('path');
const request = require('request');
const snekfetch = require('snekfetch');



const app = express();
var prefix = ayarlar.prefix;

const log = message => {
    console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};




client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;


client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);



//----------------------HIGHEST-----------------------//
client.on("guildMemberAdd", member => {
    member.roles.add('UNREGISTER ID'); // UNREGİSTER ROLÜNÜN İDSİNİ GİRİN
  });
  
//----------------------HIGHEST-----------------------//
client.on("guildMemberAdd", member => {  
    const hg = member.guild.channels.cache.find(r => r.id === "KAYIT KANALI LOL");
    const kayıtcı = "<@&KAYITCI>"
    let user = client.users.cache.get(member.id);
    require("moment-duration-format");
      const kurulus = new Date().getTime() - user.createdAt.getTime();  
   
    var alibicim;
  if (kurulus < 1296000000) alibicim = 'Hesap Durumu: Güvenilir Değil'
  if (kurulus > 1296000000) alibicim = 'Hesap Durumu: Güvenilir '
    moment.locale("tr");
      const embedd = new Discord.MessageEmbed()
      .setAuthor(member.guild.name)
  .setDescription("**Hoşgeldin! <@" + member + "> Seninle \`" + member.guild.memberCount + "\` Kişiyiz.\n\nİsmini ve Yaşını yazıp Sesli odaya geçmen gerekli. \n\n<@&Kayıtcı> rolündeki yetkililer seninle ilgilenecektir. \n\nHesap Oluşturulma Tarihi : " + moment(member.user.createdAt).format("`YYYY DD MMMM dddd`") +  "\n\n"  + alibicim + "\n\nKeyifli vakit geçirmen dileğiyle :heart:**\n")
   .setImage("https://i.pinimg.com/originals/2c/43/ac/2c43acd8c41ee853cf9fbb04960e4fa6.gif")
   hg.send(embedd)   
     hg.send(kayıtcı) 
  });
//----------------------Embedsiz welcome-----------------------//
client.on("guildMemberAdd", async (member) => {
moment.locale("tr");
let kanal = client.channels.cache.get("Welcome kanal id")
await kanal.send(`${member} **Sunucumuza Hoşgeldin**

**Seninle Birlikte ${member.guild.memberCount} kişi olduk**
**Kayıt Olmak için <&Register rol id> yetkililerine teyit vermen gerekir.**
**Tagımızı (TAG) alarak bizlere destek olabilir, ailemize katılabilirsin.**
**Sunucumuzda keyifli vakitler geçirmeni dileriz.**
<#Kurallarkanalid> **kanalından kurallarımızı okumayı unutma.**
 `).catch(e => console.log(e))//hangisini kullanacaksanız diğerini silip kullanın ve intentleri açmayı unutmayın <3
}); 
 //----------------------Embedsiz welcome-----------------------//
client.on("message", message => {
    if(message.content.toLowerCase() == "!tag") 
    return message.channel.send(`Tagınız`)
});
client.on("message", message => {
    if(message.content.toLowerCase() == ".tag") 
    return message.channel.send(`Tagınız`)
});

client.on("message", message => {
    if(message.content.toLowerCase() == "tag") 
    return message.channel.send(`Tagınız`)
});
//-------------------------------------------------------------//

client.on("userUpdate", async (lol, yeni) => {
  var sunucu = client.guilds.cache.get('SUNUCUID'); // Buraya Sunucu ID
  var uye = sunucu.members.cache.get(yeni.id);
  var ekipTag = "TAG"; // Buraya Ekip Tag
  var rolls = "ROL ID"; // Buraya Ekip Rolünün ID
  var logKanali = "LOG ID"; // Loglanacağı Kanalın ID

  if (!sunucu.members.cache.has(yeni.id) || yeni.bot || lol.username === yeni.username) return;

  if ((yeni.username).includes(ekipTag) && !uye.roles.cache.has(rolls)) {
    try {
      await uye.roles.add(rolls);
      await uye.send(`Tagımızı aldığın için teşekkürler! Aramıza hoş geldin.`);
      await client.channels.cache.get(logKanali).send(new Discord.MessageEmbed().setColor('GREEN').setDescription(`${yeni} adlı üye tagımızı alarak ailemize katıldı!`));
    } catch (err) { console.error(err) };
  };

  if (!(yeni.username).includes(ekipTag) && uye.roles.cache.has(rolls)) {
    try {
      await uye.roles.remove(uye.roles.cache.filter(rol => rol.position >= sunucu.roles.cache.get(rolls).position));
      await uye.send(`Tagımızı bıraktığın için ekip rolü ve yetkili rollerin alındı! Tagımızı tekrar alıp aramıza katılmak istersen;\nTagımız: **${ekipTag}**`);
      await client.channels.cache.get(logKanali).send(new Discord.MessageEmbed().setColor('RED').setDescription(`${yeni} adlı üye tagımızı bıraktığı için ekip ve yetkili rolleri alındı.`));
    } catch(err) { console.error(err) };
  };
});

//----------------------TAG-KONTROL----------------------\\     STG

client.on("guildMemberAdd", member => {
  let sunucuid = "SUNUCUID"; //Buraya sunucunuzun IDsini yazın
  let tag = "TAG"; //Buraya tagınızı yazın
  let rol = "ROLID"; //Buraya tag alındığı zaman verilecek rolün IDsini yazın
  let channel = client.guilds.cache.get(sunucuid).channels.cache.find(x => x.name == 'tag-log'); //tagrol-log yerine kendi log kanalınızın ismini yazabilirsiniz
if(member.user.username.includes(tag)){
member.roles.add(rol)
  const tagalma = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setDescription(`<@${member.id}> adlı kişi sunucumuza taglı şekilde katıldı.`)
      .setTimestamp()
     client.channels.cache.get('Tag log id').send(tagalma)
}
})




  
