const Discord = require ("discord.js")
const db = require("quick.db")

exports.run  = async (client, message, args) => {
  
   if (!['Yetkili Rol id'].some(lol => message.member.roles.cache.get(lol)) && !message.member.hasPermission('ADMINISTRATOR')) return message.reply(`Hatalı Kullanım: Bu komudu kullanmak için Gerekli olan yetkin yok.`) 

   const tag = "TAGIN"

   const kız = message.guild.roles.cache.find(r => r.id === "kız üye rol id")
   const kız2 = message.guild.roles.cache.find(r => r.id === "2. kız üye rol id")
   const kayıtsız = message.guild.roles.cache.find(r => r.id === 'Kayıtsız üye rol idsi')


   let member = message.mentions.users.first() || client.users.cache.get(args.join(' '))
if(!member) return message.channel.send('Kayıt edilecek kişiyi etiketlemelisin')

let isim = args[1]
let yas = args[2]
if(!isim) return message.reply('Bir isim belirtmelisin.')
if(!yas) return message.reply('Bir yaş belirtmelisin.')

member.setNickname(`${tag} ${isim} | ${yas}`)  
member.roles.add(kız)
member.roles.add(kız2)
member.roles.remove(kayıtsız)


const zibab = new Discord.MessageEmbed()

.setTitle("Kayıt Tamamlandı")
.addField(`Kayıt Eden Yetkili:`, `<@${message.author.id}>`) 
    .addField(`Kayıt Edilen:`, `<@${member.user.id}> Kayıt Oldu`)
    .addField(`Verilen Roller:`, `<@&${kız.id}> ve <@&${kız2.id} Rolleri Verildi`) 
    .addField(`Kayıtsız rolü:`, `<@&${kayıtsız.id}> Rolü Alındı`)
    .addField(`İsmin:`, `\`${tag} ${isim} | ${yas}\` Olarak Güncellendi`) 
.setFooter(`Prasty Code`)
.setColor('AQUA')
client.channels.cache.get('Kayıt log/sohbet').send(zibab)
  
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["k","kız"],
    permLevel: 0
};

exports.help = {
    name: 'erkek',
};






