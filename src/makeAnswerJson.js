const fs = require('fs');

class AnswerList {
  makeAnswerJsonBase(file_path) {
    console.log('====================makeSiXiuAnswerJson======================');
    var answerJson = null
    var i = 1; //txt中的行数
    let answerList = []
    let keyWords1 = ['一', '二', '三', '四','五','六','七','八','九'];
    let keyWords2 = ['1', '2', '3', '4', '5', '6', '7', '8', '9' ]

    let level_1 = 0;
    let level_2 = 0;

    var data = fs.readFileSync(file_path, 'utf-8');

    let results = data.split(/(?:\n|\r\n|\r)/g)

    if (results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        let result = results[i]
        if (result.length > 0) {
          if (keyWords1.indexOf(result[0]) != -1 && result[1] =='、') {
            answerList[level_1 - 1].push([])
            level_2++;
          } else if (result.indexOf('正确答案是：') != -1) {
            let answer = result.replace("正确答案是：","")
            let param = {
              answer: answer
            }
            console.log( 'level', level_1,level_2, 'result', result)
            answerList[level_1 - 1][level_2 - 1].push(param)
          } else if(result.indexOf('专题')==0){
            level_2 = 0
            answerList.push([]);
            level_1++;
          }
        }
      }
    }
    console.log('answerList------------:',JSON.stringify( answerList ));
    return answerList
  }



  makeXiAnswerJson(file_path) {
    console.log('====================makeXiAnswerJson======================');
    var answerJson = null
    var i = 1; //txt中的行数
    let answerList = []
    let keyWords1 = ['一', '二', '三', '四'];
    let keyWords2 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', ]

    let level_1 = 0;
    let level_2 = 0;

    var data = fs.readFileSync(file_path, 'utf-8');

    let results = data.split(/(?:\n|\r\n|\r)/g)

    if (results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        let result = results[i]
        if (result.length > 0) {
          if (keyWords1.indexOf(result[0]) != -1) {
            answerList[level_1 - 1].push([])
            level_2++;
          } else if (keyWords2.indexOf(result[0]) != -1) {
            let left_key = result.indexOf('（') + 1
            let right_key = result.indexOf('）')
            let question = result.substring(0, left_key) + result.substring(right_key)
            let answer = result.substring(left_key, right_key)
            let param = {
              question: question,
              answer: answer
            }
            answerList[level_1 - 1][level_2 - 1].push(param)
          } else {
            level_2 = 0
            answerList.push([]);
            level_1++;
          }
        }
      }
    }
    return answerList
  }

  makeZhiNanAnswerJson(file_path) {
    console.log('====================makeZhiNanAnswerJson======================');
    var answerJson = null
    var i = 1; //txt中的行数
    let answerList = []
    let keyWords1 = ['一', '二', '三', '四'];
    let keyWords2 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', ]

    let level_1 = 0;
    let level_2 = 0;

    var data = fs.readFileSync(file_path, 'utf-8');

    let results = data.split(/(?:\n|\r\n|\r)/g)

    if (results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        let result = results[i]
        if (result.length > 0) {
          if (keyWords1.indexOf(result[0]) != -1) {
            answerList[level_1 - 1].push([])
            level_2++;
          } else if (keyWords2.indexOf(result[0]) != -1) {
            let answer = result
            let param = {
              answer: answer
            }
            answerList[level_1 - 1][level_2 - 1].push(param)
          } else {
            level_2 = 0
            answerList.push([]);
            level_1++;
          }
        }
      }
    }
    console.log('answerList------------:',answerList);
    return answerList
  }

  makeSiXiuAnswerJson(file_path) {
    console.log('====================makeSiXiuAnswerJson======================');
    var answerJson = null
    var i = 1; //txt中的行数
    let answerList = []
    let keyWords1 = ['一', '二', '三', '四','五','六','七','八'];
    let keyWords2 = ['1', '2', '3', '4', '5', '6', '7', '8', '9' ]

    let level_1 = 0;
    let level_2 = 0;

    var data = fs.readFileSync(file_path, 'utf-8');

    let results = data.split(/(?:\n|\r\n|\r)/g)

    if (results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        let result = results[i]
        if (result.length > 0) {
          if (keyWords1.indexOf(result[0]) != -1 && result[1] =='、') {
            answerList[level_1 - 1].push([])
            level_2++;
          } else if (result.indexOf('正确答案是：') != -1) {
            let answer = result.replace("正确答案是：","")
            let param = {
              answer: answer
            }
            console.log( 'level', level_1,level_2, 'result', result)
            answerList[level_1 - 1][level_2 - 1].push(param)
          } else if(result.indexOf('专题')!=-1){
            level_2 = 0
            answerList.push([]);
            level_1++;
          }
        }
      }
    }
    console.log('answerList------------:',JSON.stringify( answerList ));
    return answerList
  }

  makeMaoAnswerJson(file_path) {
    console.log('====================makeSiXiuAnswerJson======================');
    var answerJson = null
    var i = 1; //txt中的行数
    let answerList = []
    let keyWords1 = ['一', '二', '三', '四','五','六','七','八'];
    let keyWords2 = ['1', '2', '3', '4', '5', '6', '7', '8', '9' ]

    let level_1 = 0;
    let level_2 = 0;

    var data = fs.readFileSync(file_path, 'utf-8');

    let results = data.split(/(?:\n|\r\n|\r)/g)

    if (results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        let result = results[i]
        if (result.length > 0) {
          if (keyWords1.indexOf(result[0]) != -1&&result[1]=='、') {
            answerList[level_1 - 1].push([])
            level_2++;
          } else if (result.indexOf('正确答案是：') != -1) {
            let answer = result.replace("正确答案是：","")
            let param = {
              answer: answer
            }
            answerList[level_1 - 1][level_2 - 1].push(param)
          } else if(result.indexOf('专题')!=-1){
            level_2 = 0
            answerList.push([]);
            level_1++;
          }
        }
      }
    }
    console.log('answerList------------:',JSON.stringify( answerList ));
    return answerList
  }

  makeJinDaiShiAnswerJson(file_path) {
    console.log('====================makeJinDaiShiAnswerJson======================');
    var answerJson = null
    var i = 1; //txt中的行数
    let answerList = []
    let keyWords1 = ['一', '二', '三', '四','五','六','七','八'];
    let keyWords2 = ['1', '2', '3', '4', '5', '6', '7', '8', '9' ]

    let level_1 = 0;
    let level_2 = 0;

    var data = fs.readFileSync(file_path, 'utf-8');

    let results = data.split(/(?:\n|\r\n|\r)/g)

    if (results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        let result = results[i]
        if (result.length > 0) {
          if (keyWords1.indexOf(result[0]) != -1) {
            answerList[level_1 - 1].push([])
            level_2++;
          } else if (result.indexOf('答案:') != -1) {
            let answer = result.replace("答案:","")
            let param = {
              answer: answer
            }
            answerList[level_1 - 1][level_2 - 1].push(param)
          } else if(result.indexOf('形考任务')!=-1){
            level_2 = 0
            answerList.push([]);
            level_1++;
          }
        }
      }
    }
    console.log('answerList------------:',JSON.stringify( answerList ));
    return answerList
  }
}
module.exports = {
  AnswerList
}
