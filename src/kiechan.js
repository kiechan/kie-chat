import $ from 'jquery'
import Vue from 'vue/dist/vue.esm'

const API_URL_KOUME = 'http://localhost:3000/v1/koume'

const app = new Vue({
  el: '#kie-chat',
  data: {
    userMessage: '',
    messages: [{
      message: 'こんにちは、キーちゃんだッピ',
      url: null,
      isUserMessage: false
    },
    {
      message: '知りたいことを教えてくれッピ！',
      url: null,
      isUserMessage: false
    }],
    talkId: 0,
    sessionInfo: {
      areaArray: [],
      keywordArray: []
    }
  },
  methods: {
    sendMessage: () => {
      if (app.userMessage === '') {
        return
      }
      app.messages.push({
        message: app.userMessage,
        url: null,
        isUserMessage: true
      })
      let message = app.userMessage
      app.userMessage = ''
      if (app.sessionInfo.areaArray.length !== 0) {
        let baseMessage = ''
        app.sessionInfo.areaArray.map(area => {
          baseMessage = baseMessage + area
        })
        message = baseMessage + 'の' + message
      }
      if (app.sessionInfo.keywordArray.length === 1) {
        let baseMessage = app.sessionInfo.keywordArray[0]
        message = baseMessage + 'の' + message
      }
      callKoume(message).then((data) => {
        const messages = data.messages
        if (messages == null) {
          escapeSilence()
          scrollToBottom()
          return
        }
        if (data.status === 0) {
          app.sessionInfo.areaArray = data.tempAreaArray
          app.sessionInfo.keywordArray = data.tempKeywordArray
        } else {
          app.sessionInfo.areaArray = []
          app.sessionInfo.keywordArray = []
        }
        app.messages = app.messages.concat(messages)
        scrollToBottom()
        console.log(app.sessionInfo.areaArray)
        console.log(app.sessionInfo.keywordArray)
      }).catch(err => {
        escapeError()
        scrollToBottom()
      })
    }
  }
})

const escapeSilence = () => {
  app.messages.push({
    message: 'データが見つからなかったッピ！',
    url: null,
    isUserMessage: false
  }),
  app.messages.push({
    message: '他に知りたい何が知りたいッピ？',
    url: null,
    isUserMessage: false
  })
}

const escapeError = () => {
  app.messages.push({
    message: '今は頭が働かないッピ',
    url: null,
    isUserMessage: false
  })
  app.messages.push({
    message: '少し待ってからもう一回話しかけてくれッピ',
    url: null,
    isUserMessage: false
  })
}

const scrollToBottom = () => {
  $('#kie-chat').delay(100).animate({
    scrollTop: $('#scroll-area').height()
  }, 300)
}

const callKoume = (userMessage) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'POST',
      url: API_URL_KOUME,
      data: {
        talkContent: userMessage
      }
    }).done(data => {
      if (!data.talkResponse) {
        resolve()
        return
      }
      console.log(data)
      const contents = data.talkResponse.messages
      const messages = contents.map(c => {
        return {
          message: c.words,
          url: c.url,
          isUserMessage: false
        }
      })
      console.log(data)
      resolve({
        status: data.talkResponse.status,
        tempAreaArray: data.talkResponse.areaArray,
        tempKeywordArray: data.talkResponse.keywordArray,
        messages: messages
      })
    }).fail(err => {
      reject(err)
    })
  })
}

$(window).on('load', () => {
  $('#textinput').focus()
})