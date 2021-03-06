
// 国家开放大学学习指南
const {
  Builder,
  By,
  Key,
  until
} = require('selenium-webdriver');
const {answers} = require ('../../db/answers/4628_zhinanList.json');
const {handle503} = require ('../util');
async function parseCouseZhiNan(driver) {

  let progressPath = "//div[@class='progress-bar']/span"
  let sectionl1Path = "//ul[@class='flexsections flexsections-level-1']/li"
  let sectionl2Path = "//ul[@class='flexsections flexsections-level-2']/li"
  let sectionl2Css = "li.activity"
  let sectionl2LinkCss = "a"
  await driver.wait(until.elementLocated(By.className('progress-bar')), 10000);

  let title = await driver.getTitle()
  let url = await driver.getCurrentUrl()
  console.log('url----------------:', url);
  let classId = url.substring(url.indexOf('id=') + 3);
  console.log('classId----:', classId);


  let levelOne = await driver.findElements(By.xpath(sectionl1Path))
  let progressContainer = await driver.findElement(By.xpath(progressPath))
  let progress = await progressContainer.getText()

  let status = []
  let classinfo = {
    title: title,
    url: url,
    classId: classId,
    progress: progress
  }
  for (let i = 0; i < levelOne.length; i++) {
    let a = levelOne[i]
    let text = await a.getText()
    let sectionId = await a.getAttribute('id')
    console.log(`levelOne.text ${i} ${sectionId} ${text}`)
    let levelTwo = await a.findElements(By.css(sectionl2Css))
    if (levelTwo.length == 0) {
      console.log(`levelOne.text ${i} ${sectionId} ${text} 没有内容。`)
      continue
    }
    if( /课程文件|资源更新区|电大资源区/.test( text )){
      continue
    }
    let b = levelTwo[0]

    let isDisplayed = await b.isDisplayed()
    if (!isDisplayed) {
      // 显示下级内容
      a.click()
    }

    for (let j = 0; j < levelTwo.length; j++) {
      let b = levelTwo[j]
      let text = await b.getText()
      let id = await b.getAttribute('id')
      let imgs = await b.findElements(By.tagName('img'))
      let alt = "未完成"
      let type = 'unkonwn' // text, video, quiz
      let href = ''
      if (imgs.length >= 1){
        let src = await imgs[0].getAttribute('src')
        if( src.includes('core_h.png') ){ //视频1：新时代党的建设总要求网页地址
          type = 'video'
        }else if( src.includes('quiz_h.png')){
          type = 'quiz'
        }else if( src.includes('page_h.png')){
          type = 'page'
        }
      }
      if (imgs.length >= 2) {
        // 由于前面的内容没有学习，可能没有链接元素，后面没有圆圈图片
        alt = await imgs[1].getAttribute('alt')
        let link = await b.findElement(By.css(sectionl2LinkCss))
        href = await link.getAttribute('href')
      }
      let course = {
        classId: classId, // 用于script调用，如完成视频
        sectionId: sectionId.substring(8), // section-xxx
        title: text,
        type: type,
        isFinish: alt.substring(0, 3),
        url: href,
        id: id.substring(7)
      }
      status.push(course)
      if (alt.startsWith("未完成")) {
        console.log(`levelTwo.text ${j} ${id} ${text} ${href} ${alt}`)
      }
    }
  }
  let couseJson = {
    score: classinfo,
    status: status
  }

  return couseJson
}

async function handleZhiNanQuiz( driver, url, id ,num,isFirstPage,options,code){
  console.log('====================handleZhiNanQuiz================');
  let xpath = "//div[@class='singlebutton quizstartbuttondiv']//button"
  //let queXpath = "//div[@class='que truefalse deferredfeedback notyetanswered']"
  let queSelector = ".que"
  let nextPageXpath = "//input[@value='下一页']"
  let prevPageXpath = "//input[@value='上一页']"
  let submitPageXpath = "//input[@value='结束答题…']"
  let queContentXpath="//div[@class='qtext']/p"
  let queAnswerXpath="//div[@class='answer']//input"
  console.log('isFirstPage-----:',isFirstPage);
  if(isFirstPage){
    console.log('==============isFirstPage==============');
    console.log('url-----:',url);
    await driver.get(url)

    // 如果标题 '503 Service' 开头, 表示503错误，需要重新载入url
    for( i=1; i<5; i++){
      let ok = await handle503( driver, url, 5000*i );
      if(ok){
        break;
      }
    }

    await driver.wait(until.elementLocated(By.xpath(xpath)), 15000);
    let button = await driver.findElement(By.xpath(xpath))
    console.error("isFirstPage 延时1秒开始, 防止出现503, 服务器响应问题" )
    let date = new Date()
    await  driver.wait( function(){
      return new Promise((resolve, reject) => {
        console.error("isFirstPage 延时1秒" )
        setTimeout(()=>{ resolve(true)}, 1500);
      })
    });
    console.error("isFirstPage 延时1秒结束", (new Date()).getTime() - date.getTime()  )
    await button.click() // 进入测试页面
  }

  console.log('111111111111111111111111111111');
  await driver.wait(until.elementLocated(By.css(queSelector)), 15000);
  // 可能不存在
  const [err1, nextPage] = await awaitWrap(driver.findElement(By.xpath(nextPageXpath)))
  const [err2, prevPage] = await awaitWrap(driver.findElement(By.xpath(prevPageXpath)))
  const [err3, submitPage] = await awaitWrap(driver.findElement(By.xpath(submitPageXpath)))

  let questions = await driver.findElements(By.css(queSelector))
  console.debug( `questions:${questions.length}`)

  let keyWords1 = ['一', '二', '三', '四'];
  let level_1 = 0;
  let fakeQuestionNum = 0;

  let jsonStr = answers
  // let jsonStr = ''
  let keynum = 0
  for (let i = 0; i < questions.length; i++) {
    let questionEle = questions[i];
    let content = await questionEle.findElement(By.css('.qtext p,.qtext li'))
    let answerInputs = await questionEle.findElements(By.css('.answer input[type=checkbox],.answer input[type=radio]'))
    let answerLabels = await questionEle.findElements(By.css('.answer label'))

    let question = await content.getText()
    console.log('question---:',question);
    if(keyWords1.indexOf(question[0]) != -1 ){
      keynum = 0;
      level_1=keyWords1.indexOf(question[0]);
      console.log('question--- level_1 ++:',level_1 );
      continue;
    }
    console.log('jsonStr['+num+']['+level_1+']---:',jsonStr[num][level_1]);
    console.log('keynum-fakeQuestionNum====:',keynum);
    let key = jsonStr[num][level_1][keynum-fakeQuestionNum]
    console.log('key---:',key);
    for( let j = 0; j< answerInputs.length; j++){
      let answer = answerInputs[j];
      let label = answerLabels[j]
      let a =  await answer.getAttribute('value')
      let b =  await label.getText()
      console.log('label--:',b);
      if(b.length==1){//pan duan ti
        if(b==key.answer[2]){
          await label.click()
          console.log('chose '+b);
        }else{
          continue
        }
      }else{//xuan ze ti
        let answerStr = key.answer.replace(/\s*/g,"").replace(".","").substring(1);
        let labelStr = b.replace(/\s*/g,"").replace(".","").substring(1)
        console.log('answerStr '+answerStr + ' labelStr '+ labelStr);
        if(answerStr.indexOf(labelStr)!=-1||answerStr=='全部'){
          console.log('chose '+b);
          console.log('type--:',await answer.getAttribute('type'));
          console.log('checked--:',await answer.getAttribute('checked'));
          if(await answer.getAttribute('type')=='checkbox'&&await answer.getAttribute('checked')){
            continue;
          }else{
            await answer.click()
          }
        }
      }

    }
    keynum++;
  }
  console.log('nextPage----:',nextPage);
  console.log('submitPage----:',submitPage);

  if(nextPage){
    console.log('=======has nextPage=======');
    await nextPage.click()

    // 如果标题 '503 Service' 开头, 表示503错误，需要重新载入url
    for( i=1; i<5; i++){
      let ok = await handle503( driver, null, 5000*i );
      if(ok){
        break;
      }
    }

    return await handleZhiNanQuiz( driver, url, id ,num,false,options,code)
  }else if(submitPage){
    console.log('=======has submitPage=======');
    await submitPage.click()
  }

  if(options.submitquiz == 'yes'){
    // 如果标题 '503 Service' 开头, 表示503错误，需要重新载入url
    for( i=1; i<5; i++){
      let ok = await handle503( driver, null, 5000*i );
      if(ok){
        break;
      }
    }

    const submitButton = await driver.findElements(By.css('.submitbtns button.btn-secondary'))
    console.log('submitButton-----:',submitButton);
    await submitButton[1].click()

    await driver.wait(until.elementLocated(By.css('.confirmation-dialogue input.btn-primary')), 15000);
    const ensureButton = await driver.findElements(By.css('.confirmation-dialogue input.btn-primary'))
    console.log('ensureButton-----:',ensureButton);
    await ensureButton[0].click()
  }
}

const awaitWrap = (promise) => {
 return promise
  .then(data => [null, data])
  .catch(err => [err, null])
}
module.exports={
  parseCouseZhiNan,
  handleZhiNanQuiz
}
