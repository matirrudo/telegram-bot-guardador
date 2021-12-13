const { Telegraf } = require('telegraf')
const bot_token = process.env.BOT_TOKEN
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const bot = new Telegraf(bot_token)
const urlServer = process.env.URL

console.log('bot iniciado')
bot.start((ctx) => {
    console.log(ctx.from);
    console.log(ctx.chat);
    console.log(ctx.message);
    console.log(ctx.updateType);
    ctx.reply(`Bienvenido ${ctx.chat.first_name}. Has enviado un ${ctx.updateType } `)
})

bot.help((ctx) => {
    ctx.reply('Ayuda!')
})

bot.settings((ctx) => {
    ctx.reply('Configuración')
})

bot.command(['guardar', 'Guardar', 'GUARDAR'], (ctx) =>{
    ctx.reply('Comando para guardar')
})

bot.hears('computadora', ctx => {
    ctx.reply('Hola, te vendo una computadora')
})
 
bot.on('sticker', ctx =>{
    ctx.reply('Es un sticker')
})

bot.on('document', ctx =>{
    if(ctx.message.document.file_size>20000000){
        ctx.reply('Archivo demasiado grande')
    }else{
        ctx.reply('Guardando documento...')
        ctx.telegram.getFileLink(ctx.message.document.file_id).then(url =>{
            ctx.reply(url.href)
            download(url.href, ctx.message.document.file_name, ctx)
        })
    }
})

bot.launch()

async function download(urlDownload, file_name, ctx){
    const pathSave = path.resolve(__dirname, 'public/documents', file_name)

    const response = await axios({
        method:'GET',
        url: urlDownload,
        responseType:'stream'
    })

    response.data.pipe(fs.createWriteStream(pathSave))

    return new Promise((resolve, reject) =>{
        response.data.on('end',() =>{
            ctx.reply(urlServer+'resources/documents/'+file_name)
            console.log(urlServer+'resources/documents/'+file_name)
            resolve()
        })
        response.data.on('error', err =>{
            ctx.reply('Error al guardar')
            reject(err)
        })
    })
}