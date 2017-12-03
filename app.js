const express = require('express')
const ejs = require('ejs')

const imgArrInfo = require('./setting.json')
const template = require('./template')

let app = express()
app.use(express.static('static'))

const equipmentTypeDetection = (ua) => {
  // const typeArr = ['iphone', 'android', 'ipad', 'windows', 'macos', 'windows phone', 'symbianOS', 'ipod']
  const mobileTypeArr = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"]
  const findResult = mobileTypeArr.find(ele => ua.match(new RegExp(ele, 'i')))
  return findResult || 'pc'
}

app.get('/getImg', (req, res) => {
  const userAgent = req.headers['user-agent']
  const equipmentType = equipmentTypeDetection(userAgent)
  // const newInfoArr = imgArrInfo.randomImg.reduce((acc, { imgUrl, redirect, chance }, index, arr) => {
  //   if (index > 0) {
  //     return [...acc, { imgUrl, redirect, chance: acc[index - 1].chance + chance }]
  //   }
  //   return acc
  // }, [(imgArrInfo.randomImg)[0]])
  // const randomNum = Math.ceil(Math.random() * 100)
  // const result = newInfoArr.find(ele => ele.chance > randomNum)
  // const showImgRenderStr = ejs.render(template.showImg, { params: result.imgUrl === undefined ? [] : [result.imgUrl] }).replace(/\n/g, '')
  const isPc = equipmentType === 'pc'
  let showImgRenderStr = `<a target="_blank" href="${
    imgArrInfo[isPc ? 'pcImg' : 'mobileImg'].wrapUrl
    }"><img src="${
    imgArrInfo.localAddress + imgArrInfo[isPc ? 'pcImg' : 'mobileImg'].url
    }"/></a>`
  const hiddenImgRenderStr = ejs.render(template.hiddenImg, { params: imgArrInfo.mobileHref || [] }).replace(/\n/g, '')
  let scriptContent = `
  var advertContainer = document.createElement('div')
  advertContainer.setAttribute("class", "cccAdvertContainer")
  advertContainer.innerHTML = '${
    showImgRenderStr + (isPc ? "" : hiddenImgRenderStr)
    }'
  document.getElementsByTagName('body')[0].appendChild(advertContainer);
  `
  res.send(scriptContent)
})

app.listen(80)